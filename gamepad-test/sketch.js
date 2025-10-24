const screenWidth = screen.width;
const screenHeight = screen.height;

var canvas;

var israel_flag;
var palestine_flag;

var ukraine_flag;
var russia_flag;

var sudan_flag;
var splm_flag;
var slm_al_nur_flag;
var slm_minnawi_flag;
var slm_tabour_flag;

var israel;
var palestine;

var ukraine;
var russia;

var sudan;
var splm;
var slm_al_nur;
var slm_minnawi;
var slm_tabour;

var voice1;

var camera1;
var light1;

async function preload() {
  israel_flag = loadImage('/images/Flag_of_Israel.png');
  palestine_flag = loadImage('/images/Flag_of_Palestine.png');
  ukraine_flag = loadImage('/images/Flag_of_Ukraine.png');
  russia_flag = loadImage('/images/Flag_of_Russia.png');

  sudan_flag = loadImage('/images/Flag_of_Sudan.png');
  splm_flag = loadImage('/images/Flag_of_SPLM-N.png');
  slm_al_nur_flag = loadImage('/images/Flag_of_SLM_(al-Nur).png');
  slm_minnawi_flag = loadImage('/images/Flag_of_SLM_(Minnawi).png');
  slm_tabour_flag = loadImage('/images/Flag_of_SLM_(Tambour).png');
}

function setup() {
  console.log(`screenWidth: ${screenWidth}, screenHeight: ${screenHeight}`);
  canvas = createCanvas(screenWidth, screenHeight, WEBGL);
  frameRate(30);
  israel = new Flag(16, israel_flag);
  palestine = new Flag(16, palestine_flag);
  voice1 = new Voice(D_dorian);
  camera1 = new Camera();
  light1 = new Light();
}

function draw() {
  
  camera1.update();
  light1.update();
  light1.light();

  if (israel){
    israel.render();
    israel.update();
  }

  if(palestine){
    palestine.render();
    palestine.update();
  }
  loadPixels();
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
  var values = Array(qty).fill(127);
  try{
    if(canvas){
      for(var i = 0; i < qty; i++){
        values[i] = pixels[i*4] ^ pixels[1+i*4] ^ pixels[2+i*4];
      }
    }
  } catch (error){
    console.log(error);
  } finally {
    return values;
  }
}
