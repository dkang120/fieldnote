/* Fieldnote — shared data + behavior. Plain JS, no build step. */

const SCENTS = [
  {
    slug: "library-musk", no: "01", code: "HS-01", name: "Library Musk", family: "Clean",
    tint: "#E8DFCF", bg: "#E7E1D5",
    mood: "Clean sheets, old paper, a quiet floor at 9am.",
    notes: { top: "Aldehydes, pear skin", heart: "Iris, white tea", base: "Clean musk, cashmeran" },
    wear: "Every day, close to the skin",
    story: "We started with the smell of a reading room before anyone arrives: dust caught in light, a cotton sweater, paper that has been handled. It is the scent you forget you are wearing until someone leans in."
  },
  {
    slug: "fig-study", no: "02", code: "HS-02", name: "Fig Study", family: "Green",
    tint: "#C9D0B4", bg: "#DFE1D2",
    mood: "Green fig leaf, split open in late summer.",
    notes: { top: "Fig leaf, bergamot", heart: "Fig milk, violet leaf", base: "Cedar, coconut wood" },
    wear: "Warm days, open windows",
    story: "Half fruit, half tree. The milky sweetness of a ripe fig sits on dry cedar, so it never turns sugary. Friendly in a lecture hall, interesting up close."
  },
  {
    slug: "field-vetiver", no: "03", code: "HS-03", name: "Field Vetiver", family: "Fresh",
    tint: "#D7D9C6", bg: "#E2E2D6",
    mood: "Cut grass, grapefruit peel, the walk across campus.",
    notes: { top: "Grapefruit, pink pepper", heart: "Clary sage, geranium", base: "Haitian vetiver, oakmoss" },
    wear: "Mornings, interviews, first dates",
    story: "Our crispest scent. Bright citrus up front, then the earthy, slightly smoky root of vetiver. It reads put-together without trying hard."
  },
  {
    slug: "late-tea", no: "04", code: "HS-04", name: "Late Tea", family: "Warm",
    tint: "#D9B98F", bg: "#E8DCCB",
    mood: "Black tea gone cold next to an open notebook.",
    notes: { top: "Black tea, cardamom", heart: "Orange blossom, honey", base: "Amber, tonka bean" },
    wear: "Evenings, cold weather",
    story: "A long night of studying, made comfortable. Smoky tea and cardamom soften into honeyed amber. Warm, never heavy."
  },
  {
    slug: "salt-hour", no: "05", code: "HS-05", name: "Salt Hour", family: "Fresh",
    tint: "#CCD8D8", bg: "#DEE3E1",
    mood: "Skin after the ocean, the hour before sunset.",
    notes: { top: "Sea salt, lemon", heart: "Ambrette, sage", base: "Driftwood, mineral musk" },
    wear: "Weekends, warm nights",
    story: "Not a blue sports cologne. Salt Hour smells like dried salt on warm skin and sun-bleached wood. Easy, and a little sandy."
  },
  {
    slug: "worn-leather", no: "06", code: "HS-06", name: "Worn Leather", family: "Warm",
    tint: "#C6A288", bg: "#E5D8CD",
    mood: "A suede jacket that has been to a lot of concerts.",
    notes: { top: "Saffron, black pepper", heart: "Suede, raspberry leaf", base: "Birch tar, sandalwood" },
    wear: "Nights out, fall and winter",
    story: "Soft suede rather than new leather, with a pinch of saffron and a thread of smoke. Confident without being loud."
  }
];

const PRICES = { 50: 78, 100: 128 };
const DISCOVERY = { slug: "discovery-set", name: "Discovery Set", price: 22 };
const FREE_SHIP = 75;

