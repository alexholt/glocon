const ZOOM_MIN = 0.025;
const ZOOM_MAX = 1;
const territories = [];


let hasInit = false;
let x = 0;
let y = 0;
let width = 0;
let height = 0;
let imageWidth = 0;
let imageHeight = 0;
let zoomDelta = 1;

function init(canvasWidth, canvasHeight) {
  width = canvasWidth;
  height = canvasHeight;
	const svgContainer = document.createElement('section');
	svgContainer.innerHTML = require('./images/world.svg');
	const paths = svgContainer.querySelectorAll('path');
	for (let i = 0; i < paths.length; i++) {
		const territory = paths[i];
		const path = new Path2D(territory.getAttribute('d'));
		territories[territory.getAttribute('data-name')] = path;	
	}
}

function draw(context) {
	context.clearRect(0, 0, width, height);
	context.fillStyle = 'aqua';
	context.fillRect(0, 0, width, height);
  context.save();
  context.scale(1 / zoomDelta, 1 / zoomDelta);
  context.translate(-x, -y);
	context.fillStyle = 'forestgreen';
	Object.keys(territories).forEach((name) => {
  	context.fill(territories[name]);
		context.stroke(territories[name]);
	})

  context.restore();

  if (!hasInit) {
    return;
  }
}

function pan(deltaX, deltaY) {
  x += deltaX; 
  y += deltaY;
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

export default {
  init,
  draw,
  pan,
  zoom,
};
