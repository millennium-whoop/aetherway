(async function() {
    // Wait for full page load
    await new Promise(r => window.onload = r);
async function load(url) {
    const res = await fetch(url);
    console.log("Loading:", url, "Status:", res.status);
    return res.text();
}
    // Create fullscreen canvas
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = 999999;
    document.body.appendChild(canvas);

canvas.style.background = "red";   // DEBUG
canvas.style.zIndex = "999999999"; // force on top
canvas.style.position = "fixed";
canvas.style.top = 0;
canvas.style.left = 0;

    const gl = canvas.getContext("webgl");

if (!gl) {
    console.error("WebGL failed to initialize");
} else {
    console.log("WebGL OK");
}

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Load shaders
    async function load(url) {
        return fetch(url).then(r => r.text());
    }

    const vsSource = await load("/shaders/shader.vert");
    const fsSource = await load("/shaders/shader.frag");

    function compile(type, source) {
        const s = gl.createShader(type);
        gl.shaderSource(s, source);
        gl.compileShader(s);
        return s;
    }

    const vertexShader = compile(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = compile(gl.FRAGMENT_SHADER, fsSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // fullscreen quad
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,   1, -1,   -1, 1,
         1, -1,    1, 1,   -1, 1
    ]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // texture to hold screenshot
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    async function updateTexture() {
        const screenshot = await html2canvas(document.body, {
            scale: 1,
            backgroundColor: null
        });

        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA,
            gl.RGBA, gl.UNSIGNED_BYTE,
            screenshot
        );

        draw();
    }

    function draw() {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    // initial capture
    await updateTexture();

    // update on resize
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        updateTexture();
    });

    // periodic refresh (captures page updates)
    setInterval(updateTexture, 500);
})();
