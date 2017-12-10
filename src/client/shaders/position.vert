precision mediump float;

attribute vec3 aVertexPosition;

uniform mat4 cameraMatrix;
uniform mat4 modelViewMatrix;
varying vec3 vPos;

void main() {
  vec4 pos = vec4(aVertexPosition, 1);
  gl_Position = cameraMatrix * modelViewMatrix * pos;
  vPos = aVertexPosition;
}
