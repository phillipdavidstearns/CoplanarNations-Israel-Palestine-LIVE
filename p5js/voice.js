//================================================================
class Voices {
  #voices = [];
  scale;

  Voices(qty, _scale) {
    this.scale = _scale;
    for (var i = 0; i < qty; i++) {
      this.voices.push(new Voice(this.scale));
    }
  }

  update() {
    this.voices.forEach((voice) => voice.update());
  }

  get(_index) {
    if (_index >= 0 && _index < this.voices.length) {
      return this.voices[_index];
    } else {
      return null;
    }
  }

  add() {
    this.voices.push(new Voice(this.scale));
  }

  add(voice) {
    this.voices.push(voice);
  }

  remove() {
    this.voices.splice(this.voices.length-1, 1);
  }

  get size() {
    return this.voices.length;
  }

  remove(_index) {
    if (_index >= 0 && _index < this.voices.size()) this.voices.splice(_index,1);
  }

  render(_pixels) {
    this.voice.forEach((voice) => voice.render(_pixels));
  }

  getPixelData(_pixels, _qty) {
    try {
      var data = Array(_qty).fill(0);
      var temp = Array(_qty).fill(0);
      for (var i = 0; i < this.voices.size(); i++) {
        var v = this.voices.get(i);

        if (v == null) return null;

        temp = v.getPixelData(_pixels, _qty);
        for (var j = 0; j < _qty; j++) {
          if (i == 0) {
            data[j] |= temp[j];
          } else {
            data[j] ^= temp[j];
          }
        }
      }
      return data;
    }
    catch (e) {
      console.log(`Caught Exception @ getPixelData: ${e}`);
      return null;
    }
  }

  randomize() {
    this.voices.forEach((voice) => voice.randomize());
  }
}

//================================================================

class Voice {
  register;
  position;
  velocity;
  size;
  orientation = "horizontal";
  mode = 0;
  wrap = true;
  line_color = color(0);
  pixel_index = 0;
  pixel_index_offset = 0;
  last_pixel_index_offset = 0;
  move_enabled = false;
  move_x = true;
  move_y = true;
  scale;

  arpeggiate = false;
  step_interval = 1;

  mute = true;

  constructor(_scale) {
    this.register = new Register();
    this.randomize();
    this.random_pitch();
    this.scale = _scale;
  }

  random_scale() {
    var octave_index = Math.floor(random(this.scale.length));
    var note_index = Math.floor(random(this.scale[octave_index].length));
    note_name = this.scale[octave_index][note_index];
    this.size = notes.get(note_name);
  }

  random_note() {
    note_index = Math.floor(random(notes.size()));
    this.size = notes.get(notes.keyArray()[note_index]);
  }

  random_pitch() {
    this.size = Math.floor(random(2, 1920));
  }

  update() {
    if (this.move_enabled) this.move();
    if (this.arpeggiate) this.arpeggio();
  }

  arpeggio() {
    note = this.scale[(this.register.get() >> 3 & 0b111) % this.scale.length][this.register.get() & 0b111];
    this.setNote(note);
    if (frameCount % this.step_interval == this.step_interval - 1) {
      this.mute = random(1) < 0.25;
      if (random(1) < 0.75) {
        this.register.lfsr_left();
      }
    }
  }

  randomize_velocity() {
    this.velocity = createVector(
      random(-0.002, 0.002),
      random(-0.002, 0.002)
    );
  }

  randomize_position() {
    this.position = createVector(
      random(0, 1),
      random(0, 1)
    );
  }

  randomize_mode() {
    this.mode = Math.floor(random(4));
    switch(this.mode) {
    case 0: // r
      this.line_color = color(255, 0, 0);
      break;
    case 1: // g
      this.line_color = color(0, 255, 0);
      break;
    case 2: // b
      this.line_color = color(0, 0, 255);
      break;
    case 3: // r ^ g ^ b
      this.line_color = color(255, 255, 255);
      break;
    }
  }
  
