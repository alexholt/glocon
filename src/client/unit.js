import Territory from './territory';
import { cloneDeep, padStart } from 'lodash';
import { createProgram, makeRectAt } from './canvas_tools';

export default class Unit {

  constructor(x, y, width, height, image) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;
  }

  getTerritories() {
    return cloneDeep(this.territories);
  }

  getScale() {
    return this.zoomDelta;
  }

  getOffsetX() {
    return this.x;
  }

  getOffsetY() {
    return this.y;
  }

  initialize(gl) {
    this.program  = createProgram(gl, require('./shaders/unit.vert'), require('./shaders/unit.frag'));
    this.mapTexInfo = this.loadImage(gl);

    this.positionAttributeLocation = gl.getAttribLocation(this.program, 'a_position');
    this.texcoordAttributeLocation = gl.getAttribLocation(this.program, 'a_texcoord');

    this.textureLocation = gl.getUniformLocation(this.program, 'u_texture');
    this.resolutionUniformLocation = gl.getUniformLocation(this.program, 'u_resolution');
    this.positionUniformLocation = gl.getUniformLocation(this.program, 'u_position');

    this.positionBuffer = gl.createBuffer();
    this.texcoordBuffer = gl.createBuffer();

    this.positions = new Float32Array(makeRectAt(this.x, this.y, this.width, this.height));
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    this.texcoords = [
      0, 0,
      0, 1,
      1, 0,
      1, 0,
      0, 1,
      1, 1,
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texcoords), gl.STATIC_DRAW);
    this.isInit = true;
  }

  loadImage(gl) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 255, 255])
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    this.textureInfo = {
      width: 1,
      height: 1,
      texture: tex,
    };

    const img = new Image();
    img.crossOrigin = '';
    img.addEventListener('load', () => {
      this.textureInfo.width = this.width;
      this.textureInfo.height = this.height;

      gl.bindTexture(gl.TEXTURE_2D, this.textureInfo.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      this.isInit = true;
    });

    img.src = this.image;
    return this.textureInfo;
  }

  render(gl, mapPosition) {
    if (!this.isInit) this.initialize(gl);
    gl.useProgram(this.program);

    gl.uniform2f(this.resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(this.positionUniformLocation, this.x - mapPosition.x, this.y - mapPosition.y);
    gl.uniform1i(this.textureLocation, 0);

    gl.bindTexture(gl.TEXTURE_2D, this.textureInfo.texture);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

    gl.enableVertexAttribArray(this.positionAttributeLocation);
    gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);

    gl.enableVertexAttribArray(this.texcoordAttributeLocation);
    gl.vertexAttribPointer(this.texcoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
