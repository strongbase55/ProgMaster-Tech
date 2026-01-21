// ===== Utilities =====
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => [...el.querySelectorAll(q)];
window.toast = (msg) => {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2600);
};

// ===== Year =====
$("#year").textContent = new Date().getFullYear();

// ===== Cursor glow (desktop) =====
const glow = $("#cursorGlow");
window.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
    glow.style.opacity = "1";
});
window.addEventListener("mouseleave", () => glow.style.opacity = "0");

// ===== Scroll progress =====
const progress = $("#progress");
window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    progress.style.width = scrolled + "%";
});

// ===== Reveal on scroll =====
const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("show");
    });
}, { threshold: 0.12 });

$$(".reveal").forEach(el => io.observe(el));

// ===== Active nav link =====
const sections = ["services", "work", "process", "testimonials", "contact"].map(id => document.getElementById(id));
const navLinks = $$(".nl");

const setActive = () => {
    const y = window.scrollY + 120;
    let current = "services";
    for (const s of sections) {
        if (s.offsetTop <= y) current = s.id;
    }
    navLinks.forEach(a => {
        a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
};
window.addEventListener("scroll", setActive);
setActive();

// ===== Mobile drawer =====
const drawer = $("#drawer");
$("#ham").addEventListener("click", () => drawer.classList.add("show"));
$("#closeDrawer").addEventListener("click", () => drawer.classList.remove("show"));
drawer.addEventListener("click", (e) => {
    if (e.target === drawer) drawer.classList.remove("show");
});
$$(".drawer-link").forEach(a => a.addEventListener("click", () => drawer.classList.remove("show")));

// ===== Theme toggle =====
const themeBtn = $("#themeBtn");
const savedTheme = localStorage.getItem("theme");
if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);

themeBtn.addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "light" ? "" : "light";
    if (next) document.documentElement.setAttribute("data-theme", next);
    else document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", next || "");
    toast(next ? "Light theme enabled" : "Dark theme enabled");
});

// ===== Tilt effect =====
const card = $("#tiltCard");
if (card) {
    card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const rx = ((y / r.height) - 0.5) * -10;
        const ry = ((x / r.width) - 0.5) * 10;
        card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
    });
    card.addEventListener("mouseleave", () => {
        card.style.transform = `rotateX(0deg) rotateY(0deg) translateY(0)`;
    });
}

// ===== Count-up stats =====
const countUp = (el) => {
    const target = parseFloat(el.dataset.count);
    const isFloat = String(target).includes(".");
    const duration = 900;
    const start = performance.now();

    const step = (t) => {
        const p = Math.min((t - start) / duration, 1);
        const value = target * (0.15 + 0.85 * p);
        el.textContent = isFloat ? value.toFixed(1) : Math.round(value);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = isFloat ? target.toFixed(1) : target;
    };
    requestAnimationFrame(step);
};

const statIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        countUp(e.target);
        statIO.unobserve(e.target);
    });
}, { threshold: .6 });

$$(".stat-num").forEach(el => statIO.observe(el));

// ===== Lead form (Firebase submit is in firebase.js) =====
$("#leadForm").addEventListener("submit", (e) => {
    e.preventDefault();
    // firebase.js listens to window.saveLead(...)
    const form = e.target;
    const data = Object.fromEntries(new FormData(form).entries());
    window.saveLead?.(data, form);
});


// ===== Case study modal =====
const modal = document.getElementById("caseModal");
const closeBtn = document.getElementById("caseClose");

const setCase = (el) => {
    $("#caseTitle").textContent = el.dataset.caseTitle || "Case Study";
    $("#caseType").textContent = el.dataset.caseType || "Case Study";
    $("#caseProblem").textContent = el.dataset.caseProblem || "";
    $("#caseSolution").textContent = el.dataset.caseSolution || "";
    $("#caseTech").textContent = el.dataset.caseTech || "";
    $("#caseTimeline").textContent = el.dataset.caseTimeline || "";
    $("#caseOutcome").textContent = el.dataset.caseOutcome || "";
};

const openModal = () => {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn?.focus();
};

const closeModal = () => {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
};

$$(".work").forEach((w) => {
    const btn = w.querySelector(".case-btn");
    btn?.addEventListener("click", () => {
        setCase(w);
        openModal();
    });
});

closeBtn?.addEventListener("click", closeModal);
modal?.addEventListener("click", (e) => {
    if (e.target?.dataset?.close === "true") closeModal();
});
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("show")) closeModal();
});


