// Create WebSocket connection.
let pingInterval = null;
let reconnectInterval = null;
const socketURL = "ws://localhost:8080";

let websocket = null; 

function connect(){
  try{
    websocket = new WebSocket(socketURL);
    addListeners(websocket);
  } catch (error){
    console.log(error);
  }
}

function reconnect(){
  reconnectInterval = setInterval(() => {
    log(`Attempting to reconnect...`);
    connect();
  }, 5000);
}

function addListeners(websocket){
  // Connection opened
  websocket.addEventListener("open", (event) => {
    clearInterval(reconnectInterval);
    pingInterval = setInterval(() => {
      log(`SENT: ping: ${counter}`);
      websocket.send("ping");
    }, 1000);
    websocket.send("Hello Server!");
  });

  // Listen for messages
  websocket.addEventListener("message", (event) => {
    console.log("Message from server ", event.data);
  });

  // Close
  websocket.addEventListener("close", (event) => {
    console.log("WebSocket connection closed", event);
    clearInterval(pingInterval);
    if(!reconnectInterval) reconnect();
  });

  // Error
  websocket.addEventListener("error", (event) => {
    console.log("Error", event);
    clearInterval(pingInterval);
    if(!reconnectInterval) reconnect();
  });
}

connect();
