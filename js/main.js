/* ===== Alberto Watch Company - site-wide script (jQuery) =====
   Header/nav, collections (search/filter/sort + popup), featured watches,
   store locator, contact form. Other features live in js/member3.js */
$(function () {
  "use strict";
  const rs = n => "Rs " + Number(n).toLocaleString("en-PK");
  const enc = p => encodeURI(p);

  /* ---------- header ---------- */
  $("#navToggle").on("click", function () {
    const open = $("#mainNav").toggleClass("open").hasClass("open");
    $(this).attr("aria-expanded", open).find("i").attr("class", open ? "fa-solid fa-xmark" : "fa-solid fa-bars");
  });
  $("#mainNav a").on("click", () => $("#mainNav").removeClass("open"));
  $(window).on("scroll", () => $(".site-header").toggleClass("scrolled", window.scrollY > 10));

  /* ---------- product card (used on Home + Collections) ---------- */
  const card = (p, i, asLink) => `
    <article class="p-card" tabindex="0" data-id="${p.id}" style="animation-delay:${Math.min(i, 12) * 40}ms" role="button" aria-label="View ${p.name}">
      ${p.badge ? `<span class="p-badge">${p.badge}</span>` : ""}
      <div class="p-img"><img src="${enc(p.image)}" alt="${p.name}" loading="lazy"></div>
      <div class="p-info">
        <span class="p-cat">${p.category}</span>
        <h3 class="p-name">${p.name}</h3>
        <span class="p-price">${rs(p.price)}</span>
      </div>
    </article>`;

  /* ---------- details popup (Bootstrap modal) ---------- */
  function showProduct(id) {
    const p = PRODUCTS.find(x => x.id === +id);
    if (!p || !$("#productModal").length) return;
    $("#pmImg").attr({ src: enc(p.image), alt: p.name });
    $("#pmCat").text(p.category);
    $("#pmName").text(p.name);
    $("#pmDesc").text(p.desc);
    $("#pmPrice").text(rs(p.price));
    $("#pmSpecs").html(Object.entries(p.specs).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join(""));
    $("#pmEnquire").attr("href", "contact.html?watch=" + encodeURIComponent(p.name));
    bootstrap.Modal.getOrCreateInstance("#productModal").show();
  }

  /* ---------- COLLECTIONS PAGE ---------- */
  if ($("#productGrid").length) {
    const params = new URLSearchParams(location.search);
    const cats = ["all", "Vintage", "Luxury", "Smart Watches"];
    if (cats.includes(params.get("cat"))) $("#categoryFilter").val(params.get("cat"));

    function render() {
      const q = $("#searchInput").val().trim().toLowerCase();
      const cat = $("#categoryFilter").val();
      const sort = $("#sortSelect").val();
      let list = PRODUCTS.filter(p => (cat === "all" || p.category === cat) &&
        (!q || (p.name + " " + p.category + " " + p.desc).toLowerCase().includes(q)));
      if (sort === "low-high") list.sort((a, b) => a.price - b.price);
      if (sort === "high-low") list.sort((a, b) => b.price - a.price);
      if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
      $("#productGrid").html(list.map(card).join(""));
      $("#resultCount").text(`Showing ${list.length} timepiece${list.length === 1 ? "" : "s"}`);
      $("#noResults").prop("hidden", list.length > 0);
      $(".cat-pills .f-btn").each(function () { $(this).toggleClass("active", $(this).data("cat") === cat); });
    }
    $("#searchInput").on("input", render);
    $("#categoryFilter,#sortSelect").on("change", render);
    $(".cat-pills").on("click", ".f-btn", function () { $("#categoryFilter").val($(this).data("cat")); render(); });
    render();
    if (params.get("open")) showProduct(params.get("open"));
  }
  $(document).on("click", "#productGrid .p-card", function () { showProduct($(this).data("id")); });
  $(document).on("keydown", "#productGrid .p-card", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showProduct($(this).data("id")); } });

  /* ---------- HOME: featured watches ---------- */
  if ($("#featuredGrid").length) {
    const pick = [0, 14, 28, 4].map(i => PRODUCTS[i]).filter(Boolean);
    $("#featuredGrid").html(pick.map(p => `<div class="col-6 col-lg-3">${card(p, 0).replace('<article class="p-card"', '<article class="p-card h-100"')}</div>`).join(""));
    $("#featuredGrid").on("click", ".p-card", function () { location.href = "collections.html?open=" + $(this).data("id"); });
  }

  /* ---------- STORE LOCATOR ---------- */
  if ($("#storeList").length) {
    const STORES = [
      { name: "Alberto Flagship - Gulshan-e-Iqbal", addr: "47 Tariq Road, Gulshan-e-Iqbal, Karachi, Pakistan", phone: "+92 21 3498 7654", tag: "Flagship", q: "Tariq Road Gulshan-e-Iqbal Karachi" },
      { name: "Alberto Boutique - Clifton", addr: "Boat Basin, Clifton, Karachi, Pakistan", phone: "+92 21 3587 1120", tag: "Boutique", q: "Boat Basin Clifton Karachi" },
      { name: "Alberto Boutique - DHA", addr: "Khayaban-e-Ittehad, DHA Phase 6, Karachi, Pakistan", phone: "+92 21 3584 2200", tag: "Boutique", q: "Khayaban-e-Ittehad DHA Phase 6 Karachi" }
    ];
    const show = i => {
      const s = STORES[i];
      $("#storeList .store-item").removeClass("active").eq(i).addClass("active");
      $("#storeMap").attr("src", "https://www.google.com/maps?q=" + encodeURIComponent(s.q) + "&output=embed");
      $("#directions").attr("href", "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(s.addr));
      $("#storeAddr").text(s.addr);
      $("#storePhone").text(s.phone).attr("href", "tel:" + s.phone.replace(/\s/g, ""));
    };
    $("#storeList").html(STORES.map(s => `<button type="button" class="store-item"><h3>${s.name}</h3><p>${s.addr}<br>${s.phone}</p><span class="tag">${s.tag}</span></button>`).join(""));
    $("#storeList").on("click", ".store-item", function () { show($(this).index()); });
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const fmt = h => (h % 12 || 12) + ":00 " + (h >= 12 ? "PM" : "AM");
    const today = new Date().getDay();
    $("#hoursBody").html([1, 2, 3, 4, 5, 6, 0].map(d => {
      const h = STORE.hours[d];
      return `<tr class="${d === today ? "today" : ""}"><td>${days[d]}</td><td>${h ? fmt(h[0]) + " - " + fmt(h[1]) : "Closed"}</td></tr>`;
    }).join(""));
    show(0);
  }

  /* ---------- CONTACT FORM ---------- */
  if ($("#contactForm").length) {
    const w = new URLSearchParams(location.search).get("watch");
    if (w) $("#cSubject").val("Enquiry about " + w);
    $("#contactForm").on("submit", function (e) {
      e.preventDefault();
      const name = $("#cName").val().trim(), email = $("#cEmail").val().trim(), subj = $("#cSubject").val().trim(), msg = $("#cMessage").val().trim();
      const out = $("#formMessage").removeClass("ok bad");
      if (name.length < 3) return out.addClass("bad").text("Please enter your full name (at least 3 characters).");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return out.addClass("bad").text("Please enter a valid email address.");
      if (subj.length < 3) return out.addClass("bad").text("Please add a subject.");
      if (msg.length < 10) return out.addClass("bad").text("Your message should be at least 10 characters.");
      try {
        const list = JSON.parse(localStorage.getItem("alberto_messages") || "[]");
        list.push({ name, email, subj, msg, at: new Date().toISOString() });
        localStorage.setItem("alberto_messages", JSON.stringify(list));
      } catch (err) { /* storage blocked - still show success */ }
      out.addClass("ok").text("Thank you, " + name.split(" ")[0] + "! Your message has been sent. We will reply within 24 hours.");
      this.reset();
    });
  }
});