// ===== Lead form submit =====
let lastLeadAt = 0;

$("#leadForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const form = e.target;
    const data = Object.fromEntries(new FormData(form).entries());

    // Honeypot: bots fill hidden fields
    if ((data.company || "").trim()) {
        toast("❌ Spam detected.");
        return;
    }

    // Basic throttle: block repeated submits within 20 seconds
    const now = Date.now();
    if (now - lastLeadAt < 20000) {
        toast("⏳ Please wait a few seconds and try again.");
        return;
    }
    lastLeadAt = now;

    // Optional: basic validation (extra)
    const phone = (data.phone || "").trim();
    const email = (data.email || "").trim();
    if (!/^\+?\d[\d\s-]{8,14}$/.test(phone)) {
        toast("❌ Enter a valid phone number.");
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast("❌ Enter a valid email.");
        return;
    }

    window.saveLead?.(data, form);
});
// ===== Process popup modal (safe binding) =====
window.addEventListener("DOMContentLoaded", () => {
    const pModal = document.getElementById("processModal");
    const pClose = document.getElementById("pClose");
    const pOkay = document.getElementById("pOkay");

    if (!pModal) return;

    const openProcess = (btn) => {
        const step = btn.dataset.step || "";
        const title = btn.dataset.title || "Step";
        const desc = btn.dataset.desc || "";
        const points = (btn.dataset.points || "").split("|").filter(Boolean);

        document.getElementById("pStep").textContent = `Step ${step}`;
        document.getElementById("pTitle").textContent = title;
        document.getElementById("pDesc").textContent = desc;

        const list = document.getElementById("pList");
        list.innerHTML = points.map(p => `<div class="pitem">✅ <b>${p}</b></div>`).join("");

        pModal.classList.add("show");
        pModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        pClose?.focus();
    };

    const closeProcess = () => {
        pModal.classList.remove("show");
        pModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    };

    document.querySelectorAll(".t-step").forEach(btn => {
        btn.addEventListener("click", () => openProcess(btn));
    });

    pClose?.addEventListener("click", closeProcess);
    pOkay?.addEventListener("click", closeProcess);

    pModal.addEventListener("click", (e) => {
        if (e.target?.dataset?.close === "true") closeProcess();
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && pModal.classList.contains("show")) closeProcess();
    });
});



// ===== Book a Call links =====
window.addEventListener("DOMContentLoaded", () => {
    const cal = document.getElementById("calendarBtn");
    const wa = document.getElementById("waConsultBtn");

    if (cal) {
        // Simple Google Calendar "Create event" link (works for everyone)
        const title = encodeURIComponent("Free Consultation - ProgMaster");
        const details = encodeURIComponent("Hi, I want to discuss my project with ProgMaster. Please confirm a suitable time.");
        // Example time: you can keep it blank by using dates later, but this is fine as a quick CTA link.
        cal.href = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${title}&details=${details}`;
    }

    if (wa) {
        const phone = "+91 7993854229"; // <-- change
        const msg = encodeURIComponent("Hi ProgMaster! I want a free 15-min consultation. Can we schedule a call?");
        wa.href = `https://wa.me/${phone}?text=${msg}`;
    }
});


// ===== Drag-to-scroll for tech chips =====
window.addEventListener("DOMContentLoaded", () => {
    const scroller = document.getElementById("toolScroller");
    if (!scroller) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    scroller.addEventListener("mousedown", (e) => {
        isDown = true;
        scroller.classList.add("dragging");
        startX = e.pageX - scroller.offsetLeft;
        scrollLeft = scroller.scrollLeft;
    });

    window.addEventListener("mouseup", () => {
        isDown = false;
        scroller.classList.remove("dragging");
    });

    scroller.addEventListener("mouseleave", () => {
        isDown = false;
        scroller.classList.remove("dragging");
    });

    scroller.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scroller.offsetLeft;
        const walk = (x - startX) * 1.4;
        scroller.scrollLeft = scrollLeft - walk;
    });
});


