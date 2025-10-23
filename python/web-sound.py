#!/usr/bin/env python3

import sys
import pyaudio
import logging
import socket
import json
from time import sleep
from threading import Thread, Lock, Timer
from signal import *

import select

import asyncio
from websockets.asyncio.server import serve
from websockets.exceptions import ConnectionClosed, ConnectionClosedError, ConnectionClosedOK

#===========================================================================
# Signal Handler / shutdown procedure

def signalHandler(signum, frame):
  logging.info(f'Caught termination signal: {signum}')
  shutdown()

def shutdown():
  try:
    ws.stop()
    sound.stop()
  except Exception as e:
    logging.error(f'Oh dang! {repr(e)}')
  finally:
    logging.info('Peace out!')
    sys.exit(0)

#===========================================================================

class WebsocketServer(Thread):
  def __init__(self, host='0.0.0.0', port=8000):
    super().__init__()
    self.daemon = True
    self.lock=Lock()
    self.host = host
    self.port = port
    self.loop = None
    self.server = None
    self.message_queue = []
    self.buffer = bytearray()
    self.clients = set()
    self.lastSlice = bytearray()
    self.doRun = False

  async def consume(self, message):
    try: # grab a chunk of data from the socket...
      message = json.loads(message)
      data = bytes(message['data'])
      if data:
        self.buffer += data # if there's any data there, add it to the buffer  
    except json.JSONDecodeError as e:
      pass
    except Exception as e: # if there's definitely no data to be read. the socket will throw and exception
      logging.error(f'read() Other Error: {type(e).__name__}\n{e}')
      pass

  async def produce(self):
    message = None
    if len(self.message_queue) > 0:
      message = self.message_queue[0]
      self.message_queue = self.message_queue[1:]
    return message

  async def consumer_handler(self, websocket):
    while True:
      try:
        message = await websocket.recv()
        if message:
          await self.consume(message)
        await asyncio.sleep(0.01)
      except ConnectionClosed:
        logging.info("Connection Closed")
        break
      except Exception as e:
        logging.error(f'in consumer_handler(): {repr(e)}')

  async def producer_handler(self, websocket):
    while True:
      try:
        message = await self.produce()
        if message:
          await websocket.send(message)
        await asyncio.sleep(0.01)
      except ConnectionClosed:
        logging.info("Connection Closed")
        break
      except Exception as e:
        logging.error(f'in producer_handler(): {repr(e)}')

  async def handler(self, websocket):
    logging.debug(f"starting new connection {repr(websocket)}")
    self.clients.add(websocket)
    try:
      await asyncio.gather(
        self.consumer_handler(websocket),
        self.producer_handler(websocket)
      )
    finally:
      self.clients.remove(websocket)

  def write(self, message):
    self.message_queue.append(message)

  def extractFrames(self, frames, width):
    bufferSize = frames * width
    if len(self.lastSlice) == 0:
      self.lastSlice = bytearray(bytes([127])*bufferSize)
    with self.lock:
      extractedFrames = self.buffer[:bufferSize] # grab a slice of data from the buffer
      # remove the extracted data from the buffer
      self.buffer = self.buffer[len(extractedFrames):]

      if len(extractedFrames) == 0:
        extractedFrames = self.lastSlice
      else:
        self.lastSlice = extractedFrames

      # this makes sure we return as many frames as requested, by padding with audio "0"
      extractedFrames = extractedFrames + bytes([127]) * (bufferSize - len(extractedFrames))
      return extractedFrames

  async def main(self):
    self.loop = asyncio.get_running_loop()
    async with serve(self.handler, self.host, self.port) as self.server:
      await self.server.serve_forever()
  
  def run(self):
    logging.info('[WebsocketServer] start()')
    try:
      asyncio.run(self.main())
    except Exception as e:
      logging.error('run(): %s' % repr(e))

  def stop(self):
    logging.info('[WebsocketServer] stop()')
    try:
      self.server.close()
    except Exception as e:
      logging.error(f'While closing socket: {repr(e)}')

#===========================================================================
# Audifer
# PyAudio stream instance and operations. By default pyAudio opens the stream in its own thread.
# Callback mode is used. Documentation for PyAudio states the process
# for playback runs in a separate thread. Initializing in a subclassed Thread may be redundant.

class Audifier():
  def __init__(
    self,
    qtyChannels=1,
    width=1,
    rate=44100,
    chunkSize=1920,
    deviceIndex=None,
    callback=None
  ):

    if not callback:
      raise Exception(f'Audifier instance requires a callback function. Got: {callback}')

    self.doRun=False
    self.qtyChannels = qtyChannels
    self.width = width
    self.rate = rate
    self.chunkSize = chunkSize
    self.deviceIndex = deviceIndex
    self.callback = callback
    self.pa = pyaudio.PyAudio()
    self.stream = self.initPyAudioStream()

  #On initialization, check for and use headphones, else fallback to speakers
  def initPyAudioStream(self):
    if not self.deviceIndex:
      for i in range(self.pa.get_device_count()):
        device = self.pa.get_device_info_by_index(i)
        print(device)
        print()

        if 'name' in device and device['name'] == 'External Headphones':
          print('External Headphones')
          self.deviceIndex = device['index']
          break
        elif 'name' in device and device['name'] == 'MacBook Pro Speakers':
          print('MacBook Pro Speakers')
          self.deviceIndex = device['index']
          break

    stream = self.pa.open(
      format=self.pa.get_format_from_width(self.width),
      channels=self.qtyChannels,
      rate=self.rate,
      frames_per_buffer=self.chunkSize,
      input=False,
      output_device_index=self.deviceIndex,
      output=True,
      stream_callback=self.callback,
      start=False
    )
    return stream

  def start(self):
    logging.info('[AUDIFIER] run()')
    logging.debug("Starting audio stream...")
    self.stream.start_stream()
    if self.stream.is_active():
      logging.debug("Audio stream is active.")

  def stop(self):
    logging.info('[AUDIFIER] stop()')
    self.stream.close()
    self.pa.terminate()

if __name__ == "__main__":

  logging.basicConfig(
    level=10,
    format='[Websocket Test] - %(levelname)s | %(message)s'
  )

  logging.getLogger("websockets").setLevel(logging.WARNING)

  ws = WebsocketServer(
      host = "localhost",
      port = 8080
    )

  width = 1

  def audio_callback(in_data, frame_count, time_info, status):
    message = json.dumps({
      'type' : 'get',
      'parameter' : 'frames',
      'frame_count' : frame_count
    })
    ws.write(message)
    audioChunk = ws.extractFrames(frame_count, width)
    return(bytes(audioChunk), pyaudio.paContinue)

  sound = Audifier(width=width, callback=audio_callback)

  signal(SIGINT, signalHandler)
  signal(SIGTERM, signalHandler)
  signal(SIGHUP, signalHandler)

  try:

    ws.start()
    sound.start()

    while True:
      sleep(1)

  except Exception as e:
    template = "An exception of type {0} occurred. Arguments:\n{1!r}"
    message = template.format(type(e).__name__, e.args)
    logging.error(f'Ooops! {message}')
    

