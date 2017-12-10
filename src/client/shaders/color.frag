precision mediump float;

varying vec3 vPos;

void main() {
	gl_FragColor = vec4(vPos.x, 0.5, 0.2, 0.9);
}