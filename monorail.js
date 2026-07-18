// Monorail: glide between stations, calling out each travel leg.
(function () {
  const train = document.getElementById("monorail-train");
  const caption = document.getElementById("monorail-caption");
  const stations = Array.from(document.querySelectorAll(".monorail-station"));
  if (!train || !caption || stations.length === 0) return;

  const stops = [
    {
      pos: "6%",
      text: "Stop 1: <strong>MCO Airport</strong> — wheels down Friday, weekend on",
    },
    {
      pos: "37%",
      text: "Stop 2: <strong>The Airbnb</strong> — 25 min from MCO, drop bags & first toast",
    },
    {
      pos: "68%",
      text: "Stop 3: <strong>Epcot</strong> — 15 min carpool Saturday, rope drop at 9",
    },
    {
      pos: "94%",
      text: "Final stop: <strong>World Showcase</strong> — eleven countries on foot, drinks in hand",
    },
  ];

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function setStop(i, opts) {
    const stop = stops[i];
    train.style.left = stop.pos;
    caption.innerHTML = stop.text;
    stations.forEach((s, n) => s.classList.toggle("is-here", n === i));
    train.classList.toggle("is-returning", Boolean(opts && opts.returning));
  }

  if (reduceMotion) {
    setStop(2);
    return;
  }

  const DWELL = 2600; // pause at a station
  const TRAVEL = 2800; // matches the CSS transition
  let i = 0;
  let direction = 1;

  setStop(0);

  function next() {
    if (i === stops.length - 1) direction = -1;
    else if (i === 0) direction = 1;
    i += direction;
    setStop(i, { returning: direction === -1 });
    window.setTimeout(next, TRAVEL + DWELL);
  }

  window.setTimeout(next, DWELL);
})();
