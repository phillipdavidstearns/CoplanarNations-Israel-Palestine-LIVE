const gamepads = {};

function gamepadHandler(event, connected) {
  const gamepad = event.gamepad;
  // Note:
  // gamepad === navigator.getGamepads()[gamepad.index]

  if (connected) {
    gamepads[gamepad.index] = gamepad;
    console.log('New gamepad connected: ', gamepad.index);
  } else {
    console.log('Gamepad disconnected: ', gamepad.index);
    delete gamepads[gamepad.index];
  }
}

window.addEventListener("gamepadconnected", (e) => {
  gamepadHandler(e, true);
});
window.addEventListener("gamepaddisconnected", (e) => {
  gamepadHandler(e, false);
});
