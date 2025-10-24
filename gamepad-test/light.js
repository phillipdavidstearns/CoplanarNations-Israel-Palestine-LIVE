class Light{
  c;
  position;
  position_lerp;
  position_target;
  position_progress = 0.0;
  position_rate = 0.01;
  do_position = false;
  
  constructor(){
    this.c = color(255);
    this.position = createVector(0.0,0.0,100);
    this.position_lerp = this.position.copy();
    this.position_target = this.position.copy();
  }

  setColor(_c){
    this.c = _c; 
  }
  
  update(){
    this.position_light();
  }
  
  light(){
    pointLight(
      this.c.levels[0], this.c.levels[1], this.c.levels[2] ,
      this.position_lerp.x, this.position_lerp.y, this.position_lerp.z
      );
  }
  
  randomize_position() {
    this.position = this.position_lerp.copy();
    this.position_progress = 0.0;
    this.do_position = true;
    this.position_target.x = random(-width/4.0, width/4.0);
    this.position_target.y = random(-width/4.0, height/4.0);
    this.position_target.z = random(height/10.0, height/2.0);
  }

  setPositionX(x) {
    this.position = this.position_lerp.copy();
    this.position_target.x = x;
    this.position_progress = 0.0;
    this.do_position = true;
  }

  setPositionY(y) {
    this.position = this.position_lerp.copy();
    this.position_target.y = y;
    this.position_progress = 0.0;
    this.do_position = true;
  }

  setPositionZ(z) {
    this.position = this.position_lerp.copy();
    this.position_target.z = constrain(z, 10, 10000);
    this.position_progress = 0.0;
    this.do_position = true;
  }

  setPositionZ(z, instant) {
    if (instant) {
      this.position = this.position_lerp.copy();
      this.position.z = z;
      this.position_target = this.position.copy();
      this.position_lerp = this.position.copy();
    } else {
      this.setPositionZ(z);
    }
  }

  setPosition(_position) {
    this.position = this.position_lerp.copy();
    this.position_target = _position.copy();
    this.position_progress = 0.0;
    this.do_position = true;
  }

  position_light() {

    if (this.position_progress < 1.0 && this.do_position) {
      this.position_progress = constrain(this.position_progress + this.position_rate, 0.0, 1.0);

      this.position_lerp.x = lerp(this.position.x, this.position_target.x, this.position_progress);
      this.position_lerp.y = lerp(this.position.y, this.position_target.y, this.position_progress);
      this.position_lerp.z = lerp(this.position.z, this.position_target.z, this.position_progress);
    } else if (this.position_progress >= 1.0 && this.do_position) {
      this.position = this.position_target.copy();
      this.do_position = false;
    }
  }
  
  
  
}