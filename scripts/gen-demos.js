/* Generates a real, self-contained, animated MULTI-SECTION website demo for every
   template — plain CSS (no Tailwind), vanilla JS — so "Preview" shows a complete
   running site (nav → hero → about → work → features → pricing/stats → testimonials
   → FAQ → CTA → footer), not just a hero snippet.
   Run: node scripts/gen-demos.js */
const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "public", "demos");
fs.mkdirSync(OUT_DIR, { recursive: true });

const VIDEO_TRAVEL = "https://videos.pexels.com/video-files/3129671/3129671-uhd_3840_2160_30fps.mp4";
const VIDEO_AGENCY = "https://videos.pexels.com/video-files/2098989/2098989-hd_1920_1080_30fps.mp4";

const GALLERY = [
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&q=80",
  "https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?w=900&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&q=80",
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=900&q=80",
  "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=900&q=80",
];
const GALLERY_ALT = [
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=900&q=80",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&q=80",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=900&q=80",
  "https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=900&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&q=80",
  "https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?w=900&q=80",
];
const AVATARS = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
];

/* ---------------------------------- CSS ---------------------------------- */
function baseCss(g1, g2, opts = {}) {
  const font = opts.font || "Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif";
  const display = opts.display || font;
  return `
:root{--g1:${g1};--g2:${g2};--bg:#07070c;--bg2:#0c0c14;--text:#f3f3f8;--muted:#a3a8bd;--card:rgba(255,255,255,.05);--border:rgba(255,255,255,.12)}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--text);font-family:${font};overflow-x:hidden;line-height:1.6}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
h1,h2,h3{font-family:${display};letter-spacing:-.02em;line-height:1.12}
.wrap{max-width:1180px;margin:0 auto;padding:0 24px}
.acc{background:linear-gradient(90deg,var(--g1),var(--g2));-webkit-background-clip:text;background-clip:text;color:transparent}

/* progress bar */
.prog{position:fixed;top:0;left:0;height:3px;width:0;z-index:200;background:linear-gradient(90deg,var(--g1),var(--g2));box-shadow:0 0 12px color-mix(in srgb,var(--g2) 70%,transparent)}

/* nav */
.nav{position:sticky;top:0;z-index:100;backdrop-filter:blur(14px);background:rgba(7,7,12,.7);border-bottom:1px solid var(--border)}
.nav-in{display:flex;align-items:center;justify-content:space-between;height:70px}
.brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:19px;font-family:${display}}
.brand i{width:24px;height:24px;border-radius:7px;background:linear-gradient(135deg,var(--g1),var(--g2));box-shadow:0 0 18px color-mix(in srgb,var(--g2) 60%,transparent);animation:pulse 3s ease-in-out infinite}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.13)}}
.navlinks{display:flex;gap:28px}
.navlinks a{color:var(--muted);font-size:14.5px;font-weight:500;position:relative;transition:color .15s}
.navlinks a::after{content:"";position:absolute;left:0;right:100%;bottom:-5px;height:2px;background:linear-gradient(90deg,var(--g1),var(--g2));border-radius:2px;transition:right .25s ease}
.navlinks a:hover{color:var(--text)}
.navlinks a:hover::after{right:0}
.burger{display:none;background:none;border:0;color:var(--text);font-size:24px;cursor:pointer}
.drawer{display:none;flex-direction:column;gap:16px;padding:18px 24px;border-bottom:1px solid var(--border);background:var(--bg2)}
.drawer.open{display:flex}

/* buttons */
.btn{display:inline-flex;align-items:center;gap:8px;padding:12px 22px;border-radius:999px;font-weight:700;font-size:14.5px;border:1px solid transparent;cursor:pointer;font-family:inherit;transition:transform .18s ease,box-shadow .18s ease,background .18s ease}
.btn:active{transform:scale(.97)}
.btn-primary{background:linear-gradient(90deg,var(--g1),var(--g2));color:#fff;box-shadow:0 10px 30px color-mix(in srgb,var(--g2) 35%,transparent)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 16px 40px color-mix(in srgb,var(--g2) 50%,transparent)}
.btn-ghost{background:rgba(255,255,255,.06);border-color:var(--border);color:var(--text)}
.btn-ghost:hover{background:rgba(255,255,255,.11);transform:translateY(-2px)}

/* sections */
.section{padding:92px 0}
.section.alt{background:var(--bg2)}
.shead{max-width:640px;margin:0 auto 46px;text-align:center}
.shead .kicker{display:inline-block;font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--g2);margin-bottom:12px}
.shead h2{font-size:clamp(1.8rem,4vw,2.7rem);margin:0 0 12px}
.shead p{color:var(--muted);margin:0}

/* reveal */
.reveal{opacity:0;transform:translateY(26px);transition:opacity .75s cubic-bezier(.16,1,.3,1),transform .75s cubic-bezier(.16,1,.3,1)}
.reveal.in{opacity:1;transform:none}

/* marquee */
.marquee{overflow:hidden;border-block:1px solid var(--border);padding:16px 0;background:var(--bg2)}
.marquee-track{display:flex;gap:52px;width:max-content;animation:scroll 26s linear infinite}
.marquee:hover .marquee-track{animation-play-state:paused}
.marquee span{font-size:14px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);white-space:nowrap}
@keyframes scroll{to{transform:translateX(-50%)}}

/* stats */
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:26px;text-align:center}
.stats b{display:block;font-size:clamp(1.9rem,4vw,2.7rem);font-weight:800;font-family:${display};font-variant-numeric:tabular-nums}
.stats span{color:var(--muted);font-size:14px}

/* work gallery */
.work{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}
.tile{position:relative;border-radius:16px;overflow:hidden;aspect-ratio:4/3;border:1px solid var(--border);cursor:pointer}
.tile img{width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(.16,1,.3,1)}
.tile:hover img{transform:scale(1.08)}
.tile-cap{position:absolute;inset:auto 0 0 0;padding:20px;background:linear-gradient(to top,rgba(4,4,8,.92),transparent);transform:translateY(8px);opacity:.85;transition:.35s ease}
.tile:hover .tile-cap{transform:none;opacity:1}
.tile-cap h4{margin:0 0 3px;font-size:1.05rem}
.tile-cap p{margin:0;font-size:13px;color:var(--muted)}

/* feature cards */
.grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:22px}
.card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:28px;transition:transform .25s ease,border-color .25s ease,box-shadow .25s ease}
.card:hover{transform:translateY(-6px);border-color:color-mix(in srgb,var(--g2) 45%,transparent);box-shadow:0 20px 50px rgba(0,0,0,.4)}
.card .ico{font-size:24px;color:var(--g2);margin-bottom:12px;display:block}
.card h3{margin:0 0 8px;font-size:1.08rem}
.card p{color:var(--muted);margin:0;font-size:14.5px}

/* testimonial carousel */
.quotes{position:relative;max-width:780px;margin:0 auto;min-height:210px}
.quote{position:absolute;inset:0;opacity:0;transform:translateY(14px);transition:.6s cubic-bezier(.16,1,.3,1);text-align:center;pointer-events:none}
.quote.on{opacity:1;transform:none;pointer-events:auto}
.quote .mark{font-size:52px;line-height:1;color:var(--g2);opacity:.5;font-family:Georgia,serif}
.quote p{font-size:clamp(1.05rem,2.2vw,1.35rem);margin:6px 0 20px}
.qwho{display:flex;align-items:center;justify-content:center;gap:12px}
.qwho img{width:44px;height:44px;border-radius:50%;object-fit:cover}
.qwho b{display:block;font-size:14.5px}
.qwho span{color:var(--muted);font-size:13px}
.dots{display:flex;gap:8px;justify-content:center;margin-top:26px}
.dots i{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.22);cursor:pointer;transition:.3s}
.dots i.on{width:26px;border-radius:999px;background:linear-gradient(90deg,var(--g1),var(--g2))}

/* pricing */
.tiers{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:22px;align-items:stretch}
.tier{background:var(--card);border:1px solid var(--border);border-radius:18px;padding:30px;display:flex;flex-direction:column}
.tier.pop{background:linear-gradient(var(--bg2),var(--bg2)) padding-box,linear-gradient(135deg,var(--g1),var(--g2)) border-box;border:1px solid transparent;position:relative}
.ribbon{position:absolute;top:-11px;left:50%;transform:translateX(-50%);font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;padding:5px 14px;border-radius:999px;background:linear-gradient(90deg,var(--g1),var(--g2));color:#fff}
.tier h3{margin:0 0 4px;font-size:1.1rem}
.tier .price{font-size:2.4rem;font-weight:800;font-family:${display};margin:12px 0 2px}
.tier .per{color:var(--muted);font-size:13px;margin-bottom:20px}
.tier ul{list-style:none;padding:0;margin:0 0 24px;display:flex;flex-direction:column;gap:11px;flex:1}
.tier li{display:flex;gap:9px;font-size:14.5px;color:var(--muted)}
.tier li i{color:var(--g2)}

/* faq */
.faq{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:12px}
.q{background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden}
.q button{width:100%;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:20px 22px;background:none;border:0;color:var(--text);font:inherit;font-weight:650;text-align:left;cursor:pointer}
.q button i{transition:transform .3s ease;color:var(--g2)}
.q.open button i{transform:rotate(45deg)}
.q .a{max-height:0;overflow:hidden;transition:max-height .35s ease}
.q.open .a{max-height:240px}
.q .a p{margin:0;padding:0 22px 20px;color:var(--muted);font-size:14.5px}

/* cta */
.cta-band{position:relative;overflow:hidden;border-radius:24px;padding:64px 32px;text-align:center;background:linear-gradient(130deg,color-mix(in srgb,var(--g1) 65%,#0a0a12),color-mix(in srgb,var(--g2) 40%,#0a0a12))}
.cta-band h2{font-size:clamp(1.8rem,4vw,2.7rem);margin:0 0 14px}
.cta-band p{color:#e9ebf8;margin:0 auto 28px;max-width:520px}

/* footer */
footer{border-top:1px solid var(--border);padding:56px 0 30px;background:var(--bg2)}
.fgrid{display:grid;grid-template-columns:2fr repeat(3,1fr);gap:34px;margin-bottom:38px}
.fgrid p{color:var(--muted);font-size:14px;margin:12px 0 0;max-width:280px}
.fcol h5{margin:0 0 14px;font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:var(--text)}
.fcol a{display:block;color:var(--muted);font-size:14px;margin-bottom:9px;transition:color .15s}
.fcol a:hover{color:var(--text)}
.fbot{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;padding-top:24px;border-top:1px solid var(--border);color:var(--muted);font-size:13.5px}
.socials{display:flex;gap:14px}
.socials a{width:34px;height:34px;border-radius:50%;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;transition:.2s}
.socials a:hover{background:var(--card);transform:translateY(-2px);color:var(--g2)}

@media(max-width:860px){
  .navlinks{display:none}.burger{display:block}
  .fgrid{grid-template-columns:1fr 1fr;gap:26px}
}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.reveal{opacity:1;transform:none}}
`;
}

/* ------------------------------- fragments ------------------------------- */
function nav(t, links) {
  const ls = links.map((l) => `<a href="#${l.id}">${l.label}</a>`).join("");
  return `<div class="prog" id="prog"></div>
<nav class="nav"><div class="wrap nav-in">
  <div class="brand"><i></i>${t.brand}</div>
  <div class="navlinks">${ls}</div>
  <div style="display:flex;align-items:center;gap:12px">
    <a class="btn btn-primary" href="#cta" style="padding:9px 18px">${t.navCta}</a>
    <button class="burger" id="burger" aria-label="Menu"><i class="ri-menu-3-line"></i></button>
  </div>
</div><div class="drawer" id="drawer">${ls}</div></nav>`;
}

