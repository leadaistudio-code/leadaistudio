/* ===================================================================
   Lead AI Studio — rule-based FAQ chatbot ("Ada")
   Self-injecting widget. Loads on every page. No backend required.
   Designed so the answer engine can later be swapped for an AI backend.
   =================================================================== */
(function () {
  "use strict";

  /* ---------------- knowledge base ----------------
     Each topic: keywords for free-text matching + a reply +
     follow-up quick replies. Keep answers short and action-oriented. */
  var KB = {
    services: {
      label: "Our services",
      keywords: ["service", "services", "offer", "do you do", "what do you", "solutions", "help with"],
      reply: "Lead AI Studio delivers enterprise AI across 7 core areas:<br><br>" +
        "• <strong>Secure Enterprise AI</strong> — guardrails &amp; zero-data-retention<br>" +
        "• <strong>AI Workflow Automation</strong><br>" +
        "• <strong>RAG + Knowledge AI</strong><br>" +
        "• <strong>AI Cost Optimization</strong> (LLM cost, token reduction)<br>" +
        "• <strong>LLMOps &amp; Governance</strong><br>" +
        "• <strong>Private AI Infrastructure</strong> (AWS Bedrock)<br>" +
        "• <strong>AI Agents for Operations</strong><br><br>" +
        "Plus growth services: lead generation, LinkedIn search &amp; optimization, and voice assistants.",
      quick: ["security", "pricing", "cost optimization", "book a demo"]
    },
    security: {
      label: "Security & data",
      keywords: ["secure", "security", "safe", "data", "privacy", "guardrail", "compliance", "compliant", "gdpr", "soc", "retention", "confidential"],
      reply: "Security is built in from day one:<br><br>" +
        "• <strong>Zero-data-retention</strong> AI pipelines — your data is never used to train models<br>" +
        "• <strong>AI guardrails</strong> &amp; validation to prevent unsafe or off-policy outputs<br>" +
        "• <strong>Private deployments</strong> in your own VPC / AWS Bedrock<br>" +
        "• Encryption in transit &amp; at rest, role-based access, full audit trails<br>" +
        "• Compliance-ready: SOC 2, GDPR and ISO 42001 alignment<br><br>" +
        "Corporate clients stay fully in control of their databases.",
      quick: ["private infrastructure", "governance", "book a demo"]
    },
    cost: {
      label: "AI cost optimization",
      keywords: ["cost", "cheap", "expensive", "save money", "token", "optimize", "optimization", "budget", "spend", "reduce"],
      reply: "Our <strong>AI Cost Optimization</strong> typically cuts LLM spend 40–70% via:<br><br>" +
        "• Multi-model orchestration — route each task to the cheapest capable model<br>" +
        "• Token reduction &amp; prompt compression<br>" +
        "• AI gateway systems with caching &amp; rate control<br>" +
        "• Real-time cost observability per team, feature and model<br><br>" +
        "It usually pays for itself within the first quarter.",
      quick: ["governance", "pricing", "book a demo"]
    },
    governance: {
      label: "LLMOps & governance",
      keywords: ["llmops", "govern", "governance", "observability", "monitor", "evaluation", "validation", "hallucination", "ops", "reliable", "quality"],
      reply: "<strong>LLMOps &amp; Governance</strong> keeps AI reliable and accountable:<br><br>" +
        "• AI observability — latency, cost, quality &amp; drift monitoring<br>" +
        "• Validation pipelines &amp; eval harnesses before anything ships<br>" +
        "• Hallucination-reduction systems and grounding checks<br>" +
        "• Enterprise AI governance — policies, approvals, audit logs<br><br>" +
        "You get production AI you can trust and defend.",
      quick: ["security", "private infrastructure", "book a demo"]
    },
    infra: {
      label: "Private AI infrastructure",
      keywords: ["infrastructure", "infra", "bedrock", "aws", "private", "vpc", "host", "deploy", "gateway", "on-prem"],
      reply: "We build <strong>Private AI Infrastructure</strong> that runs inside your own cloud:<br><br>" +
        "• AWS Bedrock architecture &amp; secure landing zones<br>" +
        "• AI gateway systems for routing, caching and policy control<br>" +
        "• VPC-isolated, private model endpoints<br>" +
        "• Scalable, observable, and fully owned by you<br><br>" +
        "Nothing sensitive leaves your environment.",
      quick: ["security", "cost optimization", "book a demo"]
    },
    agents: {
      label: "AI agents for operations",
      keywords: ["agent", "agents", "operations", "service desk", "incident", "devops", "ticket", "support", "root cause", "command center", "automation", "automate", "workflow"],
      reply: "Our <strong>AI Agents for Operations</strong> take work off your team:<br><br>" +
        "• AI Service Desk agents &amp; ticket summarization<br>" +
        "• Incident management copilots &amp; root-cause analysis<br>" +
        "• AI DevOps assistants &amp; operations command centers<br>" +
        "• End-to-end AI workflow automation<br><br>" +
        "Always with a human-in-the-loop and clear handoffs.",
      quick: ["pricing", "rag", "book a demo"]
    },
    rag: {
      label: "RAG + Knowledge AI",
      keywords: ["rag", "knowledge", "search", "documents", "retrieval", "chatbot", "knowledge base", "wiki"],
      reply: "<strong>RAG + Knowledge AI</strong> turns your private knowledge into trustworthy answers:<br><br>" +
        "• Retrieval-augmented generation over your docs, wikis &amp; databases<br>" +
        "• Grounded, cited responses with hallucination reduction<br>" +
        "• Secure connectors and access controls<br><br>" +
        "Great for internal assistants and customer-facing support.",
      quick: ["agents", "security", "book a demo"]
    },
    growth: {
      label: "Lead gen & LinkedIn",
      keywords: ["lead", "leads", "linkedin", "prospect", "sales", "outreach", "profile", "voice", "voice assistant", "call"],
      reply: "For growth teams (great for small businesses too):<br><br>" +
        "• <strong>Lead Generation</strong> — AI-built, enriched, ICP-matched pipelines<br>" +
        "• <strong>LinkedIn Search</strong> — pinpoint decision-makers fast<br>" +
        "• <strong>LinkedIn Profile Optimization</strong> — convert-ready profiles<br>" +
        "• <strong>AI Voice Assistance</strong> — 24/7 calls, booking &amp; qualification<br><br>" +
        "Try the live demos on our Services page.",
      quick: ["pricing", "book a demo", "our services"]
    },
    pricing: {
      label: "Pricing",
      keywords: ["price", "pricing", "cost to", "how much", "quote", "plan", "plans", "package", "tier", "budget", "afford"],
      reply: "We have plans for every size:<br><br>" +
        "• <strong>Launch</strong> — for small offices &amp; SOHO, fixed monthly<br>" +
        "• <strong>Growth</strong> — most popular, for scaling teams<br>" +
        "• <strong>Enterprise</strong> — custom, private infrastructure &amp; governance<br><br>" +
        "Most engagements start with a fixed-price 2-week pilot so you can prove value with low risk. See the Pricing page for details.",
      quick: ["book a demo", "pilot", "our services"],
      links: [{ text: "View pricing", href: "pricing.html" }]
    },
    pilot: {
      label: "Pilot / proof of concept",
      keywords: ["pilot", "poc", "proof of concept", "trial", "try", "test", "start small", "low risk"],
      reply: "Our <strong>2-week pilot</strong> is the easiest way to start:<br><br>" +
        "• Fixed price, clearly scoped to one high-impact use case<br>" +
        "• You keep the results and the working prototype<br>" +
        "• A measurable outcome before any larger commitment<br><br>" +
        "It's the lowest-risk way to see AI working on your data.",
      quick: ["book a demo", "pricing", "security"]
    },
    integrations: {
      label: "Integrations",
      keywords: ["integrat", "connect", "tools", "stack", "salesforce", "hubspot", "slack", "crm", "microsoft", "google", "api"],
      reply: "We integrate with the tools you already use — Salesforce, HubSpot, Slack, Microsoft 365, Google Workspace, Jira, ServiceNow, Zapier and more, plus your databases via secure APIs.<br><br>No rip-and-replace required.",
      quick: ["security", "book a demo", "our services"]
    },
    process: {
      label: "How we work",
      keywords: ["how do you work", "process", "timeline", "how long", "steps", "approach", "get started", "getting started", "begin", "onboard"],
      reply: "Four steps: <strong>Assess → Design → Deploy → Optimize</strong>.<br><br>" +
        "We map your workflows, find the fastest ROI, build securely with guardrails, integrate with your stack, then monitor and improve. Most pilots deliver a working result within 2 weeks.",
      quick: ["pilot", "book a demo", "pricing"]
    },
    demo: {
      label: "Book a demo",
      keywords: ["demo", "book", "call", "meeting", "consult", "talk", "speak", "contact", "human", "person", "sales", "reach"],
      reply: "Great — let's set up a free consultation. We'll review your workflows and show where AI cuts cost and lifts performance, securely.<br><br>You can book directly on our contact page, or email <strong>hello@leadaistudio.com</strong>.",
      quick: ["pricing", "our services", "security"],
      links: [{ text: "Book a demo →", href: "contact.html" }]
    }
  };

  var GREETING = "Hi, I'm Ada — the Lead AI Studio assistant. 👋<br>Ask me about our services, security, pricing, or book a demo. What brings you here today?";
  var FALLBACK = "I'm not certain I caught that. I can help with our <strong>services</strong>, <strong>security &amp; data</strong>, <strong>cost optimization</strong>, <strong>pricing</strong>, or <strong>booking a demo</strong> — pick one below, or rephrase your question.";

  /* keyword -> topic resolver */
  function resolve(text) {
    var t = (" " + text.toLowerCase() + " ");
    var best = null, bestScore = 0;
    Object.keys(KB).forEach(function (key) {
      var score = 0;
      KB[key].keywords.forEach(function (kw) {
        if (t.indexOf(kw) !== -1) score += kw.split(" ").length;
      });
      if (score > bestScore) { bestScore = score; best = key; }
    });
    return best;
  }

  /* quick-reply label -> topic key */
  var QUICK_MAP = {
    "our services": "services", "services": "services", "security": "security",
    "security & data": "security", "pricing": "pricing", "book a demo": "demo",
    "cost optimization": "cost", "governance": "governance",
    "private infrastructure": "infra", "agents": "agents", "rag": "rag",
    "pilot": "pilot", "integrations": "integrations"
  };

  /* ---------------- build DOM ---------------- */
  var launcher = document.createElement("button");
  launcher.className = "chat-launcher";
  launcher.setAttribute("aria-label", "Open chat assistant");
  launcher.innerHTML =
    '<span class="badge">1</span>' +
    '<svg class="ic-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z"/></svg>' +
    '<svg class="ic-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';

  var panel = document.createElement("div");
  panel.className = "chat-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Chat with Lead AI Studio assistant");
  panel.innerHTML =
    '<div class="chat-header">' +
      '<div class="avatar">A</div>' +
      '<div><strong>Ada · AI Assistant</strong><span>Usually replies instantly</span></div>' +
    '</div>' +
    '<div class="chat-log" id="chatLog" aria-live="polite"></div>' +
    '<div class="chat-quick" id="chatQuick"></div>' +
    '<form class="chat-input" id="chatForm">' +
      '<input type="text" id="chatInput" placeholder="Type your question…" autocomplete="off" aria-label="Type your question" />' +
      '<button type="submit" aria-label="Send message">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>' +
      '</button>' +
    '</form>';

  document.addEventListener("DOMContentLoaded", function () {
    document.body.appendChild(launcher);
    document.body.appendChild(panel);
    init();
  });

  function init() {
    var log   = panel.querySelector("#chatLog");
    var quick = panel.querySelector("#chatQuick");
    var form  = panel.querySelector("#chatForm");
    var input = panel.querySelector("#chatInput");
    var greeted = false;

    function scroll() { log.scrollTop = log.scrollHeight; }

    function addMsg(html, who) {
      var el = document.createElement("div");
      el.className = "chat-msg " + who;
      el.innerHTML = html;
      log.appendChild(el);
      scroll();
    }

    function typing(done) {
      var t = document.createElement("div");
      t.className = "chat-msg bot chat-typing";
      t.innerHTML = "<i></i><i></i><i></i>";
      log.appendChild(t);
      scroll();
      setTimeout(function () { t.remove(); done(); }, 650);
    }

    function setQuick(labels) {
      quick.innerHTML = "";
      (labels || ["Our services", "Security", "Pricing", "Book a demo"]).forEach(function (label) {
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = label;
        b.addEventListener("click", function () { handle(label); });
        quick.appendChild(b);
      });
    }

    function answerTopic(key) {
      var topic = KB[key];
      typing(function () {
        var html = topic.reply;
        if (topic.links) {
          topic.links.forEach(function (l) {
            html += '<br><a class="link-arrow" href="' + l.href + '">' + l.text + '</a>';
          });
        }
        addMsg(html, "bot");
        var labels = (topic.quick || []).map(function (q) {
          return q.replace(/\b\w/g, function (c) { return c.toUpperCase(); });
        });
        setQuick(labels.length ? labels : null);
      });
    }

    function handle(text) {
      text = (text || "").trim();
      if (!text) return;
      addMsg(text.replace(/</g, "&lt;"), "user");
      var key = QUICK_MAP[text.toLowerCase()] || resolve(text);
      if (key && KB[key]) {
        answerTopic(key);
      } else {
        typing(function () {
          addMsg(FALLBACK, "bot");
          setQuick(["Our services", "Security", "Pricing", "Book a demo"]);
        });
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = input.value;
      input.value = "";
      handle(v);
    });

    function openPanel() {
      panel.classList.add("open");
      launcher.classList.add("open");
      launcher.setAttribute("aria-label", "Close chat assistant");
      var badge = launcher.querySelector(".badge");
      if (badge) badge.style.display = "none";
      if (!greeted) {
        greeted = true;
        typing(function () {
          addMsg(GREETING, "bot");
          setQuick(["Our services", "Security", "Pricing", "Book a demo"]);
        });
      }
      setTimeout(function () { input.focus(); }, 280);
    }
    function closePanel() {
      panel.classList.remove("open");
      launcher.classList.remove("open");
      launcher.setAttribute("aria-label", "Open chat assistant");
    }

    launcher.addEventListener("click", function () {
      panel.classList.contains("open") ? closePanel() : openPanel();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("open")) closePanel();
    });
  }
})();
