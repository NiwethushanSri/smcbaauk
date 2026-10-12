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

/* ---- Chat assistant --------------------------------------------------- */
(function () {
  var EMAIL = "smcbaauk@gmail.com";

  // Knowledge base: keyword matchers -> answers sourced from the website.
  var kb = [
    { keys: ["join","member","membership","sign up","register","become"],
      a: 'We&rsquo;d love to welcome you! You can register your details on our <a href="contact.html">Contact page</a>, or email us and we&rsquo;ll be in touch. Membership keeps you connected to Old Boys near you across the UK.' },
    { keys: ["event","events","gathering","dinner","dance","agm","meeting","match","cricket","festival","upcoming","whats on","what's on"],
      a: 'Our upcoming gatherings include the <strong>Annual Dinner &amp; Dance</strong>, <strong>Branch AGM</strong>, <strong>Big Match</strong> and the <strong>Festival of Cricket</strong>. Full dates will be published soon &ndash; see the <a href="index.html">home page</a> and get in touch to be added to the list.' },
    { keys: ["project","projects","it","lab","computer","computers","laboratory","sponsor","sponsorship","donate","donation","support","insiv","giving","scholarship","bursary","university","abroad","overseas","education","study","studies","student","students"],
      a: 'Our recent projects include a new <strong>IT Laboratory</strong> for the College (45 computers), our ongoing <strong>Student Sponsorship</strong> programme, and the <strong>INSIV Global Student Awareness Programme</strong> on overseas higher education. See them all on the <a href="projects.html">Projects page</a>. To support our work or ask about sponsorship, feel free to email us.' },
    { keys: ["photo","photos","gallery","picture","pictures","album"],
      a: 'You can browse photos from our events &ndash; Dinner Dance, Big Match, TSSA and more &ndash; on the <a href="gallery.html">Gallery page</a>.' },
    { keys: ["anthem","song","college anthem"],
      a: 'You can read and listen to our College Anthem on the <a href="anthem.html">Anthem page</a>.' },
    { keys: ["story","history","founded","when","established","1989","our story","about","who"],
      a: 'SMCBAA UK was founded in 1989. You can read our full history and milestones on the <a href="ourstory.html">Our Story page</a>.' },
    { keys: ["committee","president","leadership","who runs"],
      a: 'You can meet the current Executive Committee on the <a href="committee.html">Committee page</a>.' },
    { keys: ["contact","phone","call","number","email","reach","facebook","whatsapp"],
      a: 'You can reach us by phone/WhatsApp on <a href="tel:+447984183880">+44 7984 183880</a>, by email at <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>, or on <a href="https://www.facebook.com/SMCBAAUK" target="_blank" rel="noopener">Facebook</a>. More on the <a href="contact.html">Contact page</a>.' },
    { keys: ["hi","hello","hey","hiya","good morning","good afternoon","good evening"],
      a: 'Hello! &#128075; I&rsquo;m the SMCBAA UK assistant. Ask me about events, membership, our projects, the gallery or how to get in touch &ndash; or I can help you email the committee.' },
    { keys: ["thanks","thank you","cheers","ok","okay"],
      a: 'You&rsquo;re welcome! Is there anything else I can help you with? <em>Quis Ut Deus.</em>' }
  ];

  function emailBtn(q) {
    var subject = encodeURIComponent("Enquiry from the SMCBAA UK website");
    var body = encodeURIComponent((q ? "My question: " + q + "\n\n" : "") + "My message:\n");
    return '<br><a href="mailto:' + EMAIL + '?subject=' + subject + '&body=' + body + '">&#9993;&#65039; Email the committee</a>';
  }

  function answer(text) {
    var t = text.toLowerCase();
    var words = t.replace(/[^a-z0-9\s]/g, " ").split(/\s+/);
    function has(key) {
      return key.indexOf(" ") !== -1 ? t.indexOf(key) !== -1 : words.indexOf(key) !== -1;
    }
    for (var i = 0; i < kb.length; i++) {
      for (var k = 0; k < kb[i].keys.length; k++) {
        if (has(kb[i].keys[k])) return kb[i].a;
      }
    }
    return "I&rsquo;m not sure about that one &ndash; but our committee would be glad to help. You can email us your question and we&rsquo;ll get back to you." + emailBtn(text);
  }

  // Build the widget
  var launch = document.createElement("button");
  launch.className = "chat-launch";
  launch.setAttribute("aria-label", "Open chat assistant");
  launch.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg> Chat with us';

  var panel = document.createElement("div");
  panel.className = "chat-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "SMCBAA UK chat assistant");
  panel.innerHTML =
    '<div class="chat-head">' +
      '<img src="assets/img/logo.png" alt="SMCBAA UK crest" />' +
      '<div class="ct"><strong>SMCBAA UK Assistant</strong><span>Here to help &middot; replies instantly</span></div>' +
      '<button class="chat-close" aria-label="Close chat">&times;</button>' +
    '</div>' +
    '<div class="chat-body" id="chat-body"></div>' +
    '<div class="chat-quick" id="chat-quick"></div>' +
    '<form class="chat-foot" id="chat-form">' +
      '<input type="text" id="chat-input" placeholder="Type your question&hellip;" autocomplete="off" aria-label="Your message" />' +
      '<button class="chat-send" type="submit" aria-label="Send"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>' +
    '</form>';

  document.body.appendChild(launch);
  document.body.appendChild(panel);

  var body = panel.querySelector("#chat-body");
  var quick = panel.querySelector("#chat-quick");
  var form = panel.querySelector("#chat-form");
  var input = panel.querySelector("#chat-input");

  function add(html, who) {
    var m = document.createElement("div");
    m.className = "chat-msg " + who;
    m.innerHTML = html;
    body.appendChild(m);
    body.scrollTop = body.scrollHeight;
  }

  var chips = [
    ["Upcoming events", "events"],
    ["How to join", "join membership"],
    ["Our projects", "projects"],
    ["Gallery", "gallery photos"],
    ["Contact us", "contact"]
  ];
  var started = false;
  function start() {
    if (started) return; started = true;
    add("Hello! &#128075; I&rsquo;m the SMCBAA UK assistant. Ask me about events, membership, our projects or how to get in touch &ndash; or I can help you email the committee.", "bot");
    chips.forEach(function (c) {
      var b = document.createElement("button");
      b.className = "chat-chip"; b.type = "button"; b.textContent = c[0];
      b.addEventListener("click", function () { handle(c[0], c[1]); });
      quick.appendChild(b);
    });
  }

  function handle(display, query) {
    add(display, "user");
    setTimeout(function () { add(answer(query || display), "bot"); }, 300);
  }

  function open() { panel.classList.add("open"); launch.classList.add("hidden"); start(); setTimeout(function(){ input.focus(); }, 100); }
  function close() { panel.classList.remove("open"); launch.classList.remove("hidden"); }

  launch.addEventListener("click", open);
  panel.querySelector(".chat-close").addEventListener("click", close);
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = input.value.trim();
    if (!v) return;
    input.value = "";
    handle(v);
  });
})();

