(function () {
  const stops = [
    { country: "Mexico", drink: "Margarita" },
    { country: "Norway", drink: "Aquavit" },
    { country: "China", drink: "Tsing Tao" },
    { country: "Germany", drink: "Beer" },
    { country: "Italy", drink: "Limoncello" },
    { country: "America", drink: "Bourbon" },
    { country: "Japan", drink: "Sake" },
    { country: "France", drink: "Wine" },
    { country: "Morocco", drink: "Mint Tea" },
    { country: "United Kingdom", drink: "Pint" },
    { country: "Canada", drink: "Caesar" },
  ];

  const caption = document.getElementById("world-caption");
  const pavilions = Array.from(document.querySelectorAll(".pavilion"));
  if (!caption || !pavilions.length) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let index = 0;

  function showStop(i) {
    index = ((i % stops.length) + stops.length) % stops.length;
    const stop = stops[index];
    caption.innerHTML =
      "Next stop: <strong>" +
      stop.country +
      "</strong> — " +
      stop.drink;

    pavilions.forEach((el, n) => {
      el.classList.toggle("is-active", n === index);
    });
  }

  showStop(0);

  if (reduceMotion) return;

  // Keep caption in sync with the 48s orbit (11 stops).
  const intervalMs = (48000 / stops.length);
  window.setInterval(() => {
    showStop(index + 1);
  }, intervalMs);
})();
