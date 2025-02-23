// const imgUrlsArr = [
//     "assets/images/Overlay Giff Images/Overlay Gif 1.gif",
//     "https://raw.githubusercontent.com/Dimterion/PoTW-GO/master/src/assets/images/start_screen_image_02.jpg",
//     "https://raw.githubusercontent.com/Dimterion/PoTW-GO/master/src/assets/images/start_screen_image_03.jpg"
// ];

// const articleContainer = document.getElementById("article-container");

// articleContainer.innerHTML = `<img src="${imgUrlsArr[0]}" class="image" />`;

// let imgIndex = 0;

// function previousImg() {
//     if (imgIndex > 0 && imgIndex < imgUrlsArr.length) {
//         imgIndex--;
//     } else {
//         imgIndex = imgUrlsArr.length - 1;
//     }
//     articleContainer.innerHTML = `<img src="${imgUrlsArr[imgIndex]}" class="image" />`;
// }

// function nextImg() {
//     if (imgIndex >= 0 && imgIndex < imgUrlsArr.length - 1) {
//         imgIndex++;
//     } else {
//         imgIndex = 0;
//     }
//     articleContainer.innerHTML = `<img src="${imgUrlsArr[imgIndex]}" class="image" />`;
// }

const imgUrlsArr = [
    "assets/images/Overlay Giff Images/Overlay Gif 1.gif",
    "https://raw.githubusercontent.com/Dimterion/PoTW-GO/master/src/assets/images/start_screen_image_02.jpg",
    "https://raw.githubusercontent.com/Dimterion/PoTW-GO/master/src/assets/images/start_screen_image_03.jpg"
];

const articleContainer = document.getElementById("article-container");

let imgIndex = 0;

// Function to update the image
function updateImage() {
    articleContainer.innerHTML = `<img src="${imgUrlsArr[imgIndex]}" class="image" />`;
}

// Show the first image initially
updateImage();

// Function for the next image
function nextImg() {
    imgIndex = (imgIndex + 1) % imgUrlsArr.length; // Loop back to the first image
    updateImage();
}

// Function for the previous image
function previousImg() {
    imgIndex = (imgIndex - 1 + imgUrlsArr.length) % imgUrlsArr.length; // Loop to the last image
    updateImage();
}

// Automatically change the image every 3 seconds
let autoSlide = setInterval(nextImg, 3000);

// Pause auto-slide when the user clicks a button, then restart after 5 seconds
function resetAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(nextImg, 5000);
}

// Attach reset function to buttons
document.querySelector(".btn-previous").addEventListener("click", () => {
    previousImg();
    resetAutoSlide();
});

document.querySelector(".btn-next").addEventListener("click", () => {
    nextImg();
    resetAutoSlide();
});
