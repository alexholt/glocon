import Territory from './territory';
import { cloneDeep } from 'lodash';

const ZOOM_MIN = 0.025;
const ZOOM_MAX = 1;
const territories = {};

let hasInit = false;
let x = 0;
let y = 0;
let width = 0;
let height = 0;
let imageWidth = 0;
let imageHeight = 0;
let zoomDelta = 1;
let lastActive = {};

function init(canvasWidth, canvasHeight) {
  width = canvasWidth;
  height = canvasHeight;
	const svgContainer = document.createElement('section');
	svgContainer.innerHTML = require('./images/world.svg');
	const paths = svgContainer.querySelectorAll('path');
	for (let i = 0; i < paths.length; i++) {
		const territory = paths[i];
    const pathData = territory.getAttribute('d');
		territories[territory.getAttribute('data-name')] = new Territory(pathData);
	}
}

function draw(context) {
	context.clearRect(0, 0, width, height);
	context.fillStyle = 'aqua';
	context.fillRect(0, 0, width, height);
  context.save();
  context.scale(1 / zoomDelta, 1 / zoomDelta);
  context.translate(-x, -y);
	context.lineCap = 'square';

	Object.keys(territories).forEach((name) => {
    context.lineWidth = 1 * zoomDelta;
	  context.fillStyle = 'forestgreen';

    if (territories[name].isActive) {
      context.lineWidth = 5 * zoomDelta;
	    context.fillStyle = '#227a22';
    }

  	context.fill(territories[name].getPathObj());
		context.stroke(territories[name].getPathObj());
	})

  context.restore();

  if (!hasInit) {
    return;
  }
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
	if (scaleChange === 0) {
		return;
	}
  x -= zoomX * scaleChange;
  y -= zoomY * scaleChange;
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
  const active = Object.keys(territories).find(territory => {
    const area = territories[territory];
    let { x, y, x2, y2 } = area.getBoundingBox();
    const offsetX = getOffsetX();
    const offsetY = getOffsetY();

    x -= offsetX;
    y -= offsetY;
    x2 -= offsetX;
    y2 -= offsetY;

    x /= zoomDelta;
    y /= zoomDelta;
    x2 /= zoomDelta;
    y2 /= zoomDelta;

    if (x < pageX && pageX < x2 && y < pageY && pageY < y2) {
      return true;
    }
    return false;
  });

  if (active) {
    lastActive.isActive = false;
    lastActive = territories[active];
    console.log(active);
    lastActive.isActive = true;
  }
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
};
