attribute vec2 a_position;
attribute vec2 a_texcoord;

uniform vec2 u_resolution;
uniform vec2 u_position;

varying vec2 v_texcoord;

void main() {
  vec2 clipSpace = (a_position + u_position.xy) / u_resolution;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  v_texcoord = a_texcoord;
}
