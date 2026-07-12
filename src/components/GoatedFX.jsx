import { useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   GOATED FX ENGINE — global cinematic enhancement layer.
   Pure visuals: zero content changes, zero data changes.
   Everything gates on prefers-reduced-motion and pointer type,
   and every hook targets classes that already exist in the app.
═══════════════════════════════════════════════════════════ */

const GFX_STYLES = `
@property --gfxa{syntax:'<angle>';initial-value:0deg;inherits:false}

::selection{background:rgba(61,139,255,.38);color:#fff;text-shadow:none}

/* ---- fixed ambient layers ---- */
.gfx-stars{position:fixed;inset:0;z-index:0;pointer-events:none;mix-blend-mode:screen}
.gfx-aurora{position:fixed;inset:-12%;z-index:0;pointer-events:none;mix-blend-mode:screen;filter:blur(72px);opacity:.55}
.gfx-aurora i{position:absolute;border-radius:50%}
.gfx-aurora i:nth-child(1){width:58vw;height:58vw;left:-14vw;top:-18vw;background:radial-gradient(circle,rgba(0,80,255,.17),transparent 62%);animation:gfxAur1 26s ease-in-out infinite alternate}
.gfx-aurora i:nth-child(2){width:46vw;height:46vw;right:-12vw;top:20vh;background:radial-gradient(circle,rgba(200,149,58,.11),transparent 60%);animation:gfxAur2 34s ease-in-out infinite alternate}
.gfx-aurora i:nth-child(3){width:52vw;height:52vw;left:22vw;bottom:-20vw;background:radial-gradient(circle,rgba(56,189,248,.13),transparent 62%);animation:gfxAur3 30s ease-in-out infinite alternate}
@keyframes gfxAur1{to{transform:translate(9vw,7vh) scale(1.18)}}
@keyframes gfxAur2{to{transform:translate(-7vw,-6vh) scale(1.26)}}
@keyframes gfxAur3{to{transform:translate(-8vw,-5vh) scale(1.12)}}
@media(max-width:760px){.gfx-aurora{opacity:.32;filter:blur(46px)}}

.gfx-spotlight{position:fixed;left:0;top:0;width:min(58vw,720px);height:min(58vw,720px);z-index:1;pointer-events:none;mix-blend-mode:screen;border-radius:50%;background:radial-gradient(circle,rgba(61,139,255,.11),rgba(120,193,255,.05) 34%,rgba(200,149,58,.035) 52%,transparent 70%);transform:translate3d(-2000px,-2000px,0);will-change:transform;opacity:0;transition:opacity .6s ease}
html.gfx-on .gfx-spotlight{opacity:1}
@media(pointer:coarse){.gfx-spotlight{display:none}}

/* ---- scroll progress ---- */
.gfx-progress{position:fixed;top:0;left:0;right:0;height:3px;z-index:750;pointer-events:none;background:rgba(255,255,255,.035)}
.gfx-progress i{display:block;height:100%;width:100%;transform-origin:0 50%;transform:scaleX(0);background:linear-gradient(90deg,#0050ff,#3d8bff 30%,#78c1ff 55%,#e8b86d 82%,#f5d49a);background-size:200% 100%;animation:gfxFlow 6s linear infinite;box-shadow:0 0 14px rgba(61,139,255,.75),0 1px 22px rgba(200,149,58,.4)}
@keyframes gfxFlow{to{background-position:200% 0}}

/* ---- entrance veil ---- */
.gfx-veil{position:fixed;inset:0;z-index:900;pointer-events:none}
.gfx-veil i{position:absolute;left:0;right:0;height:50.5%;background:linear-gradient(180deg,#010409,#04101f)}
.gfx-veil i:first-child{top:0;animation:gfxVeilUp .85s cubic-bezier(.77,0,.18,1) .42s forwards}
.gfx-veil i:last-child{bottom:0;background:linear-gradient(0deg,#010409,#04101f);animation:gfxVeilDn .85s cubic-bezier(.77,0,.18,1) .42s forwards}
.gfx-veil::before{content:"";position:absolute;left:6%;right:6%;top:50%;height:1px;z-index:2;background:linear-gradient(90deg,transparent,rgba(120,193,255,.95) 30%,rgba(245,212,154,.95) 70%,transparent);transform:scaleX(0);animation:gfxVeilLine .42s cubic-bezier(.22,1,.36,1) forwards,gfxVeilFade .5s ease .55s forwards}
@keyframes gfxVeilLine{to{transform:scaleX(1)}}
@keyframes gfxVeilFade{to{opacity:0}}
@keyframes gfxVeilUp{to{transform:translateY(-103%)}}
@keyframes gfxVeilDn{to{transform:translateY(103%)}}
@media(prefers-reduced-motion:reduce){.gfx-veil,.gfx-aurora,.gfx-stars,.gfx-spotlight,.gfx-burst-layer{display:none!important}}

/* ---- click spark bursts ---- */
.gfx-burst-layer{position:fixed;inset:0;z-index:640;pointer-events:none;overflow:hidden}
.gfx-spark{position:absolute;left:0;top:0;border-radius:50%;pointer-events:none;will-change:transform,opacity}
.gfx-ring{position:absolute;left:0;top:0;border-radius:50%;border:1.5px solid rgba(120,193,255,.75);box-shadow:0 0 18px rgba(120,193,255,.4);pointer-events:none;will-change:transform,opacity}

/* ---- upgraded scroll reveals (existing .sr elements) ---- */
html.gfx-on .sr:not([data-gfx-settled]){transform:translateY(38px) scale(.985);filter:blur(9px);transition:opacity 1s cubic-bezier(.22,1,.36,1) var(--gfx-d,0ms),transform 1s cubic-bezier(.22,1,.36,1) var(--gfx-d,0ms),filter .85s ease var(--gfx-d,0ms)}
html.gfx-on .sr.vis:not([data-gfx-settled]),html.gfx-on .sr.visible:not([data-gfx-settled]){opacity:1;transform:none;filter:blur(0)}

/* ---- self-armed reveals for cards without .sr ---- */
html.gfx-armed .gfx-sr{opacity:0;transform:translateY(30px) scale(.965);filter:blur(10px)}
html.gfx-armed .gfx-sr.gfx-in{opacity:1;transform:none;filter:blur(0);transition:opacity .95s cubic-bezier(.22,1,.36,1) var(--gfx-d,0ms),transform .95s cubic-bezier(.22,1,.36,1) var(--gfx-d,0ms),filter .8s ease var(--gfx-d,0ms)}

/* ---- hero cinema ---- */
html.gfx-on .hero-title-accent{background-size:230% 230%;animation:gfxHue 7s ease-in-out infinite}
@keyframes gfxHue{0%,100%{background-position:0% 40%}50%{background-position:100% 60%}}
html.gfx-on .hero-title{animation:gfxTitleGlow 6s ease-in-out infinite}
@keyframes gfxTitleGlow{0%,100%{text-shadow:0 0 0 rgba(120,193,255,0)}50%{text-shadow:0 0 42px rgba(120,193,255,.16),0 0 90px rgba(200,149,58,.09)}}

/* ---- buttons: living gradient + sheen + magnetic spring ---- */
html.gfx-on .btn-primary{background-size:180% 180%;animation:gfxBtnBg 5s ease infinite}
@keyframes gfxBtnBg{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
html.gfx-on .btn-primary::after{content:"";position:absolute;top:-30%;bottom:-30%;left:-70%;width:34%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.5),transparent);transform:skewX(-18deg);animation:gfxSheen 4.4s cubic-bezier(.4,0,.2,1) 1.4s infinite;pointer-events:none}
@keyframes gfxSheen{0%{left:-70%}42%,100%{left:145%}}
html.gfx-on .portal-btn{position:relative;overflow:hidden}
html.gfx-on .portal-btn::after{content:"";position:absolute;top:-30%;bottom:-30%;left:-70%;width:34%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.4),transparent);transform:skewX(-18deg);animation:gfxSheen 5.2s cubic-bezier(.4,0,.2,1) 2s infinite;pointer-events:none}
.gfx-mag{transition:transform .16s cubic-bezier(.34,1.3,.64,1)!important}
.gfx-mag-release{transition:transform .55s cubic-bezier(.22,1.6,.36,1)!important}

/* ---- card charge: conic energy ring + layered glow ---- */
html.gfx-on .cc,html.gfx-on .oc-card{position:relative}
html.gfx-on .cc::after,html.gfx-on .oc-card::after{content:"";position:absolute;inset:-1px;border-radius:inherit;padding:1px;background:conic-gradient(from var(--gfxa),transparent 0 10%,rgba(120,193,255,.9) 17%,rgba(245,212,154,.95) 25%,transparent 33% 100%);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:0;transition:opacity .35s ease;animation:gfxSpin 3.2s linear infinite;pointer-events:none;z-index:3}
html.gfx-on .cc:hover::after,html.gfx-on .oc-card:hover::after{opacity:1}
@keyframes gfxSpin{to{--gfxa:360deg}}
html.gfx-on .cc:hover,html.gfx-on .edition-card:hover,html.gfx-on .feat:hover,html.gfx-on .oc-card:hover,html.gfx-on .legacy-placard:hover,html.gfx-on .cm-stat:hover,html.gfx-on .cm-step-card:hover,html.gfx-on .cm-timeline-card:hover{box-shadow:0 28px 90px rgba(0,0,0,.5),0 0 44px rgba(61,139,255,.2),0 0 90px rgba(200,149,58,.1),inset 0 1px 0 rgba(255,255,255,.07);border-color:rgba(120,193,255,.42)}

/* ---- nav: flowing light seam + orbiting brand comet ---- */
html.gfx-on .nav.solid::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:1px;background:linear-gradient(90deg,transparent,rgba(61,139,255,.85),rgba(245,212,154,.85),rgba(61,139,255,.85),transparent);background-size:220% 100%;animation:gfxFlow 7s linear infinite;opacity:.65;pointer-events:none}
html.gfx-on .nav-brand-dot{position:relative}
html.gfx-on .nav-brand-dot::after{content:"";position:absolute;inset:-5px;border-radius:50%;border:1px solid rgba(232,184,109,.55);border-top-color:transparent;border-left-color:transparent;animation:gfxOrbit 2.6s linear infinite}
@keyframes gfxOrbit{to{transform:rotate(360deg)}}

/* ---- section label tracer ---- */
html.gfx-on .section-label{position:relative}
html.gfx-on .section-label::after{content:"";position:absolute;left:0;right:0;bottom:-7px;height:1px;background:linear-gradient(90deg,rgba(245,212,154,0),rgba(245,212,154,.85),rgba(61,139,255,0));background-size:200% 100%;animation:gfxFlow 5s linear infinite;opacity:.35;pointer-events:none}

/* ---- richer scrollbar ---- */
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-thumb{background:linear-gradient(rgba(0,80,255,.9),rgba(120,193,255,.8),rgba(200,149,58,.9));border-radius:4px;box-shadow:0 0 8px rgba(61,139,255,.5)}

/* ---- post-warp landing: main site materializes ---- */
html.gfx-landing .hero-content{animation:gfxLand .95s cubic-bezier(.22,1,.36,1) backwards}
html.gfx-landing .nav{animation:gfxLand .8s cubic-bezier(.22,1,.36,1) backwards}
@keyframes gfxLand{from{opacity:0;transform:scale(1.05) translateY(14px);filter:blur(12px)}}
`;

const REVEAL_TARGETS = [
  ".cc", ".feat", ".oc-card", ".edition-card", ".legacy-placard", ".legacy-member",
  ".cinfo", ".gcard", ".cm-stat", ".cm-step-card", ".cm-timeline-card",
  ".cm-award-row", ".podium-side", ".podium-main", ".contact-panel",
].join(",");

const MAGNET_TARGETS = ".btn-primary,.btn-ghost,.nav-cta,.cm-btn,.portal-btn,.lock-enter-btn";

const SPARK_COLORS = [
  "radial-gradient(circle,#f5d49a,#c8953a)",
  "radial-gradient(circle,#c4e4ff,#3d8bff)",
  "radial-gradient(circle,#ffffff,#78c1ff)",
];

export default function GoatedFX() {
  const starsRef = useRef(null);
  const spotRef = useRef(null);
  const barRef = useRef(null);
  const burstRef = useRef(null);

  /* ── DOM engine: reveals, parallax, magnetism, sparks, progress ── */
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const root = document.documentElement;
    if (reduced) return undefined;
    root.classList.add("gfx-on", "gfx-armed");
    if (fine) root.classList.add("gfx-fine");

    const cleanups = [];
    const on = (target, ev, fn, opts) => {
      target.addEventListener(ev, fn, opts);
      cleanups.push(() => target.removeEventListener(ev, fn, opts));
    };

    /* -- reveal + count-up observer -- */
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        io.unobserve(el);
        if (el.classList.contains("gfx-sr")) {
          el.classList.add("gfx-in");
          const delay = parseFloat(el.style.getPropertyValue("--gfx-d")) || 0;
          setTimeout(() => el.classList.remove("gfx-sr", "gfx-in"), delay + 1150);
        }
        if (el.dataset.gfxCount === "ready") runCountUp(el);
      });
    }, { threshold: 0.12 });
    cleanups.push(() => io.disconnect());

    const runCountUp = (el) => {
      const node = el.firstChild;
      if (!node || node.nodeType !== 3) return;
      const m = /^(\d{1,5})(.*)$/.exec(node.nodeValue.trim());
      if (!m) return;
      el.dataset.gfxCount = "done";
      const final = parseInt(m[1], 10);
      const suffix = m[2] || "";
      const dur = 1100;
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        node.nodeValue = String(Math.round(final * eased)) + suffix;
        if (p < 1 && node.isConnected) requestAnimationFrame(step);
        else node.nodeValue = String(final) + suffix;
      };
      requestAnimationFrame(step);
    };

    /* -- scan the page: arm cards, stagger delays, hook counters -- */
    let heroContent = null;
    let heroGrid = null;
    const scan = () => {
      try {
        heroContent = document.querySelector(".hero-content");
        heroGrid = document.querySelector(".hero-grid");
        const groups = new Map();
        document.querySelectorAll(REVEAL_TARGETS).forEach((el) => {
          if (el.classList.contains("sr") || el.dataset.gfxArmed) return;
          el.dataset.gfxArmed = "1";
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.92) return; // already in view: leave untouched
          const parent = el.parentElement || document.body;
          const idx = groups.get(parent) || 0;
          groups.set(parent, idx + 1);
          el.style.setProperty("--gfx-d", `${(idx % 6) * 80}ms`);
          el.classList.add("gfx-sr");
          io.observe(el);
        });
        document.querySelectorAll(".sr").forEach((el, i) => {
          if (el.dataset.gfxStag) return;
          el.dataset.gfxStag = "1";
          if (el.classList.contains("vis") || el.classList.contains("visible")) {
            el.setAttribute("data-gfx-settled", "1");
            return;
          }
          el.style.setProperty("--gfx-d", `${(i % 5) * 60}ms`);
        });
        document.querySelectorAll(".metric-num,.cm-stat strong").forEach((el) => {
          if (el.dataset.gfxCount) return;
          const node = el.firstChild;
          if (node && node.nodeType === 3 && /^\d{1,5}/.test(node.nodeValue.trim())) {
            el.dataset.gfxCount = "ready";
            io.observe(el);
          }
        });
      } catch { /* never break the app for effects */ }
    };
    scan();

    /* settle .sr elements after their reveal so original hover transitions return */
    on(document, "transitionend", (e) => {
      const el = e.target;
      if (el instanceof Element && el.classList.contains("sr") &&
          (el.classList.contains("vis") || el.classList.contains("visible"))) {
        setTimeout(() => el.setAttribute("data-gfx-settled", "1"), 60);
      }
    }, true);

    let mutTimer = 0;
    const mo = new MutationObserver(() => {
      clearTimeout(mutTimer);
      mutTimer = setTimeout(scan, 140);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    cleanups.push(() => { mo.disconnect(); clearTimeout(mutTimer); });

    /* -- pointer state -- */
    let mx = -2000, my = -2000, sx = -2000, sy = -2000;
    if (fine) on(window, "pointermove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });

    /* -- entry-portal warp: main site materializes after the flash -- */
    on(window, "gfx-warp", () => {
      setTimeout(() => {
        root.classList.add("gfx-landing");
        setTimeout(() => root.classList.remove("gfx-landing"), 2200);
      }, 980);
    });

    /* -- magnetic buttons -- */
    if (fine) {
      on(document, "mouseover", (e) => {
        const el = e.target instanceof Element ? e.target.closest(MAGNET_TARGETS) : null;
        if (!el || el.dataset.gfxMag) return;
        el.dataset.gfxMag = "1";
        const move = (ev) => {
          const r = el.getBoundingClientRect();
          const dx = Math.max(-9, Math.min(9, (ev.clientX - (r.left + r.width / 2)) * 0.22));
          const dy = Math.max(-7, Math.min(7, (ev.clientY - (r.top + r.height / 2)) * 0.28));
          el.classList.add("gfx-mag");
          el.classList.remove("gfx-mag-release");
          el.style.transform = `translate(${dx}px,${dy}px)`;
        };
        const leave = () => {
          el.classList.remove("gfx-mag");
          el.classList.add("gfx-mag-release");
          el.style.transform = "";
          setTimeout(() => el.classList.remove("gfx-mag-release"), 600);
        };
        el.addEventListener("mousemove", move);
        el.addEventListener("mouseleave", leave);
        cleanups.push(() => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); });
      }, true);
    }

    /* -- spark bursts on click -- */
    const burst = burstRef.current;
    on(document, "pointerdown", (e) => {
      if (!burst || e.button !== 0) return;
      const t = e.target instanceof Element ? e.target : null;
      if (!t || !t.closest("button,a,[role=button],.cc,.edition-card,.oc-card,.legacy-placard,input[type=submit]")) return;
      if (burst.childElementCount > 70 || typeof burst.animate !== "function") return;
      const x = e.clientX, y = e.clientY;
      const ring = document.createElement("i");
      ring.className = "gfx-ring";
      ring.style.width = ring.style.height = "10px";
      ring.style.transform = `translate(${x - 5}px,${y - 5}px)`;
      burst.appendChild(ring);
      ring.animate(
        [{ transform: `translate(${x - 5}px,${y - 5}px) scale(1)`, opacity: 1 },
         { transform: `translate(${x - 5}px,${y - 5}px) scale(7)`, opacity: 0 }],
        { duration: 620, easing: "cubic-bezier(.16,1,.3,1)" }
      ).onfinish = () => ring.remove();
      const n = 12;
      for (let i = 0; i < n; i++) {
        const s = document.createElement("i");
        s.className = "gfx-spark";
        const size = 3 + Math.random() * 4;
        s.style.width = s.style.height = `${size}px`;
        s.style.background = SPARK_COLORS[i % SPARK_COLORS.length];
        s.style.boxShadow = "0 0 10px rgba(245,212,154,.65)";
        burst.appendChild(s);
        const ang = (Math.PI * 2 * i) / n + Math.random() * 0.6;
        const dist = 34 + Math.random() * 62;
        const dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist - 14;
        s.animate(
          [{ transform: `translate(${x}px,${y}px) scale(1)`, opacity: 1 },
           { transform: `translate(${x + dx}px,${y + dy}px) scale(.15)`, opacity: 0 }],
          { duration: 600 + Math.random() * 350, easing: "cubic-bezier(.16,1,.3,1)" }
        ).onfinish = () => s.remove();
      }
    }, { passive: true });

    /* -- unified animation loop: progress bar, spotlight, hero parallax -- */
    const bar = barRef.current ? barRef.current.firstElementChild : null;
    const spot = spotRef.current;
    let spotHalf = spot ? spot.offsetWidth / 2 : 0;
    on(window, "resize", () => { spotHalf = spot ? spot.offsetWidth / 2 : 0; }, { passive: true });

    let raf = 0, lastProg = -1, running = true;
    const loop = () => {
      if (!running) return;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY || 0;
      const p = max > 0 ? Math.min(y / max, 1) : 0;
      if (bar && Math.abs(p - lastProg) > 0.0008) {
        bar.style.transform = `scaleX(${p})`;
        lastProg = p;
      }
      if (spot && fine) {
        sx += (mx - sx) * 0.09;
        sy += (my - sy) * 0.09;
        spot.style.transform = `translate3d(${sx - spotHalf}px,${sy - spotHalf}px,0)`;
      }
      if (heroContent && fine && window.innerWidth > 760 && y < window.innerHeight * 1.2) {
        heroContent.style.transform = `translate3d(0,${y * 0.16}px,0)`;
        heroContent.style.opacity = String(Math.max(0, 1 - y / 640));
        if (heroGrid) heroGrid.style.transform = `translate3d(0,${y * 0.07}px,0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    on(document, "visibilitychange", () => {
      running = document.visibilityState === "visible";
      if (running) raf = requestAnimationFrame(loop);
      else cancelAnimationFrame(raf);
    });

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
      root.classList.remove("gfx-on", "gfx-armed", "gfx-fine");
    };
  }, []);

  /* ── starfield canvas: twinkle, constellations, meteors, scroll warp ── */
  useEffect(() => {
    const c = starsRef.current;
    if (!c || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const ctx = c.getContext("2d");
    const fine = window.matchMedia("(pointer: fine)").matches;
    let W = 0, H = 0, raf = 0, running = true, lastFrame = 0;
    let mx = -9999, my = -9999;
    let lastY = window.scrollY, vel = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      W = window.innerWidth; H = window.innerHeight;
      c.width = Math.max(1, Math.floor(W * dpr));
      c.height = Math.max(1, Math.floor(H * dpr));
      c.style.width = `${W}px`;
      c.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const isMobile = window.innerWidth < 760;
    const N = isMobile ? 46 : 110;
    const stars = Array.from({ length: N }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.35 + Math.random() * 1.25,
      tw: Math.random() * Math.PI * 2,
      ts: 0.008 + Math.random() * 0.02,
      vx: (Math.random() - 0.5) * 0.06,
      vy: (Math.random() - 0.5) * 0.06,
      gold: Math.random() < 0.16,
    }));
    const meteors = [];
    let nextMeteor = performance.now() + 1800 + Math.random() * 2500;

    /* hyperspace: the entry portal dispatches gfx-warp — stars blast
       radially outward from center like a jump to lightspeed */
    let radialWarp = 0;
    const onWarp = () => { radialWarp = 1.6; };
    window.addEventListener("gfx-warp", onWarp);

    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });

    const draw = (time = 0) => {
      if (!running) return;
      if (time - lastFrame < 22) { raf = requestAnimationFrame(draw); return; }
      lastFrame = time;
      ctx.clearRect(0, 0, W, H);

      const y = window.scrollY;
      vel += ((y - lastY) - vel) * 0.14;
      lastY = y;
      const warp = Math.max(-1, Math.min(1, vel / 30));
      const streak = Math.abs(warp);

      if (radialWarp > 0.02) {
        radialWarp *= 0.95;
        const cx = W / 2, cy = H / 2;
        for (const s of stars) {
          const dxc = s.x - cx, dyc = s.y - cy;
          const d = Math.hypot(dxc, dyc) + 1;
          const ux = dxc / d, uy = dyc / d;
          const len = Math.min(240, (12 + d * 0.22) * radialWarp);
          const grad = ctx.createLinearGradient(s.x, s.y, s.x + ux * len, s.y + uy * len);
          grad.addColorStop(0, s.gold ? "rgba(245,212,154,.9)" : "rgba(196,228,255,.9)");
          grad.addColorStop(1, "rgba(0,80,255,0)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = s.r * 1.1;
          ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x + ux * len, s.y + uy * len); ctx.stroke();
          s.x += ux * radialWarp * 3.2;
          s.y += uy * radialWarp * 3.2;
          if (s.x < -8 || s.x > W + 8 || s.y < -8 || s.y > H + 8) {
            s.x = cx + (Math.random() - 0.5) * W * 0.5;
            s.y = cy + (Math.random() - 0.5) * H * 0.5;
          }
        }
        raf = requestAnimationFrame(draw);
        return;
      }

      for (const s of stars) {
        s.tw += s.ts;
        s.x += s.vx; s.y += s.vy - warp * s.r * 4.2;
        if (s.x < -4) s.x = W + 4; if (s.x > W + 4) s.x = -4;
        if (s.y < -6) s.y = H + 6; if (s.y > H + 6) s.y = -6;
        const a = (0.22 + (Math.sin(s.tw) * 0.5 + 0.5) * 0.5) * (s.gold ? 0.9 : 1);
        const col = s.gold ? `rgba(232,184,109,${a})` : `rgba(160,205,255,${a})`;
        if (streak > 0.06) {
          const len = s.r * 26 * streak * (warp > 0 ? 1 : -1);
          const grad = ctx.createLinearGradient(s.x, s.y, s.x, s.y + len);
          grad.addColorStop(0, col);
          grad.addColorStop(1, "rgba(120,193,255,0)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = s.r;
          ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x, s.y + len); ctx.stroke();
        } else {
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = col; ctx.fill();
        }
      }

      /* constellation web + cursor link */
      if (!isMobile && streak < 0.3) {
        ctx.lineWidth = 0.5;
        for (let i = 0; i < N; i++) {
          const a = stars[i];
          for (let j = i + 1; j < N; j++) {
            const b = stars[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 8100) {
              ctx.strokeStyle = `rgba(96,165,250,${(1 - d2 / 8100) * 0.055})`;
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            }
          }
          if (fine) {
            const dxm = a.x - mx, dym = a.y - my;
            const dm2 = dxm * dxm + dym * dym;
            if (dm2 < 25600) {
              ctx.strokeStyle = `rgba(200,170,110,${(1 - dm2 / 25600) * 0.14})`;
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mx, my); ctx.stroke();
            }
          }
        }
      }

      /* meteors */
      if (time > nextMeteor && meteors.length < 3) {
        const fromLeft = Math.random() < 0.5;
        meteors.push({
          x: fromLeft ? -40 : W * (0.3 + Math.random() * 0.7),
          y: fromLeft ? H * Math.random() * 0.4 : -40,
          vx: (fromLeft ? 1 : -1) * (6.5 + Math.random() * 4),
          vy: 4.5 + Math.random() * 3.5,
          life: 1,
          gold: Math.random() < 0.3,
        });
        nextMeteor = time + 2600 + Math.random() * 4200;
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx; m.y += m.vy; m.life -= 0.012;
        if (m.life <= 0 || m.x < -160 || m.x > W + 160 || m.y > H + 160) { meteors.splice(i, 1); continue; }
        const tail = 15;
        const tx = m.x - m.vx * tail, ty = m.y - m.vy * tail;
        const grad = ctx.createLinearGradient(m.x, m.y, tx, ty);
        const head = m.gold ? "rgba(245,212,154," : "rgba(196,228,255,";
        grad.addColorStop(0, head + 0.9 * m.life + ")");
        grad.addColorStop(0.3, (m.gold ? "rgba(200,149,58," : "rgba(61,139,255,") + 0.35 * m.life + ")");
        grad.addColorStop(1, "rgba(0,80,255,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(tx, ty); ctx.stroke();
        ctx.beginPath(); ctx.arc(m.x, m.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = head + 0.95 * m.life + ")"; ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onVis = () => {
      running = document.visibilityState === "visible";
      if (running) { lastFrame = 0; raf = requestAnimationFrame(draw); }
      else cancelAnimationFrame(raf);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("gfx-warp", onWarp);
      if (fine) window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <>
      <style>{GFX_STYLES}</style>
      <canvas ref={starsRef} className="gfx-stars" aria-hidden="true" />
      <div className="gfx-aurora" aria-hidden="true"><i /><i /><i /></div>
      <div ref={spotRef} className="gfx-spotlight" aria-hidden="true" />
      <div ref={burstRef} className="gfx-burst-layer" aria-hidden="true" />
      <div ref={barRef} className="gfx-progress" aria-hidden="true"><i /></div>
      <div className="gfx-veil" aria-hidden="true"><i /><i /></div>
    </>
  );
}
