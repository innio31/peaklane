/* ============================================================
   Peak Lane Model School — site behaviour
   Loads editable content from the school's CMS (Website Editor
   in the admin portal) and falls back to config.js if the API
   isn't reachable yet or a block hasn't been created.
   ============================================================ */
(function () {
  "use strict";
  const CFG = window.PLMS_CONFIG;
  const FB = CFG.fallback;
  const state = { content: null };

  /* ---------------------------------------------------------
     Icon set (inline SVG, no external icon font dependency)
  --------------------------------------------------------- */
  const ICONS = {
    cap: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3 2 8l10 5 10-5-10-5Z"/><path d="M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5"/></svg>',
    coin: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M9 12h6M12 9v6"/></svg>',
    heart: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20s-7-4.4-9.5-8.8C1 8 2.5 4.5 6 4a5 5 0 0 1 6 3 5 5 0 0 1 6-3c3.5.5 5 4 3.5 7.2C19 15.6 12 20 12 20Z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5c0 8.3 6.7 15 15 15l3-4-6-2-2 2c-2.5-1-4.5-3-5.5-5.5l2-2-2-6-4 .5Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 6 8 7 8-7"/></svg>',
    pin: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s7-6.3 7-11.5A7 7 0 0 0 5 9.5C5 14.7 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.3"/></svg>',
    fb: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M13.5 21v-8.2h2.7l.4-3.2h-3.1V7.5c0-.9.3-1.6 1.6-1.6h1.7V3.1C15.9 3 14.9 3 13.7 3c-2.5 0-4.2 1.5-4.2 4.3v2.3H6.8v3.2h2.7V21h4Z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/></svg>',
    wa: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3Zm0 16.2c-1.5 0-2.9-.4-4.1-1.1l-.3-.2-2.8.7.7-2.7-.2-.3A7.2 7.2 0 1 1 12 19.2Zm3.9-5.3c-.2-.1-1.3-.6-1.5-.7-.2-.1-.3-.1-.5.1-.1.2-.5.7-.7.8-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.3.1-.5l.4-.4c.1-.1.1-.2.2-.4 0-.1 0-.3 0-.4-.1-.1-.5-1.3-.7-1.7-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.4 3.8 3.3.5.2.9.4 1.3.5.6.2 1.1.1 1.5.1.5-.1 1.3-.5 1.5-1 .2-.5.2-.9.1-1Z"/></svg>'
  };
  function icon(name) { return ICONS[name] || ICONS.cap; }

  /* ---------------------------------------------------------
     Content loading — merges live CMS blocks over the fallback
  --------------------------------------------------------- */
  async function loadContent() {
    try {
      const res = await fetch(`${CFG.apiBase}/get-content.php?school=${encodeURIComponent(CFG.schoolCode)}`, { cache: "no-store" });
      if (!res.ok) throw new Error("bad status");
      const data = await res.json();
      state.content = data;
    } catch (e) {
      state.content = null; // fall back to config.js content only
    }
  }

  function pageBlocks(slug) {
    if (!state.content || !state.content.pages || !state.content.pages[slug]) return [];
    return state.content.pages[slug].filter((b) => b.is_visible !== 0);
  }
  function block(slug, type) {
    return pageBlocks(slug).find((b) => b.block_type === type)?.content || null;
  }

  /* ---------------------------------------------------------
     Shared chrome: header + footer
  --------------------------------------------------------- */
  function renderChrome() {
    document.querySelectorAll("[data-brand-name]").forEach((el) => (el.textContent = CFG.school.shortName));
    document.querySelectorAll("[data-school-name]").forEach((el) => (el.textContent = CFG.school.name));
    document.querySelectorAll("[data-motto]").forEach((el) => (el.textContent = CFG.school.motto));
    document.querySelectorAll("[data-phone-primary]").forEach((el) => {
      el.textContent = CFG.school.phones[0];
      el.href = `tel:${CFG.school.phones[0]}`;
    });
    document.querySelectorAll("[data-phones]").forEach((el) => (el.textContent = CFG.school.phones.join(" · ")));
    document.querySelectorAll("[data-email]").forEach((el) => {
      el.textContent = CFG.school.email;
      if (el.tagName === "A") el.href = `mailto:${CFG.school.email}`;
    });
    document.querySelectorAll("[data-address]").forEach((el) => (el.textContent = CFG.school.address));
    document.querySelectorAll("[data-portal-link]").forEach((el) => (el.href = CFG.portalUrl));
    document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

    // social links
    const social = CFG.school.social || {};
    document.querySelectorAll("[data-social]").forEach((wrap) => {
      wrap.innerHTML = "";
      if (social.facebook) wrap.insertAdjacentHTML("beforeend", `<a href="${social.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${icon("fb")}</a>`);
      if (social.instagram) wrap.insertAdjacentHTML("beforeend", `<a href="${social.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon("ig")}</a>`);
      if (social.whatsapp) wrap.insertAdjacentHTML("beforeend", `<a href="${social.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon("wa")}</a>`);
    });

    // mobile nav toggle
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".nav-toggle");
    if (header && toggle) {
      toggle.addEventListener("click", () => header.classList.toggle("open"));
      document.querySelectorAll(".nav-links a").forEach((a) => a.addEventListener("click", () => header.classList.remove("open")));
    }
  }

  /* ---------------------------------------------------------
     HOME PAGE sections
  --------------------------------------------------------- */
  function renderHero() {
    const el = document.getElementById("hero");
    if (!el) return;
    const c = block("home", "hero") || {};
    const headline = c.headline || `Welcome to <em>${CFG.school.shortName}</em>`;
    const subtext = c.subtext || `A nurturing, disciplined community where curious minds are shaped into confident, capable learners.`;
    const badge = c.badge || `Admissions Open · ${new Date().getFullYear()}/${new Date().getFullYear() + 1} Session`;
    const btnText = c.button_text || "Apply for Admission";
    const btnLink = c.button_link || "admissions.html";
    const btn2Text = c.button_secondary_text || "Explore the School";
    const btn2Link = c.button_secondary_link || "about.html";
    const slides = (c.slides || []).map((s) => s.image_path).filter(Boolean);

    el.innerHTML = `
      <div class="container hero-grid">
        <div data-animate>
          <span class="hero-badge">${badge}</span>
          <h1>${headline}</h1>
          <p class="lead">${subtext}</p>
          <div class="hero-actions">
            <a class="btn btn-gold" href="${btnLink}">${btnText}</a>
            <a class="btn btn-outline" href="${btn2Link}">${btn2Text}</a>
          </div>
          <p class="hero-motto">&ldquo;${CFG.school.motto}&rdquo;</p>
        </div>
        <div class="hero-visual" data-animate>
          <div class="hero-frame" id="heroFrame">
            ${
              slides.length
                ? slides.map((src, i) => `<img src="${src}" class="${i === 0 ? "is-active" : ""}" alt="Peak Lane Model School">`).join("")
                : `<div class="frame-crest"><img src="assets/img/logo.png" class="fallback-crest" alt="Peak Lane Model School crest"></div>`
            }
          </div>
          ${slides.length > 1 ? `<div class="hero-dots" id="heroDots"></div>` : ""}
        </div>
      </div>
      <div class="peak-divider">
        <svg viewBox="0 0 1200 70" preserveAspectRatio="none"><path d="M0 70 240 18 480 55 720 8 960 48 1200 20 1200 70Z" fill="var(--cream)"></path></svg>
      </div>`;

    if (slides.length > 1) {
      let idx = 0;
      const imgs = el.querySelectorAll(".hero-frame img");
      const dotsWrap = el.querySelector("#heroDots");
      slides.forEach((_, i) => dotsWrap.insertAdjacentHTML("beforeend", `<button data-i="${i}" class="${i === 0 ? "is-active" : ""}"></button>`));
      const dots = el.querySelectorAll(".hero-dots button");
      function show(i) {
        imgs.forEach((im, n) => im.classList.toggle("is-active", n === i));
        dots.forEach((d, n) => d.classList.toggle("is-active", n === i));
        idx = i;
      }
      dots.forEach((d) => d.addEventListener("click", () => show(+d.dataset.i)));
      setInterval(() => show((idx + 1) % slides.length), 5000);
    }
  }

  function renderStats() {
    const el = document.getElementById("stats");
    if (!el) return;
    const c = block("home", "stats");
    const stats = (c && c.stats && c.stats.length ? c.stats : FB.stats);
    el.innerHTML = `<div class="container"><div class="stats-grid">${stats
      .map((s) => `<div class="stat" data-animate><div class="num">${s.number}</div><div class="lbl">${s.label}</div></div>`)
      .join("")}</div></div>`;
  }

  function renderFeatures() {
    const el = document.getElementById("features");
    if (!el) return;
    const c = block("home", "features");
    const label = (c && c.label) || "Why Families Choose Us";
    const heading = (c && c.heading) || "Built Around Every Child";
    const sub = (c && c.subheading) || "A well-rounded foundation of care, character and academics.";
    const feats = (c && c.features && c.features.length ? c.features : FB.features);
    el.innerHTML = `
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">${label}</span>
          <h2>${heading}</h2>
          <p>${sub}</p>
        </div>
        <div class="feature-grid">
          ${feats
            .map(
              (f) => `<div class="feature-card" data-animate>
                <div class="feature-icon">${icon(f.icon)}</div>
                <h3>${f.title}</h3><p>${f.description}</p>
              </div>`
            )
            .join("")}
        </div>
      </div>`;
  }

  function renderPrograms() {
    const el = document.getElementById("programs");
    if (!el) return;
    const c = block("home", "programs");
    const label = (c && c.label) || "Levels We Offer";
    const heading = (c && c.heading) || "A Clear Path, From Nursery to Senior Secondary";
    const sub = (c && c.subheading) || "Every stage builds deliberately on the one before it.";
    const progs = (c && c.programs && c.programs.length ? c.programs : FB.programs);
    el.innerHTML = `
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">${label}</span>
          <h2>${heading}</h2>
          <p>${sub}</p>
        </div>
        <div class="program-grid">
          ${progs
            .map(
              (p) => `<div class="program-card" data-animate>
                <span class="age">${p.age}</span>
                <h3>${p.name}</h3><p>${p.description}</p>
              </div>`
            )
            .join("")}
        </div>
      </div>`;
  }

  function renderExtracurricular(targetId, pageSlug) {
    const el = document.getElementById(targetId);
    if (!el) return;
    const c = block(pageSlug, "extracurricular");
    const label = (c && c.label) || "Beyond the Classroom";
    const heading = (c && c.heading) || "Extracurricular Programmes";
    const sub = (c && c.subheading) || "Rounding out academics with skill, teamwork and creativity.";
    const acts = (c && c.activities && c.activities.length ? c.activities : FB.extracurricular);
    el.innerHTML = `
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">${label}</span>
          <h2>${heading}</h2>
          <p>${sub}</p>
        </div>
        <div class="extra-grid">
          ${acts
            .map(
              (a) => `<div class="extra-card" data-animate>
                <div class="extra-emoji">${a.icon}</div>
                <h3>${a.title}</h3><p>${a.description}</p>
              </div>`
            )
            .join("")}
        </div>
      </div>`;
  }

  function renderGallery(targetId, pageSlug, limit) {
    const el = document.getElementById(targetId);
    if (!el) return;
    const c = block(pageSlug, "gallery");
    const label = (c && c.label) || "A Glimpse Into School Life";
    const heading = (c && c.heading) || "Photo Gallery";
    const sub = (c && c.subheading) || "";
    let images = (c && c.images && c.images.length ? c.images : FB.gallery);
    if (!images.length) {
      el.innerHTML = "";
      return; // nothing to show yet — admin hasn't uploaded photos
    }
    if (limit) images = images.slice(0, limit);
    el.innerHTML = `
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">${label}</span>
          <h2>${heading}</h2>
          ${sub ? `<p>${sub}</p>` : ""}
        </div>
        <div class="gallery-grid">
          ${images
            .map((img) => `<a href="${img.image_path}" target="_blank" rel="noopener" data-animate><img src="${img.image_path}" alt="${img.alt || CFG.school.name}" loading="lazy"></a>`)
            .join("")}
        </div>
      </div>`;
  }

  function renderNews() {
    const el = document.getElementById("news");
    if (!el) return;
    const items = (state.content && state.content.news && state.content.news.length ? state.content.news : FB.news);
    if (!items.length) {
      el.innerHTML = "";
      return;
    }
    el.innerHTML = `
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Stay Informed</span>
          <h2>News &amp; Events</h2>
        </div>
        <div class="news-grid">
          ${items
            .slice(0, 3)
            .map((n) => {
              const d = n.event_date || n.created_at;
              const date = d ? new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "";
              return `<div class="news-card" data-animate>
                <div class="news-body">
                  <span class="news-tag">${(n.post_type || "news").toUpperCase()}</span>
                  <h3>${n.title}</h3>
                  <div class="news-date">${date}</div>
                  <p>${(n.content || "").replace(/<[^>]+>/g, "").slice(0, 110)}${n.content && n.content.length > 110 ? "…" : ""}</p>
                </div>
              </div>`;
            })
            .join("")}
        </div>
      </div>`;
  }

  function renderCTA(targetId, pageSlug, fallbackText) {
    const el = document.getElementById(targetId);
    if (!el) return;
    const c = block(pageSlug, "cta");
    const heading = (c && c.heading) || fallbackText.heading;
    const body = (c && c.body) || fallbackText.body;
    const btn1 = (c && c.button_text) || fallbackText.btn1;
    const link1 = (c && c.button_link) || fallbackText.link1;
    const btn2 = (c && c.button_secondary_text) || fallbackText.btn2;
    const link2 = (c && c.button_secondary_link) || fallbackText.link2;
    el.innerHTML = `
      <div class="container">
        <div class="cta-banner" data-animate>
          <div><h2>${heading}</h2><p>${body}</p></div>
          <div class="cta-actions">
            <a class="btn btn-gold" href="${link1}">${btn1}</a>
            ${btn2 ? `<a class="btn btn-outline" href="${link2}">${btn2}</a>` : ""}
          </div>
        </div>
      </div>`;
  }

  function renderTwoCol(targetId, pageSlug, reverse, fallbackData) {
    const el = document.getElementById(targetId);
    if (!el) return;
    const c = block(pageSlug, "two_col") || fallbackData;
    if (!c) return;
    const list = c.list_items && c.list_items.length ? c.list_items : (fallbackData ? fallbackData.list_items : []);
    el.innerHTML = `
      <div class="container">
        <div class="two-col ${reverse ? "reverse" : ""}">
          <div class="two-col-media" data-animate>
            <img src="${c.image_path || "assets/img/logo.png"}" alt="${c.image_alt || CFG.school.name}">
          </div>
          <div class="two-col-body" data-animate>
            <span class="eyebrow">${c.label || ""}</span>
            <h2>${c.heading || ""}</h2>
            <p>${c.body || ""}</p>
            ${list && list.length ? `<ul class="two-col-list">${list.map((li) => `<li>${li}</li>`).join("")}</ul>` : ""}
            ${c.button_text ? `<a class="btn btn-navy" style="margin-top:24px" href="${c.button_link || "#"}">${c.button_text}</a>` : ""}
          </div>
        </div>
      </div>`;
  }

  function renderContact() {
    const el = document.getElementById("contact");
    if (!el) return;
    const c = block("home", "contact") || {};
    document.querySelectorAll("[data-contact-heading]").forEach((e) => (e.textContent = c.heading || "Get in Touch"));
    document.querySelectorAll("[data-contact-sub]").forEach((e) => (e.textContent = c.subheading || "Have a question? Send us a message and we'll respond promptly."));
  }

  /* ---------------------------------------------------------
     Forms — POST to the shared multi-tenant API, scoped by
     schoolCode, and mirrored straight into the admin portal
     (admission_applications / contact_messages tables).
  --------------------------------------------------------- */
  function setStatus(box, ok, msg) {
    box.textContent = msg;
    box.className = `form-status show ${ok ? "ok" : "err"}`;
  }

  function wireAdmissionForm() {
    const form = document.getElementById("admissionForm");
    if (!form) return;

    const levelSelect = form.querySelector("#applying_level");
    if (levelSelect) {
      levelSelect.innerHTML = `<option value="">Select a level…</option>` + CFG.applyingLevels.map((l) => `<option value="${l}">${l}</option>`).join("");
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = document.getElementById("admissionStatus");
      const btn = form.querySelector("button[type=submit]");
      const payload = Object.fromEntries(new FormData(form).entries());
      payload.school = CFG.schoolCode;
      btn.disabled = true;
      btn.textContent = "Submitting…";
      try {
        const res = await fetch(`${CFG.apiBase}/submit-admission.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setStatus(status, true, `Thank you! Your application has been received${data.application_number ? ` (Ref: ${data.application_number})` : ""}. Our admissions team will contact you shortly.`);
          form.reset();
        } else {
          setStatus(status, false, data.message || "We couldn't submit your application. Please check the form and try again, or call us directly.");
        }
      } catch (err) {
        setStatus(status, false, "We couldn't reach the server. Please try again, or call us directly at " + CFG.school.phones[0] + ".");
      } finally {
        btn.disabled = false;
        btn.textContent = "Submit Application";
      }
    });
  }

  function wireContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = document.getElementById("contactStatus");
      const btn = form.querySelector("button[type=submit]");
      const payload = Object.fromEntries(new FormData(form).entries());
      payload.school = CFG.schoolCode;
      btn.disabled = true;
      btn.textContent = "Sending…";
      try {
        const res = await fetch(`${CFG.apiBase}/submit-contact.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setStatus(status, true, "Message sent — thank you! We'll get back to you shortly.");
          form.reset();
        } else {
          setStatus(status, false, data.message || "We couldn't send your message. Please try again.");
        }
      } catch (err) {
        setStatus(status, false, "We couldn't reach the server. Please try again, or call us directly at " + CFG.school.phones[0] + ".");
      } finally {
        btn.disabled = false;
        btn.textContent = "Send Message";
      }
    });
  }

  /* ---------------------------------------------------------
     ABOUT PAGE (mostly config-driven — see README for how to
     extend these into full CMS block types later)
  --------------------------------------------------------- */
  function renderAboutExtras() {
    const timeline = document.getElementById("timeline");
    if (timeline) {
      const items = FB.milestones;
      timeline.innerHTML = items
        .map((m) => `<div class="timeline-item" data-animate><span class="timeline-year">${m.year}</span><h4>${m.title}</h4><p>${m.description}</p></div>`)
        .join("");
    }
    const values = document.getElementById("values");
    if (values) {
      values.innerHTML = FB.values
        .map((v, i) => `<div class="value-card" data-animate><div class="glyph">${i + 1}</div><h4>${v.title}</h4><p>${v.description}</p></div>`)
        .join("");
    }
    const leaders = document.getElementById("leadership");
    if (leaders) {
      leaders.innerHTML = FB.leadership
        .map(
          (l) => `<div class="leader-card" data-animate>
            <div class="leader-photo">${l.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div>
            <h4>${l.name}</h4><div class="role">${l.role}</div><p class="bio">${l.bio}</p>
          </div>`
        )
        .join("");
    }
    const awards = document.getElementById("awards");
    if (awards) {
      awards.innerHTML = FB.awards
        .map((a) => `<div class="award-card" data-animate><div class="trophy">🏆</div><p>${a}</p></div>`)
        .join("");
    }
    const why = document.getElementById("whyChooseUs");
    if (why) {
      why.innerHTML = FB.whyChooseUs.map((w) => `<li>${w}</li>`).join("");
    }
  }

  /* ---------------------------------------------------------
     Scroll-reveal + active nav
  --------------------------------------------------------- */
  function initReveal() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-animate]").forEach((el) => el.classList.add("in-view"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll("[data-animate]").forEach((el) => io.observe(el));
  }

  function markActiveNav() {
    const path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach((a) => {
      const href = a.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) a.classList.add("active");
    });
  }

  /* ---------------------------------------------------------
     Boot
  --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", async () => {
    renderChrome();
    markActiveNav();
    await loadContent();

    // Home page sections
    renderHero();
    renderStats();
    renderFeatures();
    renderPrograms();
    renderTwoCol("about-teaser", "home", false, {
      label: "About Peak Lane",
      heading: "The Epitome of Knowledge",
      body: CFG.school.name + " is a community of learners dedicated to nurturing curiosity, creativity and critical thinking — building strong, disciplined foundations from Crèche through Senior Secondary.",
      list_items: ["Founded in " + CFG.school.founded, "Nursery to Senior Secondary, all on one campus", "A safe, values-driven learning environment"],
      button_text: "Learn More About Us",
      button_link: "about.html",
      image_path: "assets/img/logo.png"
    });
    renderExtracurricular("extracurricular", "home");
    renderGallery("gallery", "home", 8);
    renderNews();
    renderCTA("cta", "home", {
      heading: "Ready to Give Your Child the Best Start?",
      body: "Admission is open for the " + new Date().getFullYear() + "/" + (new Date().getFullYear() + 1) + " session. Spaces are limited.",
      btn1: "Start Your Application",
      link1: "admissions.html",
      btn2: "Contact Us",
      link2: "#contact"
    });
    renderContact();
    wireAdmissionForm();
    wireContactForm();

    // About page sections
    renderAboutExtras();
    renderGallery("aboutGallery", "about", 8);

    initReveal();
  });
})();
