import Matrix4 from './matrix4';
import Vector3 from './vector3';

export default class Camera {

  constructor() {
    this.up = new Vector3([0, 1, 0]);
    this.target = new Vector3([0, 0, 1]);
    this.pos = new Vector3([-500, 300, -500]);
    const ratio = window.innerWidth / window.innerHeight;
    this.perspective = Matrix4.makePerspective(Math.PI / 6, ratio);
    this.updateMatrix();
  }

  pan(deltaX, deltaY) {
    const cameraDistance = -this.pos.z - 0.2;
    const probe1 = new Vector3([0, 0, -cameraDistance]);
    const probe2 = new Vector3([1, 0, -cameraDistance]);
    const transform = this.perspective;

    const mappedProbe1 = transform.multiply(probe1);
    const mappedProbe2 = transform.multiply(probe2);

    const screenVec = new Vector3([window.innerWidth, window.innerHeight, 1]);
    const screenSpaceProbe1 = mappedProbe1.multiply(0.5).add(0.5).multiply(screenVec);
    const screenSpaceProbe2 = mappedProbe2.multiply(0.5).add(0.5).multiply(screenVec);
    const screenSpaceDelta = screenSpaceProbe2.x - screenSpaceProbe1.x;
    const ratio = 1 / screenSpaceDelta;

    this.pos.x -= deltaX * ratio;
    this.pos.y += deltaY * ratio;
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
    return this.matrix;
  }

  updateMatrix() {
    this.matrix = this.perspective.clone().multiply(Matrix4.makeTranslate(this.pos.x, this.pos.y, this.pos.z));
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

Camera.prototype.ZOOM_MAX = -500;
Camera.prototype.ZOOM_MIN = -1000;