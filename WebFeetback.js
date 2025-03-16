const scriptURL = 'https://script.google.com/macros/s/AKfycbyXioBVtYIriKdej13RdRxBQJ4rWKP_jN73HeuRogTa-I7cHDKtmXMifC5U3Jb70aDK/exec';
const rollCheckURL = "https://script.google.com/macros/s/AKfycby07ax9yc44TfwZOKk5_Tp17rJV9vNhOvaaMP89PArcoLdTnQFd_b0io9aNyWjI8MY0/exec"; // Replace with your deployed script URL
const form = document.forms['contact-form'];
const submitButton = document.getElementById("submit");

// Store original button text
const originalButtonText = submitButton.value;
submitButton.disabled = true;
submitButton.style.cursor = "not-allowed";

function validatePhone() {
    const phone = document.getElementById("phone").value.trim();
    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(phone)) {
        document.getElementById("phoneError").textContent = "Phone number must be exactly 10 digits.";
    } else {
        document.getElementById("phoneError").textContent = "";
    }
}

// function validateRollNumber() {
//     const rollNumber = document.getElementById("rollNumber").value.trim();
//     const rollNumberRegex = /^PROGFTWD\d{2}$/; // Ensures format like PROGFTWD01, PROGFTWD10, etc.

//     if (rollNumber && !rollNumberRegex.test(rollNumber)) {
//         alert("Invalid Training ID. Please enter a valid ID like: PROGFTWD01");
//     }
// }

function validateRollNumber() {
    let rollNumber = document.getElementById("rollNumber").value.trim().toUpperCase();
    let match = rollNumber.match(/^PROGFTWD(\d{1,3})$/); // Extract up to 3 digits

    if (!match) {
        alert("Invalid Training ID. Please enter a valid ID like: PROGFTWD01, PROGFTWD10, or PROGFTWD124.");
        return;
    }

    let serialNumber = parseInt(match[1], 10); // Convert extracted number to integer

    if (serialNumber < 1 || serialNumber > 999) {
        alert("Invalid Training ID range. Use PROGFTWD01 to PROGFTWD999.");
        return;
    }

    // Ensure correct formatting (leading zero for 1-9 only)
    let formattedRollNumber = serialNumber < 10 ? `PROGFTWD0${serialNumber}` : `PROGFTWD${serialNumber}`;

    document.getElementById("rollNumber").value = formattedRollNumber; // Update input with corrected format
}


function validateRating(event) {
    const rating = event.target.value.trim();

    if (rating && (rating > 5 || rating < 1)) {
        alert("Rating should not be more than 5.");
        event.target.value = ""; // Clear the invalid input
    }
}

// New Function: Check if Roll Number Already Exists in Google Sheets
async function checkDuplicateRollNumber() {
    const rollNumber = document.getElementById("rollNumber").value.trim().toUpperCase();
    if (!/^PROGFTWD\d{2}$/.test(rollNumber)) return false;

    try {
        const response = await fetch(rollCheckURL);
        const existingRollNumbers = await response.json();

        if (existingRollNumbers.includes(rollNumber)) {
            alert("You have already submitted feedback. Duplicate entries are not allowed.");
            return false;
        }
    } catch (error) {
        console.error("Error fetching roll numbers:", error);
        alert("Something went wrong. Please try again later.");
        return false;
    }

    return true;
}

// Listen for input blur events (when the user finishes typing)
document.getElementById("rollNumber").addEventListener("blur", validateRollNumber);
document.getElementById("phone").addEventListener("blur", validatePhone);
document.querySelector('input[name="How would you rate the quality of the training? (1-5)"]').addEventListener("blur", validateRating);
document.querySelector('input[name="How would you rate the quality of the instructor? (1-5)"]').addEventListener("blur", validateRating);

function checkFormCompletion() {
    const phone = document.getElementById("phone").value.trim();
    const rollNumber = document.getElementById("rollNumber").value.trim();
    const trainingRating = document.querySelector('input[name="How would you rate the quality of the training? (1-5)"]').value.trim();
    const instructorRating = document.querySelector('input[name="How would you rate the quality of the instructor? (1-5)"]').value.trim();

    const phoneValid = /^[0-9]{10}$/.test(phone);

    // Updated Roll Number Validation (Now allows PROGFTWD001 to PROGFTWD999)
    const rollNumberValid = /^PROGFTWD(0?[1-9]|[1-9][0-9]{1,2})$/.test(rollNumber);

    const ratingValid = trainingRating >= 1 && trainingRating <= 5 && instructorRating >= 1 && instructorRating <= 5;

    submitButton.disabled = !(phoneValid && rollNumberValid && ratingValid);
    submitButton.style.cursor = submitButton.disabled ? "not-allowed" : "pointer";
}

// Listen for input changes
document.querySelectorAll(".input-box input").forEach(input => {
    input.addEventListener("input", checkFormCompletion);
});
form.addEventListener('submit', async e => {
    e.preventDefault();
    if (submitButton.disabled) return;

    // Show loader instantly before checking duplicate Roll Number
    document.getElementById("loader").style.display = "flex";

    // Check for duplicate Roll Number before proceeding
    if (!(await checkDuplicateRollNumber())) {
        document.getElementById("loader").style.display = "none"; // Hide loader if duplicate found
        return;
    }

    submitButton.disabled = true;
    submitButton.style.cursor = "not-allowed";
    submitButton.value = "Submitting...";

    fetch(scriptURL, {
        method: 'POST',
        body: new FormData(form)
    })
        .then(response => {
            alert("Thank you for your valuable feedback");
            form.reset();
            checkFormCompletion();
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert("Something went wrong. Please try again!");
        })
        .finally(() => {
            submitButton.value = originalButtonText;
            // Refresh instantly after alert
            setTimeout(() => location.reload(), 100);
        });
});
