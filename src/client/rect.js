export default class Rect {
  
  constructor(x = 0, y = 0, x2 = 1, y2 = 1) {
    this.x = x;
    this.y = y;
    this.x2 = x2;
    this.y2 = y2;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getX2() {
    return this.x2;
  }

  getY2() {
    return this.y2;
  }

  setX(x) {
    this.x = x;
    return this;
  }

  setY(y) {
    this.y = y;
    return this;
  }

  setX2(x) {
    this.x2 = x;
    return this;
  }

  setY2(y) {
    this.y2 = y;
    return this;
  }

  getWidth() {
    return this.x2 - this.x;
  }

  getHeight() {
    return this.y2 - this.y;
  }

  getSuperTriangle() {
    return [
      {x, y: this.y2},
      {x: x, y: this.y - this.getHeight()},
      {x: x + this.getWidth(), y: this.y2},
    ];
  }

}
