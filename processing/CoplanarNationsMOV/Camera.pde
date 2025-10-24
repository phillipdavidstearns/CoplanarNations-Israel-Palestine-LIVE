class Camera {
  PVector position;
  PVector position_lerp;
  PVector position_target;
  boolean do_position = false;
  float position_rate = 0.0025;
  float position_progress = 0.0;

  PVector center;
  PVector center_lerp;
  PVector center_target;
  boolean do_center = false;
  float center_rate = 0.0025;
  float center_progress = 0.0;

  PVector axis;

  PVector translation;
  PVector translation_lerp;
  PVector translation_target;
  float translation_rate = 0.001;
  float translation_progress = 0.0;
  boolean do_translation = false;

  PVector rotation;
  PVector rotation_lerp;
  PVector rotation_target;
  float rotation_rate = 0.005;
  float rotation_progress = 0.0;
  boolean do_rotation = false;

  float aspect_ratio;

  float fov;
  float fov_lerp;
  float fov_target;

  float near;
  float far;

  float perspective_rate = 0.001;
  float perspective_progress = 0.0;

  float radius;
  float radius_target;
  float radius_ease_amount = 0.1;

  float orbit_rate = 0.01;
  float orbit_progress = 0.0;

  boolean orbit_camera = false;

  Camera() {

    this.position = new PVector(0.0, 0.0, width/2.0);
    this.position_lerp = position.copy();
    this.position_target = position.copy();

    this.center = new PVector();
    this.center_lerp = center.copy();
    this.center_target = center.copy();

    this.rotation = new PVector();
    this.rotation_lerp = rotation.copy();
    this.rotation_target = rotation.copy();

    this.translation = new PVector();
    this.translation_lerp = translation.copy();
    this.translation_target = translation.copy();

    this.axis = new PVector(0.0, 1.0, 0.0);// y-up

    this.radius = height/2.0;
    this.radius_target = this.radius;

    this.fov = PI/4.0;
    this.fov_lerp = this.fov;
    this.fov_target = this.fov;

    this.aspect_ratio = float(width)/float(height);

    this.near = 1.0;
    this.far = 10000;
  }

  void randomize_orbit() {
    this.radius_target = random(1.0, width/4.0);
    this.orbit_rate = random(0.001, 0.01);
  }

  void randomize() {
    this.position = new PVector(
      0.0,
      0.0,
      random(10, 1000)
      );
    this.position_target = this.position.copy();

    this.center = new PVector(0.0, 0.0, 0.0);
    this.center_target = this.center.copy();
  }

  void randomize_perspective() {
    this.perspective_progress = 0.0;
    this.fov_target = random(PI/16.0, PI/2.0);
  }

  void update() {

    this.position_camera();
    this.center_camera();
    this.animate_perspective();
    this.translate_camera();
    this.rotate_camera();

    if (this.orbit_camera) this.orbit();

    beginCamera();

    perspective(
      this.fov,
      this.aspect_ratio,
      1,
      10000
      );

    camera(
      this.position_lerp.x, this.position_lerp.y, this.position_lerp.z,
      this.center_lerp.x, this.center_lerp.y, this.center_lerp.z,
      this.axis.x, this.axis.y, this.axis.z
      );

    translate(
      this.translation_lerp.x,
      this.translation_lerp.y,
      this.translation_lerp.z
      );

    rotateX(this.rotation_lerp.x);
    rotateY(this.rotation_lerp.y);
    rotateZ(this.rotation_lerp.z);

    endCamera();
  }

  float ease(float current, float target, float amount) {
    return(amount * (target - current) + current);
  }

  //----------------------------------------------------------------

  void setOrbitRadius(int r) {
    this.radius_target = r;
  }

  void orbit() {
    this.orbit_progress += this.orbit_rate;
    if (this.orbit_progress >= 1.0) this.orbit_progress-=1;
    this.position_lerp.x = this.radius * cos(2 * PI * this.orbit_progress);
    this.position_lerp.y = this.radius * sin(2 * PI * this.orbit_progress);
    this.radius = this.ease(this.radius, this.radius_target, this.radius_ease_amount);
  }

  //----------------------------------------------------------------

  void setFov(int radians) {
    this.fov_target = radians;
    this.perspective_progress = 0.0;
  }

  void animate_perspective() {
    if (this.perspective_progress < 1.0) {
      this.perspective_progress += this.perspective_rate;
    }

    this.fov = lerp(this.fov, this.fov_target, this.perspective_progress);
  }

  //----------------------------------------------------------------
  // Position Camera

  void randomize_position() {
    this.position = this.position_lerp.copy();
    this.position_progress = 0.0;
    this.do_position = true;
    this.position_target.x = random(-width/4.0, width/4.0);
    this.position_target.y = random(-width/4.0, height/4.0);
  }

  void setPositionX(float x) {
    this.position = this.position_lerp.copy();
    this.position_target.x = x;
    this.position_progress = 0.0;
    this.do_position = true;
  }

  void setPositionY(float y) {
    this.position = this.position_lerp.copy();
    this.position_target.y = y;
    this.position_progress = 0.0;
    this.do_position = true;
  }

  void setPositionZ(float z) {
    this.position = this.position_lerp.copy();
    this.position_target.z = constrain(z, 10, 10000);
    this.position_progress = 0.0;
    this.do_position = true;
  }

  void setPositionZ(float z, boolean instant) {
    if (instant) {
      this.position = this.position_lerp.copy();
      this.position.z = z;
      this.position_target = this.position.copy();
      this.position_lerp = this.position.copy();
    } else {
      this.setPositionZ(z);
    }
  }

  void setPosition(PVector _position) {
    this.position = this.position_lerp.copy();
    this.position_target = _position.copy();
    this.position_progress = 0.0;
    this.do_position = true;
  }

  void position_camera() {

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

  void randomize_center() {
    this.setCenter(new PVector(
      random(-width/4.0, width/4.0),
      random(-height/4.0, height/4.0),
      0.0
      ));
  }

  void setCenter(PVector _center) {
    this.center = this.center_lerp.copy();
    this.center_target = _center.copy();
    this.center_progress = 0.0;
    this.do_center = true;
  }

  void center_camera() {

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

  void randomize_rotation() {
    this.setRotation(new PVector(
      random(-PI/4.0, PI/4.0),
      random(-PI/4.0, PI/4.0),
      random(0, 2*PI)
      ));
  }

  void setRotationX(float x) {
    this.rotation = this.rotation_lerp.copy();
    this.rotation_target.x = constrain(x, -7*PI/16.0, 7*PI/16.0);
    this.rotation_progress = 0.0;
    this.do_rotation = true;
  }

  void setRotationY(float y) {
    this.rotation = this.rotation_lerp.copy();
    this.rotation_target.y =  constrain(y, -7*PI/16.0, 7*PI/16.0);
    this.rotation_progress = 0.0;
    this.do_rotation = true;
  }

  void setRotationZ(float z) {
    this.rotation = this.rotation_lerp.copy();
    this.rotation_target.z =  constrain(z, -PI, PI);
    this.rotation_progress = 0.0;
    this.do_rotation = true;
  }

  void setRotation(PVector _rotation) {
    this.rotation = this.rotation_lerp.copy();
    this.rotation_target = _rotation.copy();
    this.rotation_progress = 0.0;
    this.do_rotation = true;
  }

  PVector getRotation() {
    return this.rotation.copy();
  }

  void rotate_camera() {

    if (this.rotation_progress < 1.0 && this.do_rotation) {
      this.rotation_progress = constrain(this.rotation_progress + this.rotation_rate, 0.0, 1.0);

      this.rotation_lerp.x = lerp(this.rotation.x, this.rotation_target.x, this.rotation_progress);
      this.rotation_lerp.y = lerp(this.rotation.y, this.rotation_target.y, this.rotation_progress);
      this.rotation_lerp.z = lerp(this.rotation.z, this.rotation_target.z, this.rotation_progress);
    } else if (this.rotation_progress >= 1.0 && this.do_rotation) {
      this.rotation = this.rotation_target.copy();
      this.do_rotation = false;
    }
  }

  //----------------------------------------------------------------
  // Translate Camera

  void randomize_translation() {
    this.setTranslation(new PVector(
      random(-width/2.0, width/2.0),
      random(-height/2.0, height/2.0),
      0.0
      ));
  }

  void setTranslationX(float x) {
    this.translation = this.translation_lerp.copy();
    this.translation_target.x = x;
    this.translation_progress = 0.0;
    this.do_translation = true;
  }

  void setTranslationY(float y) {
    this.translation = this.translation_lerp.copy();
    this.translation_target.y = y;
    this.translation_progress = 0.0;
    this.do_translation = true;
  }

  void setTranslationZ(float z) {
    this.translation = this.translation_lerp.copy();
    this.translation_target.z = constrain(z, -10000, -10);
    this.translation_progress = 0.0;
    this.do_translation = true;
  }

  void setTranslation(PVector _translation) {

    this.translation = this.translation_lerp.copy();
    this.translation_target = _translation.copy();
    this.translation_progress = 0.0;
    this.do_translation = true;
  }

  PVector getTranslation() {
    return this.translation.copy();
  }

  void translate_camera() {

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
