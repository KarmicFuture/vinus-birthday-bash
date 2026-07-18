(function () {
  const config = window.EVENT_CONFIG || {};

  function applyConfig() {
    if (config.subtitle) {
      const subtitle = document.querySelector(".marquee-subtitle");
      if (subtitle) subtitle.textContent = config.subtitle;
    }

    document.querySelectorAll("[data-field]").forEach((el) => {
      const key = el.getAttribute("data-field");
      if (key && config[key]) el.textContent = config[key];
    });

    const download = document.getElementById("rsvp-download");
    if (download) {
      if (config.sheetUrl) {
        download.hidden = false;
        const link = download.querySelector("a");
        if (link) link.href = config.sheetUrl;
      } else {
        download.hidden = true;
      }
    }
  }

  function setStatus(message, isError) {
    const status = document.getElementById("form-status");
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", Boolean(isError));
  }

  function formPayload(form) {
    const data = new FormData(form);
    return {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      attendance: String(data.get("attendance") || "").trim(),
      guests: Number(data.get("guests")) || 1,
      nights: String(data.get("nights") || "").trim(),
      message: String(data.get("message") || "").trim(),
    };
  }

  function setupForm() {
    const form = document.getElementById("rsvp-form");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      setStatus("");

      const endpoint = (config.rsvpEndpoint || "").trim();
      if (!endpoint) {
        setStatus(
          "RSVP is almost ready — the host still needs to connect the form endpoint.",
          true
        );
        return;
      }

      if (!form.reportValidity()) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      const payload = formPayload(form);

      submitBtn.disabled = true;
      setStatus("Sending your RSVP…");

      try {
        // text/plain avoids a CORS preflight against Google Apps Script.
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok || result.ok === false) {
          throw new Error(result.error || "Something went wrong.");
        }

        form.reset();
        const guests = form.querySelector('input[name="guests"]');
        if (guests) guests.value = "1";
        setStatus(
          "You're on the list — check your email for a confirmation."
        );
        if (typeof window.launchConfetti === "function") {
          window.launchConfetti(5000);
        }
      } catch (error) {
        setStatus(
          error.message ||
            "Couldn't send just now. Check your connection and try again.",
          true
        );
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  applyConfig();
  setupForm();
})();
