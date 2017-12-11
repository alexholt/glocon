precision mediump float;

attribute vec3 aVertexPosition;

uniform mat4 cameraMatrix;
uniform mat4 modelViewMatrix;
varying vec4 color;

void main() {
  vec4 pos = vec4(aVertexPosition, 1);
  gl_Position = cameraMatrix * modelViewMatrix * pos;
  color = vec4(aVertexPosition / 2.0 + 0.5, 1.0);
}
