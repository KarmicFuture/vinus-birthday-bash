// Gen X easter eggs. Be kind, rewind.
(function () {
  /* ---------- Retro modal ---------- */
  function closeModal() {
    const existing = document.querySelector(".egg-modal");
    if (existing) existing.remove();
  }

  function showModal(html) {
    closeModal();
    const overlay = document.createElement("div");
    overlay.className = "egg-modal";
    overlay.innerHTML =
      '<div class="egg-box" role="dialog" aria-modal="true">' +
      html +
      '<button class="egg-close" type="button">Press Start to Continue</button>' +
      "</div>";
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay || e.target.classList.contains("egg-close")) {
        closeModal();
      }
    });
    document.addEventListener(
      "keydown",
      function esc(e) {
        if (e.key === "Escape") {
          closeModal();
          document.removeEventListener("keydown", esc);
        }
      }
    );
    document.body.appendChild(overlay);
  }

  /* ---------- 1. Konami code ---------- */
  const KONAMI = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
    "b", "a",
  ];
  let pos = 0;

  document.addEventListener("keydown", (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === KONAMI[pos]) {
      pos++;
      if (pos === KONAMI.length) {
        pos = 0;
        cheatMode();
      }
    } else {
      pos = key === KONAMI[0] ? 1 : 0;
    }
  });

  function cheatMode() {
    showModal(
      '<div class="egg-kicker">↑ ↑ ↓ ↓ ← → ← → B A</div>' +
        '<div class="egg-title">Cheat Code Accepted</div>' +
        '<div class="egg-body">+30 lives granted.<br />' +
        "Open bar unlocked at all eleven pavilions.<br />" +
        "Player 2 has entered the party.</div>"
    );
    if (typeof window.launchConfetti === "function") {
      window.launchConfetti(6000);
    }
  }

  /* ---------- 2. Weekend mixtape (cassette in footer) ---------- */
  const cassette = document.getElementById("egg-cassette");
  if (cassette) {
    cassette.addEventListener("click", () => {
      showModal(
        '<div class="egg-kicker">Now Playing · Chrome · Dolby B</div>' +
          '<div class="egg-title">Vinu\u2019s Weekend Mixtape</div>' +
          '<div class="egg-tape">' +
          '<div class="egg-side"><strong>Side A</strong>' +
          "<ol>" +
          "<li>Come Fly with Me — Frank Sinatra</li>" +
          "<li>Take On Me — a-ha</li>" +
          "<li>Don\u2019t You (Forget About Me) — Simple Minds</li>" +
          "<li>That\u2019s Amore — Dean Martin</li>" +
          "<li>Everybody Wants to Rule the World — Tears for Fears</li>" +
          "</ol></div>" +
          '<div class="egg-side"><strong>Side B</strong>' +
          "<ol>" +
          "<li>Ain\u2019t That a Kick in the Head — Dean Martin</li>" +
          "<li>Livin\u2019 on a Prayer — Bon Jovi</li>" +
          "<li>Africa — Toto</li>" +
          "<li>Under Pressure — Queen &amp; David Bowie</li>" +
          "<li>The Best Is Yet to Come — Frank Sinatra</li>" +
          "</ol></div>" +
          "</div>" +
          '<div class="egg-body">Recorded off the radio. Sorry about the DJ talking over the intros.<br />Be kind, rewind before returning.</div>'
      );
    });
  }

  /* ---------- 3. Hidden Mickey (triple-click the ears) ---------- */
  const mickey = document.querySelector(".mickey-silhouette");
  if (mickey) {
    let clicks = 0;
    let timer = null;
    mickey.style.cursor = "pointer";
    mickey.addEventListener("click", () => {
      clicks++;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => (clicks = 0), 1200);
      if (clicks >= 3) {
        clicks = 0;
        showModal(
          '<div class="egg-kicker">Achievement Unlocked</div>' +
            '<div class="egg-title">You Found a Hidden Mickey</div>' +
            '<div class="egg-body">Meeska, Mooska, Happy Birthday.<br />' +
            "Legend says whoever finds it buys the first round in Mexico.</div>"
        );
        if (typeof window.launchConfetti === "function") {
          window.launchConfetti(4000);
        }
      }
    });
  }

  /* ---------- 4. Tooltip nods ---------- */
  const countdown = document.getElementById("countdown");
  if (countdown) {
    countdown.title = "Roads? Where we're going, we don't need roads.";
  }
  const train = document.getElementById("monorail-train");
  if (train) {
    train.title = "This baby hits 88 mph somewhere around Celebration.";
  }

  /* ---------- 5. Console art ---------- */
  const art = [
    "  ________________________________________",
    " |  ______________________________/\\/\\__  |",
    " | |  o      VINU MIX '26      o  |    | |",
    " | |   ____    .--------.    ____ |    | |",
    " | |  (____)   | (O)(O) |   (____)|    | |",
    " | |___________'--------'_________|    | |",
    " |________________________________________|",
    "",
    "   BE KIND, REWIND.",
    "   Psst — try the old code: \u2191 \u2191 \u2193 \u2193 \u2190 \u2192 \u2190 \u2192 B A",
    "   And someone left a mixtape in the footer.",
  ].join("\n");

  try {
    console.log(
      "%c" + art,
      "color: #c9a84c; font-family: monospace; font-size: 12px;"
    );
  } catch (_) {
    /* consoles are optional */
  }
})();
