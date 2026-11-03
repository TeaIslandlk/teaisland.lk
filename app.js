(function () {
  const $ = (id) => document.getElementById(id);
  const money = (n) => STORE.currency + " " + n.toLocaleString("en-US");
  const KEY = "teaisland-cart-v1";
  const prod = (id) => PRODUCTS.find((p) => p.id === id);
  const sizesOf = (p) => p.sizes || STORE.sizes;

  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} };

  // ---------- t-shirt preview art (used when a product has no photo) ----------
  const leaf = (x, y, s, r) =>
    `<path transform="translate(${x} ${y}) rotate(${r}) scale(${s})" d="M0 0 Q11 -14 0 -32 Q-11 -14 0 0Z"/>`;

  function motifSvg(m, ink) {
    const f = `fill="${ink}"`, st = `fill="none" stroke="${ink}" stroke-width="2" stroke-linecap="round"`;
    switch (m) {
      case "leaves": {
        let o = "";
        for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++)
          o += leaf(118 + c * 32, 112 + r * 30, 0.55, (r + c) % 2 ? 25 : -25);
        return `<g ${f}>${o}</g>`;
      }
      case "sprout":
        return `<g ${f}><path d="M150 190 Q150 160 150 130" ${st}/>${leaf(150, 135, 0.9, -30)}${leaf(150, 150, 0.75, 40)}</g>`;
      case "cup":
        return `<g ${st}><path d="M118 140 h64 v22 q0 24 -32 24 q-32 0 -32 -24z"/><path d="M182 148 q16 0 16 12 q0 12 -16 12"/><path d="M135 128 q6 -10 0 -18 M150 128 q6 -10 0 -18 M165 128 q6 -10 0 -18"/></g>`;
      case "branch":
        return `<g ${f}><path d="M150 195 Q140 150 160 105" ${st}/>${leaf(146, 160, 0.6, -50)}${leaf(150, 145, 0.6, 50)}${leaf(155, 125, 0.55, -45)}${leaf(160, 108, 0.7, 10)}</g>`;
      case "circle":
        return `<g ${st}><circle cx="150" cy="145" r="42"/></g><g ${f}>${leaf(150, 168, 0.9, 0)}${leaf(150, 168, 0.55, 60)}${leaf(150, 168, 0.55, -60)}</g>`;
      case "logo":
        return `<text x="150" y="190" text-anchor="middle" font-family="Cormorant Garamond,serif" font-weight="700" font-size="110" fill="${ink}">T</text>`;
    }
    return "";
  }

  // preserveAspectRatio "slice" makes the drawing fill its box (no empty side bands)
  function teeSvg(p) {
    return `<svg viewBox="0 0 300 320" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${p.name}">
      <rect width="300" height="320" fill="#efeadb"/>
      <path d="M95 22 L60 36 L10 86 L45 121 L75 101 L75 296 Q75 302 81 302 L219 302 Q225 302 225 296 L225 101 L255 121 L290 86 L240 36 L205 22 Q150 58 95 22Z" fill="${p.color}" stroke="rgba(0,0,0,.18)" stroke-width="1.5"/>
      <path d="M95 22 Q150 58 205 22" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="3"/>
      ${motifSvg(p.motif, p.ink)}
    </svg>`;
  }
  const pic = (p) => p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy">` : teeSvg(p);

  // ---------- static page bits ----------
  $("announce").textContent = STORE.announcement || "";
  if (!STORE.announcement) $("announce").classList.add("hidden");

  $("heroArt").innerHTML = (STORE.heroIds || []).map(prod).filter(Boolean)
    .map((p) => `<div class="t">${pic(p)}</div>`).join("");

  $("trust").innerHTML = STORE.trust.map(([a, b]) => `<div><b>${a}</b><span>${b}</span></div>`).join("");

  $("tiles").innerHTML = COLLECTIONS.map((c) => {
    const n = PRODUCTS.filter((p) => p.tag === c.tag).length;
    const hp = prod(c.heroId) || PRODUCTS.find((p) => p.tag === c.tag);
    return `<button class="tile" data-tag="${c.tag}" type="button">
      <div class="art">${hp ? pic(hp) : ""}</div>
      <div class="cap"><b>${c.title}</b><span>${c.line}</span><br><i>${n} ${n === 1 ? "tee" : "tees"} &rarr;</i></div>
    </button>`;
  }).join("");

  if (REVIEWS.length) {
    $("reviews").classList.remove("hidden");
    $("reviewList").innerHTML = REVIEWS.map((r) =>
      `<div class="review"><div class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p>${r.text}</p><b>${r.name}</b></div>`).join("");
  }

  if (STORE.sizeGuide && STORE.sizeGuide.length) {
    $("sizeGuideBtn").classList.remove("hidden");
    $("sizeTable").innerHTML =
      `<tr>${STORE.sizeGuideHead.map((h) => `<th>${h}</th>`).join("")}</tr>` +
      STORE.sizeGuide.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("");
    $("sizeGuideBtn").onclick = () => $("sizeModal").classList.remove("hidden");
    $("closeSize").onclick = () => $("sizeModal").classList.add("hidden");
    $("sizeModal").onclick = (e) => { if (e.target === $("sizeModal")) $("sizeModal").classList.add("hidden"); };
  }

  // ---------- filters ----------
  const prices = PRODUCTS.map((p) => p.price);
  const LO = Math.floor(Math.min(...prices) / 100) * 100;
  const HI = Math.ceil(Math.max(...prices) / 100) * 100;
  const fresh = () => ({ tag: new Set(), size: new Set(), type: new Set(), fabric: new Set(), weight: new Set(), min: LO, max: HI, showSold: true });
  let F = fresh();

  const count = (fn) => PRODUCTS.filter(fn).length;
  const uniq = (key) => [...new Set(PRODUCTS.map((p) => p[key]).filter(Boolean))];
  // configured options first, then any value used by a product that isn't listed
  const options = (list, key) => [...new Set([...(list || []), ...uniq(key)])];

  function group(title, key, items, open) {
    if (!items.length) return "";
    return `<details${open ? " open" : ""}><summary>${title}</summary><div class="fopts">${items.map(([v, n]) =>
      `<label class="${n ? "" : "zero"}"><input type="checkbox" data-g="${key}" data-v="${v}"${F[key].has(v) ? " checked" : ""}${n ? "" : " disabled"}>${v}<small>(${n})</small></label>`).join("")}</div></details>`;
  }

  function renderFilters() {
    const by = (key, list) => options(list, key).map((v) => [v, count((p) => p[key] === v)]);
    const sizes = options(STORE.filterSizes || STORE.sizes, null).map((s) => [s, count((p) => sizesOf(p).includes(s))]);

    $("filterBody").innerHTML =
      `<details open><summary>Out of stock</summary><div class="seg" id="sold">
          <button type="button" data-s="1" class="${F.showSold ? "on" : ""}">Show</button>
          <button type="button" data-s="0" class="${F.showSold ? "" : "on"}">Hide</button></div></details>` +
      `<details open><summary>Price</summary><div class="prange">
          <div class="pvals"><span id="pMinV">${money(F.min)}</span><span id="pMaxV">${money(F.max)}</span></div>
          <input type="range" id="pMin" min="${LO}" max="${HI}" step="100" value="${F.min}" aria-label="Minimum price">
          <input type="range" id="pMax" min="${LO}" max="${HI}" step="100" value="${F.max}" aria-label="Maximum price">
        </div></details>` +
      group("Size", "size", sizes, true) +
      group("Fabric type", "fabric", by("fabric", STORE.fabricTypes), true) +
      group("Fabric weight", "weight", by("weight", STORE.fabricWeights), true) +
      group("Product type", "type", by("type", STORE.productTypes), false) +
      group("Collection", "tag", by("tag", COLLECTIONS.map((c) => c.tag)), false);
  }

  const matches = (p) =>
    (F.showSold || !p.soldOut) &&
    p.price >= F.min && p.price <= F.max &&
    (!F.tag.size || F.tag.has(p.tag)) &&
    (!F.size.size || sizesOf(p).some((s) => F.size.has(s))) &&
    (!F.type.size || F.type.has(p.type)) &&
    (!F.fabric.size || F.fabric.has(p.fabric)) &&
    (!F.weight.size || F.weight.has(p.weight));

  function activeFilters() {
    return F.tag.size + F.size.size + F.type.size + F.fabric.size + F.weight.size +
      (F.min !== LO || F.max !== HI ? 1 : 0) + (F.showSold ? 0 : 1);
  }

  $("filterBody").addEventListener("change", (e) => {
    const t = e.target;
    if (t.dataset.g) { t.checked ? F[t.dataset.g].add(t.dataset.v) : F[t.dataset.g].delete(t.dataset.v); renderGrid(); }
  });
  $("filterBody").addEventListener("input", (e) => {
    if (e.target.id !== "pMin" && e.target.id !== "pMax") return;
    let a = +$("pMin").value, b = +$("pMax").value;
    if (e.target.id === "pMin" && a > b) { b = a; $("pMax").value = b; }
    if (e.target.id === "pMax" && b < a) { a = b; $("pMin").value = a; }
    F.min = a; F.max = b;
    $("pMinV").textContent = money(a); $("pMaxV").textContent = money(b);
    renderGrid();
  });
  $("filterBody").addEventListener("click", (e) => {
    const b = e.target.closest("[data-s]");
    if (b) { F.showSold = b.dataset.s === "1"; renderFilters(); renderGrid(); }
  });

  const clearAll = () => { F = fresh(); renderFilters(); renderGrid(); };
  $("clearFilters").onclick = clearAll;
  $("clearFilters2").onclick = clearAll;

  const openFilters = (on) => {
    $("filters").classList.toggle("on", on);
    $("filterOverlay").classList.toggle("on", on);
  };
  $("filterToggle").onclick = () => openFilters(true);
  $("closeFilters").onclick = () => openFilters(false);
  $("filterOverlay").onclick = () => openFilters(false);

  $("tiles").addEventListener("click", (e) => {
    const t = e.target.closest(".tile");
    if (!t) return;
    F = fresh(); F.tag.add(t.dataset.tag);
    renderFilters(); renderGrid();
    $("shop").scrollIntoView({ behavior: "smooth" });
  });

  // ---------- shop grid ----------
  const picked = {}; // product id -> size
  function renderGrid() {
    const list = PRODUCTS.filter(matches);
    const n = activeFilters();
    $("filterCount").textContent = n;
    $("filterCount").classList.toggle("hidden", !n);
    $("resultCount").textContent = n ? `${list.length} of ${PRODUCTS.length} tees` : "Choose your size and add to cart.";
    $("noResults").classList.toggle("hidden", list.length > 0);

    $("grid").innerHTML = list.map((p) => `
      <article class="card" data-id="${p.id}">
        <div class="pic">${pic(p)}
          ${p.soldOut ? `<span class="badge">Sold out</span>` : p.badge ? `<span class="badge">${p.badge}</span>` : ""}
          <span class="badge pre">Pre-order</span>
        </div>
        <div class="info">
          <h3><i class="dot" style="background:${p.color}"></i>${p.name}</h3>
          <p class="desc">${p.desc}</p>
          <div class="price">${money(p.price)}</div>
          <div class="sizes">${sizesOf(p).map((s) =>
            `<button type="button" data-size="${s}" class="${picked[p.id] === s ? "on" : ""}">${s}</button>`).join("")}</div>
          <button type="button" class="add"${p.soldOut ? " disabled" : ""}>${p.soldOut ? "Sold out" : "Add to cart"}</button>
        </div>
      </article>`).join("");
  }

  $("grid").addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const id = card.dataset.id;
    if (e.target.dataset.size) {
      picked[id] = e.target.dataset.size;
      card.querySelectorAll(".sizes button").forEach((b) => b.classList.toggle("on", b === e.target));
    } else if (e.target.classList.contains("add") && !e.target.disabled) {
      if (!picked[id]) return toast("Please choose a size first");
      addToCart(id, picked[id]);
    }
  });

  // ---------- cart ----------
  function addToCart(id, size) {
    const line = cart.find((l) => l.id === id && l.size === size);
    if (line) line.qty++; else cart.push({ id, size, qty: 1 });
    save(); renderCart();
    toast("Added to cart");
  }

  function totals() {
    const sub = cart.reduce((s, l) => s + prod(l.id).price * l.qty, 0);
    const free = STORE.freeDeliveryOver > 0 && sub >= STORE.freeDeliveryOver;
    const delivery = cart.length ? (free ? 0 : STORE.deliveryFee) : 0;
    return { sub, delivery, free, total: sub + delivery };
  }

  function renderCart() {
    cart = cart.filter((l) => prod(l.id));
    const n = cart.reduce((s, l) => s + l.qty, 0);
    $("cartCount").textContent = n;

    if (!cart.length) {
      $("cartItems").innerHTML = `<p class="empty">Your cart is empty.</p>`;
      $("totals").innerHTML = "";
      $("primaryBtn").disabled = true;
      return;
    }
    $("primaryBtn").disabled = false;
    $("cartItems").innerHTML = cart.map((l, i) => {
      const p = prod(l.id);
      return `<div class="line">
        <div class="thumb">${pic(p)}</div>
        <div class="meta"><b>${p.name}</b><span>Size ${l.size} · ${money(p.price)}</span>
          <div class="qty"><button data-a="dec" data-i="${i}">&minus;</button><span>${l.qty}</span><button data-a="inc" data-i="${i}">+</button></div>
        </div>
        <div><div class="amt">${money(p.price * l.qty)}</div><button class="rm" data-a="rm" data-i="${i}">Remove</button></div>
      </div>`;
    }).join("");

    const t = totals();
    const need = STORE.freeDeliveryOver - t.sub;
    $("totals").innerHTML = `
      <div><span>Subtotal</span><span>${money(t.sub)}</span></div>
      <div><span>Delivery</span><span>${t.free ? "Free" : money(t.delivery)}</span></div>
      ${STORE.freeDeliveryOver > 0 && !t.free ? `<div class="free"><span>Add ${money(need)} more for free delivery</span></div>` : ""}
      <div class="grand"><span>Total</span><span>${money(t.total)}</span></div>`;
  }

  $("cartItems").addEventListener("click", (e) => {
    const a = e.target.dataset.a, i = +e.target.dataset.i;
    if (!a) return;
    if (a === "inc") cart[i].qty++;
    if (a === "dec") cart[i].qty = Math.max(1, cart[i].qty - 1);
    if (a === "rm") cart.splice(i, 1);
    save(); renderCart();
  });

  // ---------- drawer / steps ----------
  let step = "cart";
  function setStep(s) {
    step = s;
    $("cartView").classList.toggle("hidden", s !== "cart");
    $("checkoutView").classList.toggle("hidden", s !== "checkout");
    $("backBtn").classList.toggle("hidden", s !== "checkout");
    $("sentHint").classList.add("hidden");
    $("drawerTitle").textContent = s === "cart" ? "Your cart" : "Delivery details";
    $("primaryBtn").textContent = s === "cart" ? "Checkout" : "Order on WhatsApp";
  }
  function openDrawer() { setStep("cart"); renderCart(); $("drawer").classList.add("on"); $("overlay").classList.add("on"); $("drawer").setAttribute("aria-hidden", "false"); }
  function closeDrawer() { $("drawer").classList.remove("on"); $("overlay").classList.remove("on"); $("drawer").setAttribute("aria-hidden", "true"); }
  $("openCart").onclick = openDrawer;
  $("closeCart").onclick = closeDrawer;
  $("overlay").onclick = closeDrawer;
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeDrawer(); openFilters(false); } });
  $("backBtn").onclick = () => setStep("cart");

  // ---------- WhatsApp order ----------
  function buildMessage(f) {
    const t = totals();
    const lines = cart.map((l, i) => {
      const p = prod(l.id);
      return `${i + 1}. ${p.name} | Size ${l.size} | Qty ${l.qty} | ${money(p.price * l.qty)}`;
    });
    return [
      `Hello Tea Island! I'd like to pre-order:`, ``,
      ...lines, ``,
      `Subtotal: ${money(t.sub)}`,
      `Delivery: ${t.free ? "Free" : money(t.delivery)}`,
      `*Total: ${money(t.total)}*`, ``,
      `Name: ${f.name}`,
      `Phone: ${f.phone}`,
      `Address: ${f.address}, ${f.city}`,
      f.notes ? `Notes: ${f.notes}` : null,
      `Payment: Cash on delivery`
    ].filter((x) => x !== null).join("\n");
  }
  const waUrl = (text) => `https://wa.me/${STORE.whatsapp}` + (text ? `?text=${encodeURIComponent(text)}` : "");

  $("primaryBtn").onclick = () => {
    if (step === "cart") { if (cart.length) setStep("checkout"); return; }
    const form = $("checkoutView");
    const f = Object.fromEntries(new FormData(form).entries());
    Object.keys(f).forEach((k) => (f[k] = String(f[k]).trim()));
    if (!f.name || !f.phone || !f.address || !f.city) {
      $("formErr").textContent = "Please fill in your name, phone, address and city.";
      return;
    }
    if (f.phone.replace(/\D/g, "").length < 9) {
      $("formErr").textContent = "Please enter a valid phone number.";
      return;
    }
    $("formErr").textContent = "";
    const url = waUrl(buildMessage(f));
    $("retryLink").href = url;
    $("sentHint").classList.remove("hidden");
    window.open(url, "_blank", "noopener");
  };

  // ---------- misc ----------
  let tt;
  function toast(msg) {
    const t = $("toast"); t.textContent = msg; t.classList.add("on");
    clearTimeout(tt); tt = setTimeout(() => t.classList.remove("on"), 1600);
  }

  $("waLink").href = waUrl("");
  $("heroWa").href = waUrl("Hello Tea Island! I'd like to pre-order.");
  $("ttLink").href = STORE.tiktok;
  $("yr").textContent = new Date().getFullYear();
  renderFilters();
  renderGrid();
  renderCart();
})();
