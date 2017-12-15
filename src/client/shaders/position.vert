precision mediump float;

attribute vec3 aVertexPosition;

uniform mat4 cameraMatrix;
uniform mat4 modelViewMatrix;
varying vec4 color;

mat4 transpose(mat4 other) {
  return mat4(
    other[0][0], other[1][0], other[2][0], other[3][0],
    other[0][1], other[1][1], other[2][1], other[3][1],
    other[0][2], other[1][2], other[2][2], other[3][2],
    other[0][3], other[1][3], other[2][3], other[3][3]
  );
}

void main() {
  vec4 pos = vec4(aVertexPosition, 1);
  gl_Position = transpose(cameraMatrix) * transpose(modelViewMatrix) * pos;
  color = vec4(aVertexPosition / 2.0 + 0.5, 1.0);
}