// ===== Case Study Modal (PRO) =====
window.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("csModal");
    const closeBtn = document.getElementById("csClose");
    const okBtn = document.getElementById("csOkay");

    if (!modal) return;

    const open = (data) => {
        document.getElementById("csType").textContent = data.type || "Case Study";
        document.getElementById("csTitle").textContent = data.title || "Project";
        document.getElementById("csOneLiner").textContent = data.oneLiner || "";
        document.getElementById("csProblem").textContent = data.problem || "";
        document.getElementById("csSolution").textContent = data.solution || "";
        document.getElementById("csOutcome").textContent = data.outcome || "";

        document.getElementById("csTech").textContent = `Tech: ${data.tech || "-"}`;
        document.getElementById("csTimeline").textContent = `Timeline: ${data.timeline || "-"}`;

        const metricsWrap = document.getElementById("csMetrics");
        const metrics = data.metrics || [];
        metricsWrap.innerHTML = metrics.slice(0, 3).map(m => `
      <div class="cs-metric">
        <div class="n">${m.value}</div>
        <div class="t">${m.label}</div>
      </div>
    `).join("");

        modal.classList.add("show");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        closeBtn?.focus();
    };

    const close = () => {
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    };

    // Attach to work cards (make sure each .work has data-case attribute)
    document.querySelectorAll(".work[data-case]").forEach(card => {
        card.style.cursor = "pointer";
        card.addEventListener("click", () => {
            const key = card.getAttribute("data-case");
            const data = window.CASE_STUDIES?.[key];
            if (data) open(data);
        });
    });

    closeBtn?.addEventListener("click", close);
    okBtn?.addEventListener("click", close);

    modal.addEventListener("click", (e) => {
        if (e.target?.dataset?.close === "true") close();
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("show")) close();
    });
});

// Define your case studies here (edit text as needed)
window.CASE_STUDIES = {
    realtechworld: {
        type: "Platform",
        title: "RealTechWorld",
        oneLiner: "A real-time intern project platform with dashboards, leaderboards & tracking.",
        problem: "Students needed real-time project experience + progress tracking, but manual tracking was slow.",
        solution: "Built a dashboard platform with leaderboards, progress tracking, admin controls, and real-time updates.",
        tech: "HTML, CSS, JavaScript, Firebase",
        timeline: "2–4 weeks MVP",
        outcome: "Cleaner tracking + better visibility + faster updates for interns.",
        metrics: [
            { value: "Realtime", label: "Live data updates" },
            { value: "Admin", label: "Dashboard + controls" },
            { value: "Faster", label: "Manual work reduced" }
        ]
    },

    coursereg: {
        type: "Web App",
        title: "Course Registration",
        oneLiner: "Registration flow with admin view and real-time updates.",
        problem: "Manual registration caused errors and delays in student onboarding.",
        solution: "Built a clean registration flow with admin management and real-time database updates.",
        tech: "HTML, CSS, JS, Firebase",
        timeline: "1–2 weeks MVP",
        outcome: "Faster onboarding + organized admin control + reliable records.",
        metrics: [
            { value: "Clean UI", label: "Premium UX" },
            { value: "Realtime", label: "Instant updates" },
            { value: "Stable", label: "Reliable storage" }
        ]
    },

    gym: {
        type: "Product",
        title: "Gym Website & App",
        oneLiner: "Marketing site + product roadmap for memberships & engagement.",
        problem: "Gym needed premium brand presence and a scalable membership system plan.",
        solution: "Designed a conversion-focused website and planned app features for long-term growth.",
        tech: "UI/UX, Web, Roadmap",
        timeline: "Planning + MVP",
        outcome: "Better brand presence + higher trust + clear growth roadmap.",
        metrics: [
            { value: "Premium", label: "Brand feel" },
            { value: "Fast", label: "Landing speed" },
            { value: "Roadmap", label: "Feature plan" }
        ]
    }
};


// Dropdown (click support)
window.addEventListener("DOMContentLoaded", () => {
    const dd = document.getElementById("ddSolutions");
    if (!dd) return;

    dd.querySelector(".dd-btn")?.addEventListener("click", (e) => {
        e.preventDefault();
        dd.classList.toggle("open");
    });

    window.addEventListener("click", (e) => {
        if (!dd.contains(e.target)) dd.classList.remove("open");
    });
});


// ===== Case Studies Data + Modal =====
const CASES = {
    realtechworld: {
        type: "Platform",
        title: "RealTechWorld",
        sub: "Dashboards + leaderboards + real-time progress visibility.",
        problem: "Students needed real-time project experience + progress tracking, but manual tracking was slow.",
        solution: "Built a dashboard platform with leaderboards, progress tracking, and real-time updates.",
        bullets: [
            "Role-based access (Admin / Mentor / Intern)",
            "Realtime DB structure for scalable updates",
            "Leaderboard + progress insights for motivation",
            "Mobile-friendly UI with premium animations"
        ],
        tech: "Tech: HTML, CSS, JavaScript, Firebase",
        timeline: "Timeline: 2–4 weeks MVP",
        outcome: "Outcome: Cleaner tracking + better visibility + faster updates."
    },
    coursereg: {
        type: "Web App",
        title: "Course Registration",
        sub: "Fast registration flow + admin view + realtime updates.",
        problem: "Manual registrations were error-prone and time-consuming.",
        solution: "Created a registration flow with admin dashboard and realtime data sync.",
        bullets: [
            "Realtime submissions + validation",
            "Admin view to filter/search/export leads",
            "Cleaner UX for higher completion rate"
        ],
        tech: "Tech: HTML, CSS, JavaScript, Firebase",
        timeline: "Timeline: 1–2 weeks MVP",
        outcome: "Outcome: Faster registration + cleaner admin workflow."
    }
};

