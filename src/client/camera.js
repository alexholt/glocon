import Matrix4 from './matrix4';
import Vector3 from './vector3';

export default class Camera {

  constructor() {
    this.up = new Vector3([0, 1, 0]);
    this.target = new Vector3([0, 0, 1]);
    this.pos = new Vector3([0, 0, -1.2]);
    this.updateMatrix();
    const ratio = window.innerWidth / window.innerHeight;
    this.perspective = Matrix4.makePerspective(Math.PI / 4, ratio);
  }

  pan(deltaX, deltaY) {
    const scale = Math.abs(this.pos.z);
    this.pos.x -= (deltaX / scale) / 100;
    this.pos.y += (deltaY / scale) / 100;
    this.target.x = this.pos.x;
    this.target.y = this.pos.y;
    this.updateMatrix();
    return this;
  }

  zoom(x, y, deltaZ) {
    const z = this.pos.z + deltaZ / 100;
    this.pos.z = Math.min(Math.max(this.ZOOM_MIN, z), this.ZOOM_MAX);
    this.updateMatrix();
    return this;
  }

  getMatrix() {
    return this.perspective.multiply(this.cameraMatrix);
  }

  updateMatrix() {
    this.cameraMatrix = Matrix4.makeTranslate(this.pos.x, this.pos.y, this.pos.z);
    return this;
  }

}

Camera.prototype.ZOOM_MAX = -1.000001;
Camera.prototype.ZOOM_MIN = -10;
