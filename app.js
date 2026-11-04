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

  /* ---------- hero: four people in a fixed boy-girl-boy-girl cycle, photos shuffle forever ---------- */
  // Every card keeps one person (Man A, Woman A, Man B, Woman B), so the visible cards are always four different people.
  // Each time a card slips to the back it swaps to a fresh, shuffled photo of that same person.
  const PEOPLE = ["ma", "wa", "mb", "wb"];
  const pools = {};
  PEOPLE.forEach(k => pools[k] = []);
  PRODUCTS.forEach(p => Object.values(p.images).forEach(list => list.forEach(f => {
    const k = (f.match(/-(m|w)([ab])\.jpg$/) || []).slice(1, 3).join("");
    if (pools[k] && !AVOID_COVER.includes(f)) pools[k].push({ img: f, tag: p.tag, name: p.name });
  })));
  const shuffle = arr => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
  const queues = {};
  const nextPhoto = k => {
    if (!queues[k] || !queues[k].length) {
      const last = queues[k + "_last"];
      queues[k] = shuffle(pools[k].slice());
      if (last && queues[k][queues[k].length - 1].img === last) queues[k].unshift(queues[k].pop());
    }
    const ph = queues[k].pop(); queues[k + "_last"] = ph.img; return ph;
  };
  const stack = $("#heroStack");
  // The line of four cards is always a run of different people: the next person is never one of the two before it,
  // and boys/girls alternate (a rare second girl or boy in a row is allowed for variety, never three).
  const gOf = k => k[0];
  function nextPerson(prev1, prev2) {                  // prev1 = last in line, prev2 = the one before
    let c = PEOPLE.filter(k => k !== prev1 && k !== prev2);
    const alt = c.filter(k => gOf(k) !== gOf(prev1));
    if (alt.length && (Math.random() < 0.85 || gOf(prev1) === gOf(prev2))) c = alt;
    return c[Math.floor(Math.random() * c.length)];
  }
  const start4 = ["ma", "wa", "mb", "wb"];             // opens: Man A, Woman A, Man B, Woman B
  const items = start4.map(k => ({ k, ph: nextPhoto(k) }));
  stack.innerHTML = items.map((s, i) => `
    <figure class="hcard" data-i="${i}">
      <img src="${s.ph.img}" alt="${esc(s.ph.name)}">
      <figcaption><span>${s.ph.tag}</span><b>${esc(s.ph.name)}</b></figcaption>
    </figure>`).join("");
  const hc = [...stack.querySelectorAll(".hcard")];
  let line = [0, 1, 2, 3];                              // card indices, front first
  function layout() { line.forEach((ci, j) => { hc[ci].dataset.pos = Math.min(j, 3); }); }
  layout();
  function paint(ci) {                                  // swap a hidden card to its new photo
    const it = items[ci], el = hc[ci], im = el.querySelector("img");
    const pre = new Image(); pre.onload = () => {
      im.src = it.ph.img; im.alt = it.ph.name;
      el.querySelector("span").textContent = it.ph.tag; el.querySelector("b").textContent = it.ph.name;
    };
    pre.src = it.ph.img;
  }
  let timer;
  const rotate = () => {
    const leaving = line.shift(); line.push(leaving);
    const p1 = items[line[2]].k, p2 = items[line[1]].k;
    const k = nextPerson(p1, p2);
    items[leaving] = { k, ph: nextPhoto(k) };
    layout();
    setTimeout(() => paint(leaving), 1000);
  };
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
      <div class="tile-txt"><h3>${c.tag}</h3><p>${c.line}</p><span>3 colours →</span></div>
    </a>`;
  }).join("");
  /* ---------- tiles shuffle through every photo of their theme ---------- */
  // Rules at every moment: boy, girl, boy, girl across the four tiles; four different people;
  // neighbouring tiles never wear the same tee colour.
  const tileEls = [...document.querySelectorAll("#tiles .tile")];
  const person = f => (f.match(/-([mw][ab])\.jpg$/) || [])[1];
  const colourOf = f => f.split("/").pop().split("-")[1];
  const tilePool = tag => PRODUCTS.filter(p => p.tag === tag).flatMap(p => Object.values(p.images).flat()).filter(f => !AVOID_COVER.includes(f));
  const tileState = COLLECTIONS.map(c => c.model);
  function pickTile(i) {
    const cur = tileState[i];
    const want = i % 2 === 0 ? "m" : "w";
    const others = tileState.filter((_, j) => j !== i).map(person);
    const adj = [tileState[i - 1], tileState[i + 1]].filter(Boolean).map(colourOf);
    const pool = tilePool(COLLECTIONS[i].tag).filter(f => f !== cur && person(f)[0] === want);
    const tiers = [
      pool.filter(f => !others.includes(person(f)) && !adj.includes(colourOf(f))),
      pool.filter(f => !others.includes(person(f))),
      pool
    ];
    const c = tiers.find(t => t.length) || [cur];
    return c[Math.floor(Math.random() * c.length)];
  }
  let tileN = 0;
  const clashing = () => tileEls.map((_, i) => i).filter(i => (i > 0 && colourOf(tileState[i]) === colourOf(tileState[i - 1])) || (i < tileEls.length - 1 && colourOf(tileState[i]) === colourOf(tileState[i + 1])));
  function swapTile() {
    // fix a neighbouring colour clash first, otherwise go round the tiles in turn
    const fix = clashing(), i = fix.length ? fix[Math.floor(Math.random() * fix.length)] : tileN++ % tileEls.length;
    const f = pickTile(i);
    if (f === tileState[i]) return;
    const im = tileEls[i].querySelector("img"), pre = new Image();
    tileState[i] = f;
    pre.onload = () => {
      im.style.opacity = 0;
      setTimeout(() => { im.src = f; im.style.opacity = 1; }, 450);
    };
    pre.src = f;
  }
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) setInterval(swapTile, 3000);

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

  // Cover photo for a card: boys and girls alternate across the grid (checkerboard), varying the model when possible.
  const gender = f => (f.match(/-(m|w)[ab]\.jpg$/) || [])[1];
  function cover(list, n, startBoy) {
    const want = ((n + (startBoy ? 0 : 1)) % 2 === 0) ? "m" : "w";
    const ok = list.filter(f => !AVOID_COVER.includes(f));
    const base = ok.length ? ok : list;
    const pool = base.filter(f => gender(f) === want);
    return (pool.length ? pool[Math.floor(n / 2) % pool.length] : base[0]);
  }
  function renderGrid() {
    const rows = COLLECTIONS.filter(c => tagFilter === "All" || c.tag === tagFilter).map((c, ci) => {
      let n = 0;
      const cards = PRODUCTS.filter(p => p.tag === c.tag).flatMap(p =>
        colourKeys(p).filter(k => colourFilter === "All" || k === colourFilter).map(k => {
          const src = cover(p.images[k], n++, COLLECTIONS.indexOf(c) % 2 === 0);
          return `<article class="card" data-id="${p.id}" data-col="${k}" data-img="${src}" tabindex="0">
        <div class="card-img">${img(src, "", p.name + " in " + COLOURS[k].name)}${p.soldOut ? `<span class="badge out">Sold out</span>` : ""}</div>
        <div class="card-info"><small>${COLOURS[k].name}</small><h3>${esc(p.name)}</h3>
          <div class="card-foot"><b>${fmt(p.price)}</b><span class="mini"><i style="--c:${COLOURS[k].hex}"></i></span></div></div>
      </article>`; })).join("");
      return cards ? `<div class="theme-row"><div class="theme-head"><h3>${c.tag}</h3><p>${c.line}</p></div><div class="theme-cards">${cards}</div></div>` : "";
    }).join("");
    $("#grid").innerHTML = rows || `<p class="empty">No tees match that combination yet.</p>`;
  }
  $("#grid").addEventListener("click", e => { const c = e.target.closest(".card"); if (c) openProduct(c.dataset.id, c.dataset.col, c.dataset.img); });
  $("#grid").addEventListener("keydown", e => { if (e.key === "Enter") { const c = e.target.closest(".card"); if (c) openProduct(c.dataset.id, c.dataset.col, c.dataset.img); } });
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
  let curImg = null;
  function openProduct(id, col, imgSrc) {
    cur = PRODUCTS.find(p => p.id === id);
    curCol = col && cur.images[col] ? col : colourKeys(cur)[0];
    curSize = null; qty = 1;
    curImg = imgSrc && cur.images[curCol].includes(imgSrc) ? imgSrc : cur.images[curCol][0];
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
    if (!cur.images[curCol].includes(curImg)) curImg = cur.images[curCol][0];
    $("#pImg").src = curImg; $("#pImg").alt = cur.name + " in " + COLOURS[curCol].name;
    $("#pColourName").textContent = COLOURS[curCol].name;
    $("#pSwatches").innerHTML = colourKeys(cur).map(k =>
      `<button type="button" class="dot ${k === curCol ? "on" : ""}" data-c="${k}" title="${COLOURS[k].name}" aria-label="${COLOURS[k].name}" style="--c:${COLOURS[k].hex}"></button>`).join("");
    const list = cur.images[curCol];
    $("#pThumbs").innerHTML = list.length > 1 ? list.map(f => `<button type="button" class="thumb ${f === curImg ? "on" : ""}" data-f="${f}" aria-label="Photo"><img src="${f}" alt="" loading="lazy"></button>`).join("") : "";
    document.querySelectorAll("#pSizes .size").forEach(b => b.classList.toggle("on", b.dataset.s === curSize));
  }
  $("#pSwatches").addEventListener("click", e => { const b = e.target.closest("[data-c]"); if (b) { curCol = b.dataset.c; curImg = cur.images[curCol][0]; paintProduct(); } });
  $("#pThumbs").addEventListener("click", e => { const b = e.target.closest("[data-f]"); if (b) { curImg = b.dataset.f; paintProduct(); } });
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
      return `<div class="line"><img src="${p.images[i.col][0]}" alt="">
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
    const msg = `Hi Tea Island! I'd like to order:\n${lines.join("\n")}\n\nSubtotal: ${fmt(t.sub)}\nDelivery: ${t.ship ? fmt(t.ship) : "Free"}\nTotal: ${fmt(t.total)} (pre-order, prepaid by bank transfer)\n\nName: ${name}\nAddress: ${addr}\n\nPlease send me the bank details to complete my pre-order.`;
    window.open(waMsg(msg), "_blank", "noopener");
  };
  const B = STORE.bank || {};
  if (B.accountNumber) {
    $("#bankBox").hidden = false;
    $("#bankBox").innerHTML = `<b>Bank transfer details</b><br>${esc(B.bankName)}${B.branch ? " · " + esc(B.branch) : ""}<br>${esc(B.accountName)}<br>${esc(B.accountNumber)}<br><small>Send the payment slip on WhatsApp to confirm.</small>`;
  }
  renderCart();
})();
