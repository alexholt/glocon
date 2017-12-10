import Matrix4 from './matrix4';
import { createProgram } from './canvas_tools';

export default class Cube {

  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.mvMatrix = Matrix4.makeIdentity().translate(this.x, this.y, this.z).scale(10);
  }

  initialize(gl) {
    this.program  = createProgram(gl, require('./shaders/position.vert'), require('./shaders/color.frag'));
    //this.mapTexInfo = this.loadImage(gl);

    this.positionAttributeLocation = gl.getAttribLocation(this.program, 'aVertexPosition');
    //this.texcoordAttributeLocation = gl.getAttribLocation(this.program, 'a_texcoord');

    //this.textureLocation = gl.getUniformLocation(this.program, 'u_texture');
    //this.resolutionUniformLocation = gl.getUniformLocation(this.program, 'u_resolution');
    //this.positionUniformLocation = gl.getUniformLocation(this.program, 'u_position');
    this.selectedTerritoryIdLocation = gl.getUniformLocation(this.program, 'u_selectedTerritoryId');
    this.cameraMatrixLocation = gl.getUniformLocation(this.program, 'cameraMatrix');
    this.modelMatrixLocation = gl.getUniformLocation(this.program, 'modelViewMatrix');

    this.positionBuffer = gl.createBuffer();
    this.texcoordBuffer = gl.createBuffer();
    this.indicesBuffer = gl.createBuffer();
    this.radX = 0;
    this.lastTime = null;

    this.positions = new Float32Array([
      // Front face
      -1.0, -1.0,  1.0,
      1.0, -1.0,  1.0,
      1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,

      // Back face
      -1.0, -1.0, -1.0,
      -1.0,  1.0, -1.0,
      1.0,  1.0, -1.0,
      1.0, -1.0, -1.0,

      // Top face
      -1.0,  1.0, -1.0,
      -1.0,  1.0,  1.0,
      1.0,  1.0,  1.0,
      1.0,  1.0, -1.0,

      // Bottom face
      -1.0, -1.0, -1.0,
      1.0, -1.0, -1.0,
      1.0, -1.0,  1.0,
      -1.0, -1.0,  1.0,

      // Right face
      1.0, -1.0, -1.0,
      1.0,  1.0, -1.0,
      1.0,  1.0,  1.0,
      1.0, -1.0,  1.0,

      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0,  1.0, -1.0,
    ]);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    //this.texcoords = new Float32Array([
    //  0, 0,
    //  1, 0,
    //  0, 1,
    //  0, 1,
    //  1, 0,
    //  1, 1,
    //]);

    //gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
    //gl.bufferData(gl.ARRAY_BUFFER, this.texcoords, gl.STATIC_DRAW);

    this.indices = new Uint16Array([
      0,  1,  2,   0,  2,  3,     // front
      4,  5,  6,   4,  6,  7,     // back
      8,  9,  10,  8,  10, 11,    // top
      12, 13, 14,  12, 14, 15,    // bottom
      16, 17, 18,  16, 18, 19,    // right
      20, 21, 22,  20, 22, 23,    // left
    ]);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
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
      width: 1,   // we don't know the size until it loads
      height: 1,
      texture: tex,
    };

    this.lookupMap = this.drawCanvasTexture(() => {
      this.textureInfo.width = this.lookupMap.width;
      this.textureInfo.height = this.lookupMap.height;

      gl.bindTexture(gl.TEXTURE_2D, this.textureInfo.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.lookupMap);
    });

    return this.textureInfo;
  }

  render(gl, cameraMatrix, time) {
    this.lastTime = this.lastTime || time;
    const elapsed = (time - this.lastTime) / 10000;
    this.lastTime = time;

    if (!this.isInit) this.initialize(gl);

    this.mvMatrix = this.mvMatrix
      .rotateZ(2 * Math.PI * elapsed);

    gl.useProgram(this.program);

    gl.uniformMatrix4fv(this.cameraMatrixLocation, false, cameraMatrix.getData());
    gl.uniformMatrix4fv(this.modelMatrixLocation, false, this.mvMatrix.getData());

    //gl.bindTexture(gl.TEXTURE_2D, this.textureInfo.texture);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

    gl.enableVertexAttribArray(this.positionAttributeLocation);
    gl.vertexAttribPointer(this.positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    //gl.bindBuffer(gl.ELEMENT_BUFFER, this.indicesBuffer);
    //gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);

    //gl.enableVertexAttribArray(this.texcoordAttributeLocation);
    //gl.vertexAttribPointer(this.texcoordAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
  }
}