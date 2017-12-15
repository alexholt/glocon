attribute vec4 a_position;
attribute vec2 a_texcoord;

uniform mat4 u_camera;

varying vec2 v_texcoord;

mat4 transpose(mat4 other) {
  return mat4(
    other[0][0], other[1][0], other[2][0], other[3][0],
    other[0][1], other[1][1], other[2][1], other[3][1],
    other[0][2], other[1][2], other[2][2], other[3][2],
    other[0][3], other[1][3], other[2][3], other[3][3]
  );
}

void main() {
  gl_Position = transpose(u_camera) * a_position;
  v_texcoord = a_texcoord;
}