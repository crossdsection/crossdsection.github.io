/* =========================================================
   Edit these to wire up your links. Empty values are hidden.
   ========================================================= */
const LINKS = {
  spotify: "",   // Ummeeed on Spotify
  youtube: "",   // YouTube channel
  linktree: "https://linktr.ee/main_aham",
};

/* Free key from https://www.last.fm/api/account/create turns on the live
   "On my headphones" list. Without it, the section links to your profile. */
const LASTFM = { user: "crossdsection", apiKey: "" };

/* ========================================================= */

const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------------- loader ---------------- */
const LOG = [
  "$ npm run build:piyush",
  "› resolving 10 years of dependencies ...... <b>ok</b>",
  "› compiling python, go, typescript ....... <b>ok</b>",
  "› migrating 20,000 titles, losing 0 ...... <b>ok</b>",
  "› teaching the backend some manners ...... <b>ok</b>",
  "› sanding the rough edges off the ui ..... <b>ok</b>",
  "› removing unused adjectives ............. <b>ok</b>",
  "<b>✦ ready. say hi.</b>",
];

function seenIntro() {
  try { return sessionStorage.getItem("pk-intro") === "1"; } catch { return false; }
}
function markIntro() {
  try { sessionStorage.setItem("pk-intro", "1"); } catch {}
}

async function runLoader() {
  const loader = $("#loader");
  const reveal = () => document.body.classList.add("is-ready");

  if (!loader) return reveal();
  if (reduceMotion || seenIntro()) {
    loader.classList.add("is-gone");
    requestAnimationFrame(() => requestAnimationFrame(reveal));
    return;
  }

  root.classList.add("is-loading");
  const log = $("#loaderLog");
  const num = $("#loaderNum");
  let skipped = false;
  let finished = false;

  const pageLoaded = new Promise((r) =>
    document.readyState === "complete" ? r() : window.addEventListener("load", r, { once: true })
  );

  const finish = async () => {
    if (finished) return;
    finished = true;
    markIntro();
    num.textContent = "100";
    loader.classList.add("is-leaving");
    await sleep(380);
    root.classList.remove("is-loading");
    reveal();
    await sleep(900);
    loader.classList.add("is-gone");
  };

  $("#loaderSkip").addEventListener("click", () => { skipped = true; finish(); });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") { skipped = true; finish(); } }, { once: true });

  // counter: eases toward a target that the log lines push forward
  let shown = 0;
  let target = 0;
  const tick = () => {
    if (finished) return;
    shown += (target - shown) * 0.12;
    num.textContent = String(Math.min(100, Math.round(shown))).padStart(3, "0");
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  for (let i = 0; i < LOG.length; i++) {
    if (skipped) return;
    log.innerHTML += (i ? "\n" : "") + LOG[i];
    target = i === LOG.length - 1 ? 92 : Math.round(((i + 1) / LOG.length) * 88);
    await sleep(i === 0 ? 380 : 210 + Math.random() * 120);
  }
  await pageLoaded;
  if (skipped) return;
  target = 100;
  await sleep(450);
  finish();
}
runLoader();

/* ---------------- links / year / copy ---------------- */
$$("[data-link]").forEach((a) => {
  const url = LINKS[a.dataset.link];
  if (url) Object.assign(a, { href: url, target: "_blank", rel: "noopener" });
  else a.remove();
});
const year = $("#year");
if (year) year.textContent = new Date().getFullYear();

const copyBtn = $("[data-copy]");
copyBtn?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(copyBtn.dataset.copy);
    copyBtn.textContent = "Email copied";
  } catch {
    copyBtn.textContent = "Select the address to copy";
  }
  setTimeout(() => (copyBtn.textContent = "Copy email"), 2200);
});

/* ---------------- text scramble on hover ---------------- */
const GLYPHS = "!<>-_\\/[]{}=+*^?#01";
function scramble(el) {
  if (el._busy) return;
  el._busy = true;
  const final = el.dataset.text || (el.dataset.text = el.textContent);
  let frame = 0;
  const total = 14;
  const step = () => {
    const out = [...final].map((ch, i) => {
      if (ch === " " || ch === "-") return ch;
      return frame / total > i / final.length ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }).join("");
    el.textContent = out;
    if (frame++ < total) requestAnimationFrame(step);
    else { el.textContent = final; el._busy = false; }
  };
  step();
}
if (!reduceMotion) $$("[data-scramble]").forEach((el) => el.addEventListener("mouseenter", () => scramble(el)));

