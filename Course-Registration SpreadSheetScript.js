const scriptURL = 'https://script.google.com/macros/s/AKfycbyjFrvyiCBypJLf2I_WVJTBH-1X2uWyXe_oEWaQufu6ofJFnN8YfQCTyNG1322YMG-JuA/exec'

const form = document.forms['contact-form']

form.addEventListener('submit', e => {

    e.preventDefault()

    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => alert("Thank you! Registration Completed. We will reach out you soon!"))
        .then(() => { window.location.reload(); })
        .catch(error => console.error('Error!', error.message))
})

// Form Validation
function validateForm() {
    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let college = document.getElementById("college").value;
    let rollNumber = document.getElementById("rollNumber").value;
    let submitButton = document.getElementById("submit");

    let nameRegex = /^[A-Za-z ]+$/;
    let phoneRegex = /^[0-9]{10}$/;
    let rollRegex = /^[A-Za-z0-9]+$/;

    let isValid = true;

    document.getElementById("nameError").innerText = "";
    document.getElementById("phoneError").innerText = "";
    document.getElementById("collegeError").innerText = "";
    document.getElementById("rollError").innerText = "";

    if (!nameRegex.test(name)) {
        document.getElementById("nameError").innerText = "Only alphabets and spaces are allowed in the name.";
        isValid = false;
    }

    if (!phoneRegex.test(phone)) {
        document.getElementById("phoneError").innerText = "Phone number must be exactly 10 digits.";
        isValid = false;
    }

    if (!nameRegex.test(college)) {
        document.getElementById("collegeError").innerText = "Special characters are not allowed in the college name.";
        isValid = false;
    }

    if (!rollRegex.test(rollNumber)) {
        document.getElementById("rollError").innerText = "Special characters are not allowed in the roll number.";
        isValid = false;
    }

    if (isValid) {
        submitButton.disabled = false;
        submitButton.classList.add("enabled");
    } else {
        submitButton.disabled = true;
        submitButton.classList.remove("enabled");
    }
}