function marquee(words) {
  const row = words.map((w) => `<span>${w}</span>`).join("");
  return `<div class="marquee"><div class="marquee-track">${row}${row}</div></div>`;
}

function statsSection(stats) {
  return `<section class="section" id="about"><div class="wrap">
  <div class="stats">
    ${stats.map((s) => `<div class="reveal"><b data-count="${s.n}">0</b><span>${s.l}</span></div>`).join("")}
  </div>
</div></section>`;
}

function workSection(t) {
  const imgs = t.gallery || GALLERY;
  return `<section class="section alt" id="work"><div class="wrap">
  <div class="shead reveal"><span class="kicker">${t.workKicker}</span><h2>${t.workTitle}</h2><p>${t.workSub}</p></div>
  <div class="work">
    ${t.projects.map((p, i) => `<div class="tile reveal"><img src="${imgs[i % imgs.length]}" alt="${p.t}" loading="lazy"><div class="tile-cap"><h4>${p.t}</h4><p>${p.c}</p></div></div>`).join("")}
  </div>
</div></section>`;
}

function featuresSection(t) {
  return `<section class="section" id="features"><div class="wrap">
  <div class="shead reveal"><span class="kicker">${t.featKicker}</span><h2>${t.featTitle}</h2><p>${t.featSub}</p></div>
  <div class="grid3">
    ${t.features.map((f) => `<div class="card reveal"><i class="ico ${f.icon || "ri-sparkling-line"}"></i><h3>${f.t}</h3><p>${f.d}</p></div>`).join("")}
  </div>
</div></section>`;
}

function testimonialsSection(t) {
  return `<section class="section alt" id="reviews"><div class="wrap">
  <div class="shead reveal"><span class="kicker">Testimonials</span><h2>${t.revTitle}</h2></div>
  <div class="quotes">
    ${t.reviews.map((r, i) => `<div class="quote${i === 0 ? " on" : ""}"><div class="mark">&ldquo;</div><p>${r.q}</p><div class="qwho"><img src="${AVATARS[i % AVATARS.length]}" alt=""><div style="text-align:left"><b>${r.n}</b><span>${r.r}</span></div></div></div>`).join("")}
  </div>
  <div class="dots" id="dots">${t.reviews.map((_, i) => `<i class="${i === 0 ? "on" : ""}" data-i="${i}"></i>`).join("")}</div>
</div></section>`;
}

function pricingSection(t) {
  return `<section class="section" id="pricing"><div class="wrap">
  <div class="shead reveal"><span class="kicker">Pricing</span><h2>${t.priceTitle}</h2><p>${t.priceSub}</p></div>
  <div class="tiers">
    ${t.tiers.map((p) => `<div class="tier${p.pop ? " pop" : ""} reveal">${p.pop ? '<span class="ribbon">Most popular</span>' : ""}
      <h3>${p.n}</h3><div class="price">${p.p}</div><div class="per">${p.per}</div>
      <ul>${p.f.map((x) => `<li><i class="ri-check-line"></i>${x}</li>`).join("")}</ul>
      <a class="btn ${p.pop ? "btn-primary" : "btn-ghost"}" href="#cta">${p.cta}</a>
    </div>`).join("")}
  </div>
</div></section>`;
}

function faqSection(t) {
  return `<section class="section alt" id="faq"><div class="wrap">
  <div class="shead reveal"><span class="kicker">FAQ</span><h2>Questions, answered</h2></div>
  <div class="faq">
    ${t.faq.map((f, i) => `<div class="q${i === 0 ? " open" : ""}"><button><span>${f.q}</span><i class="ri-add-line"></i></button><div class="a"><p>${f.a}</p></div></div>`).join("")}
  </div>
</div></section>`;
}

function ctaSection(t) {
  return `<section class="section" id="cta"><div class="wrap">
  <div class="cta-band reveal">
    <h2>${t.ctaTitle}</h2><p>${t.ctaSub}</p>
    <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
      <a class="btn btn-primary" href="#">${t.cta1}</a>
      <a class="btn btn-ghost" href="#">${t.cta2}</a>
    </div>
  </div>
</div></section>`;
}

function footer(t) {
  return `<footer><div class="wrap">
  <div class="fgrid">
    <div><div class="brand"><i></i>${t.brand}</div><p>${t.footBlurb}</p></div>
    <div class="fcol"><h5>Product</h5><a href="#features">Features</a><a href="#pricing">Pricing</a><a href="#work">Showcase</a><a href="#faq">FAQ</a></div>
    <div class="fcol"><h5>Company</h5><a href="#about">About</a><a href="#">Careers</a><a href="#">Blog</a><a href="#">Press</a></div>
    <div class="fcol"><h5>Legal</h5><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Security</a><a href="#">Cookies</a></div>
  </div>
  <div class="fbot">
    <span>© 2026 ${t.brand}. A MotionHub live demo.</span>
    <div class="socials">
      <a href="#"><i class="ri-twitter-x-line"></i></a><a href="#"><i class="ri-instagram-line"></i></a>
      <a href="#"><i class="ri-linkedin-line"></i></a><a href="#"><i class="ri-github-line"></i></a>
    </div>
  </div>
</div></footer>`;
}

function commonScript() {
  return `
// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
// scroll progress
const prog=document.getElementById('prog');
addEventListener('scroll',()=>{const h=document.documentElement,m=h.scrollHeight-h.clientHeight;prog.style.width=(m>0?h.scrollTop/m*100:0)+'%'},{passive:true});
// mobile drawer
const bg=document.getElementById('burger'),dw=document.getElementById('drawer');
if(bg)bg.onclick=()=>dw.classList.toggle('open');
if(dw)dw.querySelectorAll('a').forEach(a=>a.onclick=()=>dw.classList.remove('open'));
// count-up stats
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,raw=el.dataset.count,num=parseFloat(raw.replace(/[^0-9.]/g,'')),suf=raw.replace(/[0-9.,]/g,'');const t0=performance.now();
(function tick(now){const p=Math.min(1,(now-t0)/1400),v=num*(1-Math.pow(1-p,3));el.textContent=(num>=1000?Math.round(v).toLocaleString():(num%1?v.toFixed(1):Math.round(v)))+suf;if(p<1)requestAnimationFrame(tick)})(t0);
cio.unobserve(el)}),{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));
// testimonials
const qs=[...document.querySelectorAll('.quote')],ds=[...document.querySelectorAll('.dots i')];let qi=0,qt;
function goQ(i){qs.forEach((q,n)=>q.classList.toggle('on',n===i));ds.forEach((d,n)=>d.classList.toggle('on',n===i));qi=i}
function autoQ(){qt=setInterval(()=>goQ((qi+1)%qs.length),6000)}
ds.forEach(d=>d.onclick=()=>{clearInterval(qt);goQ(+d.dataset.i);autoQ()});
if(qs.length>1)autoQ();
const qw=document.querySelector('.quotes');
if(qw){qw.onmouseenter=()=>clearInterval(qt);qw.onmouseleave=autoQ}
// faq
document.querySelectorAll('.q button').forEach(b=>b.onclick=()=>b.parentElement.classList.toggle('open'));
`;
}

function page({ title, css, body, script }) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — MotionHub live demo</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet">
<style>${css}</style></head>
<body>${body}
<script>${commonScript()}${script || ""}</script>
</body></html>`;
}

const NAVLINKS = [
  { id: "about", label: "About" }, { id: "work", label: "Work" },
  { id: "features", label: "Features" }, { id: "pricing", label: "Pricing" }, { id: "faq", label: "FAQ" },
];

/* ------------------------------- layouts -------------------------------- */
function heroLayout(t) {
  const media = t.video
    ? `<video autoplay loop muted playsinline src="${t.video}"></video>`
    : `<img src="${t.img}" alt="">`;
  const css = baseCss(t.g1, t.g2, t.fonts) + `
