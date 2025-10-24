class Camera {
  cam;

  position;
  position_lerp;
  position_target;
  do_position = false;
  position_rate = 0.0025;
  position_progress = 0.0;

  center;
  center_lerp;
  center_target;
  do_center = false;
  center_rate = 0.0025;
  center_progress = 0.0;

  axis;

  translation;
  translation_lerp;
  translation_target;
  translation_rate = 0.001;
  translation_progress = 0.0;
  do_translation = false;

  rotation;
  rotation_lerp;
  rotation_target;
  rotation_rate = 0.005;
  rotation_progress = 0.0;
  do_rotation = false;

  aspect_ratio;

  fov;
  fov_lerp;
  fov_target;

  near;
  far;

  perspective_rate = 0.001;
  perspective_progress = 0.0;

  radius;
  radius_target;
  radius_ease_amount = 0.1;

  orbit_rate = 0.01;
  orbit_progress = 0.0;

  orbit_camera = false;

  constructor() {
    this.cam = createCamera();
    this.position = createVector(0.0, 0.0, width/2.0);
    this.position_lerp = this.position.copy();
    this.position_target = this.position.copy();

    this.center = createVector();
    this.center_lerp = this.center.copy();
    this.center_target = this.center.copy();

    this.rotation = createVector(
      random(-0.1,0.1),
      random(-0.1,0.1),
      random(-0.1,0.1)
    );
    this.rotation_lerp = this.rotation.copy();
    this.rotation_target = this.rotation.copy();

    this.translation = createVector();
    this.translation_lerp = this.translation.copy();
    this.translation_target = this.translation.copy();

    this.axis = createVector(0.0, 1.0, 0.0);// y-up

    this.radius = height/2.0;
    this.radius_target = this.radius;

    this.fov = Math.PI/4.0;
    this.fov_lerp = this.fov;
    this.fov_target = this.fov;

    this.aspect_ratio = width/height;

    this.near = 1.0;
    this.far = 10000;
  }

  randomize_orbit() {
    this.radius_target = random(1.0, width/4.0);
    this.orbit_rate = random(0.001, 0.01);
  }

  randomize() {
    this.position = createVector(
      0.0,
      0.0,
      random(10, 1000)
      );
    this.position_target = this.position.copy();
    this.center = createVector(0.0, 0.0, 0.0);
    this.center_target = this.center.copy();
  }

  randomize_perspective() {
    this.perspective_progress = 0.0;
    this.fov_target = random(Math.PI/16.0, Math.PI/2.0);
  }

  update() {

    this.position_camera();
    this.center_camera();
    this.animate_perspective();
    this.translate_camera();
    this.rotate_camera();

    if (this.orbit_camera) this.orbit();

    this.cam.perspective(
      this.fov,
      this.aspect_ratio,
      1,
      10000
    );

    this.cam.camera(
      this.position_lerp.x, this.position_lerp.y, this.position_lerp.z,
      this.center_lerp.x, this.center_lerp.y, this.center_lerp.z,
      this.axis.x, this.axis.y, this.axis.z
      );

    this.cam.move(
      this.translation_lerp.x,
      this.translation_lerp.y,
      this.translation_lerp.z
      );

    this.cam.tilt(this.rotation_lerp.x);
    this.cam.roll(this.rotation_lerp.y);
    this.cam.pan(this.rotation_lerp.z);

  }

  ease(current, target, amount) {
    return(amount * (target - current) + current);
  }

  //----------------------------------------------------------------

  setOrbitRadius(r) {
    this.radius_target = r;
  }

  orbit() {
    this.orbit_progress += this.orbit_rate;
    if (this.orbit_progress >= 1.0) this.orbit_progress -= 1;
    this.position.x = this.radius * cos(2 * Math.PI * this.orbit_progress);
    this.position.y = this.radius * sin(2 * Math.PI * this.orbit_progress);
    this.radius = this.ease(this.radius, this.radius_target, this.radius_ease_amount);
  }

  //----------------------------------------------------------------

  setFov(radians) {
    this.fov_target = radians;
    this.perspective_progress = 0.0;
  }

  animate_perspective() {
    if (this.perspective_progress < 1.0) {
      this.perspective_progress += this.perspective_rate;
    }

    this.fov = lerp(this.fov, this.fov_target, this.perspective_progress);
  }

  //----------------------------------------------------------------
  // Position Camera

  randomize_position() {
    this.position = this.position_lerp.copy();
    this.position_progress = 0.0;
    this.do_position = true;
    this.position_target.x = random(-width/4.0, width/4.0);
    this.position_target.y = random(-width/4.0, height/4.0);
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

  position_camera() {
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

  //----------------------------------------------------------------
  // Center Camera

  randomize_center() {
    this.setCenter(createVector(
      random(-width/4.0, width/4.0),
      random(-height/4.0, height/4.0),
      0.0
      ));
  }

  setCenter(_center) {
    this.center = this.center_lerp.copy();
    this.center_target = _center.copy();
    this.center_progress = 0.0;
    this.do_center = true;
  }

  center_camera() {

    if (this.center_progress < 1.0 && this.do_center) {
      this.center_progress = constrain(this.center_progress + this.center_rate, 0.0, 1.0);

      this.center_lerp.x = lerp(this.center.x, this.center_target.x, this.center_progress);
      this.center_lerp.y = lerp(this.center.y, this.center_target.y, this.center_progress);
      this.center_lerp.z = lerp(this.center.z, this.center_target.z, this.center_progress);
    } else if (this.center_progress >= 1.0 && this.do_center) {
      this.center = this.center_target.copy();
      this.do_center = false;
    }
  }

  //----------------------------------------------------------------
  // Rotate Camera

  randomize_rotation() {
    this.setRotation(createVector(
      random(-Math.PI/4.0, Math.PI/4.0),
      random(-Math.PI/4.0, Math.PI/4.0),
      random(0, 2*Math.PI)
      ));
  }

  setRotationX(x) {
    this.rotation = this.rotation_lerp.copy();
    this.rotation_target.x = constrain(x, -7*Math.PI/16.0, 7*Math.PI/16.0);
    this.rotation_progress = 0.0;
    this.do_rotation = true;
  }

  setRotationY(y) {
    this.rotation = this.rotation_lerp.copy();
    this.rotation_target.y =  constrain(y, -7*Math.PI/16.0, 7*Math.PI/16.0);
    this.rotation_progress = 0.0;
    this.do_rotation = true;
  }

  setRotationZ(z) {
    this.rotation = this.rotation_lerp.copy();
    this.rotation_target.z =  constrain(z, -Math.PI, Math.PI);
    this.rotation_progress = 0.0;
    this.do_rotation = true;
  }

  setRotation(_rotation) {
    this.rotation = rotation_lerp.copy();
    this.rotation_target = _rotation.copy();
    this.rotation_progress = 0.0;
    this.do_rotation = true;
  }

  get rotation() {
    return this.rotation.copy();
  }

  rotate_camera() {

    if (this.rotation_progress < 1.0 && this.do_rotation) {
      this.rotation_progress = constrain(this.rotation_progress + this.rotation_rate, 0.0, 1.0);

      this.rotation_lerp.x = lerp(this.rotation.x, this.rotation_target.x, this.rotation_progress);
      this.rotation_lerp.y = lerp(this.rotation.y, this.rotation_target.y, this.rotation_progress);
      this.rotation_lerp.z = lerp(this.rotation.z, this.rotation_target.z, this.rotation_progress);
    } else if (this.rotation_progress >= 1.0 && this.do_rotation) {
      this.rotation = [...this.rotation_target];
      this.do_rotation = false;
    }
  }

  //----------------------------------------------------------------
  // Translate Camera

  randomize_translation() {
    this.setTranslation(createVector(
      random(-width/2.0, width/2.0),
      random(-height/2.0, height/2.0),
      0.0
      ));
  }

  setTranslationX(x) {
    this.translation = this.translation_lerp.copy();
    this.translation_target.x = x;
    this.translation_progress = 0.0;
    this.do_translation = true;
  }

  setTranslationY(y) {
    this.translation = translation_lerp.copy();
    this.translation_target.y = y;
    this.translation_progress = 0.0;
    this.do_translation = true;
  }

  setTranslationZ(z) {
    this.translation = this.translation_lerp.copy();
    this.translation_target.z = constrain(z, -10000, -10);
    this.translation_progress = 0.0;
    this.do_translation = true;
  }

  setTranslation(_translation) {
    this.translation = this.translation_lerp.copy();
    this.translation_target = _translation.copy();
    this.translation_progress = 0.0;
    this.do_translation = true;
  }

  getTranslation() {
    return this.translation.copy();
  }

  translate_camera() {

    if (this.translation_progress < 1.0 && this.do_translation) {
      this.translation_progress = constrain(this.translation_progress + this.translation_rate, 0.0, 1.0);

      this.translation_lerp.x = lerp(this.translation.x, this.translation_target.x, this.translation_progress);
      this.translation_lerp.y = lerp(this.translation.y, this.translation_target.y, this.translation_progress);
      this.translation_lerp.z = lerp(this.translation.z, this.translation_target.z, this.translation_progress);
    } else if (this.translation_progress >= 1.0 && this.do_translation) {
      this.translation = this.translation_target.copy();
      this.do_translation = false;
    }
  }
}