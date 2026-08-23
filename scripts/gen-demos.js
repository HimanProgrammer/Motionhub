/* Generates a real, self-contained, animated single-file HTML demo for every template —
   plain CSS (no Tailwind), vanilla JS — so "Preview" can show the actual running website
   instead of just a static image. Run: node scripts/gen-demos.js */
const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "public", "demos");
fs.mkdirSync(OUT_DIR, { recursive: true });

const T = {
  video: "https://videos.pexels.com/video-files/3129671/3129671-uhd_3840_2160_30fps.mp4",
  videoAgency: "https://videos.pexels.com/video-files/2098989/2098989-hd_1920_1080_30fps.mp4",
};

function baseCss(g1, g2) {
  return `
:root{--g1:${g1};--g2:${g2};--bg:#07070c;--text:#f3f3f8;--muted:#a3a8bd;--card:rgba(255,255,255,.05);--border:rgba(255,255,255,.12)}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;overflow-x:hidden}
a{color:inherit;text-decoration:none}
.wrap{max-width:1180px;margin:0 auto;padding:0 24px}
.nav{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;height:70px;backdrop-filter:blur(14px);background:rgba(7,7,12,.65);border-bottom:1px solid var(--border)}
.brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:19px;letter-spacing:-.02em}
.brand i{width:24px;height:24px;border-radius:7px;background:linear-gradient(135deg,var(--g1),var(--g2));box-shadow:0 0 18px color-mix(in srgb,var(--g2) 60%,transparent);animation:pulse 3s ease-in-out infinite}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
.navlinks{display:flex;gap:28px}
.navlinks a{color:var(--muted);font-size:14.5px;font-weight:500;position:relative;transition:color .15s}
.navlinks a:hover{color:var(--text)}
.btn{display:inline-flex;align-items:center;gap:8px;padding:12px 22px;border-radius:999px;font-weight:700;font-size:14.5px;border:1px solid transparent;cursor:pointer;transition:transform .18s ease,box-shadow .18s ease}
.btn-primary{background:linear-gradient(90deg,var(--g1),var(--g2));color:#fff;box-shadow:0 10px 30px color-mix(in srgb,var(--g2) 35%,transparent)}
.btn-primary:hover{transform:translateY(-2px)}
.btn-ghost{background:rgba(255,255,255,.06);border-color:var(--border)}
.btn-ghost:hover{background:rgba(255,255,255,.1);transform:translateY(-2px)}
.reveal{opacity:0;transform:translateY(22px);transition:opacity .7s ease,transform .7s ease}
.reveal.in{opacity:1;transform:none}
footer{padding:34px 0;border-top:1px solid var(--border);color:var(--muted);text-align:center;font-size:13.5px}
`;
}

function revealScript() {
  return `
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=(i%6)*70+'ms';io.observe(el)});
`;
}

function page({ title, css, body, script }) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — MotionHub live demo</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css">
<style>${css}</style></head>
<body>${body}
<script>${revealScript()}${script || ""}</script>
</body></html>`;
}

function nav(brand) {
  return `<nav class="nav"><div class="wrap" style="display:flex;align-items:center;justify-content:space-between;height:100%">
    <div class="brand"><i></i>${brand}</div>
    <div class="navlinks"><a href="#">Home</a><a href="#">Work</a><a href="#">About</a><a href="#">Contact</a></div>
    <a class="btn btn-primary" href="#" style="padding:9px 18px">Get started</a>
  </div></nav>`;
}

/* ---------- Layout: full-bleed video/image hero ---------- */
function heroLayout(t) {
  const mediaTag = t.video
    ? `<video autoplay loop muted playsinline src="${t.video}"></video>`
    : `<img src="${t.img}" alt="">`;
  const css = baseCss(t.g1, t.g2) + `
