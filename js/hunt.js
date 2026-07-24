function unlockCard(id) {

    let collection = JSON.parse(
        localStorage.getItem("hugoCards") || "[]"
    );


    // Save card permanently
    if (!collection.includes(id)) {
        collection.push(id);

        localStorage.setItem(
            "hugoCards",
            JSON.stringify(collection)
        );
    }


    // Reveal popup
    const mystery = document.getElementById(`mystery-${id}`);
    const content = document.getElementById(`content-${id}`);


    if (mystery) {
        mystery.style.display = "none";
    }


    if (content) {
        content.style.display = "block";
    }


    document.body.classList.add("no-scroll");
}



function closeBox(id) {

    const box = document.getElementById(`content-${id}`);


    if (box) {
        box.style.display = "none";
    }


    document.body.classList.remove("no-scroll");
}



// On page load
document.addEventListener("DOMContentLoaded", () => {

    const collection = JSON.parse(
        localStorage.getItem("hugoCards") || "[]"
    );


    collection.forEach(id => {

        const mystery = document.getElementById(`mystery-${id}`);
        const content = document.getElementById(`content-${id}`);


        if (!mystery || !content) {
            return;
        }


        // Card already collected:
        // hide mystery forever
        mystery.style.display = "none";


        // Do NOT reopen popup after refresh
        content.style.display = "none";

    });

});
