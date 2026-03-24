function unlockCard(id) {
    let collection = JSON.parse(localStorage.getItem('hugoCards') || "[]");

    if (!collection.includes(id)) {
        collection.push(id);
        localStorage.setItem('hugoCards', JSON.stringify(collection));
    }

    // Visual Swap
    document.getElementById(`mystery-${id}`).style.display = 'none';
    document.getElementById(`content-${id}`).style.display = 'block';
}

// On Page Load: Check if any cards on this page were ALREADY found
document.addEventListener("DOMContentLoaded", () => {
    const collection = JSON.parse(localStorage.getItem('hugoCards') || "[]");
    collection.forEach(id => {
        const mystery = document.getElementById(`mystery-${id}`);
        const content = document.getElementById(`content-${id}`);
        if (mystery && content) {
            mystery.style.display = 'none';
            content.style.display = 'block';
        }
    });
});
