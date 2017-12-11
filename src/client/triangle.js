import {cloneDeep} from 'lodash';

import Circle from './circle';

export default class Triangle {

  constructor(points) {
    if (points instanceof Triangle) {
      this.points = cloneDeep(points.points);
    } else {
      this.points = points;
    }
    this.validate();
  }

  validate(points = this.points) {
    if (points.every(point => typeof point.x === 'number' && typeof point.y === 'number')) {
      return true;
    } else {
      throw new TypeError('Expected all points to have x and y properties');
    }
  }

  getCircumCircle() {
    return 
  }

}