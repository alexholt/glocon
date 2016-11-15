const SIZE = 40;

let territories = {};
let tanks = {};
let tank;

function init(_territories) {
  territories = _territories;
	tank = document.createElement('section');
	tank.innerHTML = require('./images/tank.svg');
  tank.style.position = 'fixed';
  tank.style.width = SIZE + 'px';
  tank.style.height = SIZE + 'px';
  tank.style.pointerEvents = 'none';
}

function draw(context, scale, offsetX, offsetY) {
  Object.keys(territories).forEach((territory) => {
    let { x, y, x2, y2 } = territories[territory].getBoundingBox();
    x = (x2 - x) / 2 + x;
    y = (y2 - y) / 2 + y;
    x = (x - offsetX) / scale - SIZE / 2;
    y = (y - offsetY) / scale - SIZE / 2;
    let unit;
    if (!tanks[territory]) {
      unit = tanks[territory] = tank.cloneNode(true);
      document.querySelector('main').appendChild(unit);
    } else {
      unit = tanks[territory];
    }

    if (unit.style.left !== x + 'px') {
      unit.style.left = x + 'px';
    }
    if (unit.style.top !== y + 'px') {
      unit.style.top = y + 'px';
    }
    //context.fillStyle = 'yellow';
    //context.fillRect(x, y, SIZE, SIZE);
    //context.fillStyle = 'black';
    //const { width } = context.measureText('10');
    //context.fillText( '10', x + width / 2, y + SIZE / 2 + 5);
  });
}

export default {
  init,
  draw,
};
