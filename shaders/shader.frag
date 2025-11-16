precision mediump float;

uniform sampler2D uTexture;
varying vec2 vUV;

void main() {
    vec2 uv = vUV;

    // slight CRT curvature
    vec2 curve = uv * 2.0 - 1.0;
    float r = dot(curve, curve);
    uv = uv + curve * r * 0.03;

    // sample the page texture
    vec4 color = texture2D(uTexture, uv);

    // scanlines
    float scan = sin(uv.y * 900.0) * 0.08;
    color.rgb -= scan;

    // mild vignette
    float vign = smoothstep(1.0, 0.7, r);
    color.rgb *= vign;

    gl_FragColor = color;
}