/* ---------- utilities ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = (n) => "$" + n.toFixed(0);

const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return this._m?.[k] ?? d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { this._m = { ...(this._m || {}), [k]: v }; } }
};

/* ---------- fresh-fill dates (Pacific time, Mon–Fri, last window 3pm) ---------- */
function laNow() {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hourCycle: "h23"
  }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  return { date: new Date(+p.year, +p.month - 1, +p.day), hour: +p.hour };
}
const isWeekday = (d) => d.getDay() > 0 && d.getDay() < 6;
function nextWeekday(d) { const n = new Date(d); do { n.setDate(n.getDate() + 1); } while (!isWeekday(n)); return n; }
function fillDates() {
  const { date, hour } = laNow();
  const compounded = isWeekday(date) && hour < 15 ? date : nextWeekday(date);
  return { compounded, ships: nextWeekday(compounded) };
}
const fmtDay = (d) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
const fmtLabel = (d) => d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();

/* ---------- the bottle: straight glass, Diptyque-style oval label ---------- */
function bottleSVG({ scent = SCENTS[0], name = "", city = "", date = fillDates().compounded, size = 50, title } = {}) {
  const who = (name || "Your name").slice(0, 20);
  const where = (city || "Your city").slice(0, 18);
  const h = size === 100 ? 330 : 300;           // the 100 ml bottle stands a little taller
  const top = 340 - h;
  const label = `${scent.name}, made for ${who} in ${where}`;
  return `
<svg class="bottle" viewBox="0 0 200 360" role="img" aria-label="${esc(title || label)}">
  <rect x="78" y="${top - 8}" width="44" height="48" rx="3" fill="#1C1B19"/>
  <rect x="86" y="${top + 38}" width="28" height="12" fill="#9C978E"/>
  <rect x="24" y="${top + 48}" width="152" height="${h - 50}" rx="12" fill="${scent.tint}" fill-opacity=".55" stroke="#1C1B19" stroke-opacity=".28"/>
  <rect x="24" y="${top + 74}" width="152" height="${h - 76}" rx="12" fill="${scent.tint}" fill-opacity=".55"/>
  <rect x="34" y="${top + 60}" width="5" height="${h - 90}" rx="2.5" fill="#fff" fill-opacity=".45"/>
  <g transform="translate(100 ${top + 48 + (h - 50) / 2 + 6})">
    <ellipse rx="62" ry="78" fill="#F7F3EA" stroke="#1C1B19" stroke-width="1"/>
    <ellipse rx="57" ry="73" fill="none" stroke="#1C1B19" stroke-width=".5"/>
    <text y="-46" text-anchor="middle" font-family="Hanken Grotesk, sans-serif" font-size="7.5" letter-spacing="2.2" fill="#1C1B19">FIELDNOTE</text>
    <text y="-24" text-anchor="middle" font-family="Instrument Serif, serif" font-size="11" fill="#A95F3B">No. ${scent.no}</text>
    <text y="-4" text-anchor="middle" font-family="Instrument Serif, serif" font-size="${scent.name.length > 12 ? 15 : 17}" fill="#1C1B19">${esc(scent.name)}</text>
    <line x1="-30" x2="30" y1="8" y2="8" stroke="#1C1B19" stroke-width=".5"/>
    <text y="24" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="6.6" fill="#4A4741">MADE FOR</text>
    <text y="36" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="${who.length > 14 ? 7 : 8.4}" fill="#1C1B19" data-role="name">${esc(who.toUpperCase())}</text>
    <text y="50" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="6.6" fill="#4A4741" data-role="where">${esc(where.toUpperCase())}</text>
    <text y="60" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="5.8" fill="#4A4741">${fmtLabel(date)} · ${size}ML</text>
  </g>
</svg>`;
}

function vialSVG(scent) {
  return `<svg viewBox="0 0 40 150" aria-hidden="true">
    <rect x="13" y="2" width="14" height="20" rx="2" fill="#1C1B19"/>
    <rect x="9" y="22" width="22" height="124" rx="10" fill="${scent.tint}" fill-opacity=".7" stroke="#1C1B19" stroke-opacity=".3"/>
    <rect x="11" y="70" width="18" height="36" fill="#F7F3EA"/>
    <text x="20" y="92" text-anchor="middle" font-family="Instrument Serif, serif" font-size="11" fill="#1C1B19">${scent.no}</text>
  </svg>`;
}

