// Festive layer: starfield, countdown, and gold confetti.
(function () {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- Twinkling starfield (all pages) ---------- */
  function buildStarfield() {
    const field = document.createElement("div");
    field.className = "starfield";
    field.setAttribute("aria-hidden", "true");

    const count = 70;
    for (let i = 0; i < count; i++) {
      const star = document.createElement("span");
      const size = Math.random() < 0.85 ? 2 : 3;
      star.style.left = (Math.random() * 100).toFixed(2) + "%";
      star.style.top = (Math.random() * 100).toFixed(2) + "%";
      star.style.width = size + "px";
      star.style.height = size + "px";
      star.style.animationDelay = (Math.random() * 6).toFixed(2) + "s";
      star.style.animationDuration = (2.5 + Math.random() * 4).toFixed(2) + "s";
      field.appendChild(star);
    }
    document.body.prepend(field);
  }

  /* ---------- Countdown to the party (home page) ---------- */
  function startCountdown() {
    const wrap = document.getElementById("countdown");
    if (!wrap) return;

    // Friday, Dec 4, 2026 — Kissimmee (EST).
    const target = new Date("2026-12-04T00:00:00-05:00").getTime();
    const cells = {
      days: document.getElementById("cd-days"),
      hours: document.getElementById("cd-hours"),
      minutes: document.getElementById("cd-minutes"),
      seconds: document.getElementById("cd-seconds"),
    };

    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        wrap.innerHTML =
          '<div class="countdown-label">It\u2019s party time — welcome to the weekend of the century!</div>';
        return;
      }
      const s = Math.floor(diff / 1000);
      cells.days.textContent = Math.floor(s / 86400);
      cells.hours.textContent = String(Math.floor((s % 86400) / 3600)).padStart(2, "0");
      cells.minutes.textContent = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
      cells.seconds.textContent = String(s % 60).padStart(2, "0");
      window.setTimeout(tick, 1000);
    }
    tick();
  }

  /* ---------- Gold confetti ---------- */
  const COLORS = ["#c9a84c", "#e8c97a", "#f5edd6", "#8a6e29", "#c8102e"];

  function launchConfetti(durationMs) {
    if (reduceMotion) return;

    const canvas = document.createElement("canvas");
    canvas.className = "confetti-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const pieces = [];
    const COUNT = Math.min(140, Math.floor(window.innerWidth / 9));
    for (let i = 0; i < COUNT; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height * 0.6,
        w: 5 + Math.random() * 6,
        h: 8 + Math.random() * 8,
        vy: 1.4 + Math.random() * 2.4,
        vx: -0.8 + Math.random() * 1.6,
        rot: Math.random() * Math.PI,
        vr: -0.08 + Math.random() * 0.16,
        sway: Math.random() * Math.PI * 2,
        color: COLORS[i % COLORS.length],
      });
    }

    const stopAt = Date.now() + (durationMs || 7000);
    let raining = true;

    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (Date.now() > stopAt) raining = false;

      let alive = 0;
      for (const p of pieces) {
        p.y += p.vy;
        p.sway += 0.04;
        p.x += p.vx + Math.sin(p.sway) * 0.6;
        p.rot += p.vr;

        if (p.y > canvas.height + 30) {
          if (!raining) continue;
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        alive++;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.9;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      if (alive > 0) {
        window.requestAnimationFrame(frame);
      } else {
        window.removeEventListener("resize", resize);
        canvas.remove();
      }
    }
    window.requestAnimationFrame(frame);
  }

  // Let other scripts trigger a burst (e.g. RSVP success).
  window.launchConfetti = launchConfetti;

  buildStarfield();
  startCountdown();

  // Welcome shower on the home page only.
  if (document.getElementById("countdown")) {
    launchConfetti(6500);
  }
})();
