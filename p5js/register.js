class Register {
  register = 0;
  length;
  taps = Array(2);

  constructor() {
    this.length = 16;
    this.randomize();
  }

  loop_left() {
    var temp = this.register >> (this.length - 1) & 0b1;
    this.register <<= 1;
    this.register |= temp;
  }

  loop_left(count) {
    for (var i = 0; i < count; i++) {
      this.loop_left();
    }
  }

  loop_right() {
    var temp = this.register & 0b1;
    this.register >>= 1;
    this.register |= temp << this.length;
  }

  loop_right(count) {
    for (var i = 0; i < count; i++) {
      this.loop_right();
    }
  }

  lfsr_left() {
    var input = (this.register >> this.taps[0] & 0b1) ^ (this.register >> this.taps[1] & 0b1);
    this.register <<= 1;
    this.register |= input;
  }

  lfsr_left(count) {
    for (var i = 0; i < count; i++) {
      this.lfsr_left();
    }
  }

  lfsr_right() {
    var input = (this.register >> this.taps[0] & 0b1) ^ (this.register >> this.taps[1] & 0b1);
    this.register >>= 1;
    this.register |= input << this.length;
  }

  lfsr_right(count) {
    for (var i = 0; i < count; i++) {
      this.lfsr_left();
    }
  }
  
  randomize(){
    this.randomize_register();
    this.randomize_taps();
  }

  randomize_register() {
    this.register = Math.floor(random(Math.pow(2, this.length)));
  }

  randomize_taps() {
    var candidate;
    for (var i = 0; i < this.taps.length; i++) {
      candidate = Math.floor(random(1, this.length));
      if (i != 0) {
        while (candidate == this.taps[0]) {
          candidate = Math.floor(random(1, this.length));
        }
      }
      this.taps[i] = candidate;
    }
  }

  set set(value) {
    var parsed = parseInt(value);
    if(parsed) this.register = parsed;

  }

  get get() {
    return this.register;
  }

  get size(){
    return this.length;
  }

  get(q) {
    return this.register >> q & 0b1;
  }
}
