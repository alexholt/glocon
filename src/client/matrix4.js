// projectionMatrix * cameraMatrix.invert() * objectWorldMatrix == u_matrix

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
    adj[0] = this[5]  * this[10] * this[15] -
             this[5]  * this[11] * this[14] -
             this[9]  * this[6]  * this[15] +
             this[9]  * this[7]  * this[14] +
             this[13] * this[6]  * this[11] -
             this[13] * this[7]  * this[10];

    adj[4] = -this[4]  * this[10] * this[15] +
              this[4]  * this[11] * this[14] +
              this[8]  * this[6]  * this[15] -
              this[8]  * this[7]  * this[14] -
              this[12] * this[6]  * this[11] +
              this[12] * this[7]  * this[10];

    adj[8] = this[4]  * this[9]  * this[15] -
             this[4]  * this[11] * this[13] -
             this[8]  * this[5]  * this[15] +
             this[8]  * this[7]  * this[13] +
             this[12] * this[5]  * this[11] -
             this[12] * this[7]  * this[9];

    adj[12] = -this[4]  * this[9]  * this[14] +
               this[4]  * this[10] * this[13] +
               this[8]  * this[5]  * this[14] -
               this[8]  * this[6]  * this[13] -
               this[12] * this[5]  * this[10] +
               this[12] * this[6]  * this[9];

    adj[1] = -this[1]  * this[10] * this[15] +
              this[1]  * this[11] * this[14] +
              this[9]  * this[2]  * this[15] -
              this[9]  * this[3]  * this[14] -
              this[13] * this[2]  * this[11] +
              this[13] * this[3]  * this[10];

    adj[5] = this[0]  * this[10] * this[15] -
             this[0]  * this[11] * this[14] -
             this[8]  * this[2]  * this[15] +
             this[8]  * this[3]  * this[14] +
             this[12] * this[2]  * this[11] -
             this[12] * this[3]  * this[10];

    adj[9] = -this[0]  * this[9]  * this[15] +
              this[0]  * this[11] * this[13] +
              this[8]  * this[1]  * this[15] -
              this[8]  * this[3]  * this[13] -
              this[12] * this[1]  * this[11] +
              this[12] * this[3]  * this[9];

    adj[13] = this[0]  * this[9]  * this[14] -
              this[0]  * this[10] * this[13] -
              this[8]  * this[1]  * this[14] +
              this[8]  * this[2]  * this[13] +
              this[12] * this[1]  * this[10] -
              this[12] * this[2]  * this[9];

    adj[2] = this[1]  * this[6] * this[15] -
             this[1]  * this[7] * this[14] -
             this[5]  * this[2] * this[15] +
             this[5]  * this[3] * this[14] +
             this[13] * this[2] * this[7]  -
             this[13] * this[3] * this[6];

    adj[6] = -this[0]  * this[6] * this[15] +
              this[0]  * this[7] * this[14] +
              this[4]  * this[2] * this[15] -
              this[4]  * this[3] * this[14] -
              this[12] * this[2] * this[7]  +
              this[12] * this[3] * this[6];

    adj[10] = this[0]  * this[5] * this[15] -
              this[0]  * this[7] * this[13] -
              this[4]  * this[1] * this[15] +
              this[4]  * this[3] * this[13] +
              this[12] * this[1] * this[7] -
              this[12] * this[3] * this[5];

    adj[14] = -this[0]  * this[5] * this[14] +
               this[0]  * this[6] * this[13] +
               this[4]  * this[1] * this[14] -
               this[4]  * this[2] * this[13] -
               this[12] * this[1] * this[6]  +
               this[12] * this[2] * this[5];

    adj[3] = -this[1] * this[6] * this[11] +
              this[1] * this[7] * this[10] +
              this[5] * this[2] * this[11] -
              this[5] * this[3] * this[10] -
              this[9] * this[2] * this[7]  +
              this[9] * this[3] * this[6];

    adj[7] = this[0] * this[6] * this[11] -
             this[0] * this[7] * this[10] -
             this[4] * this[2] * this[11] +
             this[4] * this[3] * this[10] +
             this[8] * this[2] * this[7]  -
             this[8] * this[3] * this[6];

    adj[11] = -this[0] * this[5] * this[11] +
               this[0] * this[7] * this[9]  +
               this[4] * this[1] * this[11] -
               this[4] * this[3] * this[9]  -
               this[8] * this[1] * this[7]  +
               this[8] * this[3] * this[5];

    adj[15] = this[0] * this[5] * this[10] -
              this[0] * this[6] * this[9]  -
              this[4] * this[1] * this[10] +
              this[4] * this[2] * this[9]  +
              this[8] * this[1] * this[6]  -
              this[8] * this[2] * this[5];

    const det = this[0] * adj[0] + this[1] * adj[4] + this[2] * adj[8] + this[3] * adj[12];

    if (det === 0) throw new TypeError('Matrix is not invertible');

    this.forEach((val, i) => {
      this[i] = val / det;
    });

    return this;
  }

  multiply(other) {
    const copy = new Matrix4(this);
    copy.forEach((val, i) => {
      copy[i] *= other[i];
    });
    return copy;
  }

  static makeOrtho(top, right, bottom, left, far = -1, near = 1) {
    return new Matrix4([
      2 / (right - left),                 0,                               0,                               0,
      0,                                  2 / (top - bottom),              0,                               0,
      0,                                  0,                               2 / (near - far),                0,
      (right + left) / (left - right),    (top + bottom) / (bottom - top), (far + near) / (near - far),     1,
    ]);
  }

  static makeCamera(pos, target, up) {
    const zAxis = pos.subtract(target).normalize();
    const yAxis = up.cross(zAxis).normalize();
    const xAxis = zAxis.cross(yAxis).normalize();

    return new Matrix4([
      ...xAxis, 0,
      ...yAxis, 0,
      ...zAxis, 0,
      ...pos,   1,
    ]);
  }

}