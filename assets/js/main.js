/* ===================================================================
   Lead AI Studio — site interactivity
   nav · scroll reveal · counters · pricing toggle · ROI calculator
   · interactive service demos · form validation
   =================================================================== */
(function () {
  "use strict";

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---- footer year ---- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---- sticky header ---- */
  var header = $(".site-header");
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 16); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- mobile nav ---- */
  var toggle = $(".nav-toggle"), nav = $(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    $$("a", nav).forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- scroll reveal ---- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- animated counters ---- */
  function animate(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var decimals = (el.getAttribute("data-count").split(".")[1] || "").length;
    var dur = 1500, t0 = null;
    function frame(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(frame);
  }
  var counters = $$("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animate(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---- pricing segment toggle ---- */
  var priceToggle = $(".price-toggle");
  if (priceToggle) {
    $$("button", priceToggle).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var seg = btn.getAttribute("data-segment");
        $$("button", priceToggle).forEach(function (b) { b.classList.toggle("active", b === btn); });
        $$("[data-seg]").forEach(function (el) {
          el.hidden = el.getAttribute("data-seg") !== seg;
        });
      });
    });
  }

  /* ---- ROI calculator ---- */
  var roi = $("#roiCalc");
  if (roi) {
    var fmt = function (n) { return "$" + Math.round(n).toLocaleString("en-US"); };
    function calcROI() {
      var team  = +$("#roiTeam").value;
      var hours = +$("#roiHours").value;
      var rate  = +$("#roiRate").value;
      $("#roiTeamVal").textContent  = team;
      $("#roiHoursVal").textContent = hours + " hrs";
      $("#roiRateVal").textContent  = "$" + rate + "/hr";
      // assumption: AI automates ~65% of repetitive hours
      var weekly   = team * hours * rate * 0.65;
      var annual   = weekly * 48;
      var reclaimed = team * hours * 0.65 * 48;
      $("#roiAnnual").textContent = fmt(annual);
      $("#roiWeekly").textContent = fmt(weekly);
      $("#roiHoursSaved").textContent = Math.round(reclaimed).toLocaleString("en-US") + " hrs";
    }
    $$("#roiTeam, #roiHours, #roiRate").forEach(function (i) {
      i.addEventListener("input", calcROI);
    });
    calcROI();
  }

  /* ---- DEMO 1: AI voice assistant transcript player ---- */
  var voiceDemo = $("#voiceDemo");
  if (voiceDemo) {
    var script = [
      { who: "caption", text: "Incoming call — 9:42 PM, after hours" },
      { who: "ai",   text: "Thanks for calling Northwind Logistics, this is the AI assistant. How can I help?" },
      { who: "user", text: "Hi, I need to reschedule a pickup for tomorrow." },
      { who: "ai",   text: "Happy to help. Can I get the booking reference, please?" },
      { who: "user", text: "It's NW-48213." },
      { who: "ai",   text: "Found it — pickup at 11 AM. What time works better tomorrow?" },
      { who: "user", text: "Make it 3 PM." },
      { who: "ai",   text: "Done. Pickup moved to 3 PM, confirmation sent by SMS. Anything else?" },
      { who: "caption", text: "Call resolved in 38s · logged to CRM · zero staff time" }
    ];
    var log = $("#voiceLog"), btn = $("#voicePlay"), i = 0, timer = null;
    function step() {
      if (i >= script.length) { btn.textContent = "Replay call"; btn.disabled = false; return; }
      var m = script[i++];
      var b = document.createElement("div");
      b.className = "bubble " + m.who;
      b.textContent = m.text;
      log.appendChild(b);
      log.scrollTop = log.scrollHeight;
      timer = setTimeout(step, m.who === "caption" ? 900 : 1300);
    }
    btn.addEventListener("click", function () {
      clearTimeout(timer); log.innerHTML = ""; i = 0;
      btn.disabled = true; btn.textContent = "Playing…";
      step();
      var check = setInterval(function () {
        if (i >= script.length) { clearInterval(check); }
      }, 300);
    });
  }

  /* ---- DEMO 2: LinkedIn headline optimizer ---- */
  var headlineDemo = $("#headlineDemo");
  if (headlineDemo) {
    var roleKeywords = {
      sales: ["Pipeline Growth", "B2B Revenue", "Enterprise Deals"],
      founder: ["Scaling Startups", "0→1 Builder", "Product-Led Growth"],
      marketing: ["Demand Generation", "Brand Strategy", "Growth Marketing"],
      ops: ["Process Automation", "Operational Excellence", "Cost Optimization"],
      tech: ["AI Engineering", "Cloud Architecture", "Platform Scale"]
    };
    $("#headlineBtn").addEventListener("click", function () {
      var raw  = ($("#headlineInput").value || "").trim();
      var role = $("#headlineRole").value;
      var out  = $("#headlineOut");
      if (!raw) { out.innerHTML = '<p class="form-note" style="color:#ef4444">Enter your current headline first.</p>'; return; }
      var kw = roleKeywords[role] || roleKeywords.ops;
      var title = raw.split(/[|•\-,]/)[0].trim() || raw;
      var optimized = title + " | " + kw[0] + " → " + kw[1] +
        " | Helping companies " + kw[2].toLowerCase() + " with measurable outcomes";
      out.innerHTML =
        '<div class="bubble caption">Optimized headline</div>' +
        '<div class="bubble ai">' + optimized + '</div>' +
        '<p class="post-meta" style="margin-top:8px">Keyword-rich, outcome-led, and search-optimized. ' +
        'A full engagement also rewrites your About, experience and content strategy.</p>';
    });
  }

  /* ---- DEMO 3: lead generation sample ---- */
  var leadDemo = $("#leadDemo");
  if (leadDemo) {
    var pool = [
      { n: "VP of Operations", c: "Mid-market SaaS", s: 96 },
      { n: "Head of IT", c: "Healthcare provider", s: 93 },
      { n: "Director, RevOps", c: "Fintech scale-up", s: 91 },
      { n: "COO", c: "Logistics enterprise", s: 89 },
      { n: "CTO", c: "E-commerce group", s: 87 },
      { n: "Procurement Lead", c: "Manufacturing", s: 84 }
    ];
    $("#leadBtn").addEventListener("click", function () {
      var ind = $("#leadIndustry").value;
      var out = $("#leadOut");
      out.innerHTML = '<div class="chat-typing"><i></i><i></i><i></i></div>';
      setTimeout(function () {
        var rows = pool.slice(0, 4).map(function (p) {
          return '<div class="hv-row" style="background:var(--bg-soft);border-color:var(--border)">' +
            '<div><strong style="color:var(--navy)">' + p.n + '</strong><br>' +
            '<span style="color:var(--mute)">' + p.c + " · " + ind + '</span></div>' +
            '<span class="tag tag-teal">' + p.s + '% fit</span></div>';
        }).join("");
        out.innerHTML = rows +
          '<p class="post-meta" style="margin-top:8px">Sample only — a live engagement delivers ' +
          'verified, enriched contacts matched to your exact ICP.</p>';
      }, 900);
    });
  }

  /* ---- carousel (testimonials & any [data-carousel]) ---- */
  $$("[data-carousel]").forEach(function (root) {
    var track  = $(".carousel-track", root);
    var slides = $$(".carousel-slide", root);
    if (!track || slides.length < 2) return;

    var prev = $(".carousel-arrow.prev", root);
    var next = $(".carousel-arrow.next", root);
    var dotsWrap = $(".carousel-dots", root);
    var autoMs = parseInt(root.getAttribute("data-autoplay"), 10) || 0;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var index = 0, timer = null, dots = [];

    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var d = document.createElement("button");
        d.type = "button";
        d.className = "carousel-dot";
        d.setAttribute("aria-label", "Go to slide " + (i + 1));
        d.addEventListener("click", function () { go(i, true); });
        dotsWrap.appendChild(d);
        dots.push(d);
      });
    }

    function render() {
      track.style.transform = "translateX(" + (-index * 100) + "%)";
      dots.forEach(function (d, i) {
        d.classList.toggle("active", i === index);
        d.setAttribute("aria-selected", String(i === index));
      });
      slides.forEach(function (s, i) { s.setAttribute("aria-hidden", String(i !== index)); });
    }
    function go(i, user) {
      index = (i + slides.length) % slides.length;
      render();
      if (user) restart();
    }
    function start() { if (autoMs && !reduce) timer = setInterval(function () { go(index + 1); }, autoMs); }
    function stop()  { clearInterval(timer); }
    function restart() { stop(); start(); }

    if (prev) prev.addEventListener("click", function () { go(index - 1, true); });
    if (next) next.addEventListener("click", function () { go(index + 1, true); });

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft")  { e.preventDefault(); go(index - 1, true); }
      if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1, true); }
    });

    var x0 = null;
    track.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1), true);
      x0 = null; start();
    }, { passive: true });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });

    render();
    start();
  });

  /* ---- form validation + Netlify Forms submission ---- */
  $$("form[data-validate]").forEach(function (form) {
    var note = $(".form-note", form);
    var submitBtn = $('[type="submit"]', form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      $$("[required]", form).forEach(function (input) {
        var valid = input.value.trim() !== "" &&
          (input.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
        input.classList.toggle("invalid", !valid);
        if (!valid) ok = false;
      });
      if (!ok) {
        if (note) {
          note.style.color = "#ef4444";
          note.textContent = "Please complete the required fields with a valid email.";
        }
        return;
      }

      var success = form.getAttribute("data-success") ||
        "Thank you — we've received your request and will reply within one business day.";

      /* Netlify Forms — submit via AJAX so the inline success message is kept */
      if (form.hasAttribute("data-netlify")) {
        var label = submitBtn ? submitBtn.textContent : "";
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }
        if (note) { note.style.color = "var(--slate)"; note.textContent = "Sending…"; }
        fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(new FormData(form)).toString()
        }).then(function (res) {
          if (!res.ok) throw new Error(String(res.status));
          if (note) { note.style.color = "var(--teal)"; note.textContent = success; }
          form.reset();
        }).catch(function () {
          if (note) {
            note.style.color = "#ef4444";
            note.textContent = "Sorry — the form could not be sent. Please email contact@leadaistudio.com.";
          }
        }).then(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = label; }
        });
        return;
      }

      /* fallback when no form backend is configured */
      if (note) { note.style.color = "var(--teal)"; note.textContent = success; }
      form.reset();
    });
  });

  /* ---- dark / light theme toggle ---- */
  (function () {
    var root = document.documentElement;
    var actions = $(".header-actions");
    function syncMeta() {
      var m = $('meta[name="theme-color"]');
      if (m) m.setAttribute("content", root.getAttribute("data-theme") === "dark" ? "#0b1626" : "#0b1f3d");
    }
    syncMeta();
    if (!actions) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    btn.setAttribute("aria-label", "Toggle dark mode");
    btn.title = "Toggle light / dark theme";
    btn.innerHTML =
      '<svg class="ic-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>' +
      '<svg class="ic-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>';
    btn.addEventListener("click", function () {
      var dark = root.getAttribute("data-theme") === "dark";
      root.setAttribute("data-theme", dark ? "light" : "dark");
      try { localStorage.setItem("theme", dark ? "light" : "dark"); } catch (e) {}
      syncMeta();
    });
    actions.insertBefore(btn, actions.firstChild);
  })();

  /* ---- scroll progress bar ---- */
  (function () {
    var bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
    function upd() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    }
    upd();
    window.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
  })();

  /* ---- back-to-top button ---- */
  (function () {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "to-top";
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
    btn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    document.body.appendChild(btn);
    window.addEventListener("scroll", function () {
      btn.classList.toggle("show", window.scrollY > 600);
    }, { passive: true });
  })();

  /* ---- hero visual: animate progress bars on load ---- */
  $$("[data-bar]").forEach(function (el) {
    var target = el.getAttribute("data-bar") + "%";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.style.width = target; return; }
    el.style.width = "0";
    setTimeout(function () {
      el.style.transition = "width 1.4s cubic-bezier(.22,1,.36,1)";
      el.style.width = target;
    }, 400);
  });

  /* ---- video / product-tour modal ---- */
  (function () {
    var triggers = $$("[data-video]");
    if (!triggers.length) return;
    var modal = document.createElement("div");
    modal.className = "video-modal";
    modal.innerHTML =
      '<div class="vm-inner">' +
      '<button class="vm-close" type="button" aria-label="Close video">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
      '<iframe title="Lead AI Studio product tour" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>' +
      '</div>';
    document.body.appendChild(modal);
    var frame = $("iframe", modal);
    function close() {
      modal.classList.remove("open");
      frame.src = "";
      document.body.style.overflow = "";
    }
    function open(id) {
      frame.src = "https://www.youtube.com/embed/" + id + "?autoplay=1&rel=0";
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
      $(".vm-close", modal).focus();
    }
    triggers.forEach(function (t) {
      t.addEventListener("click", function () { open(t.getAttribute("data-video")); });
      t.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(t.getAttribute("data-video")); }
      });
    });
    $(".vm-close", modal).addEventListener("click", close);
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("open")) close();
    });
  })();

  /* ---- wire up footer legal links ---- */
  $$(".footer-legal a").forEach(function (a) {
    var t = (a.textContent || "").toLowerCase();
    if (t.indexOf("privacy") > -1) a.setAttribute("href", "privacy.html");
    else if (t.indexOf("terms") > -1) a.setAttribute("href", "terms.html");
    else if (t.indexOf("security") > -1) a.setAttribute("href", "security.html");
  });

  /* ---- cookie consent banner ---- */
  var consent = null;
  try { consent = localStorage.getItem("cookieConsent"); } catch (e) {}
  if (!consent) {
    var bar = document.createElement("div");
    bar.className = "cookie-bar";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", "Cookie and privacy notice");
    bar.innerHTML =
      '<h4>We value your privacy</h4>' +
      '<p>We use privacy-friendly, cookieless analytics to understand what’s useful on this site. ' +
      'Read our <a href="privacy.html">Privacy Policy</a>.</p>' +
      '<div class="cookie-actions">' +
      '<button class="btn btn-primary btn-sm" data-cc="accepted">Accept</button>' +
      '<button class="btn btn-outline btn-sm" data-cc="declined">Decline</button>' +
      '</div>';
    document.body.appendChild(bar);
    requestAnimationFrame(function () { bar.classList.add("show"); });
    $$("[data-cc]", bar).forEach(function (b) {
      b.addEventListener("click", function () {
        try { localStorage.setItem("cookieConsent", b.getAttribute("data-cc")); } catch (e) {}
        bar.classList.remove("show");
        setTimeout(function () { bar.remove(); }, 500);
      });
    });
  }

  /* ---- privacy-friendly analytics (Plausible, cookieless) ----
     Register your domain at plausible.io, then this loads automatically.
     Skipped if the visitor declined in the cookie banner. */
  if (consent !== "declined") {
    var an = document.createElement("script");
    an.defer = true;
    an.setAttribute("data-domain", "leadaistudio.com");
    an.src = "https://plausible.io/js/pa-ovpp1_ffCEe9rZ5qwwaYu.js";
    document.head.appendChild(an);
  }
})();
