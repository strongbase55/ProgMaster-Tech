
function openModal() {
    document.getElementById("popupModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("popupModal").style.display = "none";
}

// Close the modal when clicking outside
window.onclick = function (event) {
    let modal = document.getElementById("popupModal");
    if (event.target === modal) {
        closeModal();
    }
}
