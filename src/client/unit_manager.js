const SIZE = 40;

let territories = {};
let tanks = {};
let isArrowShown = false;
let arrow;
let tank;
let territoryKeys;

function init(_territories) {
  territories = _territories;
  territoryKeys = Object.keys(territories);
	tank = document.createElement('img');
	tank.src = `data:image/svg+xml;utf-8,${require('./images/tank.svg')}`;

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
  territoryKeys.forEach((territory) => {
    let { x, y, x2, y2 } = territories[territory].getBoundingBox();
    x = (x2 - x) / 2 + x;
    y = (y2 - y) / 2 + y;
    x = (x - offsetX) / scale - SIZE / 2;
    y = (y - offsetY) / scale - SIZE / 2;

    if (scale > 0.5) {
      context.fillStyle = '#b2b5af';
      context.fillRect(x, y, SIZE / 2, SIZE / 2);
      context.fillStyle = 'black';
      context.font = '10px monospace';
      context.fillText('12', x, y + (SIZE / 4));
    } else {
      context.drawImage(tank, x, y, SIZE, SIZE * 1.5);
    }
  });

  //drawArrow(context, scale, offsetX, offsetY);
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