.hero{position:relative;min-height:92vh;display:flex;align-items:flex-end;overflow:hidden}
.hero video,.hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
.hero::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(4,4,8,.92),rgba(4,4,8,.25) 55%,rgba(4,4,8,.55));z-index:1}
.hero-inner{position:relative;z-index:2;padding:0 24px 70px;max-width:1180px;margin:0 auto;width:100%}
.eyebrow{display:inline-flex;align-items:center;gap:8px;padding:7px 14px;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid var(--border);font-size:13px;margin-bottom:18px}
.eyebrow .dot{width:7px;height:7px;border-radius:50%;background:${t.g2};box-shadow:0 0 8px ${t.g2}}
h1{font-size:clamp(2.2rem,6vw,4.6rem);line-height:1.04;letter-spacing:-.03em;margin:0 0 16px;font-weight:800;max-width:820px}
h1 span{background:linear-gradient(90deg,var(--g1),var(--g2));-webkit-background-clip:text;background-clip:text;color:transparent}
.sub{color:#dfe1ee;font-size:clamp(1rem,2vw,1.2rem);max-width:560px;margin:0 0 30px}
.cta-row{display:flex;gap:14px;flex-wrap:wrap;align-items:center}
.play{width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.3);display:flex;align-items:center;justify-content:center;cursor:pointer}
.scrolldown{position:absolute;left:24px;bottom:24px;z-index:2;display:flex;align-items:center;gap:10px;font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:#c8cadd}
.scrolldown .line{width:1px;height:34px;background:linear-gradient(${t.g1},transparent);animation:down 1.8s ease-in-out infinite}
@keyframes down{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}50.01%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
.section{padding:80px 0}
.grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:22px}
.card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:26px}
.card h3{margin:0 0 8px}
.card p{color:var(--muted);margin:0;font-size:14.5px;line-height:1.6}
`;
  const body = `
${nav(t.title)}
<section class="hero">${mediaTag}
  <div class="hero-inner">
    <span class="eyebrow"><span class="dot"></span>${t.eyebrow}</span>
    <h1>${t.h1a} <span>${t.h1b}</span></h1>
    <p class="sub">${t.sub}</p>
    <div class="cta-row">
      <a class="btn btn-primary" href="#">${t.cta1} <i class="ri-arrow-right-up-line"></i></a>
      <span class="play"><i class="ri-play-fill"></i></span>
      <span style="color:#cfd1e2;font-size:14px">${t.cta2}</span>
    </div>
  </div>
  <div class="scrolldown"><span class="line"></span>SCROLL</div>
</section>
<section class="section wrap">
  <div class="grid3">
    ${t.features.map((f) => `<div class="card reveal"><h3>${f.t}</h3><p>${f.d}</p></div>`).join("")}
  </div>
</section>
<footer>${t.title} — a MotionHub live demo · built to show the prompt in action</footer>
`;
  return page({ title: t.title, css, body });
}

/* ---------- Layout: SaaS gradient hero ---------- */
function saasLayout(t) {
  const css = baseCss(t.g1, t.g2) + `
.hero{position:relative;padding:120px 0 90px;text-align:center;overflow:hidden}
.aurora{position:absolute;inset:-30% -10% auto -10%;height:640px;z-index:0;filter:blur(40px);
  background:radial-gradient(closest-side,color-mix(in srgb,var(--g1) 55%,transparent),transparent 70%) 25% 30%/55% 55% no-repeat,
             radial-gradient(closest-side,color-mix(in srgb,var(--g2) 50%,transparent),transparent 70%) 75% 25%/50% 50% no-repeat;
  animation:drift 14s ease-in-out infinite alternate}
@keyframes drift{0%{transform:translateY(0) scale(1)}100%{transform:translateY(-26px) scale(1.08)}}
.hero .wrap{position:relative;z-index:1}
.pill{display:inline-flex;align-items:center;gap:8px;padding:7px 15px;border-radius:999px;background:var(--card);border:1px solid var(--border);font-size:13px;margin-bottom:22px}
.pill .dot{width:7px;height:7px;border-radius:50%;background:#38ef7d;box-shadow:0 0 8px #38ef7d}
h1{font-size:clamp(2.1rem,5.4vw,3.6rem);line-height:1.08;letter-spacing:-.03em;margin:0 auto 16px;max-width:760px;font-weight:800}
h1 span{background:linear-gradient(90deg,var(--g1),var(--g2));-webkit-background-clip:text;background-clip:text;color:transparent}
.sub{color:var(--muted);font-size:clamp(1rem,2vw,1.15rem);max-width:560px;margin:0 auto 30px}
.cta-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
.mock{max-width:760px;margin:56px auto 0;border-radius:18px;border:1px solid var(--border);background:linear-gradient(160deg,var(--card),rgba(255,255,255,.02));padding:18px;box-shadow:0 30px 80px rgba(0,0,0,.5);animation:float 5s ease-in-out infinite}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
.mock-bar{display:flex;gap:6px;margin-bottom:14px}
.mock-bar i{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.25)}
.mock-body{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.mock-body div{height:60px;border-radius:10px;background:linear-gradient(135deg,color-mix(in srgb,var(--g1) 30%,transparent),color-mix(in srgb,var(--g2) 20%,transparent));border:1px solid var(--border)}
.section{padding:76px 0}
.grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px}
.card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:24px;transition:transform .2s ease,border-color .2s ease}
.card:hover{transform:translateY(-5px);border-color:rgba(255,255,255,.3)}
.card i{font-size:22px;color:var(--g2);margin-bottom:10px;display:block}
.card h3{margin:0 0 6px;font-size:1.02rem}
.card p{margin:0;color:var(--muted);font-size:14px;line-height:1.6}
`;
  const body = `
