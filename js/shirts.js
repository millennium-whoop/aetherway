document.querySelectorAll(".shirts-design").forEach((design) => {

    const zoomWindow =
        design.parentElement.querySelector(".shirts-zoom");

    const zoomImage = design.dataset.zoomImage;

    console.log("SMALL:", design.src);
    console.log("BIG:", zoomImage);

    const image = new Image();

    image.onload = () => {

        console.log("BIG IMAGE LOADED:", zoomImage);

        zoomWindow.style.backgroundImage =
            `url("${zoomImage}")`;
    };

    image.onerror = () => {

        console.error(
            "BIG IMAGE FAILED TO LOAD:",
            zoomImage
        );
    };

    image.src = zoomImage;

    design.addEventListener("mouseenter", () => {
        zoomWindow.classList.add("visible");
    });

    design.addEventListener("mouseleave", () => {
        zoomWindow.classList.remove("visible");
    });

    design.addEventListener("mousemove", (event) => {

        const rect = design.getBoundingClientRect();

        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const percentX = mouseX / rect.width;
        const percentY = mouseY / rect.height;

        const windowWidth = zoomWindow.offsetWidth;
        const windowHeight = zoomWindow.offsetHeight;

        const imageWidth = rect.width * 3;
        const imageHeight = rect.height * 3;

        const backgroundX =
            -(percentX * imageWidth) +
            windowWidth / 2;

        const backgroundY =
            -(percentY * imageHeight) +
            windowHeight / 2;

        zoomWindow.style.backgroundSize =
            `${imageWidth}px ${imageHeight}px`;

        zoomWindow.style.backgroundPosition =
            `${backgroundX}px ${backgroundY}px`;
    });

});
