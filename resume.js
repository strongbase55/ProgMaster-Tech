// Import Firebase
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
    getDatabase,
    ref,
    get
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase Configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAt_3PX3WMQ5lGeOnnfoe7pOtliF-dFBQE",
    authDomain: "resumedatabase-a2c4b.firebaseapp.com",
    projectId: "resumedatabase-a2c4b",
    storageBucket: "resumedatabase-a2c4b.firebasestorage.app",
    messagingSenderId: "595333710032",
    appId: "1:595333710032:web:f8faf099251231bb959ed5",
    measurementId: "G-B974CWLPJG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Elements
const resumeList = document.getElementById("resume-list");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const loadMoreBtn = document.getElementById("load-more");

let allResumes = []; // Store all resumes
let displayedCount = 0; // Track displayed resumes
const batchSize = 50; // Number of resumes per load

// Fetch resumes from Firebase
async function fetchResumes() {
    const snapshot = await get(ref(db, "resumes"));
    console.log("Firebase Data:", snapshot.val()); // Debugging

    if (snapshot.exists()) {
        allResumes = Object.values(snapshot.val());
        displayResumes();
    } else {
        console.log("No resumes found in Firebase!");
    }
}

// Function to display resumes
function displayResumes() {
    resumeList.innerHTML = ""; // Clear the list
    let filteredResumes = filterResumes(); // Apply search & filter
    let visibleResumes = filteredResumes.slice(0, displayedCount + batchSize); // Show only a subset

    visibleResumes.forEach(resume => {
        let resumeCard = document.createElement("div");
        resumeCard.classList.add("resume-card");
        resumeCard.innerHTML = `
            <h3>${resume.name}</h3>
            <p>Experience: ${resume.experience}</p>
            <a href="${resume.file_url}" target="_blank">Download Resume</a>
        `;
        resumeList.appendChild(resumeCard);
    });

    displayedCount = visibleResumes.length;

    // Hide "Load More" button if all resumes are shown
    loadMoreBtn.style.display = (displayedCount >= filteredResumes.length) ? "none" : "block";
}

// Function to filter resumes based on search & dropdown
function filterResumes() {
    let searchQuery = searchInput.value.toLowerCase();
    let selectedFilter = filterSelect.value;

    return allResumes.filter(resume => {
        let matchesSearch = resume.name.toLowerCase().includes(searchQuery);
        let matchesFilter = selectedFilter === "all" || resume.experience === selectedFilter;
        return matchesSearch && matchesFilter;
    });
}

// Event Listeners
searchInput.addEventListener("input", displayResumes);
filterSelect.addEventListener("change", displayResumes);
loadMoreBtn.addEventListener("click", () => {
    displayedCount += batchSize; // Increase limit
    displayResumes();
});

// Fetch resumes when the page loads
fetchResumes();
