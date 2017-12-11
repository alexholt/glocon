export default class Circle {

  constructor(center, radius) {
    this.center = center;
    this.radius = radius;
    this.validate();
  }

  validate(center = this.center, radius = this.radius) {
    if (typeof center.x === 'number' && typeof center.y === 'number' && typeof radius === 'number') {
      return true;
    } else {
      throw new TypeError('Expected center to have x and y properties and radius to be valid');
    }
  }

  static fromPerimeterPoints(points) {
    return new Circle({x: 0, y: 0}, 1);
  }
}