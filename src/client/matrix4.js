// projectionMatrix * cameraMatrix.invert() * objectWorldMatrix == u_matrix
import Vector3 from './vector3';
import config from './config';

export default class Matrix4 {

  constructor(array = new Float32Array(16)) {
    this.forEach = Array.prototype.forEach;

    if (array instanceof Matrix4) {
      // Copy the array
      array = Array.from(array.array);
    }

    if (array instanceof Array) {
      array = new Float32Array(array);
    }

    this.validate(array);
    this.array = array;

    for (let i = 0; i < this.array.length; i++) {
      Object.defineProperty(this, i.toString(), {
        get: this.get.bind(this, i),
        set: this.set.bind(this, i),
      });
    }
  }

  get length() {
    return this.array.length;
  }

  validate(array = this.array) {
    if (!(array instanceof Float32Array)) {
      throw new TypeError(
        `Expected an array of type Float32Array but received an array of type ${array.constructor.name}`
      );
    }

    if (array.length !== 16) {
      throw new TypeError(`Expected an array of length 16 but received an array of length ${array.length}`);
    }

    return true;
  }

  get(index) {
    if (index < 0 || index > 15) {
      throw new RangeError(`Expected index to be in range of 0...15 but received an index of ${index}`);
    }
    return this.array[index];
  }

  getXY(x, y) {
    return this.get(x + y * 4);
  }

  set(index, value) {
    this.array[index] = value;
    return this;
  }

  setXY(x, y, value) {
    this.set(x + y * 4, value);
    return this;
  }

  // https://stackoverflow.com/a/1148405
  invert() {

    const adj = new Matrix4();
    adj[0] = this[5] * this[10] * this[15] -
      this[5] * this[11] * this[14] -
      this[9] * this[6] * this[15] +
      this[9] * this[7] * this[14] +
      this[13] * this[6] * this[11] -
      this[13] * this[7] * this[10];

    adj[4] = -this[4] * this[10] * this[15] +
      this[4] * this[11] * this[14] +
      this[8] * this[6] * this[15] -
      this[8] * this[7] * this[14] -
      this[12] * this[6] * this[11] +
      this[12] * this[7] * this[10];

    adj[8] = this[4] * this[9] * this[15] -
      this[4] * this[11] * this[13] -
      this[8] * this[5] * this[15] +
      this[8] * this[7] * this[13] +
      this[12] * this[5] * this[11] -
      this[12] * this[7] * this[9];

    adj[12] = -this[4] * this[9] * this[14] +
      this[4] * this[10] * this[13] +
      this[8] * this[5] * this[14] -
      this[8] * this[6] * this[13] -
      this[12] * this[5] * this[10] +
      this[12] * this[6] * this[9];

    adj[1] = -this[1] * this[10] * this[15] +
      this[1] * this[11] * this[14] +
      this[9] * this[2] * this[15] -
      this[9] * this[3] * this[14] -
      this[13] * this[2] * this[11] +
      this[13] * this[3] * this[10];

    adj[5] = this[0] * this[10] * this[15] -
      this[0] * this[11] * this[14] -
      this[8] * this[2] * this[15] +
      this[8] * this[3] * this[14] +
      this[12] * this[2] * this[11] -
      this[12] * this[3] * this[10];

    adj[9] = -this[0] * this[9] * this[15] +
      this[0] * this[11] * this[13] +
      this[8] * this[1] * this[15] -
      this[8] * this[3] * this[13] -
      this[12] * this[1] * this[11] +
      this[12] * this[3] * this[9];

    adj[13] = this[0] * this[9] * this[14] -
      this[0] * this[10] * this[13] -
      this[8] * this[1] * this[14] +
      this[8] * this[2] * this[13] +
      this[12] * this[1] * this[10] -
      this[12] * this[2] * this[9];

    adj[2] = this[1] * this[6] * this[15] -
      this[1] * this[7] * this[14] -
      this[5] * this[2] * this[15] +
      this[5] * this[3] * this[14] +
      this[13] * this[2] * this[7] -
      this[13] * this[3] * this[6];

    adj[6] = -this[0] * this[6] * this[15] +
      this[0] * this[7] * this[14] +
      this[4] * this[2] * this[15] -
      this[4] * this[3] * this[14] -
      this[12] * this[2] * this[7] +
      this[12] * this[3] * this[6];

    adj[10] = this[0] * this[5] * this[15] -
      this[0] * this[7] * this[13] -
      this[4] * this[1] * this[15] +
      this[4] * this[3] * this[13] +
      this[12] * this[1] * this[7] -
      this[12] * this[3] * this[5];

    adj[14] = -this[0] * this[5] * this[14] +
      this[0] * this[6] * this[13] +
      this[4] * this[1] * this[14] -
      this[4] * this[2] * this[13] -
      this[12] * this[1] * this[6] +
      this[12] * this[2] * this[5];

    adj[3] = -this[1] * this[6] * this[11] +
      this[1] * this[7] * this[10] +
      this[5] * this[2] * this[11] -
      this[5] * this[3] * this[10] -
      this[9] * this[2] * this[7] +
      this[9] * this[3] * this[6];

    adj[7] = this[0] * this[6] * this[11] -
      this[0] * this[7] * this[10] -
      this[4] * this[2] * this[11] +
      this[4] * this[3] * this[10] +
      this[8] * this[2] * this[7] -
      this[8] * this[3] * this[6];

    adj[11] = -this[0] * this[5] * this[11] +
      this[0] * this[7] * this[9] +
      this[4] * this[1] * this[11] -
      this[4] * this[3] * this[9] -
      this[8] * this[1] * this[7] +
      this[8] * this[3] * this[5];

    adj[15] = this[0] * this[5] * this[10] -
      this[0] * this[6] * this[9] -
      this[4] * this[1] * this[10] +
      this[4] * this[2] * this[9] +
      this[8] * this[1] * this[6] -
      this[8] * this[2] * this[5];

    const det = this[0] * adj[0] + this[1] * adj[4] + this[2] * adj[8] + this[3] * adj[12];

    if (det === 0) throw new TypeError('Matrix is not invertible');

    adj.forEach((val, i) => {
      adj[i] = val / det;
    });

    return adj;
  }