${nav(t.title)}
<section class="hero"><div class="aurora"></div>
  <div class="wrap">
    <span class="pill"><span class="dot"></span>${t.eyebrow}</span>
    <h1>${t.h1a} <span>${t.h1b}</span></h1>
    <p class="sub">${t.sub}</p>
    <div class="cta-row">
      <a class="btn btn-primary" href="#">${t.cta1}</a>
      <a class="btn btn-ghost" href="#">${t.cta2}</a>
    </div>
    <div class="mock"><div class="mock-bar"><i></i><i></i><i></i></div><div class="mock-body"><div></div><div></div><div></div></div></div>
  </div>
</section>
<section class="section wrap">
  <div class="grid3">
    ${t.features.map((f) => `<div class="card reveal"><i class="${f.icon}"></i><h3>${f.t}</h3><p>${f.d}</p></div>`).join("")}
  </div>
</section>
<footer>${t.title} — a MotionHub live demo · built to show the prompt in action</footer>
`;
  return page({ title: t.title, css, body });
}

/* ---------- Layout: dashboard / app UI ---------- */
function dashboardLayout(t) {
  const css = baseCss(t.g1, t.g2) + `
body{display:flex;min-height:100vh}
.sidebar{width:220px;flex:none;background:#0b0b10;border-right:1px solid var(--border);padding:22px 16px;display:flex;flex-direction:column;gap:6px}
.sidebar .brand{margin-bottom:22px}
.side-link{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;color:var(--muted);font-size:14px;font-weight:600}
.side-link.active{background:color-mix(in srgb,var(--g2) 16%,transparent);color:var(--text);border-left:3px solid var(--g2)}
.main{flex:1;padding:26px 30px;min-width:0}
.topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px}
.topbar h2{margin:0;font-size:1.3rem}
.avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--g1),var(--g2))}
.hero-card{position:relative;border-radius:18px;padding:34px;overflow:hidden;background:linear-gradient(120deg,color-mix(in srgb,var(--g1) 55%,#0b0b10),color-mix(in srgb,var(--g2) 35%,#0b0b10));margin-bottom:22px}
.hero-card h1{margin:0 0 8px;font-size:clamp(1.6rem,3vw,2.3rem);font-weight:800}
.hero-card span{color:color-mix(in srgb,var(--g2) 80%,#fff)}
.hero-card p{margin:0 0 18px;color:#eceefb;max-width:420px}
.stat-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;margin-bottom:22px}
.stat{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:18px}
.stat b{display:block;font-size:1.6rem}
.stat span{color:var(--muted);font-size:13px}
.ring{width:64px;height:64px;border-radius:50%;background:conic-gradient(var(--g2) 75%,rgba(255,255,255,.1) 0);display:flex;align-items:center;justify-content:center;margin:0 auto 6px}
.ring b{background:#0b0b10;width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px}
.panel{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:22px}
`;
  const body = `
<div class="sidebar">
  <div class="brand"><i></i>${t.title.split(" ")[0]}</div>
  <a class="side-link active" href="#"><i class="ri-home-5-line"></i>Home</a>
  <a class="side-link" href="#"><i class="ri-puzzle-line"></i>Puzzles</a>
  <a class="side-link" href="#"><i class="ri-bar-chart-2-line"></i>Stats</a>
  <a class="side-link" href="#"><i class="ri-settings-3-line"></i>Settings</a>
</div>
<div class="main">
  <div class="topbar"><h2>${t.eyebrow}</h2><div class="avatar"></div></div>
  <div class="hero-card reveal">
    <h1>${t.h1a} <span>${t.h1b}</span></h1>
    <p>${t.sub}</p>
    <a class="btn btn-primary" href="#">${t.cta1} <i class="ri-arrow-right-line"></i></a>
  </div>
  <div class="stat-row">
    ${t.features.slice(0, 4).map((f) => `<div class="stat reveal"><div class="ring"><b>75%</b></div><span>${f.t}</span></div>`).join("")}
  </div>
  <div class="panel reveal"><h3 style="margin-top:0">${t.cta2}</h3><p style="color:var(--muted);font-size:14px">${t.sub}</p></div>
</div>
`;
  return page({ title: t.title, css, body });
}

/* ---------- Template data ---------- */
const items = [
  { id: "summit-video-hero", layout: "hero", title: "SUMMIT", g1: "#0b1f3a", g2: "#F4BA3B", video: T.video,
    eyebrow: "Adventure & Travel", h1a: "Explore.", h1b: "Dream.", sub: "We inspire journeys that awaken curiosity and create unforgettable experiences.",
    cta1: "Start Your Journey", cta2: "Watch the reel",
    features: [{ t: "Cinematic hero", d: "Full-bleed ambient video with a glass nav and kinetic type." }, { t: "Video modal", d: "A fullscreen showreel with sound toggle." }, { t: "Fully responsive", d: "Mobile drawer, 60fps transforms only." }] },
  { id: "nova-studio-hero", layout: "hero", title: "NOVA", g1: "#0e0e0e", g2: "#C6FF3D", img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80",
    eyebrow: "Available for new work — 2026", h1a: "We build brands", h1b: "that move.", sub: "A split-screen creative studio hero with a cursor-tilt image panel and magnetic CTA.",
    cta1: "See our work", cta2: "Showreel",
    features: [{ t: "3D tilt panel", d: "Cover image tilts toward the cursor with a moving glare." }, { t: "Magnetic CTA", d: "The primary button eases toward the pointer." }, { t: "Client marquee", d: "Auto-scrolling logos, pauses on hover." }] },
  { id: "aurora-saas-hero", layout: "saas", title: "Aurora", g1: "#6d5efc", g2: "#00d4ff",
    eyebrow: "New — v2.0 is live", h1a: "Ship your product", h1b: "faster than ever.", sub: "An animated aurora gradient hero for modern SaaS — pure CSS, no image assets.",
    cta1: "Get started", cta2: "Watch demo",
    features: [{ icon: "ri-flashlight-line", t: "Blazing fast", d: "Optimized for Core Web Vitals out of the box." }, { icon: "ri-shield-check-line", t: "Secure by default", d: "RLS-backed data access, zero config." }, { icon: "ri-stack-line", t: "Composable", d: "Drop-in sections that stay on-brand." }] },
  { id: "horizon-agency-video", layout: "hero", title: "HORIZON", g1: "#101014", g2: "#ff5f6d", video: T.videoAgency,
    eyebrow: "Digital Agency", h1a: "We make brands", h1b: "impossible to ignore.", sub: "An oversized, full-bleed video hero with a services marquee and award chips.",
    cta1: "See the work", cta2: "Watch reel",
    features: [{ t: "Oversized type", d: "clamp()-driven display headline with a coral highlight." }, { t: "Services marquee", d: "Auto-scrolling strip that pauses on hover." }, { t: "Award chips", d: "\"50+ projects · 12 awards\" bottom-right." }] },
  { id: "lumen-portfolio-hero", layout: "hero", title: "LUMEN", g1: "#1a1a2e", g2: "#e94560", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=80",
    eyebrow: "Selected · 2020–2026", h1a: "Light,", h1b: "framed.", sub: "A minimal photographer/designer portfolio with a clip-path image reveal.",
    cta1: "View selected work", cta2: "About",
    features: [{ t: "Clip-path reveal", d: "The hero image wipes in on load." }, { t: "Editorial spacing", d: "Restrained, serif-led typography." }, { t: "Commission chip", d: "A pulsing \"available\" indicator." }] },
  { id: "vertex-web3-hero", layout: "saas", title: "VERTEX", g1: "#0f0c29", g2: "#00f0ff",
    eyebrow: "Protocol v3 · mainnet live", h1a: "The future is", h1b: "decentralized.", sub: "A neon Web3 hero with an animated perspective grid floor and a floating token.",
    cta1: "Launch app", cta2: "Read docs",
    features: [{ icon: "ri-coin-line", t: "$2.4B TVL", d: "Audited, non-custodial, battle-tested." }, { icon: "ri-wallet-3-line", t: "180k wallets", d: "Connected across 6 chains." }, { icon: "ri-flashlight-line", t: "0.2s finality", d: "Instant settlement, near-zero fees." }] },
  { id: "bento-features", layout: "saas", title: "Bento Grid", g1: "#11998e", g2: "#38ef7d",
    eyebrow: "Everything you need", h1a: "One platform,", h1b: "every workflow.", sub: "An Apple-style bento grid of feature cards with hover lift and scroll reveal.",
    cta1: "Explore features", cta2: "View pricing",
    features: [{ icon: "ri-apps-2-line", t: "Modular cards", d: "Asymmetric grid, some spanning 2 columns." }, { icon: "ri-cursor-line", t: "Hover lift", d: "Border glows, icon animates on hover." }, { icon: "ri-smartphone-line", t: "Collapses on mobile", d: "Single column, no layout shift." }] },
  { id: "flux-pricing-section", layout: "saas", title: "FLUX Pricing", g1: "#2193b0", g2: "#6dd5ed",
    eyebrow: "Simple, transparent pricing", h1a: "Plans that", h1b: "grow with you.", sub: "A 3-tier pricing block with an animated monthly/yearly toggle and count-up prices.",
    cta1: "Choose Pro", cta2: "Compare plans",
    features: [{ icon: "ri-toggle-line", t: "Animated toggle", d: "Prices count up/down, \"Save 20%\" badge on yearly." }, { icon: "ri-medal-line", t: "Highlighted plan", d: "Gradient border + \"Most popular\" ribbon." }, { icon: "ri-checkbox-circle-line", t: "Clear feature lists", d: "Tick rows per tier, no fine print." }] },
  { id: "claude-fullstack", layout: "dashboard", title: "App Starter", g1: "#4776e6", g2: "#8e54e9",
    eyebrow: "Dashboard", h1a: "Ship a full-stack", h1b: "app in one prompt.", sub: "Auth, a protected dashboard, and RLS-backed data — scaffolded by Claude.",
    cta1: "View spec", cta2: "What's included",
    features: [{ t: "Auth" }, { t: "Projects" }, { t: "RLS" }, { t: "Dark theme" }] },
  { id: "claude-landing", layout: "saas", title: "One-Shot Landing", g1: "#00c6ff", g2: "#0072ff",
    eyebrow: "One prompt, one file", h1a: "Describe it once,", h1b: "launch today.", sub: "A complete, self-contained animated landing page Claude outputs in a single file.",
    cta1: "Get the prompt", cta2: "See sections",
    features: [{ icon: "ri-file-code-line", t: "Single file", d: "One index.html, inline style + script." }, { icon: "ri-layout-4-line", t: "8 sections", d: "Nav → hero → pricing → FAQ → footer." }, { icon: "ri-palette-line", t: "One accent color", d: "Cohesive dark theme via CSS variables." }] },
  { id: "claude-admin-dashboard", layout: "dashboard", title: "Admin CRUD", g1: "#373b44", g2: "#4286f4",
    eyebrow: "Admin", h1a: "Full CRUD,", h1b: "zero boilerplate.", sub: "A login-protected admin dashboard with search, filters, and a raw-JSON edit mode.",
    cta1: "View spec", cta2: "What's included",
    features: [{ t: "Search" }, { t: "Filters" }, { t: "JSON mode" }, { t: "RLS" }] },
  { id: "claude-refactor", layout: "dashboard", title: "Refactor Assistant", g1: "#525252", g2: "#3d72b4",
    eyebrow: "Code review", h1a: "Cleaner code,", h1b: "same behavior.", sub: "Turns Claude into a meticulous refactoring partner — naming, duplication, guard clauses.",
    cta1: "View spec", cta2: "What it checks",
    features: [{ t: "Naming" }, { t: "Duplication" }, { t: "Guard clauses" }, { t: "Edge cases" }] },
  { id: "checkmate-chess-dashboard", layout: "dashboard", title: "CHECKMATE", g1: "#0d0d0f", g2: "#e8b64c",
    eyebrow: "Good Evening, Master 👑", h1a: "Every move shapes", h1b: "your future.", sub: "Think. Plan. Execute. Become unstoppable.",
    cta1: "Play now", cta2: "Today's challenge",
    features: [{ t: "Rating" }, { t: "Puzzles solved" }, { t: "Focus" }, { t: "Lessons" }] },
];

const layouts = { hero: heroLayout, saas: saasLayout, dashboard: dashboardLayout };
for (const t of items) {
  const html = layouts[t.layout](t);
  fs.writeFileSync(path.join(OUT_DIR, `${t.id}.html`), html);
  console.log("wrote", t.id + ".html", html.length, "bytes");
}
console.log("done:", items.length, "demos in", OUT_DIR);
