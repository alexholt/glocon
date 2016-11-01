let territories = {};

function init(_territories) {
  territories = _territories;
}

function draw(context, scale, offsetX, offsetY) {
  context.save();
  context.fillStyle = 'yellow';
  Object.keys(territories).forEach((territory) => {
    let { x, y, x2, y2 } = territories[territory].getBoundingBox();
    x = (x2 - x) / 2 + x;
    y = (y2 - y) / 2 + y;
    context.fillRect((x - offsetX) / scale, (y - offsetY) / scale, 10, 10);
  });
  context.restore();
}

export default {
  init,
  draw,
};
