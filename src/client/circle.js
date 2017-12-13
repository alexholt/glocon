import {partialRight} from 'lodash';
import Vector3 from './vector3';

export default class Circle {

  constructor(center = new Vector3([0, 0, 0]), radius = 0) {
    this.center = center;
    this.radius = radius;
    this.validate();
  }

  validate(center = this.center, radius = this.radius) {
    if (center instanceof Vector3) {
      return true;
    } else {
      throw new TypeError(`Expected center to be a Vector3 instead it is a ${center.constructor.name}`);
    }
  }

  static fromPerimeterPoints(points) {
    // r = |p1 - p2||p2 - p3||p3 - p1| / ( 2 |(p1 - p2) * (p2 - p3))
    // c = ap1 + bp2 + cp3
    // where:
    // a = |p2 - p3|^2 (p1 - p2) . (p1 - p3) / (2 |(p1 - p2) x (p2 - p3)|^2
    // b = |p1 - p3|^2 (p2 - p1) . (p2 - p3) / (2 | (p1 - p2) x (p2 - p3)|^2
    // cp = |p1 - p2|^2 (p3 - p1) . (p3 - p2) / (2 | (p1 - p2) x (p2 - p3)|^2

    const [p1, p2, p3] = points.map(point => new Vector3([point.x, point.y, 0]));

    const divisor = 2 * p1.subtract(p2).cross(p2.subtract(p3)).computeMagnitude();
    const r = p1.subtract(p2).computeMagnitude() * p2.subtract(p3).computeMagnitude() / divisor;

    const a = Math.pow(p2.subtract(p3).computeMagnitude(), 2) * p1.subtract(p2).dot(p1.subtract(p3)) / divisor;
    const b = Math.pow(p1.subtract(p3).computeMagnitude(), 2) * p2.subtract(p1).dot(p2.subtract(p3)) / divisor;
    const c = Math.pow(p1.subtract(p2).computeMagnitude(), 2) * p3.subtract(p1).dot(p3.subtract(p2)) / divisor;
    const cp = p1.multiply(a).add(p2.multiply(b)).add(p3.multiply(c));

    return new Circle(cp, r);
  }
}