  multiply(other) {
    if (other instanceof Vector3) {
      return this.multiplyByVector3(other);
    }

    const copy = new Matrix4(this);
    copy[0] = this[0] * other[0] + this[1] * other[4] + this[2] * other[8] + this[3] * other[12];
    copy[4] = this[4] * other[0] + this[5] * other[4] + this[6] * other[8] + this[7] * other[12];
    copy[8] = this[8] * other[0] + this[9] * other[4] + this[10] * other[8] + this[11] * other[12];
    copy[12] = this[12] * other[0] + this[13] * other[4] + this[14] * other[8] + this[15] * other[12];

    copy[1] = this[0] * other[1] + this[1] * other[5] + this[2] * other[9] + this[3] * other[13];
    copy[5] = this[4] * other[1] + this[5] * other[5] + this[6] * other[9] + this[7] * other[13];
    copy[9] = this[8] * other[1] + this[9] * other[5] + this[10] * other[9] + this[11] * other[13];
    copy[13] = this[12] * other[1] + this[13] * other[5] + this[14] * other[9] + this[15] * other[13];

    copy[2] = this[0] * other[2] + this[1] * other[6] + this[2] * other[10] + this[3] * other[14];
    copy[6] = this[4] * other[2] + this[5] * other[6] + this[6] * other[10] + this[7] * other[14];
    copy[10] = this[8] * other[2] + this[9] * other[6] + this[10] * other[10] + this[11] * other[14];
    copy[14] = this[12] * other[2] + this[13] * other[6] + this[14] * other[10] + this[15] * other[14];

    copy[3] = this[0] * other[3] + this[1] * other[7] + this[2] * other[11] + this[3] * other[15];
    copy[7] = this[4] * other[3] + this[5] * other[7] + this[6] * other[11] + this[7] * other[15];
    copy[11] = this[8] * other[3] + this[9] * other[7] + this[10] * other[11] + this[11] * other[15];
    copy[15] = this[12] * other[3] + this[13] * other[7] + this[14] * other[11] + this[15] * other[15];
    return copy;
  }

  multiplyByVector3(other) {
    const w = this[12] * other[0] + this[13] * other[1] + this[14] * other[2] + this[15] * 1;

    return new Vector3([
      (this[0] * other[0] + this[1] * other[1] + this[2] * other[2] + this[3]) / w,
      (this[4] * other[0] + this[5] * other[1] + this[6] * other[2] + this[7]) / w,
      (this[8] * other[0] + this[9] * other[1] + this[10] * other[2] + this[11]) / w,
    ]);
  }

  isEqual(other) {
    const isIt = this.array.reduce((acc, cur, i) => {
      return acc && Math.abs(cur - other[i]) < this.EPSILON;
    }, true);

    if (config.logLevel === 'DEBUG' && !isIt) {
      console.info(this.toString());
      console.info('does not equal');
      console.info(other.toString());
    }

    return isIt;
  }

  toString(isCStyle = false) {
    if (isCStyle) {
      return this.array.reduce((acc, cur, i) => {
        if (i % 4 === 0) {
          acc = `${acc}{ ${cur}`;
        } else {
          acc = `${acc}, ${cur}`;
        }


        if (i % 4 === 3) {
          acc = `${acc}} `;

          if (this.array.length - 1 !== i) {
            acc = `${acc}, `;
          }

        }

        return acc;
      }, '{ ') + ' }';
    }

    return (
      `
      [
         ${this[0]}, ${this[1]}, ${this[2]}, ${this[3]},
         ${this[4]}, ${this[5]}, ${this[7]}, ${this[8]},
         ${this[8]}, ${this[9]}, ${this[10]}, ${this[11]},
         ${this[12]}, ${this[13]}, ${this[14]}, ${this[15]},
      ]`
    );
  }

