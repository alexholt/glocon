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

  getBoundingBox() {
    if (this.boundingBox) {
      return this.boundingBox;
    }
    let token = '';
    this.lastPoint = { x: 0, y: 0 };
    this.pathState = 'BEGIN';
    this.currentVal = NaN;
    this.pointArray = [];
    for (let i = 0; i < this.path.length; i++) {
      let chr = this.path[i];
      if (chr === ' ' || chr === ',') {
        this.processToken(token);
        token = '';
      } else {
        token += chr;  
      }
    }

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
}