/* ---- Mini calendar ---------------------------------------------------- */
(function () {
  var el = document.getElementById("mini-cal");
  if (!el) return;
  var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var dow = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  var today = new Date();
  var view = new Date(today.getFullYear(), today.getMonth(), 1);

  function render() {
    var y = view.getFullYear(), m = view.getMonth();
    var firstDay = (new Date(y, m, 1).getDay() + 6) % 7; // Monday-start offset
    var daysInMonth = new Date(y, m + 1, 0).getDate();

    var html = '<div class="cal-head">' +
      '<button class="cal-nav" type="button" data-dir="-1" aria-label="Previous month">&#8249;</button>' +
      '<span>' + months[m] + ' ' + y + '</span>' +
      '<button class="cal-nav" type="button" data-dir="1" aria-label="Next month">&#8250;</button>' +
      '</div><div class="cal-grid">';

    for (var d = 0; d < 7; d++) html += '<div class="cal-dow">' + dow[d] + '</div>';
    for (var i = 0; i < firstDay; i++) html += '<div class="cal-day empty"></div>';
    for (var day = 1; day <= daysInMonth; day++) {
      var wd = (firstDay + day - 1) % 7;
      var cls = "cal-day" + (wd >= 5 ? " weekend" : "");
      if (y === today.getFullYear() && m === today.getMonth() && day === today.getDate()) cls += " today";
      html += '<div class="' + cls + '">' + day + '</div>';
    }
    html += '</div>';
    el.innerHTML = html;

    var navs = el.querySelectorAll(".cal-nav");
    for (var n = 0; n < navs.length; n++) {
      navs[n].addEventListener("click", function () {
        view.setMonth(view.getMonth() + parseInt(this.getAttribute("data-dir"), 10));
        render();
      });
    }
  }
  render();
})();

/* ---- Footer year ------------------------------------------------------ */
(function () {
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