const csModal = document.getElementById("csModal");
const csClose = document.getElementById("csClose");

const openCase = (key) => {
    const c = CASES[key];
    if (!c) return;

    document.getElementById("csType").textContent = c.type;
    document.getElementById("csTitle").textContent = c.title;
    document.getElementById("csSub").textContent = c.sub;
    document.getElementById("csProblem").textContent = c.problem;
    document.getElementById("csSolution").textContent = c.solution;

    const ul = document.getElementById("csBullets");
    ul.innerHTML = "";
    c.bullets.forEach(t => {
        const li = document.createElement("li");
        li.textContent = t;
        ul.appendChild(li);
    });

    document.getElementById("csTech").textContent = c.tech;
    document.getElementById("csTime").textContent = c.timeline;
    document.getElementById("csOutcome").textContent = c.outcome;

    csModal.classList.add("show");
    csModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
};

const closeCase = () => {
    csModal.classList.remove("show");
    csModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
};

csClose?.addEventListener("click", closeCase);
csModal?.addEventListener("click", (e) => {
    if (e.target?.dataset?.close) closeCase();
});
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && csModal?.classList.contains("show")) closeCase();
});

// Attach to your work cards (add data-case="realtechworld" etc.)
document.querySelectorAll("[data-case]").forEach(btn => {
    btn.addEventListener("click", () => openCase(btn.dataset.case));
});


// ===== Services: drag-to-scroll on mobile/tablet =====
window.addEventListener("DOMContentLoaded", () => {
    const scroller = document.getElementById("svcScroller");
    if (!scroller) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    scroller.addEventListener("mousedown", (e) => {
        if (window.innerWidth > 980) return; // only when animation disabled
        isDown = true;
        scroller.classList.add("dragging");
        startX = e.pageX - scroller.offsetLeft;
        scrollLeft = scroller.scrollLeft;
    });

    window.addEventListener("mouseup", () => {
        isDown = false;
        scroller.classList.remove("dragging");
    });

    scroller.addEventListener("mouseleave", () => {
        isDown = false;
        scroller.classList.remove("dragging");
    });

    scroller.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scroller.offsetLeft;
        const walk = (x - startX) * 1.4;
        scroller.scrollLeft = scrollLeft - walk;
    });
});


