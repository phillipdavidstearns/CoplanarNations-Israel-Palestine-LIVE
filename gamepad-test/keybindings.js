let fullscreenToggle = false;

function keyPressed(e){
  // console.log(`pressed key: ${key}, event: `, e);
  switch(key){
  case ' ':
    if(e.ctrlKey){
      fullscreenToggle = !fullscreenToggle;
      fullscreen(fullscreenToggle);
    }
    break;
  case 'm':
    israel.morph(Flag.generateVertices(israel.size));
    palestine.morph(Flag.generateVertices(palestine.size));
  }
}
