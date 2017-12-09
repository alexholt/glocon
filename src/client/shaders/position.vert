attribute vec3 aVertexPosition;

uniform mat4 cameraMatrix;
uniform mat4 modelViewMatrix;

void main() {
  vec4 pos = vec4(aVertexPosition, 1);
  gl_Position = cameraMatrix * modelViewMatrix * pos;
}