// ===== Services Carousel: auto-scroll one-by-one (snap) =====
window.addEventListener("DOMContentLoaded", () => {
    const scroller = document.getElementById("svcTrack2");
    const wrap = document.getElementById("svcScroller2");
    const dotsWrap = document.getElementById("svcDots2");
    if (!scroller || !wrap || !dotsWrap) return;

    const getCards = () => [...scroller.querySelectorAll(".svc-card2")];

    // Build dots for the ORIGINAL set only (before cloning)
    const originalCount = getCards().length;
    dotsWrap.innerHTML = "";
    for (let i = 0; i < originalCount; i++) {
        const d = document.createElement("button");
        d.type = "button";
        d.className = "svc-dot2";
        d.setAttribute("aria-label", `Go to service ${i + 1}`);
        d.addEventListener("click", () => goToIndex(i, true));
        dotsWrap.appendChild(d);
    }

    // Clone cards for seamless looping
    const originals = getCards();
    originals.forEach((c) => scroller.appendChild(c.cloneNode(true)));

    // Recompute after clone
    const cards = getCards();
    const dots = [...dotsWrap.querySelectorAll(".svc-dot2")];

    let idx = 0;               // index within ORIGINAL set
    let timer = null;
    let paused = false;

    const cardStep = () => {
        // width + gap (actual)
        const first = cards[0];
        const styles = window.getComputedStyle(scroller);
        const gap = parseFloat(styles.columnGap || styles.gap || "18") || 18;
        return first.getBoundingClientRect().width + gap;
    };

    const setActiveUI = (activeIndex) => {
        // active dot
        dots.forEach((d, i) => d.classList.toggle("active", i === activeIndex));

        // active card class (only in view section)
        cards.forEach((c) => c.classList.remove("is-active"));
        const activeCard = cards[activeIndex]; // choose from first set
        if (activeCard) activeCard.classList.add("is-active");
    };

    const normalizeLoop = () => {
        // When we scroll into the cloned half, jump back (no visual jump)
        const step = cardStep();
        const left = scroller.scrollLeft;

        // If passed the first set width, wrap back
        const firstSetWidth = step * originalCount;
        if (left >= firstSetWidth) {
            scroller.scrollLeft = left - firstSetWidth;
        }
    };

    const goToIndex = (i, smooth = true) => {
        idx = (i + originalCount) % originalCount;
        const step = cardStep();
        const targetLeft = idx * step;

        scroller.scrollTo({
            left: targetLeft,
            behavior: smooth ? "smooth" : "auto",
        });

        setActiveUI(idx);
    };

    // Auto-advance one-by-one
    const start = () => {
        stop();
        timer = setInterval(() => {
            if (paused) return;

            idx = (idx + 1) % originalCount;
            const step = cardStep();
            scroller.scrollTo({
                left: scroller.scrollLeft + step,
                behavior: "smooth",
            });

            // After scroll finishes, normalize if needed
            setTimeout(() => {
                normalizeLoop();
                setActiveUI(idx);
            }, 500);
        }, 2600);
    };

    const stop = () => {
        if (timer) clearInterval(timer);
        timer = null;
    };

    // Pause on hover / touch interaction
    wrap.addEventListener("mouseenter", () => (paused = true));
    wrap.addEventListener("mouseleave", () => (paused = false));
    scroller.addEventListener("touchstart", () => (paused = true), { passive: true });
    scroller.addEventListener("touchend", () => (paused = false), { passive: true });

    // Keep UI correct if user manually scrolls
    let scrollTick = null;
    scroller.addEventListener("scroll", () => {
        if (scrollTick) return;
        scrollTick = requestAnimationFrame(() => {
            normalizeLoop();

            // Detect nearest card in first set
            const step = cardStep();
            const approx = Math.round(scroller.scrollLeft / step);
            idx = ((approx % originalCount) + originalCount) % originalCount;

            setActiveUI(idx);
            scrollTick = null;
        });
    });

    // Init position
    goToIndex(0, false);
    start();
});


