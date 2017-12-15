import { scaleCanvas, createProgram } from './canvas_tools';
import { throttle } from 'lodash';
import Camera from './camera';
import Cube from './cube';
import Map from './map';
import UnitRepository from './unit_repository';
import Stats from 'stats.js';
import UI from './ui';
import Unit from './unit';

class App {

  constructor() {
    this.isPanning = false;
    this.initialize = this.initialize.bind(this);
    this.render = this.render.bind(this);
  }

  initialize() {
    this.initializeFPS();
    const canvas = document.querySelector('canvas');

    const gl = this.gl = canvas.getContext('webgl');
    gl.enable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    this.map = new Map(require('./images/world.svg'));

    this.cubes = Object.keys(this.map.getTerritories()).map((key) => {
      const ter = this.map.getTerritories()[key];
      const {x, y} = ter.getCentroid();
      return new Cube(x, -y, 0.2 + 0.5);
    });

    this.camera = new Camera();

    this.unitRepo = new UnitRepository(this.map.getTerritories());

    scaleCanvas(gl, window.innerWidth, window.innerHeight);

    window.addEventListener('resize', () => {
      scaleCanvas(canvas, window.innerWidth, window.innerHeight);
    });

    document.addEventListener('wheel', (event) => {
      event.preventDefault();
    });

    document.addEventListener('wheel', throttle((event) => {
      let deltaY = event.deltaY;

      // FF (57.0b10) uses lines for the mousewheel scroll delta
      // https://w3c.github.io/uievents/#idl-wheelevent
      if (event.deltaMode === 1) deltaY *= 20;

      this.camera.zoom(event.pageX, event.pageY, deltaY);
    }, 50));

    const down = event => {
      this.isPanning = true;
      let { pageX, pageY } = event;
      if (pageX == null) {
        ({pageX, pageY} = event.touches[0]);
      }
      this.lastX = pageX;
      this.lastY = pageY;
      document.body.style.cursor = 'move';
    };

    document.addEventListener('mousedown', down);
    document.addEventListener('touchstart', down);

    const up = event => {
      let { pageX, pageY } = event;
      if (pageX == null) {
        ({pageX, pageY} = event.touches[0]);
      }

      const distance = Math.abs(this.camera.z);
      const transformedX = pageX / distance + this.camera.x;
      const transformedY = pageY / distance + -this.camera.y;

      this.positionBox.innerText =
        `Page: (${pageX}, ${pageY})
         Map: (${transformedX.toFixed(0)}, ${transformedY.toFixed(0)})
         Cam: (${this.camera.x.toFixed(2)}, ${this.camera.y.toFixed(2)}, ${this.camera.z.toFixed(2)})`;

      const deltaX = this.lastX - pageX;
      const deltaY = this.lastY - pageY;
      this.lastX = pageX;
      this.lastY = pageY;

      if (!this.isPanning) {
        return;
      }

      this.camera.pan(deltaX, deltaY);
    };

    document.addEventListener('mousemove', up);
    document.addEventListener('touchmove', up);
    document.addEventListener('mouseout', (event) => {
      this.isPanning = false;
      this.lastX = null;
      this.lastY = null;
      document.body.style.cursor = 'default';
    });

    const end = event => {
      this.isPanning = false;
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mouseup', end);
    document.addEventListener('touchend', end);

    document.addEventListener('click', (event) => {
      this.map.handleClick(event);
    });

    //UI.initialize();
    window.requestAnimationFrame(this.render);
  }

  initializeFPS() {
    this.stats = new Stats();
    this.stats.dom.setAttribute(
      'style',
      'position: fixed; top: 10px; right: 0; font-size: 9px;'
    );
    this.positionBox = document.createElement('div');
    this.positionBox.setAttribute('id', 'position');
    this.positionBox.style.fontWeight = '800';
    this.stats.dom.appendChild(this.positionBox);
    document.body.appendChild(this.stats.dom);
  }

  render(timestamp) {
    const gl = this.gl;

    //map.handleEdgePan(lastX, lastY);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.map.render(gl, this.camera.getMatrix());
    const first = this.cubes[0];
    if (!first.isInit) {
      first.initialize(gl);
      return window.requestAnimationFrame(this.render);
    }
    //first.render(gl, this.camera.getMatrix(), timestamp, true, first.program);
    this.cubes.forEach((cube, i) => cube.render(gl, this.camera.getMatrix(), timestamp, i === 0, first.program, first.positionAttributeLocation, first.cameraMatrixLocation, first.modelMatrixLocation));

    //unitRepo.render(gl, map.getScale(), map.getOffsetX(), map.getOffsetY());

    this.stats.update();
    window.requestAnimationFrame(this.render);
  }
}

const app = new App();
window.addEventListener('DOMContentLoaded', app.initialize);