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
  }

  function setStatus(message, isError) {
    const status = document.getElementById("form-status");
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", Boolean(isError));
  }

  function setupForm() {
    const form = document.getElementById("rsvp-form");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      setStatus("");

      const email = (config.hostEmail || "").trim();
      if (!email) {
        setStatus(
          "Add your email in config.js (hostEmail) so RSVPs can be delivered.",
          true
        );
        return;
      }

      if (!form.reportValidity()) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      const formData = new FormData(form);

      submitBtn.disabled = true;
      setStatus("Sending your RSVP…");

      try {
        const response = await fetch(`https://formsubmit.co/ajax/${email}`, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload.message || "Something went wrong.");
        }

        form.reset();
        const guests = form.querySelector('input[name="guests"]');
        if (guests) guests.value = "1";
        setStatus("You're on the list — thanks for RSVPing!");
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
