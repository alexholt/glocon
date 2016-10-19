import { scaleCanvas } from './canvas_tools';
import { throttle } from 'lodash';
import Map from './map';

let context;

let isPanning = false;
let lastX;
let lastY;

function initialize() {
  const canvas = document.querySelector('canvas');   
  context = canvas.getContext('2d');
  Map.init(window.innerWidth, window.innerHeight);
  scaleCanvas(canvas, window.innerWidth, window.innerHeight);

  window.addEventListener('resize', () => {
    scaleCanvas(canvas, window.innerWidth, window.innerHeight);
  });

  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
  });

  canvas.addEventListener('wheel', throttle((event) => {
    Map.zoom(event.pageX, event.pageY, event.wheelDeltaY);
  }, 0));

  canvas.addEventListener('mousedown', (event) => {
    isPanning = true;
    const { pageX, pageY } = event;
    lastX = pageX;
    lastY = pageY;
    canvas.style.cursor = 'move';
  });

  canvas.addEventListener('mousemove', (event) => {
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

  canvas.addEventListener('mouseout', (event) => {
    isPanning = false;
    canvas.style.cursor = 'default';
  });

  canvas.addEventListener('mouseup', (event) => {
    isPanning = false;
    canvas.style.cursor = 'default';
  });

  window.requestAnimationFrame(render);
}

function render(timestamp) {
  Map.draw(context);
  window.requestAnimationFrame(render);
}

window.addEventListener('DOMContentLoaded', initialize);