.hero{position:relative;min-height:94vh;display:flex;align-items:flex-end;overflow:hidden}
.hero video,.hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;animation:kb 22s ease-in-out infinite alternate}
@keyframes kb{from{transform:scale(1)}to{transform:scale(1.09)}}
.hero::after{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(to top,rgba(4,4,8,.95),rgba(4,4,8,.2) 55%,rgba(4,4,8,.6))}
.hero-in{position:relative;z-index:2;width:100%;max-width:1180px;margin:0 auto;padding:0 24px 84px}
.eyebrow{display:inline-flex;align-items:center;gap:8px;padding:7px 15px;border-radius:999px;background:rgba(255,255,255,.09);border:1px solid var(--border);font-size:13px;margin-bottom:20px;backdrop-filter:blur(8px)}
.eyebrow .dot{width:7px;height:7px;border-radius:50%;background:var(--g2);box-shadow:0 0 9px var(--g2);animation:pulse 2s ease-in-out infinite}
.hero h1{font-size:clamp(2.4rem,6.4vw,4.9rem);margin:0 0 18px;font-weight:800;max-width:880px}
.hero h1 .ln{display:block;opacity:0;transform:translateY(26px);animation:rise .9s cubic-bezier(.16,1,.3,1) forwards}
.hero h1 .ln:nth-child(2){animation-delay:.13s}
@keyframes rise{to{opacity:1;transform:none}}
.hero .sub{color:#e2e4f0;font-size:clamp(1rem,2vw,1.22rem);max-width:560px;margin:0 0 32px;opacity:0;animation:rise .9s .3s cubic-bezier(.16,1,.3,1) forwards}
.cta-row{display:flex;gap:14px;flex-wrap:wrap;align-items:center;opacity:0;animation:rise .9s .42s cubic-bezier(.16,1,.3,1) forwards}
.play{width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.32);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:.25s;backdrop-filter:blur(8px)}
.play:hover{background:rgba(255,255,255,.22);transform:scale(1.08)}
.scrolldown{position:absolute;right:26px;bottom:30px;z-index:2;display:flex;align-items:center;gap:11px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#c8cadd;writing-mode:vertical-rl}
.scrolldown .line{width:1px;height:46px;background:linear-gradient(var(--g2),transparent);animation:down 1.9s ease-in-out infinite}
@keyframes down{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}50.01%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
.split{display:grid;grid-template-columns:1fr 1fr;gap:52px;align-items:center}
.split img{border-radius:18px;aspect-ratio:4/3;object-fit:cover;border:1px solid var(--border)}
.split h2{font-size:clamp(1.7rem,3.6vw,2.5rem);margin:0 0 16px}
.split p{color:var(--muted);margin:0 0 16px}
@media(max-width:860px){.split{grid-template-columns:1fr;gap:30px}}
`;
  const body = `
${nav(t, NAVLINKS)}
<section class="hero">${media}
  <div class="hero-in">
    <span class="eyebrow"><span class="dot"></span>${t.eyebrow}</span>
    <h1><span class="ln">${t.h1a}</span><span class="ln acc">${t.h1b}</span></h1>
    <p class="sub">${t.sub}</p>
    <div class="cta-row">
      <a class="btn btn-primary" href="#work">${t.cta1} <i class="ri-arrow-right-up-line"></i></a>
      <span class="play"><i class="ri-play-fill"></i></span><span style="color:#d3d5e4;font-size:14px">${t.cta2}</span>
    </div>
  </div>
  <div class="scrolldown"><span class="line"></span>Scroll</div>
</section>
${marquee(t.marquee)}
<section class="section"><div class="wrap"><div class="split">
  <div class="reveal"><img src="${(t.gallery || GALLERY)[2]}" alt="" loading="lazy"></div>
  <div class="reveal"><span class="kicker" style="color:var(--g2);font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase">${t.aboutKicker}</span>
    <h2>${t.aboutTitle}</h2><p>${t.aboutBody}</p><a class="btn btn-ghost" href="#work">${t.cta1}</a></div>
</div></div></section>
${statsSection(t.stats)}
${workSection(t)}
${featuresSection(t)}
${testimonialsSection(t)}
${pricingSection(t)}
${faqSection(t)}
${ctaSection(t)}
${footer(t)}`;
  return page({ title: t.brand, css, body });
}

function saasLayout(t) {
  const css = baseCss(t.g1, t.g2, t.fonts) + `
.hero{position:relative;padding:130px 0 96px;text-align:center;overflow:hidden}
.aurora{position:absolute;inset:-32% -12% auto -12%;height:680px;z-index:0;filter:blur(46px);
 background:radial-gradient(closest-side,color-mix(in srgb,var(--g1) 58%,transparent),transparent 70%) 24% 30%/56% 56% no-repeat,
            radial-gradient(closest-side,color-mix(in srgb,var(--g2) 52%,transparent),transparent 70%) 76% 24%/52% 52% no-repeat,
            radial-gradient(closest-side,rgba(250,113,205,.28),transparent 70%) 52% 70%/46% 46% no-repeat;
 animation:drift 15s ease-in-out infinite alternate}
@keyframes drift{0%{transform:translateY(0) scale(1)}100%{transform:translateY(-30px) scale(1.09)}}
.hero .wrap{position:relative;z-index:1}
.pill{display:inline-flex;align-items:center;gap:8px;padding:7px 16px;border-radius:999px;background:var(--card);border:1px solid var(--border);font-size:13px;margin-bottom:24px}
.pill .dot{width:7px;height:7px;border-radius:50%;background:#38ef7d;box-shadow:0 0 9px #38ef7d;animation:pulse 2s ease-in-out infinite}
.hero h1{font-size:clamp(2.3rem,5.8vw,4rem);margin:0 auto 18px;max-width:800px;font-weight:800}
.hero .sub{color:var(--muted);font-size:clamp(1rem,2vw,1.18rem);max-width:580px;margin:0 auto 32px}
.cta-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
.mock{max-width:840px;margin:62px auto 0;border-radius:20px;border:1px solid var(--border);background:linear-gradient(160deg,var(--card),rgba(255,255,255,.02));padding:16px;box-shadow:0 40px 90px rgba(0,0,0,.55);animation:float 6s ease-in-out infinite}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
.mock-bar{display:flex;gap:6px;padding:4px 4px 14px}
.mock-bar i{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.22)}
.mock-in{display:grid;grid-template-columns:150px 1fr;gap:12px}
.mock-side{display:flex;flex-direction:column;gap:8px}
.mock-side i{height:12px;border-radius:5px;background:rgba(255,255,255,.1)}
.mock-side i:first-child{background:linear-gradient(90deg,var(--g1),var(--g2));width:70%}
.mock-main{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.mock-main i{height:66px;border-radius:11px;background:linear-gradient(135deg,color-mix(in srgb,var(--g1) 32%,transparent),color-mix(in srgb,var(--g2) 22%,transparent));border:1px solid var(--border)}
.mock-main i:nth-child(4){grid-column:span 3;height:96px}
.logos{display:flex;gap:44px;justify-content:center;flex-wrap:wrap;opacity:.65;font-weight:700;letter-spacing:.05em}
`;
  const body = `
${nav(t, NAVLINKS)}
<section class="hero"><div class="aurora"></div>
  <div class="wrap">
    <span class="pill"><span class="dot"></span>${t.eyebrow}</span>
    <h1>${t.h1a} <span class="acc">${t.h1b}</span></h1>
    <p class="sub">${t.sub}</p>
    <div class="cta-row"><a class="btn btn-primary" href="#pricing">${t.cta1}</a><a class="btn btn-ghost" href="#features">${t.cta2}</a></div>
    <div class="mock"><div class="mock-bar"><i></i><i></i><i></i></div>
      <div class="mock-in"><div class="mock-side"><i></i><i></i><i></i><i></i><i></i></div>
      <div class="mock-main"><i></i><i></i><i></i><i></i></div></div></div>
  </div>
</section>
${marquee(t.marquee)}
${statsSection(t.stats)}
${featuresSection(t)}
${workSection(t)}
${testimonialsSection(t)}
${pricingSection(t)}
${faqSection(t)}
${ctaSection(t)}
${footer(t)}`;
  return page({ title: t.brand, css, body });
}

function dashboardLayout(t) {
  const css = baseCss(t.g1, t.g2, t.fonts) + `
.app{display:flex;min-height:100vh}
.sidebar{width:230px;flex:none;background:#0a0a10;border-right:1px solid var(--border);padding:24px 16px;display:flex;flex-direction:column;gap:5px;position:sticky;top:0;height:100vh}
.sidebar .brand{margin-bottom:26px;padding-left:6px}
.side-link{display:flex;align-items:center;gap:11px;padding:11px 13px;border-radius:11px;color:var(--muted);font-size:14px;font-weight:600;transition:.2s;border-left:3px solid transparent}
.side-link:hover{color:var(--text);background:rgba(255,255,255,.04)}
.side-link.active{background:color-mix(in srgb,var(--g2) 15%,transparent);color:var(--text);border-left-color:var(--g2)}
.side-foot{margin-top:auto;padding:16px 13px;border-radius:13px;background:linear-gradient(140deg,color-mix(in srgb,var(--g1) 40%,transparent),transparent);border:1px solid var(--border);font-size:13px;color:var(--muted)}
.main{flex:1;min-width:0;padding:26px 34px 60px}
.topbar{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:26px}
.topbar h2{margin:0;font-size:1.25rem}
.topbar .sp{color:var(--muted);font-size:13.5px}
.tb-right{display:flex;align-items:center;gap:14px}
.bell{position:relative;width:38px;height:38px;border-radius:50%;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer}
.bell::after{content:"";position:absolute;top:9px;right:10px;width:7px;height:7px;border-radius:50%;background:var(--g2);box-shadow:0 0 8px var(--g2)}
.avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--g1),var(--g2))}
.hero-card{position:relative;border-radius:20px;padding:40px;overflow:hidden;margin-bottom:24px;background:linear-gradient(125deg,color-mix(in srgb,var(--g1) 62%,#0a0a10),color-mix(in srgb,var(--g2) 34%,#0a0a10))}
.hero-card::after{content:"";position:absolute;right:-60px;top:-60px;width:300px;height:300px;border-radius:50%;border:1px solid color-mix(in srgb,var(--g2) 45%,transparent);animation:spin 22s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.hero-card h1{margin:0 0 10px;font-size:clamp(1.7rem,3.4vw,2.5rem);font-weight:800;max-width:520px}
.hero-card p{margin:0 0 22px;color:#eceefb;max-width:430px}
.stat-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:18px;margin-bottom:24px}
.stat{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:20px;transition:.25s}
.stat:hover{transform:translateY(-4px);border-color:color-mix(in srgb,var(--g2) 40%,transparent)}
.stat .lbl{color:var(--muted);font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px}
.stat b{display:block;font-size:1.9rem;font-weight:800;font-variant-numeric:tabular-nums}
.stat .sm{color:var(--muted);font-size:12.5px;margin-top:4px}
.ring{width:78px;height:78px;border-radius:50%;background:conic-gradient(var(--g2) var(--p,75%),rgba(255,255,255,.08) 0);display:flex;align-items:center;justify-content:center;margin:2px auto 8px}
.ring b{background:#0d0d14;width:60px;height:60px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px}
.panels{display:grid;grid-template-columns:1.4fr 1fr;gap:20px;margin-bottom:24px}
.panel{background:var(--card);border:1px solid var(--border);border-radius:18px;padding:24px}
.panel h3{margin:0 0 6px;font-size:1.08rem}
.panel .muted{color:var(--muted);font-size:14px;margin:0 0 18px}
.board{display:grid;grid-template-columns:repeat(8,1fr);width:190px;aspect-ratio:1;border-radius:8px;overflow:hidden;border:1px solid var(--border)}
.board i{aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:13px;color:#111}
.spark{display:flex;align-items:flex-end;gap:5px;height:64px;margin-top:12px}
.spark i{flex:1;border-radius:4px 4px 0 0;background:linear-gradient(180deg,var(--g2),color-mix(in srgb,var(--g1) 60%,transparent));animation:grow .9s cubic-bezier(.16,1,.3,1) both}
@keyframes grow{from{height:0!important}}
.rows{display:flex;flex-direction:column;gap:12px}
.row{display:flex;align-items:center;gap:13px;padding:13px;border-radius:12px;background:rgba(255,255,255,.03);border:1px solid var(--border)}
.row .ic{width:36px;height:36px;border-radius:10px;flex:none;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--g2) 18%,transparent);color:var(--g2)}
.row b{display:block;font-size:14px}.row span{color:var(--muted);font-size:12.5px}
.row .val{margin-left:auto;font-weight:700;font-variant-numeric:tabular-nums}
.tagline{text-align:center;padding:30px 0 10px;color:var(--muted);font-size:14px;letter-spacing:.04em}
.tagline em{color:var(--g2);font-style:italic}
@media(max-width:900px){.sidebar{display:none}.panels{grid-template-columns:1fr}.main{padding:22px 20px 50px}}
`;
  const squares = Array.from({ length: 64 }, (_, i) => {
    const r = Math.floor(i / 8), c = i % 8;
    const dark = (r + c) % 2 === 1;
    const glyphs = { 0: "♜", 1: "♞", 4: "♚", 56: "♖", 60: "♔", 8: "♟", 9: "♟", 48: "♙", 51: "♙" };
    return `<i style="background:${dark ? "#b58863" : "#f0d9b5"}">${glyphs[i] || ""}</i>`;
  }).join("");
  const bars = [38, 52, 44, 66, 58, 78, 70, 92].map((h, i) => `<i style="height:${h}%;animation-delay:${i * 60}ms"></i>`).join("");
  const body = `
${nav(t, [{ id: "about", label: "Overview" }, { id: "features", label: "Features" }, { id: "pricing", label: "Plans" }, { id: "faq", label: "Help" }])}
<div class="app">
  <aside class="sidebar">
    <div class="brand"><i></i>${t.brand}</div>
    ${t.sideNav.map((s, i) => `<a class="side-link${i === 0 ? " active" : ""}" href="#"><i class="${s.i}"></i>${s.t}</a>`).join("")}
    <div class="side-foot"><b style="color:var(--g2)">◆ ${t.sideFootTitle}</b><br>${t.sideFootBody}</div>
  </aside>
  <main class="main">
    <div class="topbar">
      <div><h2>${t.eyebrow}</h2><div class="sp">${t.topbarSub}</div></div>
      <div class="tb-right"><div class="bell"><i class="ri-notification-3-line"></i></div><div class="avatar"></div></div>
    </div>
    <div class="hero-card reveal">
      <h1>${t.h1a} <span class="acc" style="-webkit-text-fill-color:color-mix(in srgb,var(--g2) 85%,#fff)">${t.h1b}</span></h1>
      <p>${t.sub}</p>
      <a class="btn btn-primary" href="#pricing">${t.cta1} <i class="ri-arrow-right-line"></i></a>
    </div>
    <div class="stat-row">
      ${t.metrics.map((m) => `<div class="stat reveal">${m.ring
        ? `<div class="ring" style="--p:${m.ring}%"><b>${m.ring}%</b></div><div class="lbl" style="text-align:center;margin:0">${m.lbl}</div>`
        : `<div class="lbl">${m.lbl}</div><b data-count="${m.val}">0</b><div class="sm">${m.sm}</div>`}</div>`).join("")}
    </div>
    <div class="panels">
      <div class="panel reveal"><h3>${t.panelATitle}</h3><p class="muted">${t.panelASub}</p>
        <div style="display:flex;gap:22px;flex-wrap:wrap;align-items:center">
          ${t.showBoard ? `<div class="board">${squares}</div>` : ""}
          <div style="flex:1;min-width:180px">
            <div class="rows">${t.panelARows.map((r) => `<div class="row"><span class="ic"><i class="${r.i}"></i></span><div><b>${r.t}</b><span>${r.s}</span></div><span class="val">${r.v}</span></div>`).join("")}</div>
          </div>
        </div>
        <div class="spark">${bars}</div>
      </div>
      <div class="panel reveal"><h3>${t.panelBTitle}</h3><p class="muted">${t.panelBSub}</p>
        <div class="rows">${t.panelBRows.map((r) => `<div class="row"><span class="ic"><i class="${r.i}"></i></span><div><b>${r.t}</b><span>${r.s}</span></div><span class="val">${r.v}</span></div>`).join("")}</div>
        <a class="btn btn-ghost" style="margin-top:18px" href="#cta">${t.cta2}</a>
      </div>
    </div>
    <div class="tagline">${t.tagline}</div>
  </main>
</div>
${featuresSection(t)}
${testimonialsSection(t)}
${pricingSection(t)}
${faqSection(t)}
${ctaSection(t)}
${footer(t)}`;
  return page({ title: t.brand, css, body });
}

/* ---------- Layout: corporate / property services (navy + gold) ---------- */
function propertyLayout(t) {
  const css = baseCss(t.g1, t.g2, t.fonts).replace("--bg:#07070c;--bg2:#0c0c14", "--bg:#0a1628;--bg2:#0d1c31") + `
.hero{position:relative;overflow:hidden;padding:0}
.hero-grid{display:grid;grid-template-columns:1fr 1.15fr;align-items:center;gap:0;min-height:76vh}
.hero-copy{padding:70px 24px 70px max(24px,calc((100vw - 1180px)/2))}
.hero-copy h1{font-size:clamp(2.2rem,4.6vw,3.7rem);margin:0 0 20px;font-weight:800}
.hero-copy h1 span{display:block;opacity:0;transform:translateY(24px);animation:rise .85s cubic-bezier(.16,1,.3,1) forwards}
.hero-copy h1 span:nth-child(2){animation-delay:.12s;color:var(--g2)}
.hero-copy h1 span:nth-child(3){animation-delay:.24s}
@keyframes rise{to{opacity:1;transform:none}}
.hero-copy .sub{color:var(--muted);font-size:1.05rem;max-width:430px;margin:0 0 30px;opacity:0;animation:rise .85s .34s cubic-bezier(.16,1,.3,1) forwards}
.hero-btns{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:38px;opacity:0;animation:rise .85s .44s cubic-bezier(.16,1,.3,1) forwards}
.trust{display:flex;gap:34px;flex-wrap:wrap;opacity:0;animation:rise .85s .56s cubic-bezier(.16,1,.3,1) forwards}
.trust div{display:flex;align-items:center;gap:11px}
.trust .tico{width:38px;height:38px;border-radius:10px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--g2);font-size:18px;flex:none}
.trust b{display:block;font-size:13px}.trust span{color:var(--muted);font-size:12.5px}
.hero-img{position:relative;height:100%;min-height:420px}
.hero-img img{width:100%;height:100%;object-fit:cover}
.hero-img::after{content:"";position:absolute;inset:0;background:linear-gradient(to right,var(--bg) 0%,rgba(10,22,40,.55) 22%,transparent 60%)}
.rule{width:56px;height:3px;border-radius:2px;background:var(--g2);margin:14px auto 18px}
.rule.l{margin-left:0}
.svc{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.svc-card{background:var(--bg2);border:1px solid var(--border);border-radius:15px;overflow:hidden;transition:transform .25s ease,border-color .25s ease}
.svc-card:hover{transform:translateY(-6px);border-color:color-mix(in srgb,var(--g2) 45%,transparent)}
.svc-top{position:relative;height:140px}
.svc-top img{width:100%;height:100%;object-fit:cover}
.svc-ico{position:absolute;left:16px;bottom:-18px;width:44px;height:44px;border-radius:12px;background:var(--bg2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--g2);font-size:19px}
.svc-body{padding:32px 18px 20px}
.svc-body h3{margin:0 0 8px;font-size:1.02rem}
.svc-body p{margin:0 0 14px;color:var(--muted);font-size:13.6px}
.more{color:var(--g2);font-size:13.5px;font-weight:700;display:inline-flex;align-items:center;gap:7px}
.more i{transition:transform .25s ease}
.more:hover i{transform:translateX(4px)}
.why{background:var(--g2);color:#20180a;border-radius:15px;padding:22px;display:flex;flex-direction:column}
.why .wico{font-size:26px;margin-bottom:12px}
.why h3{margin:0 0 14px;font-size:1.05rem;color:#20180a}
.why ul{list-style:none;padding:0;margin:0 0 16px;display:flex;flex-direction:column;gap:10px}
.why li{display:flex;gap:9px;font-size:12.8px;font-weight:600}
.why li i{color:#fff}
.why .strip{margin-top:auto;border-radius:10px;overflow:hidden;height:92px}
.why .strip img{width:100%;height:100%;object-fit:cover}
.about-card{display:grid;grid-template-columns:1fr 1.1fr;gap:0;background:var(--bg2);border:1px solid var(--border);border-radius:18px;overflow:hidden}
.about-card .ac-copy{padding:48px 40px}
.about-card .kick{color:var(--g2);font-size:12.5px;font-weight:700;letter-spacing:.1em}
.about-card h2{font-size:clamp(1.5rem,3vw,2.1rem);margin:10px 0 0}
.about-card p{color:var(--muted);font-size:14.5px;margin:0 0 24px}
.about-card img{width:100%;height:100%;object-fit:cover;min-height:330px}
.listings{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.listing{border-radius:14px;overflow:hidden;transition:transform .25s ease}
.listing:hover{transform:translateY(-6px)}
.listing .ph{height:190px;border-radius:14px;overflow:hidden;border:1px solid var(--border)}
.listing .ph img{width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(.16,1,.3,1)}
.listing:hover .ph img{transform:scale(1.07)}
.listing h4{margin:14px 0 5px;font-size:1.02rem}
.listing p{margin:0;color:var(--muted);font-size:13.4px}
.news input{width:100%;padding:11px 14px;border-radius:8px;border:1px solid var(--border);background:rgba(255,255,255,.05);color:var(--text);font:inherit;font-size:13.5px;margin-bottom:10px}
.news input:focus{outline:none;border-color:var(--g2)}
.news button{width:100%;padding:11px;border-radius:8px;border:0;background:var(--g2);color:#20180a;font:inherit;font-weight:800;font-size:13.5px;cursor:pointer;transition:.2s}
.news button:hover{filter:brightness(1.08)}
.news .ok{color:var(--g2);font-size:12.5px;margin:8px 0 0;display:none}
.news.done .ok{display:block}
@media(max-width:1000px){.svc{grid-template-columns:repeat(2,1fr)}.listings{grid-template-columns:1fr 1fr}}
@media(max-width:860px){
  .hero-grid{grid-template-columns:1fr}.hero-copy{padding:56px 24px 40px}
  .hero-img{min-height:280px}.hero-img::after{background:linear-gradient(to bottom,rgba(10,22,40,.6),transparent 40%)}
  .svc,.listings{grid-template-columns:1fr}.about-card{grid-template-columns:1fr}
}
`;
  const body = `
${nav(t, [{ id: "services", label: "Services" }, { id: "about", label: "About Us" }, { id: "properties", label: "Properties" }, { id: "reviews", label: "Owners" }, { id: "faq", label: "Contact" }])}
<section class="hero">
  <div class="hero-grid">
    <div class="hero-copy">
      <h1><span>${t.h1a}</span><span>${t.h1b}</span><span>${t.h1c}</span></h1>
      <p class="sub">${t.sub}</p>
      <div class="hero-btns"><a class="btn btn-primary" href="#services">${t.cta1}</a><a class="btn btn-ghost" href="#properties">${t.cta2}</a></div>
      <div class="trust">
        <div><span class="tico"><i class="ri-shield-check-line"></i></span><div><b>Trusted</b><span>Property Management</span></div></div>
        <div><span class="tico"><i class="ri-group-line"></i></span><div><b>Happy Owners</b><span>&amp; Tenants</span></div></div>
      </div>
    </div>
    <div class="hero-img"><img src="${t.img}" alt="Managed apartment building"></div>
  </div>
</section>

<section class="section" id="services"><div class="wrap">
  <div class="shead reveal"><h2>${t.svcTitle}</h2><div class="rule"></div><p>${t.svcSub}</p></div>
  <div class="svc">
    ${t.services.map((s) => `<div class="svc-card reveal">
      <div class="svc-top"><img src="${s.img}" alt="${s.t}" loading="lazy"><span class="svc-ico"><i class="${s.i}"></i></span></div>
      <div class="svc-body"><h3>${s.t}</h3><p>${s.d}</p><a class="more" href="#">Learn More <i class="ri-arrow-right-line"></i></a></div>
    </div>`).join("")}
    <div class="why reveal">
      <span class="wico"><i class="ri-home-4-line"></i></span><h3>Why Choose Us?</h3>
      <ul>${t.why.map((w) => `<li><i class="ri-check-line"></i>${w}</li>`).join("")}</ul>
      <div class="strip"><img src="${t.whyImg}" alt="" loading="lazy"></div>
    </div>
  </div>
</div></section>

<section class="section" id="about"><div class="wrap">
  <div class="about-card reveal">
    <div class="ac-copy">
      <span class="kick">${t.aboutKicker}</span>
      <h2>${t.aboutTitle}</h2><div class="rule l"></div>
      <p>${t.aboutBody}</p>
      <a class="btn btn-primary" href="#reviews">More About Us</a>
    </div>
    <img src="${t.aboutImg}" alt="" loading="lazy">
  </div>
</div></section>

<section class="section" id="properties"><div class="wrap">
  <div class="shead reveal"><h2>Featured Properties</h2><div class="rule"></div><p>Explore a selection of properties we currently manage.</p></div>
  <div class="listings">
    ${t.listings.map((l) => `<div class="listing reveal"><div class="ph"><img src="${l.img}" alt="${l.t}" loading="lazy"></div><h4>${l.t}</h4><p>${l.m}</p></div>`).join("")}
  </div>
</div></section>

${statsSection(t.stats)}
${testimonialsSection(t)}
${pricingSection(t)}
${faqSection(t)}
${ctaSection(t)}

<footer><div class="wrap">
  <div class="fgrid">
    <div><div class="brand"><i></i>${t.brand}</div><p>${t.footBlurb}</p>
      <div class="socials" style="margin-top:16px"><a href="#"><i class="ri-facebook-fill"></i></a><a href="#"><i class="ri-twitter-x-line"></i></a><a href="#"><i class="ri-linkedin-fill"></i></a><a href="#"><i class="ri-instagram-line"></i></a></div>
    </div>
    <div class="fcol"><h5>Quick Links</h5><a href="#">Home</a><a href="#about">About Us</a><a href="#services">Services</a><a href="#properties">Properties</a><a href="#">Owners</a><a href="#">Tenants</a></div>
    <div class="fcol"><h5>Our Services</h5><a href="#">Residential Management</a><a href="#">Commercial Management</a><a href="#">Maintenance Services</a><a href="#">Tenant Placement</a><a href="#">Rent Collection</a></div>
    <div class="fcol"><h5>Newsletter</h5><p style="color:var(--muted);font-size:13.5px;margin:0 0 12px">Subscribe for property management tips.</p>
      <form class="news" id="news" novalidate><input type="email" placeholder="Your email address" required><button type="submit">Subscribe</button><p class="ok">✓ Thanks — you're subscribed.</p></form>
    </div>
  </div>
  <div class="fbot" style="justify-content:center"><span>© 2026 ${t.brand} Management. A MotionHub live demo.</span></div>
</div></footer>`;
  const script = `
const nf=document.getElementById('news');
if(nf)nf.onsubmit=e=>{e.preventDefault();const i=nf.querySelector('input');if(!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(i.value)){i.style.borderColor='#ff8a9c';return}i.style.borderColor='';nf.classList.add('done');i.value=''};
`;
  return page({ title: t.brand, css, body, script });
}

/* --------------------------- shared content bits -------------------------- */
const genericFaq = (thing) => [
  { q: `What exactly is ${thing}?`, a: `${thing} is a complete, production-ready template you can copy, customise and ship — no design work required.` },
  { q: "Do I own what I build with it?", a: "Yes. Whatever the prompt generates is yours to use commercially, with no attribution, watermark or lock-in." },
  { q: "Which AI builders does it work with?", a: "Claude, Cursor, v0, Bolt and Lovable. Each template lists its best-fit builders on its page." },
  { q: "Do I need to know how to code?", a: "No. Paste the prompt into your AI builder, describe your product, and it scaffolds the whole thing. Tweak the copy and colours and you're live." },
];
const genericTiers = (a, b, c) => [
  { n: "Starter", p: "$0", per: "Free forever", f: ["1 project", "Community support", "Basic components", a], cta: "Start free" },
  { n: "Pro", p: "$149", per: "per year", pop: true, f: ["Unlimited projects", "Every premium template", "Priority support", b, "Commercial licence"], cta: "Go Pro" },
  { n: "Lifetime", p: "$239", per: "one-time", f: ["Everything in Pro", "Lifetime updates", "Source files", c], cta: "Buy once" },
];

/* -------------------------------- templates ------------------------------- */
const items = [
  { id: "summit-video-hero", layout: "hero", brand: "SUMMIT", g1: "#0b1f3a", g2: "#F4BA3B", video: VIDEO_TRAVEL,
    navCta: "Book a trip", eyebrow: "Adventure & Travel · Since 2012",
    h1a: "Explore. Dream.", h1b: "Discover.", sub: "We craft expeditions that awaken curiosity and turn ordinary weeks into the stories you tell for decades.",
    cta1: "Start your journey", cta2: "Watch the film",
    marquee: ["Patagonia", "Iceland", "Nepal", "Kilimanjaro", "Dolomites", "Atacama", "Faroe Islands"],
    aboutKicker: "Who we are", aboutTitle: "Small groups. Wild places. Zero compromise.",
    aboutBody: "Every SUMMIT expedition is led by guides who live in the region they take you through. Groups cap at twelve, so you get real access — the trailhead nobody queues at, the family kitchen that isn't on any map.",
    stats: [{ n: "1200+", l: "Travellers guided" }, { n: "38", l: "Countries" }, { n: "4.9", l: "Average rating" }, { n: "12", l: "Max group size" }],
    workKicker: "Expeditions", workTitle: "Where we'll take you", workSub: "Hand-built itineraries, refined over a decade of running them ourselves.",
    projects: [{ t: "Torres del Paine", c: "Patagonia · 9 days" }, { t: "Highland Traverse", c: "Iceland · 7 days" }, { t: "Annapurna Circuit", c: "Nepal · 14 days" }, { t: "Dolomites Ridge", c: "Italy · 6 days" }, { t: "Atacama Crossing", c: "Chile · 8 days" }, { t: "Faroe Coastline", c: "Denmark · 5 days" }],
    featKicker: "Why SUMMIT", featTitle: "Built for people who hate tour groups", featSub: "Everything is handled — except the part where you have to be present.",
    features: [{ icon: "ri-map-pin-line", t: "Local guides only", d: "Every trip is led by someone who grew up in that valley, not a seasonal hire." }, { icon: "ri-shield-check-line", t: "Weather-proof booking", d: "Storm shuts the pass? Move your dates free, up to 48 hours out." }, { icon: "ri-leaf-line", t: "Carbon-negative trips", d: "We fund 2× the offset of every flight and vehicle on your itinerary." }],
    revTitle: "What travellers say",
    reviews: [{ q: "I've done a lot of guided trips. This is the first one where I felt like a traveller and not a customer.", n: "Marta Ellison", r: "Torres del Paine, 2025" }, { q: "Our guide rerouted us around a storm and it became the best day of the trip. That's experience you can't fake.", n: "Devin Roy", r: "Highland Traverse, 2025" }, { q: "Twelve people, fourteen days, and I'd go again tomorrow with every one of them.", n: "Priya Anand", r: "Annapurna Circuit, 2024" }],
    priceTitle: "Simple trip pricing", priceSub: "No hidden supplements. Flights excluded, everything else isn't.",
    tiers: genericTiers("Trip planning guide", "Private guide upgrade", "Gear package included"),
    faq: genericFaq("SUMMIT"),
    ctaTitle: "The mountain isn't going anywhere. You should.", ctaSub: "Next departures open in March. Small groups fill fast.",
    footBlurb: "Guided expeditions to the places that don't fit in a weekend. Founded by guides, run by guides." },

  { id: "nova-studio-hero", layout: "hero", brand: "NOVA", g1: "#0e0e0e", g2: "#C6FF3D", img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80",
    gallery: GALLERY_ALT, navCta: "Start a project", eyebrow: "Available for new work — 2026",
    h1a: "We build brands", h1b: "that move.", sub: "A branding studio for companies that would rather be remembered than merely noticed.",
    cta1: "See our work", cta2: "Watch showreel",
    marquee: ["Branding", "Identity", "Motion", "Packaging", "Art direction", "Strategy", "Web"],
    aboutKicker: "The studio", aboutTitle: "Twelve people. No account managers.",
    aboutBody: "You work directly with the people making the thing. We take on eight projects a year, which is fewer than we could — and exactly as many as we can do properly.",
    stats: [{ n: "8", l: "Projects a year" }, { n: "24", l: "Awards" }, { n: "12", l: "In the studio" }, { n: "97%", l: "Clients return" }],
    workKicker: "Selected work", workTitle: "Recent projects", workSub: "A decade of identities, campaigns and the occasional total rebuild.",
    projects: [{ t: "Kestrel Coffee", c: "Identity · Packaging" }, { t: "Halcyon Bank", c: "Brand system" }, { t: "Meridian Type", c: "Typeface · Web" }, { t: "Orbit Studios", c: "Motion · Identity" }, { t: "Fold Architects", c: "Art direction" }, { t: "Nine Yards", c: "Campaign" }],
    featKicker: "How we work", featTitle: "Fewer meetings, better work", featSub: "The process is deliberately short and deliberately opinionated.",
    features: [{ icon: "ri-compass-3-line", t: "Strategy first", d: "Two weeks of positioning before anyone opens a design tool." }, { icon: "ri-shapes-line", t: "Systems, not logos", d: "You get a kit that still works on the thing you launch in three years." }, { icon: "ri-movie-2-line", t: "Motion built in", d: "Every identity ships with its motion language already defined." }],
    revTitle: "Client words",
    reviews: [{ q: "They pushed back on our brief, and they were right. The rebrand moved our conversion 34%.", n: "Sasha Klein", r: "CEO, Halcyon" }, { q: "The only studio we've worked with that shipped on the date they said in the first email.", n: "Tom Iwu", r: "Founder, Kestrel" }, { q: "Three years on and the system still holds up. Nothing has needed a redesign.", n: "Lena Ortiz", r: "CMO, Orbit" }],
    priceTitle: "Engagement models", priceSub: "Most projects land in the middle tier. We'll tell you if you don't need it.",
    tiers: genericTiers("Logo & basic kit", "Full identity system", "Ongoing retainer"),
    faq: genericFaq("NOVA"),
    ctaTitle: "Got something worth building?", ctaSub: "Two slots left for Q2. Tell us what you're making.",
    footBlurb: "An independent branding studio. Strategy, identity and motion for companies with something to prove." },

  { id: "aurora-saas-hero", layout: "saas", brand: "Aurora", g1: "#6d5efc", g2: "#00d4ff",
    navCta: "Get started", eyebrow: "New — v2.0 is live",
    h1a: "Ship your product", h1b: "faster than ever.", sub: "The platform layer your team stops rebuilding. Auth, data, billing and analytics — wired together on day one.",
    cta1: "Start free", cta2: "See features",
    marquee: ["Vercel", "Linear", "Stripe", "Supabase", "Figma", "Notion", "Retool"],
    stats: [{ n: "48000", l: "Developers" }, { n: "2.4", l: "Avg. weeks saved" }, { n: "99.99%", l: "Uptime" }, { n: "180", l: "Integrations" }],
    workKicker: "Showcase", workTitle: "Built on Aurora", workSub: "Teams shipping real products on top of the platform.",
    projects: [{ t: "Ledger", c: "Fintech · Series A" }, { t: "Cohort", c: "Edtech" }, { t: "Signal Health", c: "Healthcare" }, { t: "Basecamp Labs", c: "Developer tools" }, { t: "Northwind", c: "Logistics" }, { t: "Pageturn", c: "Publishing" }],
    featKicker: "Platform", featTitle: "Everything you'd build anyway", featSub: "Except it's already done, tested and running in production somewhere.",
    features: [{ icon: "ri-flashlight-line", t: "Blazing fast", d: "Edge-rendered by default. Core Web Vitals green out of the box." }, { icon: "ri-shield-check-line", t: "Secure by default", d: "Row-level security on every table, SOC 2 Type II, zero config." }, { icon: "ri-stack-line", t: "Composable", d: "Take the auth, skip the billing. Nothing is all-or-nothing." }, { icon: "ri-line-chart-line", t: "Analytics included", d: "Product events and funnels without bolting on a second vendor." }, { icon: "ri-git-branch-line", t: "Preview branches", d: "Every PR gets a full database branch, seeded and disposable." }, { icon: "ri-terminal-box-line", t: "Real CLI", d: "Everything the dashboard does, scriptable and CI-friendly." }],
    revTitle: "Loved by engineering teams",
    reviews: [{ q: "We deleted about 9,000 lines of glue code the week we moved to Aurora.", n: "Ren Watanabe", r: "Staff Engineer, Ledger" }, { q: "Preview branches alone justified the whole migration. Review is a different job now.", n: "Ada Coleman", r: "VP Eng, Cohort" }, { q: "Went from idea to paying customers in eleven days. That's not marketing copy, that's our git log.", n: "Milo Fritz", r: "Founder, Pageturn" }],
    priceTitle: "Pricing that scales down too", priceSub: "Start free. Pay when you have users, not before.",
    tiers: genericTiers("Community Discord", "SSO & audit logs", "Dedicated support engineer"),
    faq: genericFaq("Aurora"),
    ctaTitle: "Start building this afternoon", ctaSub: "Free tier, no credit card, no sales call.",
    footBlurb: "The platform layer for product teams. Auth, data, billing and analytics that already work together." },

  { id: "horizon-agency-video", layout: "hero", brand: "HORIZON", g1: "#101014", g2: "#ff5f6d", video: VIDEO_AGENCY,
    gallery: GALLERY_ALT, navCta: "Let's build", eyebrow: "Digital Agency · London & NYC",
    h1a: "We make brands", h1b: "impossible to ignore.", sub: "Strategy, design and motion for companies that are done blending in with their category.",
    cta1: "See the work", cta2: "Watch reel",
    marquee: ["Branding", "Web", "Motion", "Strategy", "Campaign", "Content", "Product"],
    aboutKicker: "The agency", aboutTitle: "Loud on purpose. Never at random.",
    aboutBody: "Attention is the cheapest thing to buy and the hardest thing to keep. We build brands that earn the second look, then give people a reason to stay.",
    stats: [{ n: "50", l: "Projects shipped" }, { n: "12", l: "Awards" }, { n: "340%", l: "Avg. lift" }, { n: "2", l: "Studios" }],
    workKicker: "Work", workTitle: "Selected campaigns", workSub: "The ones we're allowed to show you.",
    projects: [{ t: "Volt Energy", c: "Rebrand · Campaign" }, { t: "Copper & Co", c: "Identity" }, { t: "Nightshift", c: "Motion · Film" }, { t: "Atlas Mobility", c: "Product · Web" }, { t: "Riot Athletic", c: "Campaign" }, { t: "Sable", c: "Brand system" }],
    featKicker: "Services", featTitle: "Three things, done properly", featSub: "We say no to the rest, which is why these are good.",
    features: [{ icon: "ri-lightbulb-flash-line", t: "Brand strategy", d: "Positioning, narrative and the sharp bit you actually say out loud." }, { icon: "ri-palette-line", t: "Design systems", d: "Identity that survives contact with a real marketing team." }, { icon: "ri-film-line", t: "Motion & film", d: "In-house studio. Nothing gets outsourced to a stranger." }],
    revTitle: "What clients say",
    reviews: [{ q: "Our category is beige. They made us the only thing anyone remembers from the trade show.", n: "Kai Brennan", r: "CMO, Volt" }, { q: "340% lift on qualified leads in one quarter. I've stopped being surprised by them.", n: "Nadia Sharpe", r: "Founder, Atlas" }, { q: "They killed our favourite idea in week two. Best decision on the whole project.", n: "Owen Diaz", r: "Brand Lead, Sable" }],
    priceTitle: "How we engage", priceSub: "Project, retainer or embedded. Most start with a sprint.",
    tiers: genericTiers("Brand audit", "Full campaign build", "Embedded team"),
    faq: genericFaq("HORIZON"),
    ctaTitle: "Ready to be impossible to ignore?", ctaSub: "Tell us what you're launching. We'll tell you if we're the right studio.",
    footBlurb: "A digital agency in London and New York. Strategy, design and motion for brands with something to say." },

  { id: "lumen-portfolio-hero", layout: "hero", brand: "LUMEN", g1: "#1a1a2e", g2: "#e94560", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=80",
    fonts: { display: "Fraunces,Georgia,serif" }, navCta: "Commission work", eyebrow: "Selected · 2020–2026",
    h1a: "Light,", h1b: "framed.", sub: "Landscape and documentary photography. Available for editorial commissions and print sales worldwide.",
    cta1: "View selected work", cta2: "About the work",
    marquee: ["National Geographic", "Sidetracked", "Kinfolk", "Monocle", "The Guardian", "Outside"],
    aboutKicker: "About", aboutTitle: "I photograph places before they change.",
    aboutBody: "Fifteen years of walking into landscapes at the wrong hour and waiting. Most of these frames took three trips. A few took one lucky morning, and I won't pretend otherwise.",
    stats: [{ n: "15", l: "Years shooting" }, { n: "42", l: "Countries" }, { n: "1400", l: "Prints sold" }, { n: "9", l: "Exhibitions" }],
    workKicker: "Portfolio", workTitle: "Selected frames", workSub: "Prints available in editions of twenty-five.",
    projects: [{ t: "Blue Hour, Lofoten", c: "Norway · 2025" }, { t: "The Long Road", c: "Iceland · 2024" }, { t: "Salt Flats", c: "Bolivia · 2024" }, { t: "Cedar & Fog", c: "Japan · 2023" }, { t: "Last Light", c: "Scotland · 2023" }, { t: "Dune Study", c: "Namibia · 2022" }],
    featKicker: "Services", featTitle: "Ways to work together", featSub: "Editorial, commercial and fine art print.",
    features: [{ icon: "ri-camera-lens-line", t: "Editorial commissions", d: "Assignment work for magazines, brands and publishers, worldwide." }, { icon: "ri-gallery-line", t: "Fine art prints", d: "Hand-finished, archival, editions of twenty-five with a signed certificate." }, { icon: "ri-book-open-line", t: "Licensing", d: "Existing frames licensed for print, digital and exhibition use." }],
    revTitle: "Kind words",
    reviews: [{ q: "Lumen delivered the cover frame on day two of a ten-day shoot. We used eleven more inside.", n: "Erin Vasquez", r: "Photo Editor, Sidetracked" }, { q: "The print is better in person than on screen, which is rarer than it should be.", n: "Julian Reyes", r: "Collector" }, { q: "Quiet on set, relentless about light. Exactly what you want on a documentary job.", n: "Hana Sato", r: "Producer" }],
    priceTitle: "Print & commission rates", priceSub: "Transparent pricing. Custom sizes on request.",
    tiers: genericTiers("Open edition print", "Limited edition, signed", "Full commission day rate"),
    faq: genericFaq("LUMEN"),
    ctaTitle: "Let's make something worth printing.", ctaSub: "Commissions open for spring. Prints ship worldwide.",
    footBlurb: "Landscape and documentary photography. Editorial commissions, licensing and archival print sales." },

  { id: "vertex-web3-hero", layout: "saas", brand: "VERTEX", g1: "#0f0c29", g2: "#00f0ff",
    navCta: "Launch app", eyebrow: "Protocol v3 · mainnet live",
    h1a: "The future is", h1b: "decentralized.", sub: "Non-custodial infrastructure for on-chain markets. Audited, permissionless and fast enough to actually use.",
    cta1: "Launch app", cta2: "Read the docs",
    marquee: ["Ethereum", "Base", "Arbitrum", "Optimism", "Solana", "Polygon", "Avalanche"],
    stats: [{ n: "2.4", l: "Billion TVL (USD)" }, { n: "180000", l: "Wallets connected" }, { n: "0.2", l: "Second finality" }, { n: "6", l: "Chains supported" }],
    workKicker: "Ecosystem", workTitle: "Built on VERTEX", workSub: "Protocols and apps running on the network today.",
    projects: [{ t: "Prism DEX", c: "Spot & perps" }, { t: "Anchor Lend", c: "Money market" }, { t: "Nomad Bridge", c: "Cross-chain" }, { t: "Vault Labs", c: "Yield strategies" }, { t: "Origin ID", c: "Identity" }, { t: "Torch", c: "Payments" }],
    featKicker: "Protocol", featTitle: "Built for people who read the contract", featSub: "Open source, independently audited, no admin keys.",
    features: [{ icon: "ri-coin-line", t: "Non-custodial", d: "Your keys, always. The protocol never takes custody of user funds." }, { icon: "ri-shield-keyhole-line", t: "Four audits", d: "Trail of Bits, OpenZeppelin, Spearbit and a live bug bounty." }, { icon: "ri-flashlight-line", t: "0.2s finality", d: "Sub-second settlement with fees measured in fractions of a cent." }, { icon: "ri-git-repo-line", t: "Fully open source", d: "Every contract and the entire front end, MIT licensed." }, { icon: "ri-government-line", t: "On-chain governance", d: "Token holders vote on upgrades. No multisig backdoor." }, { icon: "ri-links-line", t: "Six chains", d: "One interface, unified liquidity, native bridging built in." }],
    revTitle: "From the ecosystem",
    reviews: [{ q: "We shipped Prism on VERTEX in five weeks. The equivalent build on L1 was a six-month roadmap.", n: "Zoe Marchetti", r: "Founder, Prism" }, { q: "The audit trail is the most thorough I've reviewed this cycle. No admin keys is not a small claim.", n: "Ravi Chandra", r: "Security researcher" }, { q: "Sub-second finality changed our UX assumptions completely. Users stopped asking if it worked.", n: "Felix Andersen", r: "CTO, Torch" }],
    priceTitle: "Protocol fees", priceSub: "Transparent, on-chain, and voted on by holders.",
    tiers: genericTiers("Public RPC access", "Priority throughput", "Dedicated infrastructure"),
    faq: genericFaq("VERTEX"),
    ctaTitle: "Start building on-chain", ctaSub: "Docs, testnet faucet and a grants programme, all open.",
    footBlurb: "Non-custodial infrastructure for on-chain markets. Open source, audited, governed by its holders." },

  { id: "bento-features", layout: "saas", brand: "Bento", g1: "#11998e", g2: "#38ef7d",
    navCta: "Try free", eyebrow: "Everything you need",
    h1a: "One platform,", h1b: "every workflow.", sub: "Stop stitching six tools together. Bento gives your team one surface for projects, docs, and everything in between.",
    cta1: "Explore features", cta2: "View pricing",
    marquee: ["Projects", "Docs", "Automations", "Reporting", "Calendars", "Forms", "Approvals"],
    stats: [{ n: "26000", l: "Teams" }, { n: "6", l: "Tools replaced" }, { n: "4.8", l: "G2 rating" }, { n: "40%", l: "Less tool spend" }],
    workKicker: "Customers", workTitle: "Teams running on Bento", workSub: "From four-person studios to nine-hundred-person orgs.",
    projects: [{ t: "Fieldwork", c: "Design studio · 12 people" }, { t: "Grainhouse", c: "Agency · 60 people" }, { t: "Loop Health", c: "Healthcare · 300" }, { t: "Sparrow", c: "Startup · 8 people" }, { t: "Continuum", c: "Consultancy · 140" }, { t: "Tidewater", c: "Logistics · 900" }],
    featKicker: "Features", featTitle: "Modular by design", featSub: "Turn on what you need. Ignore the rest without paying for it.",
    features: [{ icon: "ri-apps-2-line", t: "Modular workspace", d: "Projects, docs and tracking in one place, each usable on its own." }, { icon: "ri-cursor-line", t: "Built to feel fast", d: "Every action is optimistic. Nothing waits on a spinner." }, { icon: "ri-smartphone-line", t: "Real mobile app", d: "Native iOS and Android, offline-capable, not a wrapped webview." }, { icon: "ri-robot-2-line", t: "Automations", d: "If-this-then-that across any module, no separate automation bill." }, { icon: "ri-bar-chart-box-line", t: "Reporting", d: "Dashboards that read live data, shareable outside your workspace." }, { icon: "ri-lock-2-line", t: "Granular permissions", d: "Per-field access control, guest seats that are actually free." }],
    revTitle: "What teams tell us",
    reviews: [{ q: "We cancelled four subscriptions the month we switched. The finance team noticed before I told them.", n: "Ines Duval", r: "COO, Grainhouse" }, { q: "It's the first tool where our non-technical staff didn't need a training session.", n: "Marcus Bell", r: "Ops Lead, Loop Health" }, { q: "The mobile app is genuinely good, which I did not expect and now rely on daily.", n: "Yuki Tan", r: "Founder, Sparrow" }],
    priceTitle: "One price, every module", priceSub: "No per-feature upsells. Guests are free, always.",
    tiers: genericTiers("Up to 3 members", "Unlimited members", "SSO, SCIM & audit logs"),
    faq: genericFaq("Bento"),
    ctaTitle: "Replace six tools this week", ctaSub: "Free for small teams. Import from your current stack in one click.",
    footBlurb: "One workspace for projects, docs and everything between. Modular, fast, and priced without surprises." },

  { id: "flux-pricing-section", layout: "saas", brand: "FLUX", g1: "#2193b0", g2: "#6dd5ed",
    navCta: "Choose a plan", eyebrow: "Simple, transparent pricing",
    h1a: "Plans that", h1b: "grow with you.", sub: "Start free, upgrade when the numbers make sense, and never get surprised by an invoice.",
    cta1: "Compare plans", cta2: "Talk to sales",
    marquee: ["No setup fees", "Cancel anytime", "Annual discount", "Free migration", "24h support"],
    stats: [{ n: "31000", l: "Paying customers" }, { n: "20%", l: "Annual saving" }, { n: "0", l: "Setup fees" }, { n: "24", l: "Hour support SLA" }],
    workKicker: "Customers", workTitle: "Who's on FLUX", workSub: "Across every plan tier, from solo builders up.",
    projects: [{ t: "Rivet", c: "Starter plan" }, { t: "Coastline", c: "Pro plan" }, { t: "Ninebark", c: "Pro plan" }, { t: "Halyard Group", c: "Lifetime" }, { t: "Studio Meridian", c: "Pro plan" }, { t: "Vantage", c: "Lifetime" }],
    featKicker: "Included", featTitle: "What every plan gets", featSub: "Even the free one. We're not hiding the good parts behind Enterprise.",
    features: [{ icon: "ri-toggle-line", t: "Monthly or yearly", d: "Switch any time. Yearly saves 20% and we prorate the change." }, { icon: "ri-medal-line", t: "No feature gates", d: "Paid tiers add scale and support, never core functionality." }, { icon: "ri-checkbox-circle-line", t: "Honest limits", d: "Every limit is on the pricing page. Nothing is 'contact us'." }],
    revTitle: "On our pricing",
    reviews: [{ q: "First SaaS I've bought where the pricing page answered every question without a call.", n: "Greta Lindqvist", r: "Finance Lead, Coastline" }, { q: "We moved from monthly to annual and they refunded the overlap without being asked.", n: "Sam Okafor", r: "Founder, Rivet" }, { q: "Bought the lifetime tier two years ago. Still getting every new feature. No regrets.", n: "Dana Whitfield", r: "Director, Vantage" }],
    priceTitle: "Pick your plan", priceSub: "Yearly billing saves 20%. Change or cancel whenever.",
    tiers: genericTiers("1 seat, core features", "Unlimited seats & priority support", "Pay once, updates forever"),
    faq: genericFaq("FLUX"),
    ctaTitle: "Start on the free plan", ctaSub: "No card required. Upgrade only when you outgrow it.",
    footBlurb: "Straightforward pricing for growing teams. No setup fees, no feature gates, no surprise invoices." },

  { id: "claude-landing", layout: "saas", brand: "One-Shot", g1: "#00c6ff", g2: "#0072ff",
    navCta: "Get the prompt", eyebrow: "One prompt, one file",
    h1a: "Describe it once,", h1b: "launch today.", sub: "A single master prompt that makes Claude output a complete, animated, production-ready landing page in one file.",
    cta1: "Get the prompt", cta2: "See what it builds",
    marquee: ["Claude", "Cursor", "v0", "Bolt", "Lovable", "Replit", "Windsurf"],
    stats: [{ n: "8", l: "Sections generated" }, { n: "1", l: "File output" }, { n: "0", l: "Build steps" }, { n: "60", l: "FPS animations" }],
    workKicker: "Output", workTitle: "What it generates", workSub: "Every section, wired and animated, in a single index.html.",
    projects: [{ t: "Sticky glass nav", c: "Smooth-scroll links" }, { t: "Animated hero", c: "CSS keyframe gradient" }, { t: "How it works", c: "3-step row" }, { t: "Bento features", c: "Asymmetric grid" }, { t: "Testimonials", c: "Auto-advance slider" }, { t: "Pricing & FAQ", c: "Toggle + accordion" }],
    featKicker: "Why it works", featTitle: "Specific enough to be reliable", featSub: "Vague prompts give vague output. This one leaves nothing to chance.",
    features: [{ icon: "ri-file-code-line", t: "Single file", d: "One index.html with inline style and script. Nothing to install." }, { icon: "ri-layout-4-line", t: "Eight sections", d: "Nav through footer, ordered and specified so nothing gets skipped." }, { icon: "ri-palette-line", t: "One accent colour", d: "Cohesive dark theme driven by CSS variables you can swap in seconds." }, { icon: "ri-css3-line", t: "Plain CSS only", d: "No Tailwind, no framework, no build step. Readable and editable." }, { icon: "ri-magic-line", t: "Scroll animations", d: "IntersectionObserver reveals, specified per section." }, { icon: "ri-smartphone-line", t: "Responsive by default", d: "Mobile drawer and single-column collapse are part of the spec." }],
    revTitle: "From people using it",
    reviews: [{ q: "I stopped writing landing page boilerplate entirely. This does in one shot what took me a day.", n: "Cameron Pike", r: "Indie founder" }, { q: "The output actually looks designed, which is not my experience with most one-shot prompts.", n: "Aisha Rahman", r: "Freelance developer" }, { q: "Handed it to a non-technical co-founder. She shipped a page that afternoon.", n: "Ben Kovacs", r: "CTO" }],
    priceTitle: "Get the prompt", priceSub: "Free to copy. Premium unlocks the full library.",
    tiers: genericTiers("This prompt, free", "Every premium prompt", "Lifetime library access"),
    faq: genericFaq("this prompt"),
    ctaTitle: "Ship a landing page today", ctaSub: "Copy the prompt, paste it into Claude, describe your product.",
    footBlurb: "One master prompt that outputs a complete animated landing page — plain CSS, single file, no build step." },

  { id: "claude-fullstack", layout: "dashboard", brand: "AppKit", g1: "#4776e6", g2: "#8e54e9",
    navCta: "Get the prompt", eyebrow: "Dashboard", topbarSub: "Your projects, live",
    h1a: "Ship a full-stack app", h1b: "in one prompt.", sub: "Auth, a protected dashboard and row-level-secured data — scaffolded end to end by Claude.",
    cta1: "Get the prompt", cta2: "See what's included",
    sideNav: [{ i: "ri-home-5-line", t: "Overview" }, { i: "ri-folder-3-line", t: "Projects" }, { i: "ri-key-2-line", t: "Auth" }, { i: "ri-database-2-line", t: "Database" }, { i: "ri-settings-3-line", t: "Settings" }],
    sideFootTitle: "Pro tip", sideFootBody: "Run the SQL block first — the signup trigger depends on it.",
    metrics: [{ lbl: "Projects", val: "24", sm: "+3 this week" }, { lbl: "Users", val: "1280", sm: "+12% MoM" }, { ring: 92, lbl: "Test coverage" }, { lbl: "Deploys", val: "156", sm: "All green" }],
    panelATitle: "Recent projects", panelASub: "Everything scaffolded from the starter prompt.",
    panelARows: [{ i: "ri-folder-3-line", t: "Marketing site", s: "Next.js · Vercel", v: "Live" }, { i: "ri-folder-3-line", t: "Internal tools", s: "Next.js · Supabase", v: "Live" }, { i: "ri-folder-3-line", t: "Client portal", s: "In review", v: "Staging" }],
    panelBTitle: "What's included", panelBSub: "Every piece the prompt generates for you.",
    panelBRows: [{ i: "ri-key-2-line", t: "Email auth", s: "Signup, login, logout", v: "✓" }, { i: "ri-shield-check-line", t: "Row-level security", s: "Per-user policies", v: "✓" }, { i: "ri-table-line", t: "CRUD + optimistic UI", s: "Projects table", v: "✓" }, { i: "ri-file-code-line", t: "SQL & .env.example", s: "Copy-paste ready", v: "✓" }],
    tagline: "Scaffold once. <em>Ship forever.</em>",
    featKicker: "Included", featTitle: "A real starter, not a toy", featSub: "The parts everyone rebuilds, generated correctly the first time.",
    features: [{ icon: "ri-key-2-line", t: "Auth that works", d: "Signup, login, logout and a genuinely protected dashboard route." }, { icon: "ri-shield-check-line", t: "RLS from the start", d: "Policies written so users only ever see their own rows." }, { icon: "ri-refresh-line", t: "Optimistic UI", d: "Create and delete feel instant, with proper rollback on failure." }],
    revTitle: "From developers using it",
    reviews: [{ q: "Saved me the two days I always lose to auth plumbing. The RLS policies were correct out of the box.", n: "Tomas Lindberg", r: "Full-stack developer" }, { q: "I've used a lot of starter templates. This is the first that didn't need unpicking.", n: "Priyanka Nair", r: "Engineering lead" }, { q: "The SQL it generates is clean enough that I actually read it instead of trusting it blindly.", n: "Jordan Ashby", r: "Backend engineer" }],
    priceTitle: "Get the prompt", priceSub: "Premium unlocks this and every other coding kit.",
    tiers: genericTiers("Free prompts only", "Every coding kit", "Lifetime access"),
    faq: genericFaq("AppKit"),
    ctaTitle: "Stop rebuilding auth", ctaSub: "One prompt, a complete starter, and your afternoon back.",
    footBlurb: "A precise build spec that gets Claude to scaffold a clean full-stack app — auth, database and RLS included." },

  { id: "claude-admin-dashboard", layout: "dashboard", brand: "AdminKit", g1: "#373b44", g2: "#4286f4",
    navCta: "Get the prompt", eyebrow: "Admin", topbarSub: "Manage everything in one place",
    h1a: "Full CRUD,", h1b: "zero boilerplate.", sub: "A login-protected admin dashboard with search, filters, bulk actions and a raw-JSON power mode.",
    cta1: "Get the prompt", cta2: "See what's included",
    sideNav: [{ i: "ri-dashboard-line", t: "Overview" }, { i: "ri-table-line", t: "Items" }, { i: "ri-user-3-line", t: "Users" }, { i: "ri-file-list-3-line", t: "Logs" }, { i: "ri-settings-3-line", t: "Settings" }],
    sideFootTitle: "Admin only", sideFootBody: "Writes are gated behind profiles.is_admin at the database level.",
    metrics: [{ lbl: "Items", val: "1842", sm: "+64 this week" }, { lbl: "Admins", val: "6", sm: "2 active now" }, { ring: 88, lbl: "Records complete" }, { lbl: "Edits today", val: "37", sm: "All logged" }],
    panelATitle: "Recent activity", panelASub: "Every write, attributed and timestamped.",
    panelARows: [{ i: "ri-edit-line", t: "Updated 'Pricing page'", s: "by admin@site.com", v: "2m" }, { i: "ri-add-line", t: "Created 'Q2 campaign'", s: "by editor@site.com", v: "18m" }, { i: "ri-delete-bin-line", t: "Deleted draft item", s: "by admin@site.com", v: "1h" }],
    panelBTitle: "What's included", panelBSub: "Everything the prompt generates.",
    panelBRows: [{ i: "ri-search-line", t: "Search & filter", s: "Across every column", v: "✓" }, { i: "ri-code-box-line", t: "Raw JSON mode", s: "Validated on save", v: "✓" }, { i: "ri-shield-user-line", t: "Admin-only writes", s: "RLS enforced", v: "✓" }, { i: "ri-loader-4-line", t: "Loading & empty states", s: "Every view", v: "✓" }],
    tagline: "Built for the people who <em>actually run the site.</em>",
    featKicker: "Included", featTitle: "The admin panel you'd have built", featSub: "Accessible, keyboard-friendly and honest about its states.",
    features: [{ icon: "ri-table-line", t: "Real data table", d: "Search, filter and sort, with create and edit in a side panel." }, { icon: "ri-code-box-line", t: "JSON power mode", d: "Edit any record as raw JSON, validated before it saves." }, { icon: "ri-shield-user-line", t: "Admin-gated writes", d: "Enforced in the database, not just hidden in the interface." }],
    revTitle: "From teams using it",
    reviews: [{ q: "The JSON edit mode is the feature I didn't know I wanted and now use constantly.", n: "Elena Fischer", r: "Technical lead" }, { q: "Loading, empty and error states for every view. That alone saved me a day of polish.", n: "Rashid Karim", r: "Product engineer" }, { q: "Handed it to our ops team and they needed no training. That's the whole review.", n: "Sophie Tran", r: "Head of Ops" }],
    priceTitle: "Get the prompt", priceSub: "Premium unlocks this and every other coding kit.",
    tiers: genericTiers("Free prompts only", "Every coding kit", "Lifetime access"),
    faq: genericFaq("AdminKit"),
    ctaTitle: "Ship your admin panel today", ctaSub: "One prompt, full CRUD, properly secured.",
    footBlurb: "A spec that gets Claude to build a clean, secure admin dashboard with full CRUD and a JSON power mode." },

  { id: "claude-refactor", layout: "dashboard", brand: "Refactor", g1: "#525252", g2: "#3d72b4",
    navCta: "Get the prompt", eyebrow: "Code review", topbarSub: "Behaviour-preserving cleanups",
    h1a: "Cleaner code,", h1b: "same behaviour.", sub: "Turns Claude into a meticulous refactoring partner — naming, duplication and guard clauses, with bugs reported separately.",
    cta1: "Get the prompt", cta2: "See what it checks",
    sideNav: [{ i: "ri-dashboard-line", t: "Overview" }, { i: "ri-git-pull-request-line", t: "Reviews" }, { i: "ri-bug-line", t: "Findings" }, { i: "ri-history-line", t: "History" }, { i: "ri-settings-3-line", t: "Settings" }],
    sideFootTitle: "Ground rule", sideFootBody: "Behaviour never changes silently. Suspected bugs are listed, not fixed.",
    metrics: [{ lbl: "Files reviewed", val: "312", sm: "This month" }, { lbl: "Lines removed", val: "4820", sm: "Net reduction" }, { ring: 96, lbl: "Tests still green" }, { lbl: "Bugs flagged", val: "23", sm: "Reported, not patched" }],
    panelATitle: "Recent reviews", panelASub: "Each one behaviour-preserving by construction.",
    panelARows: [{ i: "ri-file-code-line", t: "checkout.js", s: "Extracted 4 functions", v: "-118" }, { i: "ri-file-code-line", t: "auth-middleware.js", s: "Guard clauses added", v: "-46" }, { i: "ri-file-code-line", t: "report-builder.js", s: "Deduplicated logic", v: "-203" }],
    panelBTitle: "What it checks", panelBSub: "Every pass, in this order.",
    panelBRows: [{ i: "ri-price-tag-3-line", t: "Naming", s: "Intent-revealing identifiers", v: "✓" }, { i: "ri-file-copy-line", t: "Duplication", s: "Extract and consolidate", v: "✓" }, { i: "ri-shield-line", t: "Guard clauses", s: "Flatten nesting", v: "✓" }, { i: "ri-error-warning-line", t: "Edge cases", s: "Listed separately", v: "✓" }],
    tagline: "Improve the code. <em>Never change the behaviour.</em>",
    featKicker: "How it works", featTitle: "Careful by default", featSub: "The rules that keep a refactor from becoming a rewrite.",
    features: [{ icon: "ri-lock-line", t: "Behaviour preserved", d: "No feature changes. Anything suspicious gets reported, never silently altered." }, { icon: "ri-brush-line", t: "Matches your style", d: "Keeps the language, formatting and conventions the file already uses." }, { icon: "ri-list-check-2", t: "Explains every change", d: "A short bullet list of what changed and why, before the code." }],
    revTitle: "From engineers using it",
    reviews: [{ q: "It flagged a race condition instead of quietly 'fixing' it. That restraint is why I trust it.", n: "Ana Petrova", r: "Staff engineer" }, { q: "Kept our plain-CSS conventions instead of dragging in Tailwind like every other tool tries to.", n: "Wes Halloran", r: "Frontend lead" }, { q: "Two hundred lines out of one file and the test suite never went red once.", n: "Ibrahim Diallo", r: "Backend engineer" }],
    priceTitle: "Get the prompt", priceSub: "Premium unlocks this and every other coding kit.",
    tiers: genericTiers("Free prompts only", "Every coding kit", "Lifetime access"),
    faq: genericFaq("Refactor Assistant"),
    ctaTitle: "Clean up that file you're avoiding", ctaSub: "Paste it in. Get a careful, explained refactor back.",
    footBlurb: "Turns Claude into a careful refactoring partner that improves code without ever changing its behaviour." },

  { id: "checkmate-chess-dashboard", layout: "dashboard", brand: "CHECKMATE", g1: "#0d0d0f", g2: "#e8b64c",
    fonts: { display: "Sora,Inter,sans-serif" }, navCta: "Play now", eyebrow: "Good Evening, Master 👑", topbarSub: "Ready when you are",
    h1a: "Every move shapes", h1b: "your future.", sub: "Think. Plan. Execute. Become unstoppable.",
    cta1: "Play now", cta2: "Today's challenge", showBoard: true,
    sideNav: [{ i: "ri-home-5-line", t: "Home" }, { i: "ri-puzzle-line", t: "Puzzles" }, { i: "ri-graduation-cap-line", t: "Learn" }, { i: "ri-bar-chart-2-line", t: "Stats" }, { i: "ri-sword-line", t: "Games" }, { i: "ri-group-line", t: "Community" }],
    sideFootTitle: "Go Premium", sideFootBody: "Unlimited puzzles, full game analysis and opening prep.",
    metrics: [{ lbl: "Rating", val: "1524", sm: "▲ +24 · 98W / 32L" }, { ring: 75, lbl: "Puzzles solved" }, { lbl: "Focus score", val: "4.6", sm: "★★★★½ of 5" }, { lbl: "Lessons", val: "12", sm: "of 20 complete" }],
    panelATitle: "Today's challenge", panelASub: "Find the best move — can you spot it in 20 seconds?",
    panelARows: [{ i: "ri-trophy-line", t: "Reward", s: "On first solve", v: "💎 25" }, { i: "ri-bar-chart-line", t: "Difficulty", s: "Rated 1600–1800", v: "Medium" }, { i: "ri-timer-line", t: "Ends in", s: "Resets at midnight", v: "10:24:53" }],
    panelBTitle: "Your progress", panelBSub: "The last seven days at a glance.",
    panelBRows: [{ i: "ri-sword-line", t: "Games played", s: "This week", v: "18" }, { i: "ri-fire-line", t: "Current streak", s: "Personal best: 31", v: "12 days" }, { i: "ri-puzzle-line", t: "Puzzles solved", s: "94% accuracy", v: "247" }, { i: "ri-time-line", t: "Time studied", s: "Across all lessons", v: "6h 20m" }],
    tagline: "Discipline today, <em>freedom tomorrow.</em>",
    featKicker: "Training", featTitle: "Built to make you better", featSub: "Not just a place to play — a place to actually improve.",
    features: [{ icon: "ri-puzzle-line", t: "Daily puzzles", d: "Tactics matched to your rating, getting harder as you improve." }, { icon: "ri-graduation-cap-line", t: "Structured lessons", d: "Openings, endgames and middlegame plans in a real curriculum." }, { icon: "ri-line-chart-line", t: "Honest analytics", d: "See exactly which positions you lose from, not just your rating." }],
    revTitle: "From the community",
    reviews: [{ q: "Went from 1100 to 1500 in four months. The puzzle difficulty curve is the reason.", n: "Daniel Okonkwo", r: "Rated 1512" }, { q: "The analytics showed me I was losing from equal endgames, not openings. Changed how I train.", n: "Freya Nilsen", r: "Rated 1780" }, { q: "The daily challenge is the only streak I've ever actually kept.", n: "Arjun Mehta", r: "Rated 1340" }],
    priceTitle: "Train at your level", priceSub: "Free forever for casual play. Premium when you get serious.",
    tiers: genericTiers("5 puzzles a day", "Unlimited puzzles & full analysis", "Lifetime, all future courses"),
    faq: genericFaq("CHECKMATE"),
    ctaTitle: "Your next move starts now", ctaSub: "Free to play. No ads, ever.",
    footBlurb: "A chess training app built around deliberate practice — daily puzzles, structured lessons and honest analytics." },
  { id: "propertix-property-management", layout: "property", brand: "Propertix", g1: "#0a1628", g2: "#e8b04a",
    fonts: { display: "'Plus Jakarta Sans',Inter,sans-serif" },
    navCta: "Get a Quote", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80",
    h1a: "We Manage", h1b: "Properties,", h1c: "You Enjoy Peace.",
    sub: "Professional property management services that protect your investment and maximize your returns.",
    cta1: "Our Services", cta2: "View Properties",
    svcTitle: "Our Management Services",
    svcSub: "We provide end-to-end property management solutions tailored to your needs — from marketing and tenant placement to maintenance and financial reporting.",
    services: [
      { i: "ri-home-4-line", t: "Residential Management", d: "Comprehensive management for single-family homes, apartments, and multi-unit properties.", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80" },
      { i: "ri-building-2-line", t: "Commercial Management", d: "Expert management for office spaces, retail properties, and commercial complexes.", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80" },
      { i: "ri-tools-line", t: "Maintenance Services", d: "24/7 maintenance support to ensure your property stays in perfect condition.", img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80" },
    ],
    why: ["Experienced Management Team", "Transparent Communication", "Maximized Rental Income", "Minimal Vacancy Rates", "Reliable Maintenance"],
    whyImg: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80",
    aboutKicker: "About Propertix", aboutTitle: "We Take Care<br>So You Don't Have To",
    aboutBody: "Propertix Management is a full-service property management company dedicated to providing exceptional service to property owners and tenants. Our goal is to protect your investment, increase property value, and deliver peace of mind.",
    aboutImg: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80",
    listings: [
      { t: "Modern Family Home", m: "3 Bed • 2 Bath • 2200 Sqft", img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80" },
      { t: "Downtown Office Space", m: "2000 Sqft • Prime Location", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80" },
      { t: "Luxury Apartment", m: "2 Bed • 2 Bath • City View", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80" },
    ],
    stats: [{ n: "2400", l: "Units managed" }, { n: "98%", l: "Occupancy rate" }, { n: "18", l: "Years in business" }, { n: "4.9", l: "Owner rating" }],
    revTitle: "What owners and tenants say",
    reviews: [
      { q: "Two rentals with Propertix for six years. I've never once had to chase a repair or a rent payment.", n: "Gloria Mendez", r: "Owner · 2 properties" },
      { q: "They filled a vacancy in nine days at above my asking rent. The previous manager took two months.", n: "Aaron Whitlock", r: "Owner · 14 units" },
      { q: "Maintenance actually answers at 9pm. As a tenant that's the whole review.", n: "Nia Foster", r: "Tenant · Luxury Apartment" },
    ],
    priceTitle: "Management plans", priceSub: "Flat percentage of collected rent. No leasing surprises.",
    tiers: [
      { n: "Essential", p: "6%", per: "of monthly rent", f: ["Rent collection", "Owner portal & statements", "Tenant screening", "Annual inspection"], cta: "Get started" },
      { n: "Full Service", p: "8%", per: "of monthly rent", pop: true, f: ["Everything in Essential", "24/7 maintenance coordination", "Marketing & tenant placement", "Quarterly inspections", "Eviction protection"], cta: "Most owners pick this" },
      { n: "Commercial", p: "Custom", per: "tailored quote", f: ["Everything in Full Service", "CAM reconciliation", "Lease negotiation", "Dedicated account manager"], cta: "Request a quote" },
    ],
    faq: [
      { q: "What does Propertix actually handle?", a: "Marketing, tenant screening and placement, rent collection, maintenance coordination, inspections, and monthly financial reporting. You approve the big decisions; we handle everything else." },
      { q: "How quickly do you fill a vacancy?", a: "Our current average is 14 days from listing to signed lease. We market across the major portals plus our own tenant waitlist." },
      { q: "When do I get paid?", a: "Owner disbursements go out by the 10th of each month, with a full statement in your owner portal. No holding periods." },
      { q: "Can I cancel the agreement?", a: "Yes — 30 days' written notice, no termination fee. We'd rather earn the renewal than trap you in a contract." },
    ],
    ctaTitle: "Ready to stop managing and start owning?", ctaSub: "Free rental analysis for your property, no obligation.",
    footBlurb: "Professional property management services that make property ownership simple and profitable." },
];

const layouts = { hero: heroLayout, saas: saasLayout, dashboard: dashboardLayout, property: propertyLayout };
for (const t of items) {
  const html = layouts[t.layout](t);
  fs.writeFileSync(path.join(OUT_DIR, `${t.id}.html`), html);
  console.log("wrote", t.id + ".html", (html.length / 1024).toFixed(1) + "kb");
}
console.log("done:", items.length, "full-site demos in", OUT_DIR);
