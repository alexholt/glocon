attribute vec2 a_position;
attribute vec2 a_texcoord;

uniform vec2 u_resolution;
uniform vec3 u_position;

varying vec2 v_texcoord;

void main() {
  vec2 zeroToOne = (a_position + u_position.xy) / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, u_position.z);
  v_texcoord = a_texcoord;
}