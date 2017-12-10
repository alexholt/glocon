import Matrix4 from './matrix4';
import Vector3 from './vector3';

export default class Camera {

  constructor() {
    this.up = new Vector3([0, 1, 0]);
    this.target = new Vector3([0, 0, 1]);
    this.pos = new Vector3([-500, 300, -100]);
    this.updateMatrix();
    const ratio = window.innerWidth / window.innerHeight;
    this.perspective = Matrix4.makePerspective(Math.PI / 4, ratio);
  }

  pan(deltaX, deltaY) {
    const scale = Math.abs(this.pos.z);
    const MULTIPLIER = 240; // WHY??!!!!
    
    this.pos.x -= deltaX / MULTIPLIER * scale;
    this.pos.y += deltaY / MULTIPLIER * scale;
    this.target.x = this.pos.x;
    this.target.y = this.pos.y;
    this.updateMatrix();
    return this;
  }

  zoom(x, y, deltaZ) {
    const z = this.pos.z + deltaZ;
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

  get x() {
    return this.pos.x;
  }

  get y() {
    return this.pos.y;
  }

  get z() {
    return this.pos.z;
  }
}

Camera.prototype.ZOOM_MAX = -100;
Camera.prototype.ZOOM_MIN = -1000;