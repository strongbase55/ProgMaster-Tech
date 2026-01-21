import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, push, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";


// ===== YOUR CONFIG =====
const firebaseConfig = {
    apiKey: "AIzaSyA5WPhVmT7CqMcpaMalDlw4lghN9KWIrL4",
    authDomain: "progmaster-pvt-ltd.firebaseapp.com",
    projectId: "progmaster-pvt-ltd",
    storageBucket: "progmaster-pvt-ltd.firebasestorage.app",
    messagingSenderId: "73277667141",
    appId: "1:73277667141:web:9957a4278b00337359f02c",
    measurementId: "G-CDMS6KTHHQ"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Expose a global function used by app.js
window.saveLead = async (data, form) => {
    const btn = document.getElementById("submitBtn");
    const btnText = btn.querySelector(".btn-text");
    const spinner = btn.querySelector(".spinner");

    try {
        btn.disabled = true;
        btnText.textContent = "Sending…";
        spinner.style.display = "inline-block";

        const clean = {
            name: (data.name || "").trim(),
            phone: (data.phone || "").trim(),
            email: (data.email || "").trim(),
            service: (data.service || "").trim(),
            message: (data.message || "").trim(),
            createdAt: serverTimestamp(),
            source: "website",
        };

        if (!clean.name || !clean.phone || !clean.email || !clean.service || !clean.message) {
            throw new Error("Please fill all fields.");
        }

        await push(ref(db, "leads"), clean);

        form.reset();
        window.dispatchEvent(new Event("lead:sent"));
        document.getElementById("toast").textContent = "";
        (window.toast || (() => { }))?.("✅ Request sent successfully!");
    } catch (err) {
        const msg = err?.message || "Something went wrong.";
        const t = document.getElementById("toast");
        t.textContent = "❌ " + msg;
        t.classList.add("show");
        setTimeout(() => t.classList.remove("show"), 3000);
    } finally {
        btn.disabled = false;
        btnText.textContent = "Send Request";
        spinner.style.display = "none";
    }
};
