    let cols, rows;
    let noiseValues;
    let noiseScale = 0.1;
    let noiseOffset = 0;
    let tileSize = 10;

    let minTileSize = 10;
    let maxTileSize = 50;

    let palette = [];
    let backgroundColor;

    let overlay;
    let originalOverlay;

    function preload() {
        overlay = loadImage('overlay.gif'); // Make sure the image is in the same directory
    }

    function setup() {
        pixelDensity(1); // Adjust pixel density to ensure consistent scaling across devices
        let canvas = createCanvas(400, 640);
        canvas.parent('sketch-container'); // Ensure the canvas is in the correct container
        
        tileSize = getRandomTileSize();
        cols = int(width / tileSize);
        rows = int(height / tileSize);
        noiseValues = Array.from({ length: cols }, () => Array(rows).fill(0));
        noStroke();

        if (overlay) {
            overlay.resize(width, height);
            originalOverlay = overlay.get();
        }

        initializePalette();
        applyPaletteToImage();
    }

    function draw() {
        if (backgroundColor) {
            background(backgroundColor);
        }

        // Update noise values
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                let nx = x * noiseScale;
                let ny = y * noiseScale;
                noiseValues[x][y] = noise(nx, ny, noiseOffset);
            }
        }

        // Draw tiles based on noise values
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                let n = noiseValues[x][y];
                let c = getPaletteColor(n);
                fill(c);
                rect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }

        // Draw the overlay image
        if (overlay) {
            image(overlay, 0, 0);
        }

        // Update the noise offset to animate the effect
        noiseOffset += 0.05;
    }

    // Trigger changes only when clicking on the canvas
    function mousePressed() {
        if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
            updateBackgroundAndOverlay();
        }
    }

    // Key press event
    function keyPressed() {
        console.log('Key pressed:', key); // For debugging
        if (key === ' ') {
            updateBackgroundAndOverlay();
        }
    }

    function updateBackgroundAndOverlay() {
        backgroundColor = color(random(255), random(255), random(255));

        tileSize = getRandomTileSize();
        cols = int(width / tileSize);
        rows = int(height / tileSize);
        noiseValues = Array.from({ length: cols }, () => Array(rows).fill(0));

        overlay = originalOverlay.get();
        updatePalette();
        applyPaletteToImage();
    }

    function getRandomTileSize() {
        let possibleSizes = [];
        for (let i = minTileSize; i <= maxTileSize; i++) {
            if (width % i === 0 && height % i === 0) {
                possibleSizes.push(i);
            }
        }
        return possibleSizes.length > 0 ? random(possibleSizes) : minTileSize;
    }

    function initializePalette() {
        for (let i = 0; i < 5; i++) {
            palette[i] = color(random(255), random(255), random(255));
        }
    }

    function updatePalette() {
        for (let i = 0; i < palette.length; i++) {
            let newColor;
            let validColor = false;
            while (!validColor) {
                newColor = color(random(255), random(255), random(255));
                validColor = true;
                for (let j = 0; j < i; j++) {
                    if (colorDistance(newColor, palette[j]) < 100) {
                        validColor = false;
                        break;
                    }
                }
            }
            palette[i] = newColor;
        }
    }

    function colorDistance(c1, c2) {
        return dist(red(c1), green(c1), blue(c1), red(c2), green(c2), blue(c2));
    }

    function applyPaletteToImage() {
        overlay.loadPixels();

        let usedColors = {}; // To keep track of used colors
        let colorIndices = {}; // To map original colors to palette indices

        // Initialize colorIndices with -1 (unassigned)
        for (let i = 0; i < overlay.pixels.length; i += 4) {
            let r = overlay.pixels[i];
            let g = overlay.pixels[i + 1];
            let b = overlay.pixels[i + 2];
            let a = overlay.pixels[i + 3];

            if (a === 0) continue; // Skip transparent pixels

            let pixelColor = color(r, g, b, a);

            if (!colorIndices[pixelColor.toString()]) {
                // Assign a new unique index
                let newIndex = findAvailableIndex(usedColors);
                colorIndices[pixelColor.toString()] = newIndex;
                usedColors[newIndex] = true;
            }

            let paletteIndex = colorIndices[pixelColor.toString()];
            let newColor = palette[paletteIndex];

            overlay.pixels[i] = red(newColor);
            overlay.pixels[i + 1] = green(newColor);
            overlay.pixels[i + 2] = blue(newColor);
        }

        overlay.updatePixels();
    }

    function findAvailableIndex(usedColors) {
        for (let i = 0; i < palette.length; i++) {
            if (!usedColors[i]) {
                return i;
            }
        }
        return 0; // Fallback if all colors are used
    }

    function getPaletteColor(noiseValue) {
        let numColors = palette.length;
        let index = map(noiseValue, 0, 1, 0, numColors - 1);
        let lowerIndex = floor(index);
        let upperIndex = min(lowerIndex + 1, numColors - 1);
        let lerpAmount = index - lowerIndex;

        let c1 = palette[lowerIndex];
        let c2 = palette[upperIndex];
        return lerpColor(c1, c2, lerpAmount);
    }