/* ---------------- custom cursor ---------------- */
const cursor = $("#cursor");
let mouse = { x: innerWidth / 2, y: innerHeight / 2 };
if (cursor && finePointer && !reduceMotion) {
  const label = cursor.firstElementChild;
  let cx = mouse.x, cy = mouse.y;
  addEventListener("pointermove", (e) => { mouse = { x: e.clientX, y: e.clientY }; });
  const loop = () => {
    cx += (mouse.x - cx) * 0.22;
    cy += (mouse.y - cy) * 0.22;
    cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(loop);
  };
  loop();

  const labelFor = (el) => {
    if (el.closest(".lens")) return "hide";
    if (el.closest(".chip")) return "drag";
    const ph = el.closest(".project__head");
    if (ph) return ph.getAttribute("aria-expanded") === "true" ? "close" : "open";
    const c = el.closest("[data-cursor]");
    return c ? c.dataset.cursor : "";
  };
  addEventListener("pointerover", (e) => {
    const l = labelFor(e.target);
    cursor.classList.toggle("is-hidden", l === "hide");
    cursor.classList.toggle("is-big", !!l && l !== "hide");
    if (l && l !== "hide") label.textContent = l;
  });
  document.addEventListener("pointerleave", () => cursor.classList.add("is-hidden"));
  document.addEventListener("pointerenter", () => cursor.classList.remove("is-hidden"));
} else if (cursor) cursor.remove();

/* ---------------- portrait lens: 1-bit dither under the pointer ---------------- */
(function lens() {
  const fig = $("#lens");
  if (!fig) return;
  const img = $("img", fig);
  const cvs = $("canvas", fig);
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

  const draw = () => {
    const w = 150, h = Math.round(150 * img.naturalHeight / img.naturalWidth);
    cvs.width = w; cvs.height = h;
    const ctx = cvs.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);
    let data;
    try { data = ctx.getImageData(0, 0, w, h); } catch { return; }
    const d = data.data;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const lum = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
        const t = (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16;
        const on = Math.pow(lum, 0.8) * 1.35 > t;
        d[i] = on ? 242 : 26; d[i + 1] = on ? 166 : 21; d[i + 2] = on ? 90 : 18; d[i + 3] = 255;
      }
    }
    ctx.putImageData(data, 0, 0);
  };
  img.complete ? draw() : img.addEventListener("load", draw, { once: true });

  const move = (e) => {
    const r = fig.getBoundingClientRect();
    fig.style.setProperty("--x", `${e.clientX - r.left}px`);
    fig.style.setProperty("--y", `${e.clientY - r.top}px`);
    fig.style.setProperty("--r", `${Math.max(70, r.width * 0.26)}px`);
  };
  fig.addEventListener("pointerenter", (e) => {
    if (e.pointerType !== "mouse") return;
    move(e);
    fig.classList.add("is-entering", "is-peeking");
    setTimeout(() => fig.classList.remove("is-entering"), 350);
  });
  fig.addEventListener("pointermove", (e) => e.pointerType === "mouse" && move(e));
  fig.addEventListener("pointerleave", () => fig.classList.remove("is-peeking"));
  // touch: tap flips the whole photo to 1-bit and back
  fig.addEventListener("click", (e) => { if (e.pointerType !== "mouse") fig.classList.toggle("is-xray"); });
  const tip = $(".lens__tip", fig);
  if (!finePointer && tip) tip.textContent = "[tap me, i'm 1-bit inside]";
})();

/* ---------------- statement: words light up with scroll ---------------- */
(function statement() {
  const el = $("#statement");
  if (!el) return;
  const HOT = new Set(["whole", "thing:", "mischief"]);
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map((w) => `<span class="w${HOT.has(w.replace(/[.,]/g, "")) || HOT.has(w) ? " hot" : ""}">${w}</span>`).join(" ");
  const spans = $$(".w", el);
  if (reduceMotion) { spans.forEach((s) => s.classList.add("is-on", ...(s.classList.contains("hot") ? ["is-hot"] : []))); return; }
  const update = () => {
    const r = el.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35)));
    const n = Math.round(p * spans.length);
    spans.forEach((s, i) => {
      s.classList.toggle("is-on", i < n);
      s.classList.toggle("is-hot", i < n && s.classList.contains("hot"));
    });
  };
  addEventListener("scroll", update, { passive: true });
  update();
})();

