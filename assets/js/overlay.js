document.addEventListener("DOMContentLoaded", function () {
    const overlay = document.getElementById("overlay");

    // Disable scrolling on body when overlay is open
    document.body.classList.add("no-scroll");

    function closeOverlay() {
        overlay.style.display = "none";
        document.body.classList.remove("no-scroll"); // Enable scrolling on body when overlay is closed
    }

    document.querySelector(".close-btn").addEventListener("click", closeOverlay);
});
