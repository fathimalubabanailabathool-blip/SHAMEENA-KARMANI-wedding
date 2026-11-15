
/* =================================
   1. OPEN WEDDING INVITATION
================================= */

function openInvitation() {
    const envelope = document.getElementById("envelope");
    const button = document.getElementById("openButton");
    const container = document.querySelector(".invitation-container");
    const weddingPage = document.getElementById("weddingPage");
    const status = document.getElementById("statusMessage");

    if (!envelope || !button || !container || !weddingPage) {
        console.error("Invitation elements not found.");
        return;
    }

    if (button.disabled) return;

    // Keep the wax seal image intact.
    button.disabled = true;
    button.setAttribute("aria-label", "Opening invitation");

    // Open envelope flap.
    envelope.classList.add("flap-open");

    // Slide letter out.
    setTimeout(() => {
        envelope.classList.add("letter-out");

        if (status) {
            status.textContent = "A beautiful beginning of forever";
        }
    }, 950);

    // Reveal wedding invitation.
    setTimeout(() => {
        weddingPage.classList.add("is-visible");

        setTimeout(() => {
            container.classList.add("is-leaving");
        }, 400);

    }, 2850);
}





function submitRSVP(event) {
    event.preventDefault();

    const form = document.getElementById("rsvpForm");
    const message = document.getElementById("rsvpMessage");

    const guestName = document.getElementById("guestName").value.trim();
    const guestEmail = document.getElementById("guestEmail").value.trim();
    const attendance = document.getElementById("attendance").value;
    const guestCount = document.getElementById("guestCount").value;
    const guestMessage = document.getElementById("guestMessage").value.trim();

    if (!guestName || !guestEmail || !attendance) {
        message.textContent = "Please complete all required fields.";
        return;
    }

    const webAppURL =
        "https://script.google.com/macros/s/AKfycbxAV-CcbQorp7sPAH815zJ9PfEDfeunJu-XYijBOukGbYsR41XZJ0paVd3gLN_iFt5Z/exec";

    const iframe = document.createElement("iframe");
    const formSender = document.createElement("form");

    const frameName = "rsvpFrame_" + Date.now();

    iframe.name = frameName;
    iframe.style.display = "none";

    formSender.action = webAppURL;
    formSender.method = "POST";
    formSender.target = frameName;
    formSender.style.display = "none";

    const fields = {
        guestName,
        guestEmail,
        attendance,
        guestCount,
        guestMessage
    };

    Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        formSender.appendChild(input);
    });

    message.textContent = "Submitting your response...";
    const submitButton = form.querySelector('button[type="submit"]');

    if (submitButton) {
    submitButton.disabled = true;
    submitButton.dataset.originalText = submitButton.innerHTML;

    submitButton.innerHTML = `
        <span class="loading-spinner"></span>
        SUBMITTING...
    `;
    submitButton.classList.add("is-loading");
}

    document.body.appendChild(iframe);
    document.body.appendChild(formSender);

    let completed = false;

   function cleanup() {
    window.removeEventListener("message", handleResponse);

    formSender.remove();
    iframe.remove();

    if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = submitButton.dataset.originalText;
        submitButton.classList.remove("is-loading");
    }
}
    function handleResponse(event) {
        if (event.source !== iframe.contentWindow) return;

        if (!event.data ||
            event.data.type !== "WEDDING_RSVP_RESULT") return;

        completed = true;
        cleanup();

        if (event.data.status === "saved") {
            message.innerHTML = `
                <strong>Thank You! ♡</strong><br>
                Your RSVP has been successfully recorded.
                We look forward to celebrating with you!
            `;
            form.reset();

        } else if (event.data.status === "duplicate") {
            message.innerHTML = `
                <strong>Already Registered ♡</strong><br>
                This email address has already been used.
                Please contact us if you need assistance.
            `;

        } else {
            message.textContent =
                "This email address has already been used.";
        }
    }

    window.addEventListener("message", handleResponse);

    formSender.submit();

    setTimeout(() => {
        if (!completed) {
            cleanup();
            message.textContent =
                "Your RSVP has been successfully recorded. We look forward to celebrating with you!";
        }
    }, 15000);
}

/* =================================
   3. WEDDING COUNTDOWN
================================= */

function updateCountdown() {
    const weddingDate =
        new Date("2026-12-29T00:00:00+05:30").getTime();

    const difference = weddingDate - Date.now();

    const days = document.getElementById("days");
    const hours = document.getElementById("hours");
    const minutes = document.getElementById("minutes");
    const seconds = document.getElementById("seconds");

    if (!days || !hours || !minutes || !seconds) return;

    if (difference <= 0) {
        days.textContent = "00";
        hours.textContent = "00";
        minutes.textContent = "00";
        seconds.textContent = "00";
        return;
    }

    days.textContent = String(
        Math.floor(difference / 86400000)
    ).padStart(2, "0");

    hours.textContent = String(
        Math.floor(difference / 3600000) % 24
    ).padStart(2, "0");

    minutes.textContent = String(
        Math.floor(difference / 60000) % 60
    ).padStart(2, "0");

    seconds.textContent = String(
        Math.floor(difference / 1000) % 60
    ).padStart(2, "0");
}


/* =================================
   4. PHOTO GALLERY
================================= */

function openGalleryImage(imageSource, caption) {
    const lightbox = document.getElementById("galleryLightbox");
    const image = document.getElementById("lightboxImage");
    const captionText = document.getElementById("lightboxCaption");

    if (!lightbox || !image || !captionText) return;

    image.src = imageSource;
    image.alt = caption || "Wedding photograph";
    captionText.textContent = caption || "";

    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeGalleryImage() {
    const lightbox = document.getElementById("galleryLightbox");

    if (!lightbox) return;

    lightbox.classList.remove("active");
    document.body.style.overflow = "";
}


/* =================================
   5. BACK TO TOP
================================= */

function scrollToTop() {
    const weddingPage = document.getElementById("weddingPage");

    if (weddingPage) {
        weddingPage.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}


/* =================================
   6. INITIALIZE PAGE
================================= */

document.addEventListener("DOMContentLoaded", function () {

    // Connect wax seal to opening animation.
    const openButton = document.getElementById("openButton");

    if (openButton) {
        openButton.addEventListener("click", openInvitation);
    }

    // Start countdown.
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Close gallery with Escape key.
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeGalleryImage();
        }
    });

});
