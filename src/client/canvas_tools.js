export function scaleCanvas(context, width, height) {
  const element = context.canvas;
  const ratio = getRatio(context);
  element.style.width = width;
  element.style.height = height;
  element.width = width * ratio;
  element.height = height * ratio;
}

export function getRatio(context) {
  const devicePixelRatio = window.devicePixelRatio || 1;
  const backingStoreRatio = context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio || 1;
  return devicePixelRatio / backingStoreRatio;
}

export function createProgram(gl, _vert, _frag) {
  const program = gl.createProgram();
  const vert = createShader(gl, gl.VERTEX_SHADER, _vert);
  const frag = createShader(gl, gl.FRAGMENT_SHADER, _frag);

  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);

    throw message;
  }

  return program;
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);

    throw message;
  }

  return shader;
}

export function makeRectAt(x, y, width, height) {
  return [
    x, y, 0,
    x + width, y, 0,
    x, y - height, 0,
    x, y - height, 0,
    x + width, y, 0,
    x + width, y - height, 0,
  ];
}