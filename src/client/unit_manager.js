let territories = {};

function init(_territories) {
  territories = _territories;
  console.log(territories['United States'].pathData);
}

function draw(context, scale, offsetX, offsetY) {
  context.save();
  context.fillStyle = 'yellow';
  context.fillRect((200 - offsetX) / scale, (200 - offsetY) / scale, 10, 10);
  context.restore();
}

export default {
  init,
  draw,
};
