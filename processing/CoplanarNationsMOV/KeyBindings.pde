float[][] vertices;
boolean shift = false;
float rotation_step = PI/64.0;
float translation_step = 100;
int min_voices = 2;
int max_voices = 20;

void keyReleased() {
  if (keyCode == 16) shift = false;
}

void keyPressed() {
  //println(keyCode);

  if (keyCode == 16) shift = true;

  if (shift) { // rotate Z
    switch(keyCode) {
    case 37: // left
      camera1.setRotationZ(camera1.rotation_target.z + rotation_step);
      break;
    case 39: // right
      camera1.setRotationZ(camera1.rotation_target.z - rotation_step);
      break;

    case 32: // SCAPE_BAR turn off PlanarNation and Voices visibility, animation and output
      israel.edge_flicker = false;
      israel.texture_flicker = false;
      israel.do_animate = false;
      israel.render_edges = false;
      israel.render_texture = false;

      palestine.edge_flicker = false;
      palestine.texture_flicker = false;
      palestine.do_animate = false;
      palestine.render_edges = false;
      palestine.render_texture = false;

      for (Voice v : voices.voices) {
        v.mute = true;
      }
      break;
    }
  } else { // rotate X Y
    switch(keyCode) {
    case 32: // SCAPE_BAR turn off PlanarNation visibility and animation
      israel.edge_flicker = false;
      israel.texture_flicker = false;
      israel.do_animate = false;
      palestine.edge_flicker = false;
      palestine.texture_flicker = false;
      palestine.do_animate = false;

      break;
    case 37: // left
      camera1.setRotationY(camera1.rotation_target.y + rotation_step);
      break;
    case 38: // up
      camera1.setRotationX(camera1.rotation_target.x - rotation_step);
      break;
    case 39: // right
      camera1.setRotationY(camera1.rotation_target.y - rotation_step);
      break;
    case 40: // down
      camera1.setRotationX(camera1.rotation_target.x + rotation_step);
      break;
    }
  }

  switch(key) {

  case 'w':
    camera1.setTranslationY(camera1.translation_target.y + translation_step);
    break;
  case 'a':
    camera1.setTranslationX(camera1.translation_target.x + translation_step);
    break;
  case 's':
    camera1.setTranslationY(camera1.translation_target.y - translation_step);
    break;
  case 'd':
    camera1.setTranslationX(camera1.translation_target.x - translation_step);
    break;

  case 'W':
    camera1.setPositionY(camera1.position_target.y + translation_step);
    break;
  case 'A':
    camera1.setPositionX(camera1.position_target.x + translation_step);
    break;
  case 'S':
    camera1.setPositionY(camera1.position_target.y - translation_step);
    break;
  case 'D':
    camera1.setPositionX(camera1.position_target.x - translation_step);
    break;

    // Camera Z
  case '1':
    camera1.setPositionZ(10);
    break;
  case '2':
    camera1.setPositionZ(20);
    break;
  case '3':
    camera1.setPositionZ(40);
    break;
  case '4':
    camera1.setPositionZ(80);
    break;
  case '5':
    camera1.setPositionZ(160);
    break;
  case '6':
    camera1.setPositionZ(320);
    break;
  case '7':
    camera1.setPositionZ(640);
    break;
  case '8':
    camera1.setPositionZ(1280);
    break;
  case '9':
    camera1.setPositionZ(2560);
    break;
  case '0':
    camera1.setPositionZ(5120);
    break;

  case '!':
    camera1.setPositionZ(10, true);
    break;
  case '@':
    camera1.setPositionZ(20, true);
    break;
  case '#':
    camera1.setPositionZ(40, true);
    break;
  case '$':
    camera1.setPositionZ(80, true);
    break;
  case '%':
    camera1.setPositionZ(160, true);
    break;
  case '^':
    camera1.setPositionZ(320, true);
    break;
  case '&':
    camera1.setPositionZ(640, true);
    break;
  case '*':
    camera1.setPositionZ(1280, true);
    break;
  case '(':
    camera1.setPositionZ(2560, true);
    break;
  case ')':
    camera1.setPositionZ(5120, true);
    break;

    // Camera FOV


    // Camera Orbit Radius


    //case 'o':
    //  camera1.orbit_camera = !camera1.orbit_camera;
    //  break;
    //case 'O':
    //  camera1.randomize_orbit();
    //  break;

  case 'm':
    israel.morph(israel.generateVertices(qty_vertices));
    palestine.morph(palestine.generateVertices(qty_vertices));
    break;

  case'r':
    israel.render_texture = !israel.render_texture;
    if (!israel.render_texture) israel.randomizeVertices();
    break;
  case't':
    israel.render_texture = !israel.render_texture;
    if (!israel.render_texture) israel.randomizeVertices();
    palestine.render_texture = !palestine.render_texture;
    if (!palestine.render_texture) palestine.randomizeVertices();
    break;
  case'y':
    palestine.render_texture = !palestine.render_texture;
    if (!palestine.render_texture) palestine.randomizeVertices();
    break;

  case'R':
    israel.render_edges = !israel.render_edges;
    break;
  case'T':
    israel.render_edges = !israel.render_edges;
    palestine.render_edges = !palestine.render_edges;
    break;
  case'Y':
    palestine.render_edges = !palestine.render_edges;
    break;

  case 'f':
    israel.randomizeVertices();
    break;
  case 'g':
    israel.randomizeVertices();
    palestine.randomizeVertices();
    break;
  case 'h':
    palestine.randomizeVertices();
    break;

  case 'F':
    israel.do_animate = !israel.do_animate;
    break;
  case 'G':
    israel.do_animate = !israel.do_animate;
    palestine.do_animate = !palestine.do_animate;
    break;
  case 'H':
    palestine.do_animate = !palestine.do_animate;
    break;

  case 'v':
    israel.texture_flicker = !israel.texture_flicker;
    break;
  case 'b':
    israel.texture_flicker = !israel.texture_flicker;
    palestine.texture_flicker = !palestine.texture_flicker;
    break;
  case 'n':
    palestine.texture_flicker = !palestine.texture_flicker;
    break;

  case 'V':
    israel.edge_flicker = !israel.edge_flicker;
    break;
  case 'B':
    israel.edge_flicker = !israel.edge_flicker;
    palestine.edge_flicker = !palestine.edge_flicker;
    break;
  case 'N':
    palestine.edge_flicker = !palestine.edge_flicker;
    break;

  case ',': // decrement animation rate
    israel.noise_rate = constrain( israel.noise_rate - 0.0001, 0.0, 0.001);
    palestine.noise_rate = constrain( palestine.noise_rate - 0.0001, 0.0, 0.005);
    break;
  case '.': // increment animation rate
    israel.noise_rate = constrain( israel.noise_rate + 0.0001, 0.0, 0.001);
    palestine.noise_rate = constrain( palestine.noise_rate + 0.0001, 0.0, 0.005);
    break;
  case '/':
    israel.noise_rate = random(0.005);
    palestine.noise_rate = random(0.005);
    break;

  case '<': // decrement flicker rate
    israel.flicker_amount = constrain( israel.flicker_amount - 0.05, 0.01, 0.99);
    palestine.flicker_amount = constrain( palestine.flicker_amount - 0.05, 0.01, 0.99);
    break;
  case '>': // increment flicker rate
    israel.flicker_amount = constrain( israel.flicker_amount + 0.05, 0.01, 0.99);
    palestine.flicker_amount = constrain( palestine.flicker_amount + 0.05, 0.01, 0.99);
    break;
  case '?':
    israel.flicker_amount = random(0.01, 0.99);
    palestine.flicker_amount = random(0.01, 0.99);
    break;

  case 'U': // all voices on
    for (Voice v : voices.voices) {
      v.random_pitch();
    }
    break;

  case 'u': // all voices on
    for (Voice v : voices.voices) {
      v.random_pitch();
      v.randomize();
    }
    break;

  case 'i': // all voices on
    for (Voice v : voices.voices) {
      v.random_note();
      v.randomize();
    }
    break;

  case 'I': // all voices on
    for (Voice v : voices.voices) {
      v.random_note();
    }
    break;

  case 'o': // all voices on
    for (Voice v : voices.voices) {
      v.random_scale();
      v.randomize();
    }
    break;

  case 'O': // all voices on
    for (Voice v : voices.voices) {
      v.random_scale();
    }
    break;

  case 'j': // all voices on
    for (Voice v : voices.voices) {
      v.mute = false;
    }
    break;

  case 'J': // all voices off
    for (Voice v : voices.voices) {
      v.mute = true;
    }
    break;

  case 'k': // all voices on
    for (Voice v : voices.voices) {
      v.mute = !v.mute;
    }
    break;

  case 'K': // all voices off
    for (Voice v : voices.voices) {
      v.mute = random(1) < 0.5;
    }
    break;

  case 'l': // all voices on
    for (Voice v : voices.voices) {
      v.move_enabled = true;
    }
    break;

  case 'L': // all voices off
    for (Voice v : voices.voices) {
      v.move_enabled = false;
    }
    break;

  case ';': // all voices on
    for (Voice v : voices.voices) {
      v.move_enabled = !v.move_enabled;
    }
    break;

  case ':': // all voices off
    for (Voice v : voices.voices) {
      v.move_enabled = random(1) < 0.5;
    }
    break;

  case '_': // turn one more off
    int limit = voices.size() - min_voices;
    for (int i = 0; i < limit; i++) {
      voices.remove();
    }
    break;

  case '+': // turn one more on
    for (int i = voices.size(); i < max_voices; i++) {
      Voice v = new Voice(B_locrian);
      v.mute = false;
      voices.add(v);
    }
    break;

  case '-': // remove one voice
    if (voices.size() > min_voices) voices.remove();
    break;

  case '=': // add one voice
    if (voices.size() < max_voices) {
      Voice v = new Voice(B_locrian);
      v.mute = false;
      voices.add(v);
    }
    break;

  case 'p': // add one voice
    for (Voice v : voices.voices) {
      v.randomize_velocity();
      v.randomize_position();
      v.randomize_orientation();
    }
    break;

  case 'P': // add one voice
    for (Voice v : voices.voices) {
      v.randomize_orientation();
    }
    break;

  case '[': // add one voice
    for (Voice v : voices.voices) {
      v.randomize_velocity();
      v.randomize_position();
      v.randomize_orientation();
      v.randomize_mode();
    }
    break;

  case '{': // add one voice
    for (Voice v : voices.voices) {
      v.randomize_mode();
    }
    break;

  case ']':
    light1.setPositionZ(
      constrain(light1.position_target.z - 10, 100, 500)
      );
    break;
  case '}':
    light1.setPositionZ(
      constrain(light1.position_target.z + 10, 100, 500)
      );
    break;

  case '\\':
    light1.setPositionZ(random(100, 500));
    break;
  case '|':
    light1.setPositionZ(250);
    break;

  case 'E':
    camera1.setCenter(new PVector());
    break;
  case 'e':
    camera1.randomize_center();
    break;
  case 'Q':
    camera1.setPosition(new PVector(0.0, 0.0, camera1.position_lerp.z));
    break;
  case 'q':
    camera1.randomize_position();
    break;
  case 'z':
    camera1.randomize_translation();
    break;
  case 'Z':
    camera1.setTranslation(new PVector());
    break;
  case 'x':
    camera1.randomize_rotation();
    break;
  case 'X':
    camera1.setRotation(new PVector());
    break;
  case 'c':
    camera1.randomize_perspective();
    break;
  case 'C':
    camera1.fov_target = PI/4.0;
    break;
  }
}
