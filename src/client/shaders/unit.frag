precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;

void main() {
   vec4 color = texture2D(u_texture, v_texcoord);
   gl_FragColor = color;
}
