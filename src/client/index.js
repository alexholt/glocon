import { scaleCanvas } from './canvas_tools';
import { throttle } from 'lodash';
import Map from './map';
import UnitManager from './unit_manager';

let context;

let isPanning = false;
let lastX;
let lastY;

function initialize() {
  const canvas = document.querySelector('canvas');   
  context = canvas.getContext('2d');
  Map.init(window.innerWidth, window.innerHeight);
  UnitManager.init(Map.getTerritories());
  scaleCanvas(canvas, window.innerWidth, window.innerHeight);

  window.addEventListener('resize', () => {
    scaleCanvas(canvas, window.innerWidth, window.innerHeight);
  });

  document.addEventListener('wheel', (event) => {
    event.preventDefault();
  });

  document.addEventListener('wheel', throttle((event) => {
    Map.zoom(event.pageX, event.pageY, event.wheelDeltaY);
  }, 0));

  document.addEventListener('mousedown', (event) => {
    isPanning = true;
    const { pageX, pageY } = event;
    lastX = pageX;
    lastY = pageY;
    canvas.style.cursor = 'move';
  });

  document.addEventListener('mousemove', (event) => {
    if (!isPanning) {
      return;
    }
    const { pageX, pageY } = event;
    const deltaX = lastX - pageX;
    const deltaY = lastY - pageY;
    lastX = pageX;
    lastY = pageY;
    Map.pan(deltaX, deltaY);
  });

  document.addEventListener('mouseleave', (event) => {
    isPanning = false;
    canvas.style.cursor = 'default';
  });

  document.addEventListener('mouseup', (event) => {
    isPanning = false;
    canvas.style.cursor = 'default';
  });

  window.requestAnimationFrame(render);
}

function render(timestamp) {
  Map.draw(context);
  UnitManager.draw(context, Map.getScale(), Map.getOffsetX(), Map.getOffsetY());
  window.requestAnimationFrame(render);
}

window.addEventListener('DOMContentLoaded', initialize);
