import { scaleCanvas, createProgram } from './canvas_tools';
import { throttle } from 'lodash';
import Camera from './camera';
import Map from './map';
import UnitRepository from './unit_repository';
import Stats from 'stats.js';
import UI from './ui';
import Unit from './unit';

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
let map;
let unitRepo;
let camera;

function initialize() {
  initializeFPS();
  const canvas = document.querySelector('canvas');

  gl = canvas.getContext('webgl');
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  map = new Map(require('./images/world.svg'));
  camera = new Camera();

  unitRepo = new UnitRepository(map.getTerritories());

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

    camera.zoom(event.pageX, event.pageY, deltaY);
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
    const transformedX = pageX * map.getScale() + map.getOffsetX();
    const transformedY = pageY * map.getScale() + map.getOffsetY();
    positionBox.innerText =
      `(${pageX}, ${pageY})
      [${transformedX.toFixed(0)}, ${transformedY.toFixed(0)}]
      Map:
        (${map.getOffsetX()}, ${map.getOffsetY()}) @ ${map.getScale()}`;

    const deltaX = lastX - pageX;
    const deltaY = lastY - pageY;
    lastX = pageX;
    lastY = pageY;

    if (!isPanning) {
      return;
    }

    camera.pan(deltaX, deltaY);
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
    map.handleClick(event);
  });

  //UI.initialize();
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

function render(timestamp) {
  //map.handleEdgePan(lastX, lastY);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(1, 0, 0.8, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  map.render(gl, camera.getMatrix());

  //unitRepo.render(gl, map.getScale(), map.getOffsetX(), map.getOffsetY());

  stats.update();
  window.requestAnimationFrame(render);
}

window.addEventListener('DOMContentLoaded', initialize);