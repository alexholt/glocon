attribute vec4 a_position;
attribute vec2 a_texcoord;

uniform mat4 u_camera;

varying vec2 v_texcoord;

void main() {
  gl_Position = u_camera * a_position;
  v_texcoord = a_texcoord;
}