  randomize_orientation(){
    this.orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
  }

  randomize() {
    this.randomize_position();
    this.randomize_velocity();
    this.register.randomize();
    this.randomize_mode();
    this.step_interval = floor(32/random(1, 4));
    this.randomize_orientation();
  }

  move() {
    // wrap
    if (this.wrap) {
      if (this.move_x) {
        this.position.x += this.velocity.x;
        if (this.position.x < 0.0) {
          this.position.x += 1.0;
        } else if (this.position.x >= 1.0) {
          this.position.x -= 1.0;
        }
      }

      if (this.move_y) {
        this.position.y += this.velocity.y;
        if (this.position.y < 0.0) {
          this.position.y += 1.0;
        } else if (this.position.y >= 1.0) {
          this.position.y -= 1.0;
        }
      }
    } else { // Bounce
      if (this.move_x) {
        this.position.x += this.velocity.x;
        if (this.position.x < 0.0) {
          this.position.x *= -1.0;
          this.velocity.x *=-1;
        } else if (this.position.x >= 1.0) {
          this.position.x = 2.0 - this.position.x;
          this.velocity.x *= -1;
        }
      }
      if (this.move_y) {
        this.position.y += this.velocity.y;
        if (this.position.y < 0.0) {
          this.position.y *= -1.0;
          this.velocity.y *= -1;
        } else if (this.position.y >= 1.0) {
          this.position.y = 2.0 - this.position.x;
          this.velocity.y *= -1;
        }
      }
    }
  }

  getPixelData(_pixels, _qty) {

    line = Array(_qty).fill(0);
    start_pixel = this.getStart();
    line_position = this.getPosition();

    var pixel = color(0);
    var value = 0;

    for (var l = 0; l < _qty; l++) {
      if (this.mute) {
        value = 127;
      } else {
        this.pixel_index_offset = (l + this.last_pixel_index_offset) % this.size;
        this.pixel_index = this.pixel_index_offset + start_pixel;

        if (this.getOrientation() === "horizontal") {
          pixel = _pixels[line_position * width + ((this.pixel_index + width) % width)];
        } else {
          pixel = _pixels[((this.pixel_index + height) % height) * width + line_position];
        }

        switch(this.mode) {
        case 0: // r
          value = (pixel >> 16 & 0xff);
          break;
        case 1: // g
          value = (pixel >> 8 & 0xff);
          break;
        case 2: // b
          value = (pixel & 0xff);
          break;
        case 3: // r ^ g ^ b
          value = (pixel & 0xFF) ^ (pixel >> 8 & 0xFF) ^ (pixel >> 16 & 0xff);
          break;
        }
      }

      line[l] = value;
    }

    this.last_pixel_index_offset = this.pixel_index_offset;
    return line;
  }

  setNote(note) {
    if (notes.hasKey(note)) {
      this.size = notes.get(note);
    }
  }

  getMax() {
    return this.orientation === "horizontal" ? width : height;
  }

  getPosition() {
    return floor(
      this.orientation === "horizontal" ?
      this.position.y * height
      :
      this.position.x * width
      );
  }

  getStart() {
    if (this.orientation ==="horizontal") {
      return (floor(this.position.x * width - (this.size / 2.0)) + width) % width;
    } else {
      return (floor(this.position.y * height - (this.size / 2.0)) + height) % height;
    }
  }

  getOrientation() {
    return this.orientation;
  }

  moveEnable() {
    this.move_enabled = true;
  }

  moveDisable() {
    this.move_enabled = false;
  }

  render(_pixels) {
    if (this.mute) return;
    for (var l = 0; l < this.size; l++) {
      if (this.orientation === "horizontal") {
        _pixels[((height + this.getPosition()) % height) * width + ((l+this.getStart() + width) % width)] = this.line_color;
      } else {
        _pixels[((l+this.getStart() + height) % height) * width + ((width + this.getPosition()) % width)] = this.line_color;
      }
    }
  }
}