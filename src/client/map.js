const ZOOM_MIN = 0.025;
const ZOOM_MAX = 1;

let mapImage;

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
  mapImage = new Image();
  mapImage.addEventListener('load', (event) => {
    hasInit = true;
    imageWidth = mapImage.width;
    imageHeight = mapImage.height;
  });
  mapImage.src = require('!!url!./images/world.svg');
}

function draw(context) {
  context.save();
  context.translate(-x, -y);
  context.scale(1 / zoomDelta, 1 / zoomDelta);

  context.drawImage(
    mapImage,
    0,
    0,
    imageWidth,
    imageHeight
  );

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
  x += zoomX * scaleChange;
  y += zoomY * scaleChange;
}

export default {
  init,
  draw,
  pan,
  zoom,
};
