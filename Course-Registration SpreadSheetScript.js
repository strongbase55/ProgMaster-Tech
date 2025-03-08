const scriptURL = 'https://script.google.com/macros/s/AKfycbyjFrvyiCBypJLf2I_WVJTBH-1X2uWyXe_oEWaQufu6ofJFnN8YfQCTyNG1322YMG-JuA/exec';
const form = document.forms['contact-form'];
const submitButton = document.getElementById("submit");

// Store original button text
const originalButtonText = submitButton.value;

// Set default disabled styles
submitButton.disabled = true;
submitButton.style.cursor = "not-allowed";

// Function to validate form fields
function validateForm() {
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const college = document.getElementById("college").value.trim();
    const rollNumber = document.getElementById("rollNumber").value.trim();

    const nameRegex = /^[a-zA-Z\s]+$/; // Only letters and spaces
    const collegeRegex = /^[a-zA-Z\s]+$/; // Only letters and spaces (No numbers)
    const rollNumberRegex = /^[a-zA-Z0-9]+$/; // Letters and numbers (no spaces or special chars)
    const phoneRegex = /^[0-9]{10}$/; // Exactly 10 digits

    let isValid = true;

    // Name validation
    if (!nameRegex.test(name)) {
        document.getElementById("nameError").textContent = "Only letters and spaces allowed.";
        isValid = false;
    } else {
        document.getElementById("nameError").textContent = "";
    }

    // Phone validation
    if (!phoneRegex.test(phone)) {
        document.getElementById("phoneError").textContent = "Phone number must be exactly 10 digits.";
        isValid = false;
    } else {
        document.getElementById("phoneError").textContent = "";
    }

    // College validation (Updated: Only letters & spaces, no numbers)
    if (!collegeRegex.test(college)) {
        document.getElementById("collegeError").textContent = "Only letters and spaces allowed.";
        isValid = false;
    } else {
        document.getElementById("collegeError").textContent = "";
    }

    // Roll Number validation
    if (!rollNumberRegex.test(rollNumber)) {
        document.getElementById("rollNumberError").textContent = "Only letters and numbers allowed.";
        isValid = false;
    } else {
        document.getElementById("rollNumberError").textContent = "";
    }

    if (isValid) {
        submitButton.disabled = false;
        submitButton.style.cursor = "pointer";
    } else {
        submitButton.disabled = true;
        submitButton.style.cursor = "not-allowed";
    }
}

// Listen for form input changes to validate in real-time
document.querySelectorAll(".input-box input").forEach(input => {
    input.addEventListener("input", validateForm);
});

// Listen for form submission
form.addEventListener('submit', e => {
    e.preventDefault();

    // Final validation before submission
    validateForm();
    if (submitButton.disabled) return;

    // Disable button and change text to "Submitting..."
    submitButton.disabled = true;
    submitButton.style.cursor = "not-allowed";
    submitButton.value = "Submitting...";

    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => {
            alert("Thank you! Registration Completed. We will reach out to you soon!");
            form.reset(); // Reset form after submission
            validateForm(); // Re-check to disable the button
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert("Something went wrong. Please try again!");
        })
        .finally(() => {
            submitButton.value = originalButtonText;
            setTimeout(validateForm, 2000); // Enable if valid
        });
});
