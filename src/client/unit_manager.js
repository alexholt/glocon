const SIZE = 40;

let territories = {};
let tanks = {};
let isArrowShown = false;
let arrow;
let tank;

function init(_territories) {
  territories = _territories;
	tank = document.createElement('section');
  tank.classList.add('unit');
	tank.innerHTML = require('./images/tank.svg');
  tank.style.width = SIZE + 'px';
  tank.style.height = SIZE + 'px';

  arrow = document.createElement('section');
  arrow.classList.add('arrow');
  arrow.innerHTML = require('./images/movement_arrow.svg');
  arrow.style.width = SIZE * 4 + 'px';
  arrow.style.height = SIZE + 'px';
  document.querySelector('main').appendChild(arrow);
}

function attachEventHandlers(el) {
  el.addEventListener('click', function () {
    this.classList.toggle('selected');
    isArrowShown = this.classList.contains('selected');
  });
}

function draw(context, scale, offsetX, offsetY) {
  return;
  Object.keys(territories).forEach((territory) => {
    let { x, y, x2, y2 } = territories[territory].getBoundingBox();
    x = (x2 - x) / 2 + x;
    y = (y2 - y) / 2 + y;
    x = (x - offsetX) / scale - SIZE / 2;
    y = (y - offsetY) / scale - SIZE / 2;
    let unit;

    if (!tanks[territory]) {
      unit = tanks[territory] = tank.cloneNode(true);
      attachEventHandlers(unit);
      document.querySelector('main').appendChild(unit);
    } else {
      unit = tanks[territory];
    }

    if (unit.style.left !== Math.round(x) + 'px') {
      unit.style.left = Math.round(x) + 'px';
    }

    if (unit.style.top !== Math.round(y) + 'px') {
      unit.style.top = Math.round(y) + 'px';
    }
  });

  drawArrow(context, scale, offsetX, offsetY);
}

function drawArrow(context, scale, offsetX, offsetY) {
  if (isArrowShown && !arrow.classList.contains('active')) {
    arrow.classList.add('active');
  } else if (!isArrowShown && arrow.classList.contains('active')) {
    arrow.classList.remove('active');
  }

  if (isArrowShown) {
    let selected = document.querySelector('.unit.selected');
    arrow.style.left = selected.style.left;
    arrow.style.top = selected.style.top;
    arrow.style.transform = 'rotate(45deg)';
  }
}

export default {
  init,
  draw,
};
