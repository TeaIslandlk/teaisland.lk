(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const fmt = n => STORE.currency + " " + n.toLocaleString("en-US");
  const waBase = "https://wa.me/" + STORE.whatsapp;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // image with fallback (model photo -> flat mockup)
  function img(src, fallback, alt, cls) {
    return `<img ${cls ? `class="${cls}"` : ""} src="${src}" alt="${esc(alt)}" loading="lazy" ${fallback ? `onerror="this.onerror=null;this.src='${fallback}'"` : ""}>`;
  }
  const firstImg = p => Object.values(p.images)[0];
  const colourKeys = p => Object.keys(p.images);

  /* ---------- basics ---------- */
  $("#announce").textContent = STORE.announcement;
  $("#yr").textContent = new Date().getFullYear();
  const waMsg = txt => waBase + "?text=" + encodeURIComponent(txt);
  $("#heroWa").href = waMsg("Hi Tea Island! I'd like to pre-order a tee.");
  $("#waFloat").href = waMsg("Hi Tea Island!");
  $("#footLinks").innerHTML = [
    `<a href="${waMsg("Hi Tea Island!")}" target="_blank" rel="noopener">WhatsApp ${STORE.whatsappDisplay}</a>`,
    STORE.tiktok && `<a href="${STORE.tiktok}" target="_blank" rel="noopener">TikTok</a>`,
    STORE.instagram && `<a href="${STORE.instagram}" target="_blank" rel="noopener">Instagram</a>`,
    STORE.facebook && `<a href="${STORE.facebook}" target="_blank" rel="noopener">Facebook</a>`
  ].filter(Boolean).join(" · ");

  /* ---------- hero: 3 themes, White/Green only, auto shuffle ---------- */
  const heroCards = HERO.map(tag => {
    const col = COLLECTIONS.find(c => c.tag === tag);
    const picks = PRODUCTS.filter(p => p.tag === tag && (p.images.white || p.images.green));
    // choose the product whose flat image is the collection's hero image, else the first
    const p = picks.find(x => Object.values(x.images).includes(col.image)) || picks[0];
    return { tag, p, model: col.model, flat: col.image };
  });
  const stack = $("#heroStack");
  stack.innerHTML = heroCards.map((c, i) => `
    <figure class="hcard" data-i="${i}">
      ${img(c.model, c.flat, c.p.name, "")}
      <figcaption><span>${c.tag}</span><b>${esc(c.p.name)}</b></figcaption>
    </figure>`).join("");
  let front = 0;
  const hc = [...stack.querySelectorAll(".hcard")];
  function layout() {
    hc.forEach((el, i) => {
      const pos = (i - front + hc.length) % hc.length; // 0 front, 1 mid, 2 back
      el.dataset.pos = pos;
    });
  }
  layout();
  let timer;
  const rotate = () => { front = (front + 1) % hc.length; layout(); };
  const start = () => { stop(); if (!matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(rotate, 3600); };
  const stop = () => clearInterval(timer);
  stack.addEventListener("mouseenter", stop);
  stack.addEventListener("mouseleave", start);
  stack.addEventListener("click", rotate);
  start();

  /* ---------- collection tiles ---------- */
  let tagFilter = "All", colourFilter = "All";
  $("#tiles").innerHTML = COLLECTIONS.map(c => {
    const n = PRODUCTS.filter(p => p.tag === c.tag).length;
    return `<a class="tile" href="#shop" data-tag="${c.tag}">
      ${img(c.model, c.image, c.tag + " collection")}
      <div class="tile-txt"><h3>${c.tag}</h3><p>${c.line}</p><span>${n} tee${n > 1 ? "s" : ""} →</span></div>
    </a>`;
  }).join("");
  $("#tiles").addEventListener("click", e => {
    const t = e.target.closest(".tile"); if (!t) return;
    tagFilter = t.dataset.tag; renderChips(); renderGrid();
  });

  /* ---------- filters + grid ---------- */
  function renderChips() {
    $("#tagChips").innerHTML = ["All", ...COLLECTIONS.map(c => c.tag)]
      .map(t => `<button class="chip ${t === tagFilter ? "on" : ""}" data-tag="${t}">${t}</button>`).join("");
    $("#colourChips").innerHTML = `<button class="chip ${colourFilter === "All" ? "on" : ""}" data-col="All">Any colour</button>` +
      Object.entries(COLOURS).map(([k, c]) =>
        `<button class="dot ${colourFilter === k ? "on" : ""}" data-col="${k}" title="${c.name}" aria-label="${c.name}" style="--c:${c.hex}"></button>`).join("");
  }
  $("#tagChips").addEventListener("click", e => { const b = e.target.closest("[data-tag]"); if (b) { tagFilter = b.dataset.tag; renderChips(); renderGrid(); } });
  $("#colourChips").addEventListener("click", e => { const b = e.target.closest("[data-col]"); if (b) { colourFilter = b.dataset.col; renderChips(); renderGrid(); } });

  function renderGrid() {
    const list = PRODUCTS.filter(p => (tagFilter === "All" || p.tag === tagFilter) && (colourFilter === "All" || p.images[colourFilter]));
    $("#grid").innerHTML = list.length ? list.map(p => {
      const key = colourFilter !== "All" ? colourFilter : colourKeys(p)[0];
      return `<article class="card" data-id="${p.id}" data-col="${key}" tabindex="0">
        <div class="card-img">${img(p.images[key], "", p.name)}${p.badge ? `<span class="badge">${p.badge}</span>` : ""}${p.soldOut ? `<span class="badge out">Sold out</span>` : ""}</div>
        <div class="card-info"><small>${p.tag}</small><h3>${esc(p.name)}</h3>
          <div class="card-foot"><b>${fmt(p.price)}</b>
            <span class="mini">${colourKeys(p).map(k => `<i style="--c:${COLOURS[k].hex}"></i>`).join("")}</span></div></div>
      </article>`;
    }).join("") : `<p class="empty">No tees match that combination yet.</p>`;
  }
  $("#grid").addEventListener("click", e => { const c = e.target.closest(".card"); if (c) openProduct(c.dataset.id, c.dataset.col); });
  $("#grid").addEventListener("keydown", e => { if (e.key === "Enter") { const c = e.target.closest(".card"); if (c) openProduct(c.dataset.id, c.dataset.col); } });
  renderChips(); renderGrid();

  /* ---------- overlays ---------- */
  const open = el => { el.hidden = false; document.body.classList.add("lock"); };
  const close = el => { el.hidden = true; if (![...document.querySelectorAll(".overlay")].some(o => !o.hidden)) document.body.classList.remove("lock"); };
  document.querySelectorAll(".overlay").forEach(o => {
    o.addEventListener("click", e => { if (e.target === o || e.target.closest("[data-close]")) close(o); });
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") document.querySelectorAll(".overlay").forEach(o => !o.hidden && close(o)); });

  /* ---------- product dialog ---------- */
  let cur = null, curCol = null, curSize = null, qty = 1;
  function openProduct(id, col) {
    cur = PRODUCTS.find(p => p.id === id);
    curCol = col && cur.images[col] ? col : colourKeys(cur)[0];
    curSize = null; qty = 1;
    $("#pTag").textContent = cur.tag;
    $("#pName").textContent = cur.name;
    $("#pLine").textContent = cur.line;
    $("#pPrice").textContent = fmt(cur.price);
    $("#pDesc").textContent = cur.desc;
    $("#pQty").textContent = 1; $("#pHint").textContent = "";
    $("#pSizes").innerHTML = STORE.sizes.map(s => `<button type="button" class="size" data-s="${s}">${s}</button>`).join("");
    $("#addBtn").disabled = !!cur.soldOut;
    $("#addBtn").textContent = cur.soldOut ? "Sold out" : "Add to bag";
    paintProduct();
    open($("#pOverlay"));
  }
  function paintProduct() {
    $("#pImg").src = cur.images[curCol]; $("#pImg").alt = cur.name + " in " + COLOURS[curCol].name;
    $("#pColourName").textContent = COLOURS[curCol].name;
    $("#pSwatches").innerHTML = colourKeys(cur).map(k =>
      `<button type="button" class="dot ${k === curCol ? "on" : ""}" data-c="${k}" title="${COLOURS[k].name}" aria-label="${COLOURS[k].name}" style="--c:${COLOURS[k].hex}"></button>`).join("");
    document.querySelectorAll("#pSizes .size").forEach(b => b.classList.toggle("on", b.dataset.s === curSize));
  }
  $("#pSwatches").addEventListener("click", e => { const b = e.target.closest("[data-c]"); if (b) { curCol = b.dataset.c; paintProduct(); } });
  $("#pSizes").addEventListener("click", e => { const b = e.target.closest("[data-s]"); if (b) { curSize = b.dataset.s; $("#pHint").textContent = ""; paintProduct(); } });
  $("#qMinus").onclick = () => { qty = Math.max(1, qty - 1); $("#pQty").textContent = qty; };
  $("#qPlus").onclick = () => { qty = Math.min(20, qty + 1); $("#pQty").textContent = qty; };
  $("#addBtn").onclick = () => {
    if (!curSize) { $("#pHint").textContent = "Please choose a size."; return; }
    const k = [cur.id, curCol, curSize].join("|");
    const ex = cart.find(i => i.k === k);
    if (ex) ex.q += qty; else cart.push({ k, id: cur.id, col: curCol, size: curSize, q: qty });
    saveCart(); renderCart(); close($("#pOverlay")); open($("#cartOverlay"));
  };

  /* ---------- size guide ---------- */
  $("#sgBtn").onclick = () => open($("#sgOverlay"));
  $("#sgTable").innerHTML = `<tr>${STORE.sizeGuideHead.map(h => `<th>${h}</th>`).join("")}</tr>` +
    STORE.sizeGuide.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("");
  $("#sgNote").textContent = STORE.sizeNote;

  /* ---------- bag ---------- */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem("ti_cart") || "[]").filter(i => PRODUCTS.some(p => p.id === i.id && p.images[i.col])); } catch (e) {}
  const saveCart = () => { try { localStorage.setItem("ti_cart", JSON.stringify(cart)); } catch (e) {} };
  const prod = id => PRODUCTS.find(p => p.id === id);
  function totals() {
    const sub = cart.reduce((s, i) => s + prod(i.id).price * i.q, 0);
    const free = STORE.freeDeliveryOver && sub >= STORE.freeDeliveryOver;
    const ship = cart.length ? (free ? 0 : STORE.deliveryFee) : 0;
    return { sub, ship, total: sub + ship };
  }
  function renderCart() {
    const count = cart.reduce((s, i) => s + i.q, 0);
    $("#cartCount").textContent = count;
    if (!cart.length) {
      $("#cartItems").innerHTML = `<p class="empty">Your bag is empty.</p>`;
      $("#cartSum").innerHTML = ""; $("#checkout").hidden = true; return;
    }
    $("#checkout").hidden = false;
    $("#cartItems").innerHTML = cart.map((i, n) => {
      const p = prod(i.id);
      return `<div class="line"><img src="${p.images[i.col]}" alt="">
        <div><b>${esc(p.name)}</b><small>${COLOURS[i.col].name} · ${i.size}</small>
          <div class="qty-row sm"><button data-n="${n}" data-d="-1">−</button><span>${i.q}</span><button data-n="${n}" data-d="1">+</button></div></div>
        <div class="line-r"><b>${fmt(p.price * i.q)}</b><button class="link" data-rm="${n}">Remove</button></div></div>`;
    }).join("");
    const t = totals();
    $("#cartSum").innerHTML = `<div><span>Subtotal</span><span>${fmt(t.sub)}</span></div>
      <div><span>Delivery</span><span>${t.ship ? fmt(t.ship) : "Free"}</span></div>
      <div class="tot"><span>Total</span><span>${fmt(t.total)}</span></div>`;
  }
  $("#cartItems").addEventListener("click", e => {
    const d = e.target.closest("[data-d]"), r = e.target.closest("[data-rm]");
    if (d) { const i = cart[+d.dataset.n]; i.q += +d.dataset.d; if (i.q < 1) cart.splice(+d.dataset.n, 1); }
    if (r) cart.splice(+r.dataset.rm, 1);
    if (d || r) { saveCart(); renderCart(); }
  });
  $("#cartBtn").onclick = () => open($("#cartOverlay"));
  $("#sendBtn").onclick = () => {
    const name = $("#cName").value.trim(), addr = $("#cAddr").value.trim();
    if (!name || !addr) { alert("Please add your name and delivery address."); return; }
    const t = totals();
    const lines = cart.map(i => { const p = prod(i.id); return `• ${p.name} (${COLOURS[i.col].name}, ${i.size}) x${i.q} = ${fmt(p.price * i.q)}`; });
    const msg = `Hi Tea Island! I'd like to order:\n${lines.join("\n")}\n\nSubtotal: ${fmt(t.sub)}\nDelivery: ${t.ship ? fmt(t.ship) : "Free"}\nTotal: ${fmt(t.total)} (cash on delivery)\n\nName: ${name}\nAddress: ${addr}`;
    window.open(waMsg(msg), "_blank", "noopener");
  };
  renderCart();
})();