// ===== Selected Work: tiny premium interactions =====
window.addEventListener("DOMContentLoaded", () => {
    const card = document.querySelector(".work-card-pro");
    if (!card) return;

    // subtle tilt
    const maxTilt = 6;
    const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        const rx = (0.5 - y) * maxTilt;
        const ry = (x - 0.5) * maxTilt;
        card.style.transform = `translateY(-6px) scale(1.01) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };

    card.addEventListener("mouseenter", () => {
        card.style.transition = "transform .15s ease, box-shadow .25s ease, border-color .25s ease";
    });
    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", () => {
        card.style.transition = "transform .25s ease, box-shadow .25s ease, border-color .25s ease";
        card.style.transform = "";
    });

    // metrics pop-in on load
    const metrics = card.querySelectorAll(".wc-metric");
    metrics.forEach((m, i) => {
        m.style.opacity = "0";
        m.style.transform = "translateY(10px)";
        setTimeout(() => {
            m.style.transition = "opacity .35s ease, transform .35s ease";
            m.style.opacity = "1";
            m.style.transform = "translateY(0)";
        }, 220 + i * 120);
    });
});



/* ===================== SELECTED WORK: Slider + Modal ===================== */
(() => {
    const track = document.getElementById("workTrack");
    const viewport = document.getElementById("workViewport");
    const prevBtn = document.getElementById("workPrev");
    const nextBtn = document.getElementById("workNext");

    const modal = document.getElementById("csModal");
    const csPill = document.getElementById("csPill");
    const csTitle = document.getElementById("csTitle");
    const csSub = document.getElementById("csSub");
    const csHighlights = document.getElementById("csHighlights");
    const csTags = document.getElementById("csTags");
    const csDelivered = document.getElementById("csDelivered");
    const csMetrics = document.getElementById("csMetrics");

    const projects = [
        {
            badge: "Platform",
            title: "RealTechWorld",
            sub: "A student–intern real-time project platform designed to improve delivery, visibility, and outcomes.",
            delivered:
                "Built a clean dashboard experience, weekly progress tracking, and leaderboard-style visibility for mentors and interns. Focused on speed, clarity, and simple workflows.",
            highlights: [
                "Secure authentication and role-based access",
                "Weekly progress + module tracking",
                "Leaderboards with performance breakdown",
                "Admin controls for updates and monitoring"
            ],
            tags: ["HTML", "CSS", "JavaScript", "Firebase"],
            metrics: [
                { v: "+40%", l: "Faster onboarding" },
                { v: "24/7", l: "Cloud uptime" },
                { v: "1k+", l: "Users supported" }
            ]
        },
        {
            badge: "Automation",
            title: "Intern Ops Tracker",
            sub: "An automation-first tracking system for tasks, attendance, and weekly performance scoring.",
            delivered:
                "Designed a lightweight workflow that reduces manual follow-ups and makes reviews faster with auto summaries and structured metrics.",
            highlights: [
                "Attendance % calculations and weekly rollups",
                "Task assignment + completion tracking",
                "Performance signals (communication, coding, teamwork)",
                "Fast review-ready summary views"
            ],
            tags: ["Dashboards", "Sheets", "Apps Script", "GA4"],
            metrics: [
                { v: "-60%", l: "Manual tracking" },
                { v: "4x", l: "Faster reviews" },
                { v: "99%", l: "Data accuracy" }
            ]
        },
        {
            badge: "Web App",
            title: "Job Portal + Auth",
            sub: "A student-only job portal with secure login, roles, and admin moderation.",
            delivered:
                "Implemented secure access for training students and created a smooth job browsing and applying experience with admin oversight.",
            highlights: [
                "Unique Student ID login system",
                "Protected routes and role policies",
                "Admin job posting + moderation",
                "Clean, responsive UI for mobile/desktop"
            ],
            tags: ["Firebase", "Auth", "Realtime DB", "UI"],
            metrics: [
                { v: "2s", l: "Fast search" },
                { v: "RBAC", l: "Role access" },
                { v: "100%", l: "Audit logs" }
            ]
        },
        {
            badge: "UI System",
            title: "Mock Interview UI",
            sub: "A modern interview dashboard with status flow and analytics-ready layout.",
            delivered:
                "Built a clean, animated interview UX with structured sections that can later plug into real-time analytics and evaluation scoring.",
            highlights: [
                "Smooth status flow (awaiting, live, completed)",
                "Reusable UI blocks for analytics",
                "Professional card-based layout",
                "Better readability + spacing system"
            ],
            tags: ["UI", "Charts", "Timeline", "JavaScript"],
            metrics: [
                { v: "+35%", l: "Engagement" },
                { v: "UX", l: "Clean flow" },
                { v: "A11y", l: "Readable UI" }
            ]
        }
    ];

    // ----- Slider (2 cards at a time) -----
    let index = 0; // 0 -> shows cards 1&2, 1 -> cards 2&3, 2 -> cards 3&4
    const maxIndex = 2;

    function cardStepPx() {
        const card = track.querySelector(".work-card");
        if (!card) return 0;
        const gap = 16; // matches CSS gap
        return card.getBoundingClientRect().width + gap;
    }

    function updateSlider() {
        const step = cardStepPx();
        track.style.transform = `translateX(${-index * step}px)`;
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === maxIndex;
    }

    prevBtn.addEventListener("click", () => {
        index = Math.max(0, index - 1);
        updateSlider();
    });

    nextBtn.addEventListener("click", () => {
        index = Math.min(maxIndex, index + 1);
        updateSlider();
    });

    window.addEventListener("resize", updateSlider);
    updateSlider();

    // ----- Modal -----
    function openModal(i) {
        const p = projects[i];
        if (!p) return;

        csPill.textContent = p.badge;
        csTitle.textContent = p.title;
        csSub.textContent = p.sub;
        csDelivered.textContent = p.delivered;

        csHighlights.innerHTML = p.highlights.map(x => `<li>${x}</li>`).join("");
        csTags.innerHTML = p.tags.map(x => `<span>${x}</span>`).join("");

        csMetrics.innerHTML = p.metrics.map(m => `
      <div class="metric">
        <div class="metric-val">${m.v}</div>
        <div class="metric-label">${m.l}</div>
      </div>
    `).join("");

        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    document.addEventListener("click", (e) => {
        const openBtn = e.target.closest("[data-open]");
        if (openBtn) openModal(Number(openBtn.getAttribute("data-open")));

        if (e.target.closest("[data-close]")) closeModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
})();
