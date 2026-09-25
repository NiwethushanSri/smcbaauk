/* =========================================================================
   SMCBAA UK — site scripts
   1) Mobile navigation toggle
   2) Gallery lightbox (open, close, prev/next, keyboard support)
   ========================================================================= */

/* ---- 1. Mobile nav ---------------------------------------------------- */
(function () {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // Close the menu when a link is tapped (mobile)
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();

/* ---- 2. Lightbox ------------------------------------------------------ */
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
  var box = document.getElementById("lightbox");
  if (!items.length || !box) return;

  var stage = box.querySelector(".lightbox-stage");
  var caption = box.querySelector("figcaption");
  var current = 0;

  function render(index) {
    current = (index + items.length) % items.length;
    var source = items[current];
    var media = source.querySelector("img, .ph");
    var text = source.querySelector("figcaption");

    stage.innerHTML = ""; // clear
    var full = media.getAttribute && media.getAttribute("data-full");
    if (full) {
      // Load the high-resolution version for the lightbox
      var img = new Image();
      img.src = full;
      img.alt = media.getAttribute("alt") || "";
      stage.appendChild(img);
    } else {
      // Fallback: clone the media node (handles placeholder tiles)
      var clone = media.cloneNode(true);
      clone.style.transform = "none";
      stage.appendChild(clone);
    }
    caption.textContent = text ? text.textContent.trim() : "";
  }

  function open(index) {
    render(index);
    box.classList.add("open");
    box.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    box.classList.remove("open");
    box.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  items.forEach(function (item, i) {
    item.addEventListener("click", function () { open(i); });
  });

  box.querySelector(".lightbox-close").addEventListener("click", close);
  box.querySelector(".lightbox-prev").addEventListener("click", function () { render(current - 1); });
  box.querySelector(".lightbox-next").addEventListener("click", function () { render(current + 1); });

  // Click on the dark backdrop (not the figure) closes
  box.addEventListener("click", function (e) {
    if (e.target === box) close();
  });

  // Keyboard controls
  document.addEventListener("keydown", function (e) {
    if (!box.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") render(current - 1);
    if (e.key === "ArrowRight") render(current + 1);
  });
})();

/* ---- 3. Launch ceremony (ribbon cutting) ------------------------------ */
(function () {
  var launch = document.getElementById("launch");
  if (!launch) return;

  var force = /[?&]launch\b/i.test(location.search) || location.hash.toLowerCase() === "#launch";
  // Show the ceremony once per browser; ?launch (or #launch) replays it.
  var seen = false;
  try { seen = localStorage.getItem("smcbaa_launched") === "1"; } catch (e) {}
  if (seen && !force) { launch.parentNode.removeChild(launch); return; }

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var countEl = document.getElementById("count-num");
  var subEl = document.getElementById("launch-sub");
  var stage = document.getElementById("ribbon-stage");
  var ribbon = document.getElementById("ribbon");
  var cutBtn = document.getElementById("cut-btn");
  var confetti = document.getElementById("confetti");
  var colors = ["#cf1124", "#1e3fa0", "#ffd34d", "#ffffff", "#a60d1c"];

  document.body.classList.add("launching");

  function showNumber(txt, isGo) {
    countEl.textContent = txt;
    countEl.classList.toggle("go", !!isGo);
    if (reduce) return;
    countEl.classList.remove("count-pop");
    void countEl.offsetWidth; // reflow to restart the animation
    countEl.classList.add("count-pop");
  }

  function startRibbon() {
    countEl.parentNode.style.display = "none";
    subEl.textContent = "";
    stage.classList.add("show");
    if (!reduce) cutBtn.classList.add("pulse");
  }

  function burstConfetti() {
    var pieces = reduce ? 40 : 140;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < pieces; i++) {
      var b = document.createElement("i");
      var dur = 2.6 + Math.random() * 2.4;
      b.style.left = Math.random() * 100 + "vw";
      b.style.background = colors[(Math.random() * colors.length) | 0];
      b.style.animationDuration = dur + "s";
      b.style.animationDelay = Math.random() * 0.5 + "s";
      var w = 7 + Math.random() * 8;
      b.style.width = w + "px";
      b.style.height = (w * (1 + Math.random())) + "px";
      if (Math.random() > 0.6) b.style.borderRadius = "50%";
      frag.appendChild(b);
    }
    confetti.appendChild(frag);
    setTimeout(function () { confetti.innerHTML = ""; }, 6000);
  }

  function finish() {
    launch.classList.add("done");
    document.body.classList.remove("launching");
    try { localStorage.setItem("smcbaa_launched", "1"); } catch (e) {}
    setTimeout(function () { if (launch.parentNode) launch.parentNode.removeChild(launch); }, 1000);
  }

  var cut = false;
  cutBtn.addEventListener("click", function () {
    if (cut) return;
    cut = true;
    cutBtn.disabled = true;
    cutBtn.classList.remove("pulse");
    cutBtn.classList.add("snip");
    var delay = reduce ? 0 : 400; // let the scissors snip first
    setTimeout(function () {
      ribbon.classList.add("cut");
      burstConfetti();
      var hint = document.querySelector(".cut-hint");
      if (hint) hint.textContent = "Welcome to our new home. Once a Michaelite, always a Michaelite.";
    }, delay);
    setTimeout(finish, delay + (reduce ? 400 : 1500));
  });

  // Run the 10 -> 1 countdown, then reveal the ribbon.
  var n = 10;
  showNumber(String(n));
  var timer = setInterval(function () {
    n--;
    if (n >= 1) {
      showNumber(String(n));
    } else {
      clearInterval(timer);
      showNumber("It's time!", true);
      setTimeout(startRibbon, reduce ? 300 : 1100);
    }
  }, reduce ? 450 : 1000);
})();

/* ---- 4. Scroll-triggered reveals -------------------------------------- */
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;

  var vh = window.innerHeight || document.documentElement.clientHeight;
  var els = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var deferred = els.filter(function (el) {
    // Only defer elements that start below the fold; above-fold ones keep
    // their immediate entrance animation.
    return el.getBoundingClientRect().top > vh * 0.9;
  });
  if (!deferred.length) return;

  deferred.forEach(function (el) { el.classList.add("on-scroll"); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
  deferred.forEach(function (el) { io.observe(el); });
})();

/* ---- 5. Animated stat counters ---------------------------------------- */
(function () {
  var nums = Array.prototype.slice.call(document.querySelectorAll(".num[data-count]"));
  if (!nums.length) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function run(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var plain = el.hasAttribute("data-plain");
    if (reduce || isNaN(target)) { el.textContent = plain ? target : target.toLocaleString("en-GB"); return; }
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(eased * target);
      el.textContent = plain ? String(val) : val.toLocaleString("en-GB");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (!("IntersectionObserver" in window)) { nums.forEach(run); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
    });
  }, { threshold: 0.4 });
  nums.forEach(function (el) { io.observe(el); });
})();

/* ---- 6. Back to top --------------------------------------------------- */
(function () {
  var btn = document.createElement("button");
  btn.className = "to-top";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>';
  document.body.appendChild(btn);
  btn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  window.addEventListener("scroll", function () {
    btn.classList.toggle("show", window.scrollY > 600);
  }, { passive: true });
})();

/* ---- Footer year ------------------------------------------------------ */
(function () {
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
