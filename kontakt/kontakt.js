document.addEventListener("DOMContentLoaded", () => {
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    const form = document.getElementById("contact-form");
    const statusEl = document.getElementById("form-status");

    if (!form || !statusEl) return;

    const fields = {
        name: form.querySelector("#name"),
        email: form.querySelector("#email"),
        phone: form.querySelector("#phone"),
        subject: form.querySelector("#subject"),
        message: form.querySelector("#message"),
        privacy: form.querySelector("#privacy")
    };

    function setError(fieldName, message) {
        const errorElement = form.querySelector(`.error-message[data-for="${fieldName}"]`);
        if (errorElement) {
            errorElement.textContent = message || "";
        }
    }

    function clearAllErrors() {
        form.querySelectorAll(".error-message").forEach((el) => {
            el.textContent = "";
        });
    }

    function validateEmail(email) {
        if (!email) return false;
        // einfache, aber ausreichende Prüfung
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return pattern.test(email.toLowerCase());
    }

    function validateForm() {
        clearAllErrors();
        let valid = true;

        // Name
        if (!fields.name.value.trim()) {
            setError("name", "Bitte geben Sie Ihren Namen ein.");
            valid = false;
        }

        // E-Mail
        if (!fields.email.value.trim()) {
            setError("email", "Bitte geben Sie Ihre E-Mail-Adresse ein.");
            valid = false;
        } else if (!validateEmail(fields.email.value.trim())) {
            setError("email", "Bitte geben Sie eine gültige E-Mail-Adresse ein.");
            valid = false;
        }

        // Betreff
        if (!fields.subject.value.trim()) {
            setError("subject", "Bitte geben Sie einen Betreff an.");
            valid = false;
        }

        // Nachricht
        if (!fields.message.value.trim()) {
            setError("message", "Bitte schreiben Sie eine kurze Nachricht.");
            valid = false;
        }

        // Datenschutz
        if (!fields.privacy.checked) {
            setError("privacy", "Bitte bestätigen Sie die Datenschutzerklärung.");
            valid = false;
        }

        return valid;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        statusEl.classList.remove("form-status--success", "form-status--error");
        statusEl.textContent = "";

        const isValid = validateForm();
        if (!isValid) {
            statusEl.textContent = "Bitte überprüfen Sie Ihre Eingaben.";
            statusEl.classList.add("form-status--error");
            return;
        }

        // Hier könnte später echte Backend-Logik / Mailversand kommen.
        // Aktuell nur Simulation einer erfolgreichen Übermittlung.
        statusEl.textContent = "Vielen Dank für Ihre Nachricht. Wir werden uns zeitnah bei Ihnen melden.";
        statusEl.classList.add("form-status--success");

        form.reset();
    });

    form.addEventListener("reset", () => {
        clearAllErrors();
        statusEl.textContent = "";
        statusEl.classList.remove("form-status--success", "form-status--error");
    });
});