  transpose() {
    return new Matrix4([
      this.getXY(0, 0), this.getXY(0, 1), this.getXY(0, 2), this.getXY(0, 3),
      this.getXY(1, 0), this.getXY(1, 1), this.getXY(1, 2), this.getXY(1, 3),
      this.getXY(2, 0), this.getXY(2, 1), this.getXY(2, 2), this.getXY(2, 3),
      this.getXY(3, 0), this.getXY(3, 1), this.getXY(3, 2), this.getXY(3, 3),
    ]);
  }

  getData() {
    return this.transpose().array;
  }

  translate() {
    return this.multiply(Matrix4.makeTranslate(...arguments));
  }

  rotateX() {
    return this.multiply(Matrix4.makeRotateX(...arguments));
  }

  rotateY() {
    return this.multiply(Matrix4.makeRotateY(...arguments));
  }

  rotateZ() {
    return this.multiply(Matrix4.makeRotateZ(...arguments));
  }

  scale() {
    return this.multiply(Matrix4.makeScale(...arguments));
  }

  static makeOrtho(top, right, bottom, left, far = 1, near = -1) {
    return new Matrix4([
      2 / (right - left),                 0,                               0,                               0,
      0,                                  2 / (top - bottom),              0,                               0,
      0,                                  0,                               -2 / (far - near),                0,
      (right + left) / (right - left),    (top + bottom) / (top - bottom), -(far + near) / (far - near),     1,
    ]);
  }

  static makeCamera(
    pos = new Vector3([0, 0, 1]),
    target = new Vector3([0, 0, -1]),
    up = new Vector3([0, 1, 0])
  ) {
    const zAxis = target.subtract(pos).normalize();
    const xAxis = up.cross(zAxis).normalize();
    const yAxis = zAxis.cross(xAxis).normalize();

    return new Matrix4([
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      ...pos,   1,
    ]).invert();
  }

  static makePerspective(fovy, aspect) {
    const znear = -1;
    const zfar = 1;
    const ymax = znear * Math.tan(fovy);
    const ymin = -ymax;
    const xmin = ymin * aspect;
    const xmax = ymax * aspect;

    return Matrix4.makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
  }

  static makeFrustum(left, right, bottom, top, znear, zfar) {
    const X = 2 * znear / (right - left);
    const Y = 2 * znear / (top - bottom);
    const A = (right + left) / (right - left);
    const B = (top + bottom) / (top - bottom);
    const C = -(zfar + znear) / (zfar - znear);
    const D = -2 * zfar * znear / (zfar - znear);

    return new Matrix4([
      X,  0,  A,  0,
      0,  Y,  B,  0,
      0,  0,  C,  D,
      0,  0,  -1,  0,
    ]);
  }

  static makeIdentity() {
    return new Matrix4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]);
  }

  static makeScale(w, h, d) {
    h = h || w;
    d = d || w;
    return new Matrix4([
      w, 0, 0, 0,
      0, h, 0, 0,
      0, 0, d, 0,
      0, 0, 0, 1,
    ]);
  }

  static makeTranslate(x, y, z) {
    return new Matrix4([
      1, 0, 0, x,
      0, 1, 0, y,
      0, 0, 1, z,
      0, 0, 0, 1,
    ]);
  }

  static makeRotateX(rad) {
    return new Matrix4([
      1,              0,             0,   0,
      0,  Math.cos(rad), Math.sin(rad),   0,
      0, -Math.sin(rad), Math.cos(rad),   0,
      0,              0,             0,   1,
    ]);
  }

  static makeRotateY(rad) {
    return new Matrix4([
       Math.cos(rad), 0, -Math.sin(rad), 0,
                   0, 1,              0, 0,
       Math.sin(rad), 0,  Math.cos(rad), 0,
                   0, 0,              0, 1,
    ]);
  }

  static makeRotateZ(rad) {
    return new Matrix4([
       Math.cos(rad), Math.sin(rad), 0, 0,
      -Math.sin(rad), Math.cos(rad), 0, 0,
                   0,             0, 1, 0,
                   0,             0, 0, 1,
    ]);
  }

  static parse(str) {
    const parseFunc = val => parseInt(val.trim());
    const filterFunc = val => val && val.trim().length > 0;

    const array = str.replace(/[,{}]/g, ' ').split(/\s+/).filter(filterFunc).map(parseFunc);
    return new Matrix4(array);
  }
}

Matrix4.prototype.EPSILON = 1e-9;