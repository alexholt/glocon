precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;

void main() {
   gl_FragColor = texture2D(u_texture, v_texcoord);
   //gl_FragColor = vec4(v_texcoord, 0.0, 1.0); // debug: black is bad, rgb is good
}