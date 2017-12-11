import Matrix4 from './matrix4';
import Territory from './territory';
import Vector3 from './vector3';

import { cloneDeep, padStart } from 'lodash';
import { createProgram, makeRectAt } from './canvas_tools';

const PAN_BORDER = 10;
const CENTROID_RADIUS = 10;
const territories = {};

export default class Map {

  constructor(map) {
    this.mapX = -1;
    this.mapY = 0;
    this.mapWidth = 2000;
    this.mapHeight = 1000;
    this.active = '';
    this.lastActive = {};
    this.isInit = false;
    this.selectedTerritoryId = -1;

    this.svgContainer = document.createElement('section');
    this.svgContainer.innerHTML = map;

    const paths = this.svgContainer.querySelectorAll('path');
    this.texture = new Image();

    this.texture.addEventListener('load', () => {
      this.isInit = true;
    });

    this.texture.src = require('./images/2x/terrain@2x.png');

    this.territories = {};

    for (let i = 0; i < paths.length; i++) {
      const territory = paths[i];
      const pathData = territory.getAttribute('d');
      this.territories[territory.getAttribute('data-name')] = new Territory(pathData);
    }
  }

  drawCanvasTexture(cb) {
    const map = this.svgContainer.cloneNode(true);
    const paths = map.querySelectorAll('path');

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      let encodedColor = `${i.toString(16)}`;
      encodedColor = `#${padStart(encodedColor, 6, '0')}`;

      path.setAttribute('fill', `${encodedColor}`);
      path.removeAttribute('inkscape:connector-curvature');
      path.removeAttribute('data-name');
      path.removeAttribute('data-id');
      path.setAttribute('stroke-width', '0');
    }

    const img = new Image();
    const svg = map.querySelector('svg');

    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', '8000');
    svg.setAttribute('height', '4000');
    img.crossOrigin = '';
    img.addEventListener('load', cb);
    img.src = `data:image/svg+xml,${encodeURI(map.innerHTML).replace(/#/g, '%23')}`;
    return img;
  }

  getTerritories() {
    return cloneDeep(this.territories);
  }

  handleClick({pageX, pageY}) {
    const point = this.lastClickedPoint =
      [Math.round(pageX / this.zoomDelta + this.x), Math.round(pageY / this.zoomDelta + this.y)];

    if (!this.lookupData) {
      const context = document.createElement('canvas').getContext('2d');
      context.canvas.width = 2000;
      context.canvas.height = 1000;
      context.canvas.style.width = '2000px';
      context.canvas.style.height = '1000px';
      context.drawImage(this.lookupMap, 0, 0, 2000, 1000);
      this.lookupData = context.getImageData(0, 0, 2000, 1000).data;
    }

    this.selectedTerritoryId = this.lookupData[(point[0] + point[1] * 2000) * 4 + 1] * 256 +
      this.lookupData[(point[0] + point[1] * 2000) * 4 + 2];

    return this.lastClickedPoint;
  }

  setActive(name) {
    active = name;
    if (!active || lastActive === territories[active] && lastActive.isActive) {
      lastActive.isActive = false;
      return;
    }

    lastActive.isActive = false;
    lastActive = territories[active];
    lastActive.isActive = true;
  }

  handleEdgePan(lastX, lastY) {
    if (!lastX || !lastY) return;

    const lowerX =  PAN_BORDER;
    const upperX = width - PAN_BORDER;
    const lowerY = PAN_BORDER;
    const upperY = height - PAN_BORDER;

    if (lastX < lowerX) pan(-10, 0);
    if (lastX > upperX) pan(10, 0);
    if (lastY > upperY) pan(0, 10);
    if (lastY < lowerY) pan(0, -10);
  }

  initialize(gl) {
    this.program  = createProgram(gl, require('./shaders/basic.vert'), require('./shaders/basic.frag'));
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
    gl.uniformMatrix4fv(this.cameraMatrixLocation, false, cameraMatrix.getData());

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