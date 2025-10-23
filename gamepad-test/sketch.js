const screenWidth = screen.width;
const screenHeight = screen.height;

function setup() {
  console.log(`screenWidth: ${screenWidth}, screenHeight: ${screenHeight}`);
  createCanvas(screenWidth, screenHeight);
  loadPixels();
  console.log(`pixels.length: ${pixels.length}, pixelDensity(): ${pixelDensity()}`);
  // frameRate(30);
}

function draw() {
  // loadPixels();
  // for(var i = 0; i < pixels.length / 4; i++){
  //   pixels[i*4] = Math.round(255 * (0.5 * (Math.sin(i * (0.5 * Math.sin(frameCount * 0.001)+1) + frameCount * 0.1) + 1)));
  //   pixels[1+i*4] = Math.round(255 * (0.5 * (Math.sin(i * (0.5 * Math.sin(frameCount * 0.002)+1) + frameCount*0.03) + 1)));
  //   pixels[2+i*4] = Math.round(255 * (0.5 * (Math.sin(i * (0.5 * Math.sin(frameCount * 0.003)+1) + frameCount*0.02) + 1)));
  //   pixels[3+i*4] = 255;
  // }
  // updatePixels();
}

async function parseMessage(message){
  if(message.type === "get" && message.parameter === "frames"){
    var response = JSON.stringify({
      'data': await grabPixels(message.frame_count)
    })
    if (websocket){
      await websocket.send(response)
    };
  }
}

async function grabPixels(qty){
  var values = [qty];
  try{
    loadPixels();
    for(var i = 0; i < qty; i++){
      values[i] = Math.round(255 * 0.5 * (Math.sin(2*Math.PI*i*(4/1920)) + 1));//pixels[i*4] ^ pixels[1+i*4] ^ pixels[2+i*4];
    }
  } catch (error){
    console.log(error);
  } finally {
    return values;
  }
}
