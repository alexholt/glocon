import Matrix4 from './matrix4';
import Territory from './territory';
import Vector3 from './vector3';

import { cloneDeep, padStart } from 'lodash';
import { createProgram, makeRectAt } from './canvas_tools';

const ZOOM_MIN = 0.025;
const ZOOM_MAX = 10;
const PAN_BORDER = 10;
const CENTROID_RADIUS = 10;
const territories = {};

export default class Cube {

  constructor() {
    this.x = -0.5;
    this.y = 0.5;
  }

  initialize(gl) {
    this.program  = createProgram(gl, require('./shaders/basic.vert'), require('./shaders/color.frag'));
    this.mapTexInfo = this.loadImage(gl);

    this.positionAttributeLocation = gl.getAttribLocation(this.program, 'a_position');
    this.texcoordAttributeLocation = gl.getAttribLocation(this.program, 'a_texcoord');

    this.textureLocation = gl.getUniformLocation(this.program, 'u_texture');
    this.resolutionUniformLocation = gl.getUniformLocation(this.program, 'u_resolution');
    this.positionUniformLocation = gl.getUniformLocation(this.program, 'u_position');
    this.selectedTerritoryIdLocation = gl.getUniformLocation(this.program, 'u_selectedTerritoryId');
    this.cameraMatrixLocation = gl.getUniformLocation(this.program, 'u_camera');

    this.positionBuffer = gl.createBuffer();
    this.texcoordBuffer = gl.createBuffer();

    this.positions = new Float32Array(makeRectAt(this.mapX, this.mapY, this.mapWidth, this.mapHeight));
    console.log(this.positions.toString());

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    this.texcoords = [
      0, 0,
      1, 0,
      0, 1,
      0, 1,
      1, 0,
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

  render(gl, cameraMatrix) {
    if (!this.isInit) this.initialize(gl);
    gl.useProgram(this.program);

    gl.uniform1i(this.textureLocation, 0);
    gl.uniform1i(this.selectedTerritoryIdLocation, this.selectedTerritoryId);
    gl.uniformMatrix4fv(this.cameraMatrixLocation, false, cameraMatrix.array);

    gl.bindTexture(gl.TEXTURE_2D, this.textureInfo.texture);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

    gl.enableVertexAttribArray(this.positionAttributeLocation);
    gl.vertexAttribPointer(this.positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);

    gl.enableVertexAttribArray(this.texcoordAttributeLocation);
    gl.vertexAttribPointer(this.texcoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}