/* ---------- shared chrome ---------- */
function chrome() {
  const page = $("main")?.dataset.page;
  const link = (href, label, key) => `<a href="${href}"${page === key ? ' aria-current="page"' : ""}>${label}</a>`;
  document.body.insertAdjacentHTML("afterbegin", `
    <a class="sr" href="#main">Skip to content</a>
    <div class="announce">Every bottle is mixed after you order. Free shipping over ${money(FREE_SHIP)}.</div>
    <header class="site-header"><div class="wrap">
      <button class="menu-btn" aria-expanded="false" aria-controls="nav">Menu</button>
      <a class="logo" href="index.html">Fieldnote</a>
      <nav class="nav" id="nav">
        ${link("scents.html", "House scents", "scents")}
        ${link("discovery.html", "Discovery Set", "discovery")}
        ${link("how-its-made.html", "How it's made", "made")}
      </nav>
      <button class="bag-btn" data-open-bag>Bag (<span data-bag-count>0</span>)</button>
    </div></header>`);

  document.body.insertAdjacentHTML("beforeend", `
    <footer class="site-footer"><div class="wrap">
      <div class="foot-grid">
        <div>
          <h4>Letters from the bench</h4>
          <p class="small" style="color:var(--ink-soft)">New scents, campus pop-up dates, and 10% off your first bottle.</p>
          <form class="signup" data-signup>
            <label class="sr" for="foot-email">Email</label>
            <input class="input" id="foot-email" type="email" placeholder="you@school.edu" required>
            <button class="btn" type="submit">Sign up</button>
          </form>
        </div>
        <div><h4>Shop</h4><ul>
          <li><a href="scents.html">House scents</a></li>
          <li><a href="discovery.html">Discovery Set</a></li>
          <li><a href="how-its-made.html">How it's made</a></li>
        </ul></div>
        <div><h4>Help</h4><ul>
          <li><a href="how-its-made.html#faq">Shipping and fill times</a></li>
          <li><a href="how-its-made.html#ingredients">Ingredients</a></li>
          <li><a href="mailto:hello@fieldnote.studio">hello@fieldnote.studio</a></li>
        </ul></div>
      </div>
      <div class="wordmark" aria-hidden="true">Fieldnote</div>
      <div class="foot-note"><span>Mixed by hand in Los Angeles.</span><span>© ${new Date().getFullYear()} Fieldnote. A preview site; checkout opens at launch.</span></div>
    </div></footer>
    <div class="scrim" data-close-bag></div>
    <aside class="drawer" aria-label="Your bag" aria-hidden="true">
      <header><h2>Your bag</h2><button class="x" data-close-bag>Close</button></header>
      <div class="items" data-bag-items></div>
      <footer data-bag-foot></footer>
    </aside>
    <div class="toast" role="status" aria-live="polite"></div>`);

  const menu = $(".menu-btn"), nav = $("#nav");
  menu.addEventListener("click", () => { const o = nav.classList.toggle("open"); menu.setAttribute("aria-expanded", o); menu.textContent = o ? "Close" : "Menu"; });
  $$("[data-open-bag]").forEach((b) => b.addEventListener("click", openBag));
  $$("[data-close-bag]").forEach((b) => b.addEventListener("click", closeBag));
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeBag());
  $$("[data-signup]").forEach((f) => f.addEventListener("submit", (e) => { e.preventDefault(); f.reset(); toast("You're on the list."); }));
  renderBag();
}

