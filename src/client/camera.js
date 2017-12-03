import Matrix4 from './matrix4';
import Vector3 from './vector3';

export default class Camera {

  constructor(target = new Vector3([0, 0, 0])) {
    this.up = new Vector3([0, -1, 0]);
    this.target = target;
    this.pos = new Vector3([0, 0, 1]);
    this.updateMatrix();
    this.ortho = Matrix4.makeOrtho(0, window.innerWidth, window.innerHeight, 0);
  }

  pan(deltaX, deltaY) {
    this.pos.x += deltaX * this.pos.z;
    this.pos.y += deltaY * this.pos.z;
    this.updateMatrix();
    return this;
  }

  zoom(x, y, deltaZ) {
    this.pos.z += deltaZ;
    this.updateMatrix();
    return this;
  }

  getMatrix() {
    return this.cameraMatrix.invert().multiply(this.ortho);
  }

  updateMatrix() {
    this.cameraMatrix = Matrix4.makeCamera(this.pos, this.target, this.up);
    return this;
  }

}