/* ---------------- projects: accordion + cursor preview ---------------- */
(function projects() {
  $$(".project__head").forEach((btn) => {
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      btn.nextElementSibling.hidden = open;
      if (cursor) cursor.firstElementChild.textContent = open ? "open" : "close";
    });
  });

  const peek = $("#peek");
  if (!peek || !finePointer || reduceMotion) return;
  const dpr = Math.min(2, devicePixelRatio || 1);
  const W = 320, H = 220;
  peek.width = W * dpr; peek.height = H * dpr;
  const ctx = peek.getContext("2d");
  ctx.scale(dpr, dpr);
  const C = { soot: "#241d18", bone: "#efe6d6", ember: "#f2a65a", rust: "#b8562f", dim: "#5a4e44" };

  let mode = null, t0 = 0, px = 0, py = 0, raf = 0;
  const rnd = (s) => { const x = Math.sin(s * 999) * 10000; return x - Math.floor(x); };

  const VIZ = {
    // Blitz: a CMS grid where tiles keep getting published
    tiles(t) {
      const cols = 9, rows = 6, gw = 26, gh = 20, gap = 6, ox = (W - cols * (gw + gap)) / 2, oy = (H - rows * (gh + gap)) / 2;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const k = r * cols + c;
        const phase = (t / 900 + rnd(k) * 6) % 6;
        ctx.fillStyle = phase < 1 ? C.ember : phase < 1.15 ? C.bone : C.dim;
        ctx.fillRect(ox + c * (gw + gap), oy + r * (gh + gap), gw, gh);
      }
    },
    // ingestion: three messy inputs funnel into one clean stream
    stream(t) {
      ctx.font = "11px IBM Plex Mono, monospace"; ctx.fillStyle = C.bone;
      ["API", "CSV", "JSON"].forEach((s, i) => ctx.fillText(s, 14, 52 + i * 62));
      ctx.strokeStyle = C.dim; ctx.beginPath(); ctx.moveTo(250, 30); ctx.lineTo(250, 190); ctx.stroke();
      for (let i = 0; i < 60; i++) {
        const lane = i % 3, p = ((t / 2200) + rnd(i)) % 1;
        const sx = 50, sy = 48 + lane * 62, ex = 250, ey = 110;
        const x = sx + (ex - sx) * p, y = sy + (ey - sy) * Math.pow(p, 2.2);
        ctx.fillStyle = p > 0.85 ? C.ember : C.bone;
        ctx.fillRect(x, y + (1 - p) * (rnd(i + 3) - .5) * 18, 3, 3);
      }
      for (let i = 0; i < 12; i++) { const x = 254 + ((t / 12 + i * 6) % 66); ctx.fillStyle = C.ember; ctx.fillRect(x, 108, 4, 4); }
    },
    // Fize: 150 providers wired to one platform
    web(t) {
      const cx = W / 2, cy = H / 2;
      for (let i = 0; i < 150; i++) {
        const a = (i / 150) * Math.PI * 2 + t / 9000, rad = 70 + rnd(i) * 26;
        const x = cx + Math.cos(a) * rad * 1.45, y = cy + Math.sin(a) * rad * .95;
        const lit = ((t / 40) % 150 | 0) === i || rnd(i + (t / 600 | 0)) > .93;
        if (lit) { ctx.strokeStyle = C.ember; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke(); }
        ctx.fillStyle = lit ? C.ember : C.bone; ctx.fillRect(x - 1, y - 1, 2.5, 2.5);
      }
      ctx.fillStyle = C.ember; ctx.beginPath(); ctx.arc(cx, cy, 9, 0, 7); ctx.fill();
    },
    // Talkstock: a market that never sleeps
    candles(t) {
      const n = 22, w = 9, gap = 5, ox = 14;
      let price = 110;
      const shift = t / 380 | 0;
      for (let i = 0; i < n; i++) {
        const k = i + shift;
        const open = price, close = price + (rnd(k) - .48) * 34;
        const hi = Math.min(open, close) - rnd(k + 1) * 14, lo = Math.max(open, close) + rnd(k + 2) * 14;
        const up = close < open;
        ctx.strokeStyle = ctx.fillStyle = up ? C.ember : C.rust;
        const x = ox + i * (w + gap);
        ctx.beginPath(); ctx.moveTo(x + w / 2, hi); ctx.lineTo(x + w / 2, lo); ctx.stroke();
        ctx.fillRect(x, Math.min(open, close), w, Math.max(2, Math.abs(close - open)));
        price = Math.max(40, Math.min(180, close));
      }
    },
    // Utopia Academy: six teams orbiting one idea
    orbit(t) {
      const cx = W / 2, cy = H / 2;
      ctx.strokeStyle = C.dim;
      [40, 70].forEach((r) => { ctx.beginPath(); ctx.ellipse(cx, cy, r * 1.5, r, 0, 0, 7); ctx.stroke(); });
      for (let i = 0; i < 6; i++) {
        const r = i % 2 ? 70 : 40, a = t / (i % 2 ? 1600 : 1100) + i * 1.05;
        ctx.fillStyle = i % 2 ? C.bone : C.ember;
        ctx.beginPath(); ctx.arc(cx + Math.cos(a) * r * 1.5, cy + Math.sin(a) * r, 6, 0, 7); ctx.fill();
      }
      ctx.fillStyle = C.bone; ctx.font = "900 26px 'Big Shoulders Display', sans-serif"; ctx.textAlign = "center";
      ctx.fillText("6", cx, cy + 9); ctx.textAlign = "start";
    },
  };

  const frame = (now) => {
    ctx.fillStyle = C.soot; ctx.fillRect(0, 0, W, H);
    VIZ[mode] && VIZ[mode](now - t0);
    peek.style.left = px + 28 + W / 2 + "px";
    peek.style.top = py + "px";
    raf = requestAnimationFrame(frame);
  };
  $$(".project").forEach((p) => {
    const head = $(".project__head", p);
    head.addEventListener("pointerenter", (e) => {
      mode = p.dataset.viz; t0 = performance.now(); px = e.clientX; py = e.clientY;
      peek.classList.add("is-on");
      if (!raf) raf = requestAnimationFrame(frame);
    });
    head.addEventListener("pointermove", (e) => { px = e.clientX; py = e.clientY; });
    head.addEventListener("pointerleave", () => {
      peek.classList.remove("is-on");
      setTimeout(() => { if (!peek.classList.contains("is-on")) { cancelAnimationFrame(raf); raf = 0; } }, 300);
    });
  });
})();

