precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;

void main() {
   vec4 color = texture2D(u_texture, v_texcoord);

   if (color.z == 154.0 / 255.0) {
     gl_FragColor = vec4(1.0, 1.0, 0, 1.0);
   } else {
     gl_FragColor = color;
     //gl_FragColor = vec4(1.0, 0, 0, 1.0);
   }
   //gl_FragColor = vec4(v_texcoord, 0.0, 1.0); // debug: black is bad, rgb is good
}