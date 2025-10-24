class Flag {
  texture;
  vertices;
  vertices_morphed;
  vertices_target;
  scale = 1920.0;
  noise_offset = [
    random(-1,1),
    random(-1,1),
    random(-1,1),
    random(-1,1)
  ];
  noise_position = 0.0;
  noise_rate = 0.001;
  do_animate = false;
  morph_progress = 0.0;
  morph_speed = 0.01;
  morph_enabled = false;
  debug = false;
  render_edges = true;
  render_texture = true;
  qty_vertices;
  edge_flicker = false;
  texture_flicker = false;
  flicker_amount=0.5;
  

  //----------------------------------------------------------------
  // Constructors

  constructor(qty_vertices, texture) {
    this.morph_speed = random(0.0001, 0.01);
    this.qty_vertices = qty_vertices;
    this.texture = texture;
    this.vertices = Flag.generateVertices(this.qty_vertices);
    this.vertices_target = Array(this.vertices.length);
    this.vertices_morphed = Array(this.vertices.length);
  }

  //----------------------------------------------------------------
  // update

  update() {
    if (this.edge_flicker) this.render_edges = Math.random() < this.flicker_amount;
    if (this.texture_flicker) this.render_texture = Math.random() < this.flicker_amount;
    if (this.morph_enabled) this.do_morph();
  }

  //----------------------------------------------------------------
  // morphControls

  do_morph() {
    if (this.morph_progress >= 1.0) {
      this.morph_enabled = false;
      this.morph_progress = 0.0;
      this.vertices = [...this.vertices_target];
    } else {
      this.morph_progress = constrain(this.morph_progress + this.morph_speed, 0.0, 1.0);
      for (var i = 0; i < this.vertices.length; i++) {
        for (var j = 0; j < this.vertices_morphed[i].length; j++) {
          this.vertices_morphed[i][j] = lerp(this.vertices[i][j], this.vertices_target[i][j], this.morph_progress);
        }
      }
    }
  }

  morph(target_vertices) {
    this.vertices_morphed = [...this.vertices];
    this.vertices_target = [...target_vertices];
    this.morph_progress = 0.0;
    this.morph_enabled = true;
  }

  //----------------------------------------------------------------
  // render

  render() {
    var start;
    var temp;

    if (this.render_edges) {
      strokeWeight(1);
      stroke(255);
    } else {
      noStroke();
    }

    push();
    textureMode(NORMAL);
    textureWrap(REPEAT);
    

    //draw the vertices
    beginShape();
    if (this.texture != null && this.render_texture) {
      texture(this.texture);
    } else {
      noFill();
    }
    
    for (var i = 0; i < this.size - 2; i++){
      start = this.morph_enabled ? this.vertices_morphed[i] : this.vertices[i];
      this.placeVertex(start);
      for(var j = 1; j < 3; j++){
        temp = this.morph_enabled ? this.vertices_morphed[i+j] : this.vertices[i+j];
        this.placeVertex(temp);
      }
      this.placeVertex(start);
    }

    for (var i = 0; i < this.size; i++) {
      temp = this.morph_enabled ? this.vertices_morphed[i] : this.vertices[i];
      this.placeVertex(temp);
    }

    var end = this.morph_enabled ? this.vertices_morphed[0] : this.vertices[0];
    this.placeVertex(end);
    if(this.do_animate) this.noise_position += this.noise_rate;
    endShape();
    pop();
  }

  placeVertex(_vertex) {
    vertex(
      width * (_vertex[0] + 2 *( noise(_vertex[0], this.noise_position + this.noise_offset[0]) - 0.5)),
      height * (_vertex[1] + 2 * (noise(_vertex[1], this.noise_position + this.noise_offset[1]) - 0.5)),
      0,
      _vertex[2] + 2 * (noise(_vertex[2], this.noise_position + this.noise_offset[2]) - 0.5),
      _vertex[3] + 2 * (noise(_vertex[3], this.noise_position + this.noise_offset[3]) - 0.5)
      );
  }

  static generateVertices(_qty_vertices) {
    var new_vertices = [];
    for (var i = 0; i < _qty_vertices; i++) {
      new_vertices.push(Flag.generateRandomVertex());

    }
    return new_vertices;
  }

  //----------------------------------------------------------------
  // randomizeVertices

  randomizeVertices() {
    for (var i = 0; i < this.vertices.length; i++) {
      this.vertices[i] = Flag.generateRandomVertex();
    }
    this.vertices_morphed = [...this.vertices];
    this.vertices_target = [...this.vertices];
    return this.vertices;
  }

  //----------------------------------------------------------------
  // generateRandomVertex

  static generateRandomVertex() {
    return [
      random(-1, 1),
      random(-1, 1),
      random(-1,1),
      random(-1,1)
    ];
  }
  //----------------------------------------------------------------
  // getters

  get size() {
    return this.qty_vertices;
  }

  get vertices() {
    return [...this.vertices];
  }

  //----------------------------------------------------------------
  // setters
  set vertices(vertices) {
    if (this.morph_enabled) {
      this.vertices_target = [...vertices];
    } else {
      this.vertices = [...vertices];
    }

    return this;
  }
}