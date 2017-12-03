const SIZE = 40;
const TOKEN_WIDTH = 98 / 2;
const TOKEN_HEIGHT = 109 / 2;
const TOKEN_PADDING = 20;

import Unit from './unit';

export default class UnitRepository {

  constructor(_territories) {
    this.tanks = {};
    this.isArrowShown = false;
    this.territories = _territories;
    this.territoryKeys = Object.keys(this.territories);

    this.tank = document.createElement('img');
    this.tank.src = require('./images/3x/tank@3x.png');

    this.troop = document.createElement('img');
    this.troop.src = require('./images/3x/troop@3x.png');

    this.plane = document.createElement('img');
    this.plane.src = require('./images/3x/fighter@3x.png');

    this.tanks = {};
    this.territoryKeys.forEach((territory) => {
      const {x, y} = this.territories[territory].getCentroid();
      this.tanks[territory] = new Unit(x, y, 50, 50, require('./images/2x/tank@2x.png'));
    });
  }

  render(gl, scale, offsetX, offsetY) {
    this.territoryKeys.forEach((territory) => {
      let {x, y} = this.territories[territory].getCentroid();

      x = Math.round((x - offsetX) / scale);
      y = Math.round((y - offsetY) / scale);

      this.tanks[territory].render(gl, {x, y});
    });
  }
}
