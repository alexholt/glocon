import { scaleCanvas, createProgram } from './canvas_tools';
import { throttle } from 'lodash';
import Map from './map';
import UnitManager from './unit_manager';
import Stats from 'stats.js';
import UI from './ui';

let gl;

let isPanning = false;
let lastX;
let lastY;
let lastFrame;
let stats;
let positionBox;
let program;
let positionAttributeLocation;
let positionBuffer;

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
    Map.handleClick(event);
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
  positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  var positions = [
    0, 0,
    0, 0.5,
    0.7, 0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
}

function render(timestamp) {
  //Map.handleEdgePan(lastX, lastY);
  //Map.draw(context);
  //UnitManager.draw(context, Map.getScale(), Map.getOffsetX(), Map.getOffsetY());

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(1, 0, 0.8, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.useProgram(program);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLES, 0, 3);

  stats.update();
  window.requestAnimationFrame(render);
}

window.addEventListener('DOMContentLoaded', initialize);