/* ---------------- toolbox: draggable, throwable chips ---------------- */
(function toolbox() {
  const tray = $("#tray");
  if (!tray) return;
  const chips = $$(".chip", tray);
  let bounds = tray.getBoundingClientRect();
  const state = chips.map((el, i) => ({ el, x: 0, y: 0, vx: 0, vy: 0, rot: (Math.random() - .5) * 14, w: 0, h: 0, drag: false }));

  const place = () => {
    bounds = tray.getBoundingClientRect();
    // scatter with rejection sampling so chips rarely overlap
    const placed = [];
    state.forEach((s) => {
      s.w = s.el.offsetWidth; s.h = s.el.offsetHeight;
      let best = null;
      for (let k = 0; k < 60; k++) {
        const x = 12 + Math.random() * Math.max(1, bounds.width - s.w - 24);
        const y = 12 + Math.random() * Math.max(1, bounds.height - s.h - 24);
        const hit = placed.some((p) => x < p.x + p.w + 8 && x + s.w + 8 > p.x && y < p.y + p.h + 8 && y + s.h + 8 > p.y);
        best = { x, y };
        if (!hit) break;
      }
      s.x = best.x; s.y = best.y; placed.push(s);
      render(s);
    });
  };
  const render = (s) => { s.el.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.rot}deg)`; };

  // drop-in when the tray scrolls into view
  const dropIn = () => {
    if (reduceMotion) return;
    state.forEach((s, i) => {
      const fy = s.y;
      s.el.style.transition = "none";
      s.el.style.transform = `translate(${s.x}px, ${-80 - Math.random() * 200}px) rotate(${s.rot * 3}deg)`;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        s.el.style.transition = `transform ${.9 + Math.random() * .4}s cubic-bezier(.34,1.56,.64,1) ${i * 0.03}s`;
        s.y = fy; render(s);
        setTimeout(() => (s.el.style.transition = ""), 1800);
      }));
    });
  };

  place();
  addEventListener("resize", () => { clearTimeout(tray._t); tray._t = setTimeout(place, 150); });
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { dropIn(); io.disconnect(); } }, { threshold: .35 });
    io.observe(tray);
  }

  let active = null, last = { x: 0, y: 0, t: 0 }, z = 10;
  const clamp = (s) => {
    const maxX = bounds.width - s.w - 4, maxY = bounds.height - s.h - 4;
    if (s.x < 4) { s.x = 4; s.vx *= -.6; }
    if (s.x > maxX) { s.x = maxX; s.vx *= -.6; }
    if (s.y < 4) { s.y = 4; s.vy *= -.6; }
    if (s.y > maxY) { s.y = maxY; s.vy *= -.6; }
  };
  state.forEach((s) => {
    s.el.addEventListener("pointerdown", (e) => {
      bounds = tray.getBoundingClientRect();
      active = s; s.drag = true; s.vx = s.vy = 0;
      s.ox = e.clientX - bounds.left - s.x; s.oy = e.clientY - bounds.top - s.y;
      last = { x: e.clientX, y: e.clientY, t: performance.now() };
      s.el.classList.add("is-dragging"); s.el.style.zIndex = ++z; s.el.style.transition = "none";
      s.el.setPointerCapture(e.pointerId);
    });
    s.el.addEventListener("pointermove", (e) => {
      if (active !== s) return;
      const now = performance.now(), dt = Math.max(1, now - last.t);
      s.vx = (e.clientX - last.x) / dt * 16; s.vy = (e.clientY - last.y) / dt * 16;
      last = { x: e.clientX, y: e.clientY, t: now };
      s.x = e.clientX - bounds.left - s.ox; s.y = e.clientY - bounds.top - s.oy;
      s.rot = Math.max(-25, Math.min(25, s.vx * 1.4));
      clamp(s); render(s);
    });
    const release = () => {
      if (active !== s) return;
      active = null; s.drag = false; s.el.classList.remove("is-dragging");
      if (reduceMotion) return;
      const glide = () => {
        if (s.drag) return;
        s.vx *= .93; s.vy *= .93; s.rot *= .92;
        s.x += s.vx; s.y += s.vy; clamp(s); render(s);
        if (Math.abs(s.vx) + Math.abs(s.vy) > .2 || Math.abs(s.rot) > .3) requestAnimationFrame(glide);
      };
      glide();
    };
    s.el.addEventListener("pointerup", release);
    s.el.addEventListener("pointercancel", release);
  });
})();

/* ---------------- footer wordmark ---------------- */
(function mark() {
  const el = $("#mark");
  if (!el || reduceMotion) return;
  const letters = [...el.textContent].map((ch) => { const s = document.createElement("span"); s.textContent = ch; s.setAttribute("aria-hidden", "true"); return s; });
  el.textContent = ""; el.append(...letters);
  el.addEventListener("pointermove", (e) => {
    letters.forEach((s) => {
      const r = s.getBoundingClientRect();
      s.classList.toggle("is-up", Math.abs(e.clientX - (r.left + r.width / 2)) < r.width * 1.1);
    });
  });
  el.addEventListener("pointerleave", () => letters.forEach((s) => s.classList.remove("is-up")));
})();

/* ---------------- active nav link ---------------- */
(function nav() {
  const links = $$(".bar__nav a");
  const secs = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.setAttribute("aria-current", String(a.getAttribute("href") === "#" + e.target.id)));
  }), { rootMargin: "-45% 0px -50% 0px" });
  secs.forEach((s) => io.observe(s));
})();

/* ---------------- Last.fm ---------------- */
(async function listening() {
  if (!LASTFM.apiKey) return;
  const list = $(".listening__list");
  const url = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&format=json&limit=5" +
    "&user=" + encodeURIComponent(LASTFM.user) + "&api_key=" + encodeURIComponent(LASTFM.apiKey);
  try {
    const res = await fetch(url);
    if (!res.ok) return;
    const tracks = (await res.json()).recenttracks?.track || [];
    if (!tracks.length) return;
    list.innerHTML = "";
    tracks.forEach((t) => {
      const li = document.createElement("li");
      const img = document.createElement("img");
      const art = (t.image || []).find((i) => i.size === "medium");
      img.src = art?.["#text"] || ""; img.alt = ""; img.loading = "lazy";
      const text = document.createElement("span");
      const name = document.createElement("span");
      name.className = "listening__track"; name.textContent = t.name;
      if (t["@attr"]?.nowplaying) {
        const now = document.createElement("span");
        now.className = "listening__now"; now.textContent = "playing now";
        name.append(now);
      }
      const artist = document.createElement("span");
      artist.className = "listening__artist"; artist.textContent = t.artist?.["#text"] || t.artist?.name || "";
      text.append(name, artist); li.append(img, text); list.append(li);
    });
  } catch { /* keep the fallback */ }
})();
