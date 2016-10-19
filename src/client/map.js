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
  context.drawImage(
    mapImage,
    x,
    y,
    width,
    height,
    0,
    0,
    width / zoomDelta,
    height / zoomDelta
  );

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
  zoomDelta += delta * 0.001;
  const scaleChange = zoomDelta - oldDelta;
  x -= zoomX * scaleChange;
  y -= zoomY * scaleChange;
  width -= zoomX * scaleChange;
  height -= zoomY * scaleChange;
  width = Math.max(width, imageWidth);
  height = Math.max(height, imageHeight);
}

export default {
  init,
  draw,
  pan,
  zoom,
};
