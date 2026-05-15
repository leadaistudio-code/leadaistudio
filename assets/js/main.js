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

  /* ---- generic form validation ---- */
  $$("form[data-validate]").forEach(function (form) {
    var note = $(".form-note", form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      $$("[required]", form).forEach(function (input) {
        var valid = input.value.trim() !== "" &&
          (input.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
        input.classList.toggle("invalid", !valid);
        if (!valid) ok = false;
      });
      if (!note) return;
      if (!ok) {
        note.style.color = "#ef4444";
        note.textContent = "Please complete the required fields with a valid email.";
        return;
      }
      note.style.color = "var(--teal)";
      note.textContent = form.getAttribute("data-success") ||
        "Thank you — we've received your request and will reply within one business day.";
      form.reset();
    });
  });
})();
