export default class Vector3 {

  constructor(array = new Float32Array(3)) {
    this.forEach = Array.prototype.forEach;
    this[Symbol.iterator] = Array.prototype[Symbol.iterator];

    if (array instanceof Vector3) {
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

  get(index) {
    return this.array[index];
  }

  set(index, value) {
    this.array[index] = value;
  }

  get length() {
    return this.array.length;
  }

  get x() {
    return this.array[0];
  }

  set x(x) {
    this[0]  = x;
  }

  get y() {
    return this.array[1];
  }

  set y(y) {
    this[1]  = y;
  }

  get z() {
    return this.array[2];
  }

  set z(z) {
    this[2]  = z;
  }

  validate(array = this.array) {
    if (!(array instanceof Float32Array)) {
      throw new TypeError(
        `Expected an array of type Float32Array but received an array of type ${array.constructor.name}`
      );
    }

    if (array.length !== 3) {
      throw new TypeError(`Expected an array of length 3 but received an array of length ${array.length}`);
    }

    return true;
  }

  subtract(other) {
    const vec = new Vector3(this);

    vec.forEach((val, i) => {
      vec[i] -= other[i];
    });

    return vec;
  }

  add(other) {
    const vec = new Vector3(this);

    vec.forEach((val, i) => {
      vec[i] += other[i];
    });

    return vec;
  }

  cross(other) {
    return new Vector3([
      this[1] * other[2] - this[2] * other[1],
      this[2] * other[0] - this[0] * other[2],
      this[0] * other[1] - this[1] * other[0]
    ]);
  }

  dot(other) {
    return this[0] * other[0] + this[1] * other[1] + this[2] * other[2];
  }

  normalize() {
    const mag = this.computeMagnitude();
    const vec = new Vector3(this);

    vec.forEach((val, i) => {
      vec[i] = val / mag;
    });

    return vec;
  }

  computeMagnitude() {
    return Math.sqrt(this.dot(this));
  }

}