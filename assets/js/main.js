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
    // Clone the media node so both <img> and placeholder tiles work
    var clone = media.cloneNode(true);
    clone.style.transform = "none";
    stage.appendChild(clone);
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

/* ---- Footer year ------------------------------------------------------ */
(function () {
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
