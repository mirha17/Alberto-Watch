/* ===== Member 3 JavaScript =====
   1. Visitor counter        5. Technology section (filter + cards)
   2. Date/Time/Location     6. Gallery (filter + lightbox)
      scrolling ticker       7. Support (cards, FAQ, form validation)
   3. Analog clock           8. Extra effects (reveal, counters, back-to-top, active menu)
*/
(function () {
  "use strict";
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  /* ---------- 1. VISITOR COUNTER ---------- */
  function initVisitorCounter() {
    const el = $("#visitorCount");
    if (!el) return;
    const KEY = "alberto_visitor_count";
    let count = 1000; // starting value
    try {
      count = parseInt(localStorage.getItem(KEY), 10) || 1000;
      // ek session (tab) mein sirf ek baar count badhao
      if (!sessionStorage.getItem("alberto_counted")) {
        count++;
        localStorage.setItem(KEY, count);
        sessionStorage.setItem("alberto_counted", "1");
      }
    } catch (e) { /* storage blocked: default value dikhao */ }
    el.textContent = String(count).padStart(6, "0");
    el.classList.add("pop");
  }

  /* ---------- STORE OPEN / CLOSED STATUS ---------- */
  const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const fmtHour = h => (h % 12 || 12) + (h >= 12 ? " PM" : " AM");

  function getStoreStatus() {
    // store ke apne timezone ka waqt (visitor kahin se bhi dekhe, status sahi rahe)
    let now;
    try { now = new Date(new Date().toLocaleString("en-US", { timeZone: STORE.timeZone })); }
    catch (e) { now = new Date(); }
    const day = now.getDay(), mins = now.getHours() * 60 + now.getMinutes();
    const today = STORE.hours[day];
    if (today && mins >= today[0] * 60 && mins < today[1] * 60)
      return { open: true, text: `Store Open Now (closes at ${fmtHour(today[1])})` };
    if (today && mins < today[0] * 60)
      return { open: false, text: `Store Closed (opens today at ${fmtHour(today[0])})` };
    for (let i = 1; i <= 7; i++) {
      const d = (day + i) % 7;
      if (STORE.hours[d])
        return { open: false, text: `Store Closed (opens ${i === 1 ? "tomorrow" : DAY_NAMES[d]} at ${fmtHour(STORE.hours[d][0])})` };
    }
    return { open: false, text: "Store Closed" };
  }

  function renderStoreStatus() {
    const pill = $("#storeStatus");
    if (!pill) return;
    const st = getStoreStatus();
    pill.classList.toggle("open", st.open);
    pill.classList.toggle("closed", !st.open);
    $("#storeStatusText").textContent = st.text;
  }

  /* ---------- 2. TICKER: DATE + TIME + LOCATION + WEATHER + STORE STATUS ---------- */
  let locationText = "Detecting location...";
  let weatherText = "Loading weather...";
  let coords = { lat: STORE.lat, lon: STORE.lon };

  function weatherInfo(code) {
    if (code === 0) return { icon: "☀️", label: "Clear sky" };
    if (code <= 2) return { icon: "⛅", label: "Partly cloudy" };
    if (code === 3) return { icon: "☁️", label: "Overcast" };
    if (code === 45 || code === 48) return { icon: "🌫️", label: "Foggy" };
    if (code >= 51 && code <= 57) return { icon: "🌦️", label: "Drizzle" };
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { icon: "🌧️", label: "Rain" };
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { icon: "❄️", label: "Snow" };
    if (code >= 95) return { icon: "⛈️", label: "Thunderstorm" };
    return { icon: "🌡️", label: "Weather" };
  }

  async function fetchWeather() {
    try {
      // Open-Meteo: free API, API key ki zaroorat nahi
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code&timezone=auto`;
      const r = await fetch(url);
      if (!r.ok) throw new Error("HTTP " + r.status);
      const d = await r.json();
      const w = weatherInfo(d.current.weather_code);
      weatherText = `${w.icon} ${Math.round(d.current.temperature_2m)}°C, ${w.label}`;
    } catch (e) {
      weatherText = "Weather unavailable";
    }
  }

  function updateTicker() {
    const now = new Date();
    const date = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const time = now.toLocaleTimeString("en-US");
    const st = getStoreStatus();
    const msg = `⌚ Welcome to Alberto Watch Company   |   📅 Date: ${date}   |   🕐 Time: ${time}   |   📍 Location: ${locationText}   |   ${weatherText}   |   ${st.open ? "🟢" : "🔴"} ${st.text}`;
    $$(".ticker-item").forEach(i => (i.textContent = msg));
  }

  function fallbackLocation(reason) {
    let tz = "";
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) {}
    locationText = (tz ? tz.replace("_", " ") + " (approx.)" : "Unavailable") + (reason ? " - " + reason : "");
    fetchWeather(); // store ke default coordinates se weather
  }

  function initLocation() {
    /* Location permission is asked ONLY on the home page (body[data-ask-location]) and only once per session.
       The answer is saved, so other pages reuse it without asking again. */
    const KEY = "alberto_loc";
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    if (saved && saved.lat) { coords = { lat: saved.lat, lon: saved.lon }; locationText = saved.text; fetchWeather(); return; }
    if (document.body.dataset.askLocation !== "true") { fallbackLocation(""); return; }
    try {
      if (sessionStorage.getItem("alberto_loc_asked")) { fallbackLocation(""); return; }
      sessionStorage.setItem("alberto_loc_asked", "1");
    } catch (e) {}
    if (!("geolocation" in navigator)) { fallbackLocation("geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords;
        coords = { lat: latitude, lon: longitude };
        locationText = `Lat ${latitude.toFixed(3)}, Lon ${longitude.toFixed(3)}`;
        fetchWeather();
        try {
          // reverse geocoding (city/country naam); fail ho to coordinates hi dikhte rahenge
          const r = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const d = await r.json();
          const place = [d.city || d.locality, d.principalSubdivision, d.countryName].filter(Boolean).join(", ");
          if (place) locationText = place + `  (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`;
        } catch (e) { /* coordinates enough */ }
        try { localStorage.setItem(KEY, JSON.stringify({ lat: latitude, lon: longitude, text: locationText })); } catch (e) {}
      },
      err => fallbackLocation(err.code === 1 ? "permission denied" : "unavailable"),
      { timeout: 10000, maximumAge: 600000 }
    );
  }

  function initTicker() {
    if (!$("#ticker")) return;
    initLocation();
    updateTicker();
    setInterval(updateTicker, 1000);
    setInterval(fetchWeather, 15 * 60 * 1000); // har 15 minute baad weather refresh
  }

  /* ---------- 3. ANALOG CLOCK ---------- */
  function initAnalogClock() {
    const ticks = $("#clockTicks");
    if (!ticks) return;
    let html = "";
    for (let i = 0; i < 12; i++) {
      html += `<line x1="100" y1="10" x2="100" y2="20" stroke="#a47551" stroke-width="3" transform="rotate(${i * 30} 100 100)"/>`;
    }
    ticks.innerHTML = html;
    const tick = () => {
      const n = new Date();
      const s = n.getSeconds(), m = n.getMinutes() + s / 60, h = (n.getHours() % 12) + m / 60;
      $("#sHand").setAttribute("transform", `rotate(${s * 6} 100 100)`);
      $("#mHand").setAttribute("transform", `rotate(${m * 6} 100 100)`);
      $("#hHand").setAttribute("transform", `rotate(${h * 30} 100 100)`);
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- helpers: filter buttons ---------- */
  function buildFilters(container, categories, onChange) {
    container.innerHTML = categories.map((c, i) => `<button class="f-btn${i === 0 ? " active" : ""}" data-cat="${c}">${c}</button>`).join("");
    container.addEventListener("click", e => {
      const b = e.target.closest(".f-btn");
      if (!b) return;
      $$(".f-btn", container).forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      onChange(b.dataset.cat);
    });
  }

  /* ---------- 3. DIGITAL CLOCK ---------- */
function initClock() {
  const box = $("#digitalClock");
  if (!box) return;
  const pad = n => String(n).padStart(2, "0");
  const tick = () => {
    const n = new Date();
    const h = n.getHours();
    $("#dcHours").textContent = pad(h % 12 || 12);
    $("#dcMinutes").textContent = pad(n.getMinutes());
    $("#dcSeconds").textContent = pad(n.getSeconds());
    $("#dcAmPm").textContent = h >= 12 ? "PM" : "AM";
    $("#dcDate").textContent = n.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  };
  tick();
  setInterval(tick, 1000);
}

  /* ---------- 5. TECHNOLOGY ---------- */
  function initTechnology() {
    const grid = $("#techGrid");
    if (!grid) return;
    const render = cat => {
      const list = cat === "All" ? TECH_DATA : TECH_DATA.filter(t => t.cat === cat);
      grid.innerHTML = list.map((t, i) => `
        <div class="col-md-6 col-lg-4" style="animation-delay:${i * 60}ms">
          <div class="tech-card">
            <div class="tech-icon">${t.icon}</div>
            <h5>${t.title}</h5>
            <p>${t.desc}</p>
            <span class="tech-tag">${t.cat}</span>
          </div>
        </div>`).join("");
    };
    buildFilters($("#techFilters"), ["All", ...new Set(TECH_DATA.map(t => t.cat))], render);
    render("All");
  }

  /* ---------- 6. GALLERY + LIGHTBOX ---------- */
  let galleryList = [];
  let lbIndex = 0;

  function initGallery() {
    const grid = $("#galleryGrid");
    if (!grid) return;
    const render = cat => {
      galleryList = cat === "All" ? GALLERY_DATA : GALLERY_DATA.filter(g => g.cat === cat);
      grid.innerHTML = galleryList.map((g, i) => `
        <div class="col-6 col-md-4 col-lg-3" style="animation-delay:${i * 60}ms">
          <div class="g-item" data-i="${i}" tabindex="0" role="button" aria-label="Open ${g.title}">
            <img src="${encodeURI(g.src)}" alt="${g.title}" loading="lazy">
            <div class="g-cap">${g.title}</div>
          </div>
        </div>`).join("");
    };
    buildFilters($("#galleryFilters"), ["All", ...new Set(GALLERY_DATA.map(g => g.cat))], render);
    render("All");

    grid.addEventListener("click", e => {
      const it = e.target.closest(".g-item");
      if (it) openLightbox(+it.dataset.i);
    });
    grid.addEventListener("keydown", e => {
      const it = e.target.closest(".g-item");
      if (it && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openLightbox(+it.dataset.i); }
    });

    $("#lbClose").addEventListener("click", closeLightbox);
    $("#lbPrev").addEventListener("click", () => showLightbox(lbIndex - 1));
    $("#lbNext").addEventListener("click", () => showLightbox(lbIndex + 1));
    $("#lightbox").addEventListener("click", e => { if (e.target.id === "lightbox") closeLightbox(); });
    document.addEventListener("keydown", e => {
      if (!$("#lightbox").classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showLightbox(lbIndex - 1);
      if (e.key === "ArrowRight") showLightbox(lbIndex + 1);
    });
  }
  function showLightbox(i) {
    if (!galleryList.length) return;
    lbIndex = (i + galleryList.length) % galleryList.length;
    const g = galleryList[lbIndex];
    $("#lbImg").src = encodeURI(g.src);
    $("#lbImg").alt = g.title;
    $("#lbCaption").textContent = `${g.title}  (${lbIndex + 1}/${galleryList.length})`;
  }
  function openLightbox(i) {
    showLightbox(i);
    $("#lightbox").classList.add("open");
    $("#lightbox").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    $("#lightbox").classList.remove("open");
    $("#lightbox").setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  /* ---------- 7. SUPPORT ---------- */
  function initSupport() {
    const cards = $("#supportCards");
    if (!cards) return;
    cards.innerHTML = SUPPORT_DATA.map((s, i) => `
      <div class="col-sm-6 col-lg-3 reveal">
        <div class="support-card" role="button" tabindex="0" aria-expanded="false" data-i="${i}"><div class="ic">${s.icon}</div><h5>${s.title}</h5><p>${s.text}</p><span class="more-hint">Click for details &#9662;</span></div>
      </div>`).join("");
    // detail panel (opens below the 4 boxes when a box is clicked)
    const panel = document.createElement("div");
    panel.id = "supportDetail"; panel.className = "support-detail"; panel.hidden = true; panel.setAttribute("aria-live", "polite");
    cards.parentNode.insertBefore(panel, cards.nextSibling);
    const openCard = card => {
      const i = +card.dataset.i, s = SUPPORT_DATA[i];
      const same = card.classList.contains("active");
      $$(".support-card", cards).forEach(c => { c.classList.remove("active"); c.setAttribute("aria-expanded", "false"); });
      if (same) { panel.hidden = true; return; }
      card.classList.add("active"); card.setAttribute("aria-expanded", "true");
      panel.innerHTML = `<h4>${s.icon} ${s.title}</h4><p>${s.intro}</p><ul>${s.points.map(p => `<li>${p}</li>`).join("")}</ul><a class="btn btn-gold" href="${s.href}">${s.cta}</a>`;
      panel.hidden = false;
      panel.classList.remove("pop"); void panel.offsetWidth; panel.classList.add("pop");
    };
    cards.addEventListener("click", e => { const c = e.target.closest(".support-card"); if (c) openCard(c); });
    cards.addEventListener("keydown", e => { if (e.key !== "Enter" && e.key !== " ") return; const c = e.target.closest(".support-card"); if (c) { e.preventDefault(); openCard(c); } });

    const faq = $("#faqList");
    faq.innerHTML = FAQ_DATA.map(f => `
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false"><span>${f.q}</span><span class="arrow">▼</span></button>
        <div class="faq-a">${f.a}</div>
      </div>`).join("");
    faq.addEventListener("click", e => {
      const btn = e.target.closest(".faq-q");
      if (!btn) return;
      const item = btn.parentElement;
      const wasOpen = item.classList.contains("open");
      $$(".faq-item", faq).forEach(x => { x.classList.remove("open"); $(".faq-q", x).setAttribute("aria-expanded", "false"); });
      if (!wasOpen) { item.classList.add("open"); btn.setAttribute("aria-expanded", "true"); }
    });

    initTracker();

    // form validation
    const form = $("#supportForm");
    const setErr = (id, msg) => { $(id).textContent = msg; return !msg; };
    form.addEventListener("submit", e => {
      e.preventDefault();
      const name = $("#sName").value.trim(), email = $("#sEmail").value.trim();
      const type = $("#sType").value, msg = $("#sMsg").value.trim();
      const ok = [
        setErr("#eName", name.length < 3 ? "Please enter your full name (min 3 letters)." : ""),
        setErr("#eEmail", /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? "" : "Please enter a valid email address."),
        setErr("#eType", type ? "" : "Please select an issue type."),
        setErr("#eMsg", msg.length < 10 ? "Message must be at least 10 characters." : "")
      ].every(Boolean);
      const success = $("#formSuccess");
      if (!ok) { success.textContent = ""; return; }

      // naya ticket banao aur save karo
      const id = makeTicketId();
      const all = getTickets();
      all.push({ id, name, email, type, msg, created: Date.now() });
      try { localStorage.setItem(TICKET_KEY, JSON.stringify(all)); } catch (er) {}

      success.textContent = `✅ Thank you, ${name}! Your ticket ID is ${id}. Track it in the Repair Status Tracker above.`;
      form.reset();
      $("#ticketInput").value = id;
      showTicket(id);
    });
  }

  /* ---------- REPAIR STATUS TRACKER ---------- */
  const TICKET_KEY = "alberto_tickets";
  const DEMO_STAGE_MS = 30000; // naye ticket ka status demo ke liye har 30 second mein agle stage par jata hai
  let activeTicket = null;

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function getTickets() {
    try { return JSON.parse(localStorage.getItem(TICKET_KEY) || "[]"); } catch (e) { return []; }
  }
  function makeTicketId() {
    let id;
    const used = new Set([...REPAIR_DATA, ...getTickets()].map(t => t.id));
    do { id = "ALB-" + Math.floor(2000 + Math.random() * 7999); } while (used.has(id));
    return id;
  }
  function findTicket(raw) {
    const id = raw.trim().toUpperCase();
    const demo = REPAIR_DATA.find(t => t.id === id);
    if (demo) return { ...demo };
    const mine = getTickets().find(t => t.id === id);
    if (mine) {
      const stage = Math.min(REPAIR_STAGES.length - 1, Math.floor((Date.now() - mine.created) / DEMO_STAGE_MS));
      return { id: mine.id, customer: mine.name, watch: mine.type, stage, eta: stage === 4 ? "Ready now" : "3-5 working days" };
    }
    return null;
  }
  function showTicket(raw) {
    const box = $("#trackResult");
    const tk = findTicket(raw);
    if (!tk) {
      activeTicket = null;
      box.innerHTML = `<div class="track-error">❌ No ticket found for "${esc(raw.trim())}". Please check the ID and try again.</div>`;
      return;
    }
    activeTicket = tk.id;
    const steps = REPAIR_STAGES.map((s, i) => {
      const cls = i < tk.stage ? "done" : i === tk.stage ? "current" : "";
      return `<li class="${cls}"><div class="bubble">${i < tk.stage ? "✓" : i + 1}</div>${s}</li>`;
    }).join("");
    box.innerHTML = `
      <div class="track-info">
        <div>🎫 Ticket: <b>${esc(tk.id)}</b></div>
        <div>👤 Customer: <b>${esc(tk.customer)}</b></div>
        <div>⌚ Service: <b>${esc(tk.watch)}</b></div>
        <div>⏱️ Estimated: <b>${esc(tk.eta)}</b></div>
      </div>
      <ol class="stepper">${steps}</ol>
      ${tk.stage === 4 ? '<div class="ready-msg">🎉 Your watch is ready! Please visit the store with your ticket ID to collect it.</div>' : ""}`;
  }
  function initTracker() {
    const form = $("#trackForm");
    if (!form) return;
    form.addEventListener("submit", e => {
      e.preventDefault();
      const v = $("#ticketInput").value;
      if (!v.trim()) { $("#trackResult").innerHTML = '<div class="track-error">Please enter a ticket ID.</div>'; return; }
      showTicket(v);
    });
    // agar ticket dikh raha hai to status khud update hota rahe
    setInterval(() => { if (activeTicket) showTicket(activeTicket); }, 5000);
  }

  /* ---------- 8. EXTRA EFFECTS ---------- */
  function initReveal() {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add("show");
        $$(".counter", en.target).forEach(animateCounter);
        obs.unobserve(en.target);
      });
    }, { threshold: 0.15 });
    $$(".reveal").forEach(el => io.observe(el));
  }
  function animateCounter(el) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    const target = +el.dataset.target, dur = 1500, start = performance.now();
    const step = t => {
      const p = Math.min((t - start) / dur, 1);
      el.textContent = Math.floor(p * target).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  function initScrollUI() {
    const toTop = $("#toTop");
    if (!toTop) return;
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    const links = $$(".nav-link-m3");
    const sections = links.map(l => $(l.getAttribute("href"))).filter(Boolean);
    const onScroll = () => {
      toTop.classList.toggle("show", window.scrollY > 400);
      let current = null;
      sections.forEach(s => { if (s.getBoundingClientRect().top <= 120) current = s.id; });
      links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + current));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- START ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initVisitorCounter();
    initTicker();
    initAnalogClock();
    initClock();
    initTechnology();
    initGallery();
    initSupport();
    renderStoreStatus();
    setInterval(renderStoreStatus, 60000);
    initReveal();
    initScrollUI();
  });
})();
