import Rect from './rect';
import { last } from 'lodash';

export default class Territory {

  constructor(path) {
    this.path = path;
    this.pathObj = new Path2D(this.path);
  }

  getPathObj() {
    return this.pathObj;
  }

  // Bowyer-Watson algorithm
  triangulate() {
    const boundingBox = this.getBoundingBox();
    const triangulation = [boundingBox.getSuperTriangle()];

    this.pointList.forEach(point => {
      const badTriangles = [];
      triangulation.forEach(triangle => {
        triangle.every(coord => {
        });
      });
    });
  }

  processToken(token) {
    token = token.toLowerCase();
    if (['m', 'v', 'h', 'z', ','].includes(token)) {
      this.stateChange(token);
    } else {
      const val = parseInt(token, 10);
      let point;
      switch (this.pathState) {
        case 'MOVE':
          this.pathState = 'MOVE_X';
          this.currentVal = val + this.lastPoint.x;
          break;
        case 'MOVE_X':
          point = { x: this.currentVal, y: val + this.lastPoint.y };
          this.pointArray.push(point);
          this.currentVal = NaN;
          this.lastPoint = last(this.pointArray);
          this.pathState = 'MOVE';
          break;
        case 'MOVE_H':
          this.lastPoint = last(this.pointArray);
          this.pointArray.push({ x: this.lastPoint.x + val, y: this.lastPoint.y });
          break;
        case 'MOVE_V':
          this.lastPoint = last(this.pointArray);
          this.pointArray.push({ x: this.lastPoint.x, y: this.lastPoint.y + val });
          break;
      }
    }
  }

  stateChange(token) {
    switch (token) {
      case 'm':
        this.pathState = 'MOVE';
        if (this.pointArray.length > 0) {
          this.lastPoint = last(this.pointArray);
        } else {
          this.lastPoint = { x: 0, y: 0 };
        }
        break;
      case 'h':
        this.pathState = 'MOVE_H';
        break;
      case 'v':
        this.pathState = 'MOVE_V';
        break;
      case 'z':
        this.pathState = 'CLOSE_PATH';
        break;
      default:
        throw new Error(
          `Unknown path token: ${token};` +
          `points so far: ${JSON.stringify(this.pointArray)}`
        );
    }
  }

  getPointArray() {
    if (this.pointArray) return this.pointArray;

    this.pointArray = [];
    let token = '';

    for (let i = 0; i < this.path.length; i++) {
      let chr = this.path[i];
      if (chr === ' ' || chr === ',') {
        this.processToken(token);
        token = '';
      } else {
        token += chr;
      }
    }

    return this.pointArray;
  }

  getBoundingBox() {
    if (this.boundingBox) {
      return this.boundingBox;
    }
    this.lastPoint = { x: 0, y: 0 };
    this.pathState = 'BEGIN';
    this.currentVal = NaN;
    this.getPointArray();

    return this.boundingBox = this.pointArray.reduce((acc, cur) => {
      if (acc.getX() > cur.x) {
        acc.setX(cur.x);
      }

      if (acc.getY() > cur.y) {
        acc.setY(cur.y);
      }

      if (acc.getX2() < cur.x) {
        acc.setX2(cur.x);
      }

      if (acc.getY2() < cur.y) {
        acc.setY2(cur.y);
      }

      return acc;
    }, new Rect(Infinity, Infinity, -Infinity, -Infinity));
  }

  // Formula is from https://en.wikipedia.org/wiki/Centroid, duh
  // @return {Point}
  getCentroid() {

    const nextTwo = (vertices, i) => ({
        xi: vertices[i].x,
        yi: vertices[i].y,
        xi1: vertices[(i + 1) % vertices.length].x,
        yi1: vertices[(i + 1) % vertices.length].y,
    });

    if (this.centroid) return this.centroid;

    const vertices = this.getPointArray();

    // a = 1/2 * sum( xi * yi1 - xi1 * yi )
    let a = 0;
    for (let i = 0; i < vertices.length; i++) {
      let {xi, yi, xi1, yi1} = nextTwo(vertices, i);
      a += xi * yi1 - xi1 * yi;
    }

    a /= 2;

    // cx = 1/6a * sum( (xi + xi1) * (xi * yi1 - xi1 * yi) )
    let cx = 0;
    for (let i = 0; i < vertices.length; i++) {
      let {xi, yi, xi1, yi1} = nextTwo(vertices, i);
      cx += (xi + xi1) * (xi * yi1 - xi1 * yi);
    }
    cx *= 1 / (6 * a);

    // cy = 1/6a * sum( (yi + yi1) * (xi * yi1 - xi1 * yi) )
    let cy = 0;
    for (let i = 0; i < vertices.length; i++) {
      let {xi, yi, xi1, yi1} = nextTwo(vertices, i);
      cy += (yi + yi1) * (xi * yi1 - xi1 * yi);
    }
    cy *= 1 / (6 * a);

    return {x: cx, y: cy};
  }

}
