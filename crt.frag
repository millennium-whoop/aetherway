#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_texture;
uniform vec2 u_resolution;

uniform float u_time;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;

    // Convert to -1..1
    vec2 centered = uv * 2.0 - 1.0;

    // Barrel distortion for curvature
    float barrel = 1.1; // adjust curvature
    centered *= 1.0 + barrel * dot(centered, centered);

    uv = (centered + 1.0) / 2.0;

    // Sample original texture
    vec3 color = texture2D(u_texture, uv).rgb;

    // Add scanlines
    float scan = sin(gl_FragCoord.y * 1.5) * 0.1;
    color -= scan;

    // Optional vignette
    float dist = length(centered);
    color *= smoothstep(1.0, 0.7, dist);

    gl_FragColor = vec4(color, 1.0);
}
