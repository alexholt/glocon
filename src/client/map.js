import Territory from './territory';
import { cloneDeep } from 'lodash';

const ZOOM_MIN = 0.025;
const ZOOM_MAX = 10;
const PAN_BORDER = 10;
const CENTROID_RADIUS = 10;
const territories = {};

let x = -200;
let y = -100;
let width = 0;
let height = 0;
let imageWidth = 0;
let imageHeight = 0;
let zoomDelta = 1;
let lastActive = {};
let lastClickedPoint;
let active = '';
let canvasTexture;
let texture;
let pattern;
let isInit = false;

function init(canvasWidth, canvasHeight) {
  width = canvasWidth;
  height = canvasHeight;
	const svgContainer = document.createElement('section');
  svgContainer.innerHTML = require('./images/world.svg');

	const paths = svgContainer.querySelectorAll('path');
  texture = new Image();

  texture.addEventListener('load', () => {
    isInit = true;
  });

  texture.src = require('./images/2x/terrain@2x.png');

  for (let i = 0; i < paths.length; i++) {
    const territory = paths[i];
    const pathData = territory.getAttribute('d');
    territories[territory.getAttribute('data-name')] = new Territory(pathData);
  }
}

function draw(context) {
  if (!isInit) return;

  context.fillStyle = 'aqua';
  context.fillRect(0, 0, width, height);

  context.save();
  context.scale(1 / zoomDelta, 1 / zoomDelta);
  context.translate(-x, -y);
  context.lineCap = 'round';

  let currentTransform;
  Object.keys(territories).forEach((name) => {
    const territory = territories[name];

    context.lineWidth = zoomDelta;

    if (!pattern) {
      pattern = context.createPattern(texture, 'repeat');
      const matrix = document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGMatrix();
      pattern.setTransform(matrix.scale(ZOOM_MIN));
    }

    context.fillStyle = pattern;
    context.fill(territory.getPathObj());

    if (territory.isActive) {
      context.lineWidth = 5 * zoomDelta;
      context.fillStyle = '#227a22';
    }

    context.stroke(territory.getPathObj());

    context.save();
    currentTransform = context.currentTransform;
    context.resetTransform();
    if (
      lastClickedPoint &&
      context.isPointInPath(territory.getPathObj(), lastClickedPoint[0], lastClickedPoint[1])
    ) {
      context.restore();
      const centroid = territory.getCentroid();

      context.fillStyle = 'red';
      context.transform = currentTransform;
      context.beginPath();
      context.arc(centroid.x, centroid.y, CENTROID_RADIUS * zoomDelta, 0, Math.PI * 2);
      context.fill();
      context.stroke();

      if (name !== active) {
        setActive(name);
      }

    } else {
      context.restore();
    }
  });

  context.restore();
}

function pan(deltaX, deltaY) {
  x += deltaX * zoomDelta;
  y += deltaY * zoomDelta;
}

function zoom(zoomX, zoomY, delta) {
  const oldDelta = zoomDelta;
  zoomDelta += delta * 0.00025;
  zoomDelta = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoomDelta));
  const scaleChange = zoomDelta - oldDelta;

  x -= (zoomX - width / 2) * scaleChange;
  y -= (zoomY - height / 2) * scaleChange;
}

function getTerritories() {
  return cloneDeep(territories);
}

function getScale() {
  return zoomDelta;
}

function getOffsetX() {
  return x;
}

function getOffsetY() {
  return y;
}

function handleClick({pageX, pageY}) {
  lastClickedPoint = [pageX * zoomDelta + x, pageY * zoomDelta + y];
}

function setActive(name) {
  active = name;
  if (!active || lastActive === territories[active] && lastActive.isActive) {
    lastActive.isActive = false;
    return;
  }

  lastActive.isActive = false;
  lastActive = territories[active];
  lastActive.isActive = true;
}

function handleEdgePan(lastX, lastY) {
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

export default {
  init,
  draw,
  pan,
  zoom,
  getTerritories,
  getScale,
  getOffsetX,
  getOffsetY,
  handleClick,
  handleEdgePan,
};