function toast(msg) {
  const t = $(".toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2400);
}

/* ---------- bag ---------- */
const getBag = () => store.get("fn-bag", []);
const setBag = (b) => { store.set("fn-bag", b); renderBag(); };
function addToBag(item) { setBag([...getBag(), { ...item, id: Date.now() + Math.random() }]); openBag(); }
function openBag() { $(".drawer").classList.add("open"); $(".drawer").setAttribute("aria-hidden", "false"); $(".scrim").classList.add("open"); $(".drawer .x").focus(); }
function closeBag() { $(".drawer")?.classList.remove("open"); $(".drawer")?.setAttribute("aria-hidden", "true"); $(".scrim")?.classList.remove("open"); }

function renderBag() {
  const bag = getBag();
  $$("[data-bag-count]").forEach((n) => (n.textContent = bag.length));
  const items = $("[data-bag-items]"), foot = $("[data-bag-foot]");
  if (!items) return;
  if (!bag.length) {
    items.innerHTML = `<div class="empty"><p>Your bag is empty. Not sure where to start? Six samples cost ${money(DISCOVERY.price)}, and that ${money(DISCOVERY.price)} comes off your first full bottle.</p><a class="btn ghost" href="discovery.html">See the Discovery Set</a></div>`;
    foot.innerHTML = "";
    return;
  }
  const total = bag.reduce((s, i) => s + i.price, 0);
  const { compounded, ships } = fillDates();
  items.innerHTML = bag.map((i) => {
    const s = SCENTS.find((x) => x.slug === i.slug);
    const thumb = s ? bottleSVG({ scent: s, name: i.name, city: i.city, size: i.size, title: s.name }) : vialSVG(SCENTS[1]);
    const detail = s ? `${i.size} ml · for ${esc(i.name || "you")}${i.city ? ", " + esc(i.city) : ""}` : "6 × 2 ml samples";
    return `<div class="line"><div class="thumb">${thumb}</div>
      <div><h4>${esc(s ? s.name : DISCOVERY.name)}</h4><div class="tag-text">${detail}</div>
      <button class="remove" data-remove="${i.id}">Remove</button></div>
      <div>${money(i.price)}</div></div>`;
  }).join("");
  const left = Math.max(0, FREE_SHIP - total);
  foot.innerHTML = `
    <div class="small">${left ? `${money(left)} away from free shipping` : "Free shipping unlocked"}</div>
    <div class="ship-bar"><span style="width:${Math.min(100, (total / FREE_SHIP) * 100)}%"></span></div>
    <div class="totals"><span>Subtotal</span><span>${money(total)}</span></div>
    <p class="small">Mixed ${fmtDay(compounded)}. Ships ${fmtDay(ships)}.</p>
    <button class="btn block" data-checkout>Check out</button>`;
  $$("[data-remove]").forEach((b) => b.addEventListener("click", () => setBag(getBag().filter((x) => String(x.id) !== b.dataset.remove))));
  $("[data-checkout]").addEventListener("click", () => toast("Checkout opens at launch. We saved your bag."));
}

/* ---------- pages ---------- */
function scentCard(s) {
  return `<a class="scent-card" href="scent.html?s=${s.slug}">
    <div class="frame" style="background:${s.bg}">${bottleSVG({ scent: s, name: "", city: "", title: s.name })}</div>
    <div class="meta"><h3>${s.name}</h3><span class="price">from ${money(PRICES[50])}</span></div>
    <p class="notes">${s.notes.top.split(",")[0]}, ${s.notes.heart.split(",")[0].toLowerCase()}, ${s.notes.base.split(",")[0].toLowerCase()}</p>
  </a>`;
}

function initHome() {
  const stage = $("[data-hero-bottle]"), n = $("#hero-name"), c = $("#hero-city");
  const draw = () => (stage.innerHTML = bottleSVG({ scent: SCENTS[1], name: n.value, city: c.value }));
  n.addEventListener("input", draw); c.addEventListener("input", draw); draw();
  $("[data-home-grid]").innerHTML = SCENTS.map(scentCard).join("");
  $("[data-vials]").innerHTML = SCENTS.map(vialSVG).join("");
  const { compounded } = fillDates();
  $$("[data-next-fill]").forEach((el) => (el.textContent = fmtDay(compounded)));
}

function initCatalog() {
  const grid = $("[data-grid]");
  const show = (f) => (grid.innerHTML = SCENTS.filter((s) => f === "All" || s.family === f).map(scentCard).join(""));
  $$(".chip").forEach((chip) => chip.addEventListener("click", () => {
    $$(".chip").forEach((x) => x.setAttribute("aria-pressed", x === chip));
    show(chip.dataset.f);
  }));
  show("All");
}

function initProduct() {
  const slug = new URLSearchParams(location.search).get("s");
  const s = SCENTS.find((x) => x.slug === slug) || SCENTS[0];
  document.title = `${s.name} | Fieldnote`;
  let size = 50;
  $("[data-pdp-media]").style.background = s.bg;
  $("[data-crumb]").textContent = s.name;
  $("[data-name]").textContent = s.name;
  $("[data-mood]").textContent = s.mood;
  $("[data-story]").textContent = s.story;
  $("[data-wear]").textContent = s.wear;
  $("[data-code]").textContent = s.code;
  $("[data-top]").textContent = s.notes.top;
  $("[data-heart]").textContent = s.notes.heart;
  $("[data-base]").textContent = s.notes.base;
  const { compounded, ships } = fillDates();
  $("[data-fill]").innerHTML = `Order now and we mix it <strong>${fmtDay(compounded)}</strong>. It ships <strong>${fmtDay(ships)}</strong>.`;

  const nm = $("#p-name"), ct = $("#p-city");
  const draw = () => {
    $("[data-pdp-media]").innerHTML = bottleSVG({ scent: s, name: nm.value, city: ct.value, size });
    $$("[data-price]").forEach((p) => (p.textContent = money(PRICES[size])));
    $("[data-n-count]").textContent = `${nm.value.length}/20`;
    $("[data-c-count]").textContent = `${ct.value.length}/18`;
  };
  $$(".size").forEach((b) => b.addEventListener("click", () => {
    size = +b.dataset.size; $$(".size").forEach((x) => x.setAttribute("aria-pressed", x === b)); draw();
  }));
  nm.addEventListener("input", draw); ct.addEventListener("input", draw); draw();

  const add = () => {
    if (!nm.value.trim()) { nm.focus(); toast("Add the name for your label first."); return; }
    addToBag({ slug: s.slug, size, price: PRICES[size], name: nm.value.trim(), city: ct.value.trim() });
  };
  $$("[data-add]").forEach((b) => b.addEventListener("click", add));
  $("[data-more]").innerHTML = SCENTS.filter((x) => x !== s).slice(0, 3).map(scentCard).join("");
  document.body.classList.add("has-sticky");
}

function initDiscovery() {
  $("[data-vials]").innerHTML = SCENTS.map(vialSVG).join("");
  $("[data-list]").innerHTML = SCENTS.map((s) => `<div><dt>No. ${s.no}</dt><dd><a href="scent.html?s=${s.slug}">${s.name}</a> <span class="small">${s.notes.top.split(",")[0]}, ${s.notes.base.split(",")[0].toLowerCase()}</span></dd></div>`).join("");
  $$("[data-add-discovery]").forEach((b) => b.addEventListener("click", () => addToBag({ slug: DISCOVERY.slug, price: DISCOVERY.price })));
  document.body.classList.add("has-sticky");
}

function initMade() {
  const { compounded, ships } = fillDates();
  $$("[data-next-fill]").forEach((el) => (el.textContent = fmtDay(compounded)));
  $$("[data-next-ship]").forEach((el) => (el.textContent = fmtDay(ships)));
}

document.addEventListener("DOMContentLoaded", () => {
  chrome();
  ({ home: initHome, scents: initCatalog, product: initProduct, discovery: initDiscovery, made: initMade })[$("main")?.dataset.page]?.();
});
