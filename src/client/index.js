import { scaleCanvas, createProgram, makeRectAt } from './canvas_tools';
import { throttle } from 'lodash';
import Map from './map';
import UnitManager from './unit_manager';
import Stats from 'stats.js';
import UI from './ui';

let gl;

let isPanning = false;
let lookupMap;
let lastX;
let lastY;
let lastFrame;
let stats;
let positionBox;
let program;
let positionAttributeLocation;
let positionBuffer;
let resolutionUniformLocation;
let positionUniformLocation;
let positions;
let texcoords;
let textureLocation;
let texcoordAttributeLocation;
let texcoordBuffer;
let mapTexInfo;
let selectedTerritoryId;
let selectedTerritoryIdLocation;

function initialize() {
  initializeFPS();
  const canvas = document.querySelector('canvas');

  gl = canvas.getContext('webgl');
  Map.init(window.innerWidth, window.innerHeight);
  //UnitManager.init(Map.getTerritories());
  scaleCanvas(gl, window.innerWidth, window.innerHeight);

  window.addEventListener('resize', () => {
    scaleCanvas(canvas, window.innerWidth, window.innerHeight);
  });

  document.addEventListener('wheel', (event) => {
    event.preventDefault();
  });

  document.addEventListener('wheel', throttle((event) => {
    let deltaY = event.deltaY;

    // FF (57.0b10) uses lines for the mousewheel scroll delta
    // https://w3c.github.io/uievents/#idl-wheelevent
    if (event.deltaMode === 1) deltaY *= 20;

    Map.zoom(event.pageX, event.pageY, deltaY);
  }, 50));

  const down = event => {
    isPanning = true;
    let { pageX, pageY } = event;
    if (pageX == null) {
      ({pageX, pageY} = event.touches[0]);
    }
    lastX = pageX;
    lastY = pageY;
    canvas.style.cursor = 'move';
  };

  document.addEventListener('mousedown', down);
  document.addEventListener('touchstart', down);

  const up = event => {
    let { pageX, pageY } = event;
    if (pageX == null) {
      ({pageX, pageY} = event.touches[0]);
    }
    const transformedX = pageX * Map.getScale() + Map.getOffsetX();
    const transformedY = pageY * Map.getScale() + Map.getOffsetY();
    positionBox.innerText =
      `(${pageX}, ${pageY})
      [${transformedX.toFixed(0)}, ${transformedY.toFixed(0)}]
      Map:
        (${Map.getOffsetX()}, ${Map.getOffsetY()}) @ ${Map.getScale()}`;

    const deltaX = lastX - pageX;
    const deltaY = lastY - pageY;
    lastX = pageX;
    lastY = pageY;

    if (!isPanning) {
      return;
    }

    Map.pan(deltaX, deltaY);
  };

  document.addEventListener('mousemove', up);
  document.addEventListener('touchmove', up);
  document.addEventListener('mouseout', (event) => {
    isPanning = false;
    lastX = null;
    lastY = null;
    canvas.style.cursor = 'default';
  });

  const end = event => {
    isPanning = false;
    canvas.style.cursor = 'default';
  };

  document.addEventListener('mouseup', end);
  document.addEventListener('touchend', end);

  document.addEventListener('click', (event) => {
    const point = Map.handleClick(event);
    const context = document.createElement('canvas').getContext('2d');

    context.canvas.width = 2000;
    context.canvas.height = 1000;
    context.canvas.style.width = '2000px';
    context.canvas.style.height = '1000px';
    context.drawImage(lookupMap, 0, 0, 2000, 1000);

    const data = context.getImageData(0, 0, 2000, 1000).data;
    selectedTerritoryId = data[(point[0] + point[1] * 2000) * 4 + 1] * 256 + data[(point[0] + point[1] * 2000) * 4 + 2];
  });

  //UI.initialize();
  initializeGL(gl);
  window.requestAnimationFrame(render);
}

function initializeFPS() {
  stats = new Stats();
  stats.dom.setAttribute(
    'style',
    'position: fixed; top: 10px; right: 0; width: 100px'
  );
  positionBox = document.createElement('div');
  positionBox.setAttribute('id', 'position');
  positionBox.style.fontWeight = '800';
  stats.dom.appendChild(positionBox);
  document.body.appendChild(stats.dom);
}

function initializeGL(gl) {
  program  = createProgram(gl, require('./shaders/basic.vert'), require('./shaders/basic.frag'));
  mapTexInfo = loadImage();

  positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  texcoordAttributeLocation = gl.getAttribLocation(program, 'a_texcoord');

  textureLocation = gl.getUniformLocation(program, 'u_texture');
  resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
  positionUniformLocation = gl.getUniformLocation(program, 'u_position');
  selectedTerritoryIdLocation = gl.getUniformLocation(program, 'u_selectedTerritoryId');

  positionBuffer = gl.createBuffer();
  texcoordBuffer = gl.createBuffer();

  positions = new Float32Array(makeRectAt(0, 0, 2000, 1000));
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  texcoords = [
    0, 0,
    0, 1,
    1, 0,
    1, 0,
    0, 1,
    1, 1,
  ];

  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
}

function render(timestamp) {
  //Map.handleEdgePan(lastX, lastY);
  //Map.draw(context);
  //UnitManager.draw(context, Map.getScale(), Map.getOffsetX(), Map.getOffsetY());

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(1, 0, 0.8, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(program);

  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
  gl.uniform3f(positionUniformLocation, -Map.getOffsetX(), -Map.getOffsetY(), Map.getScale());
  gl.uniform1i(textureLocation, 0);
  gl.uniform1i(selectedTerritoryIdLocation, selectedTerritoryId);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  
  gl.enableVertexAttribArray(texcoordAttributeLocation);
  gl.vertexAttribPointer(texcoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  stats.update();
  window.requestAnimationFrame(render);
}

function loadImage() {
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

  const textureInfo = {
    width: 1,   // we don't know the size until it loads
    height: 1,
    texture: tex,
  };

  lookupMap = Map.drawCanvasTexture(() => {
    textureInfo.width = lookupMap.width;
    textureInfo.height = lookupMap.height;

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, lookupMap);
  });

  return textureInfo;
}

window.addEventListener('DOMContentLoaded', initialize);