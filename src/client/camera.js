import Matrix4 from './matrix4';
import Vector3 from './vector3';

export default class Camera {

  constructor() {
    this.up = new Vector3([0, 1, 0]);
    this.target = new Vector3([0, 0, 1]);
    this.pos = new Vector3([1, -0.5, -1]);
    this.updateMatrix();
    const ratio = window.innerWidth / window.innerHeight;
    this.perspective = Matrix4.makePerspective(60, ratio);
  }

  pan(deltaY, deltaX) {
    this.pos.x += (deltaX * this.pos.z / 100);
    this.pos.y -= (deltaY * this.pos.z / 100);
    this.target.x = this.pos.x;
    this.target.y = this.pos.y;
    this.updateMatrix();
    return this;
  }

  zoom(x, y, deltaZ) {
    this.pos.z = Math.max(0, this.pos.z + 0.001 * (deltaZ < 0 ? -1 : 1));
    this.updateMatrix();
    return this;
  }

  getMatrix() {
    return this.cameraMatrix.multiply(this.perspective);
  }

  updateMatrix() {
    //this.cameraMatrix = Matrix4.makeCamera(this.pos, this.target, this.up);
    this.cameraMatrix = new Matrix4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      -this.pos.y, -this.pos.x, this.pos.z, 1,
    ]);
    return this;
  }

}