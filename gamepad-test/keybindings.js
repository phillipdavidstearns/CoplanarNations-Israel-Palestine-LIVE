let fullscreenToggle = false;

function keyPressed(e){
  console.log(`typed key: ${key}, event: `, e);
  switch(key){
  case ' ':
    if(e.ctrlKey){
      fullscreenToggle = !fullscreenToggle;
      fullscreen(fullscreenToggle);
    }
    break;
  }
}
