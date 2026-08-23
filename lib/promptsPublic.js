/* Public-safe copy of the prompt catalog — used as the pre-load / offline fallback on
   the home gallery and template pages. Premium prompt TEXT is stripped (null) here on
   purpose so it never ships in a public page's JS bundle. The real gate is server-side:
   Supabase's "prompts_public" view (see lib/supabaseClient.js getPrompts()) also nulls
   premium `prompt` text unless the requester is unlimited/admin.
   For the FULL catalog (used only by the admin dashboard to seed the DB), see lib/prompts.js. */

export const CATEGORIES = [
  {
    "id": "all",
    "label": "All"
  },
  {
    "id": "motion",
    "label": "Motion Sites"
  },
  {
    "id": "coding",
    "label": "Coding (Claude)"
  },
  {
    "id": "saas",
    "label": "SaaS"
  },
  {
    "id": "agency",
    "label": "Agency"
  },
  {
    "id": "portfolio",
    "label": "Portfolio"
  },
  {
    "id": "ecommerce",
    "label": "E‑commerce"
  },
  {
    "id": "ai",
    "label": "AI / Web3"
  }
];

export const PROMPTS_PUBLIC = [
  {
    "id": "summit-video-hero",
    "preview": "https://videos.pexels.com/video-files/3129671/3129671-uhd_3840_2160_30fps.mp4",
    "title": "SUMMIT — Background Video Hero",
    "category": "motion",
    "tags": [
      "hero",
      "video",
      "travel"
    ],
    "tier": "premium",
    "gradient": [
      "#0b1f3a",
      "#F4BA3B"
    ],
    "builders": [
      "Claude",
      "Cursor",
      "v0"
    ],
    "description": "A cinematic full-screen background-video hero for a travel brand, with glass nav, kinetic headline, and a video modal.",
    "prompt": null
  },
  {
    "id": "nova-studio-hero",
    "preview": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80",
    "title": "NOVA — Split-Screen Studio Hero",
    "category": "agency",
    "tags": [
      "agency",
      "split",
      "3d-tilt"
    ],
    "tier": "premium",
    "gradient": [
      "#0e0e0e",
      "#C6FF3D"
    ],
    "builders": [
      "Claude",
      "Cursor",
      "v0"
    ],
    "description": "A split-screen creative-studio hero with a kinetic headline, magnetic buttons, and a cursor-tilt image panel.",
    "prompt": null
  },
  {
    "id": "aurora-saas-hero",
    "preview": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80",
    "title": "Aurora SaaS Gradient Hero",
    "category": "saas",
    "tags": [
      "saas",
      "hero",
      "gradient"
    ],
    "tier": "free",
    "gradient": [
      "#6d5efc",
      "#00d4ff"
    ],
    "builders": [
      "Claude",
      "Cursor",
      "v0",
      "Lovable"
    ],
    "description": "A SaaS hero with an animated aurora gradient mesh background and a floating product card — pure CSS, no images.",
    "prompt": "# Aurora SaaS Hero (Master Prompt)\n\nA modern SaaS landing hero with an animated \"aurora\" gradient background — no image or video assets, everything drawn in CSS.\n\n## Tech Stack (plain CSS only — NO Tailwind)\n- HTML5 semantic layout.\n- Hand-written CSS with :root variables; the aurora is layered radial-gradients animated with @keyframes + blur. No framework, no build step.\n- Google Fonts: \"Space Grotesk\" + \"Inter\".\n- Icons: Remix Icon CDN.\n- Vanilla JS for the scroll reveal only.\n\n## Visual & Interactive Requirements\n1. Full-width dark hero. Background: 3 blurred radial-gradient blobs (purple #6d5efc, cyan #00d4ff, pink #fa71cd) drifting slowly and independently via @keyframes.\n2. Nav: wordmark + links (Product, Pricing, Docs, Blog) + a primary pill \"Get started\".\n3. Centered content: a glass pill badge \"New — v2.0 is live\" with a green status dot; a bold headline (max 8 words) using clamp(); a one-line subhead; two buttons (primary filled gradient + secondary ghost).\n4. To the right (or below on mobile): a floating product-screenshot card built from CSS (rounded, soft glow, faint UI mockup inside) with a gentle up/down float animation.\n5. Staggered fade-up entrance for each element. Fully responsive (single column on mobile). 60fps, transforms only. Output a single self-contained index.html."
  },
  {
    "id": "horizon-agency-video",
    "preview": "https://videos.pexels.com/video-files/2098989/2098989-hd_1920_1080_30fps.mp4",
    "title": "HORIZON — Video Agency Hero",
    "category": "agency",
    "tags": [
      "agency",
      "video",
      "bold"
    ],
    "tier": "premium",
    "gradient": [
      "#101014",
      "#ff5f6d"
    ],
    "builders": [
      "Claude",
      "Cursor"
    ],
    "description": "A bold full-bleed video hero for a digital agency, with oversized type, a marquee, and a reel modal.",
    "prompt": null
  },
  {
    "id": "lumen-portfolio-hero",
    "preview": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80",
    "title": "LUMEN — Portfolio Reveal Hero",
    "category": "portfolio",
    "tags": [
      "portfolio",
      "reveal",
      "minimal"
    ],
    "tier": "free",
    "gradient": [
      "#1a1a2e",
      "#e94560"
    ],
    "builders": [
      "Claude",
      "v0",
      "Lovable"
    ],
    "description": "A minimal photographer/designer portfolio hero with a clip-path image reveal and elegant type.",
    "prompt": "# LUMEN — Portfolio Reveal Hero (Master Prompt)\n\nA minimal, elegant portfolio hero for a photographer/designer named LUMEN.\n\n## Tech Stack (plain CSS only — NO Tailwind)\n- HTML5 semantic layout.\n- Hand-written CSS with :root variables; clip-path + transitions for the reveal. No framework, no build step.\n- Google Fonts: \"Fraunces\" (serif display) + \"Inter\".\n- Icons: Remix Icon CDN.\n- Vanilla JS (IntersectionObserver for reveals).\n\n## Assets\n- Hero image: https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=80\n  object-fit: cover; revealed with an expanding clip-path wipe on load.\n\n## Visual & Interactive Requirements\n1. Sparse nav: \"LUMEN\" wordmark left; links (Work, About, Contact) right; lots of whitespace.\n2. Large serif headline \"Light, framed.\" with a thin animated underline; a one-line subtitle; a text link \"View selected work →\" that slides its arrow on hover.\n3. The hero image reveals via an expanding clip-path wipe on load; a caption (\"Selected · 2020–2026\") fades up over it.\n4. A small \"available for commissions\" chip with a pulsing dot.\n5. Restrained, editorial spacing; 60fps; fully responsive (image stacks under the text on mobile). Output one self-contained index.html."
  },
  {
    "id": "vertex-web3-hero",
    "preview": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80",
    "title": "VERTEX — Neon Web3 Hero",
    "category": "ai",
    "tags": [
      "web3",
      "neon",
      "grid"
    ],
    "tier": "premium",
    "gradient": [
      "#0f0c29",
      "#00f0ff"
    ],
    "builders": [
      "Claude",
      "Cursor",
      "v0"
    ],
    "description": "A futuristic Web3/AI hero with an animated perspective grid floor, neon glow type, and a floating token.",
    "prompt": null
  },
  {
    "id": "bento-features",
    "preview": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    "title": "Bento Feature Grid Section",
    "category": "saas",
    "tags": [
      "features",
      "bento",
      "grid"
    ],
    "tier": "free",
    "gradient": [
      "#11998e",
      "#38ef7d"
    ],
    "builders": [
      "Claude",
      "v0",
      "Lovable"
    ],
    "description": "An Apple-style bento grid of feature cards with hover lift, animated icons, and scroll reveal.",
    "prompt": "# Bento Feature Grid (Master Prompt)\n\nA premium \"bento box\" features section for a SaaS site.\n\n## Tech Stack (plain CSS only — NO Tailwind)\n- HTML5 semantic layout.\n- Hand-written CSS using CSS grid with spanning cells (grid-column/grid-row span) and glassmorphism. No framework, no build step.\n- Google Fonts: \"Space Grotesk\" + \"Inter\".\n- Icons: Remix Icon CDN.\n- Vanilla JS (IntersectionObserver reveal).\n\n## Visual & Interactive Requirements\n1. A section heading + one-line subhead, centered.\n2. An asymmetric grid of 5–6 cards of varying sizes (some span 2 columns or 2 rows). Each card: an animated Remix icon, a short title, one sentence of copy.\n3. On hover: card lifts slightly, border glows, icon animates.\n4. Dark theme with subtle glassmorphism (blur + translucent borders + faint gradient accents per card).\n5. Cards fade/slide in on scroll, staggered. Fully responsive — collapse to one column on mobile. Output one self-contained section (HTML + inline style + script)."
  },
  {
    "id": "flux-pricing-section",
    "preview": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    "title": "FLUX — Animated Pricing Section",
    "category": "saas",
    "tags": [
      "pricing",
      "toggle",
      "saas"
    ],
    "tier": "premium",
    "gradient": [
      "#2193b0",
      "#6dd5ed"
    ],
    "builders": [
      "Claude",
      "v0",
      "Lovable"
    ],
    "description": "A 3-tier pricing block with an animated monthly/yearly toggle, count-up prices, and a highlighted plan.",
    "prompt": null
  },
  {
    "id": "claude-fullstack",
    "preview": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
    "title": "Full-Stack App Starter (Claude)",
    "category": "coding",
    "tags": [
      "fullstack",
      "claude",
      "app"
    ],
    "tier": "premium",
    "gradient": [
      "#4776e6",
      "#8e54e9"
    ],
    "builders": [
      "Claude",
      "Cursor"
    ],
    "description": "A precise build spec that gets Claude to scaffold a clean full-stack app with auth and a database — plain CSS, no Tailwind.",
    "prompt": null
  },
  {
    "id": "claude-landing",
    "preview": "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80",
    "title": "One-Shot Landing Page (Claude)",
    "category": "coding",
    "tags": [
      "landing",
      "claude",
      "html"
    ],
    "tier": "free",
    "gradient": [
      "#00c6ff",
      "#0072ff"
    ],
    "builders": [
      "Claude",
      "v0"
    ],
    "description": "One prompt that makes Claude output a complete, self-contained animated landing page in a single file — plain CSS.",
    "prompt": "# One-Shot Landing Page (Master Prompt for Claude)\n\nBuild a complete, single-file landing page (index.html with inline <style> and <script>).\n\n## Rules\n- Plain, hand-written CSS only — NO Tailwind, NO external CSS framework. You may load Google Fonts and Remix Icon via CDN.\n- Vanilla JS only. No build step.\n\n## Sections, in order\n1. Sticky glass nav with smooth-scroll links.\n2. Animated gradient hero (CSS @keyframes) with headline + primary/secondary CTAs.\n3. A 3-item \"how it works\" row.\n4. A bento features grid.\n5. A testimonials slider (auto-advance, pause on hover).\n6. Pricing (3 tiers, one highlighted).\n7. FAQ accordion.\n8. Footer.\n\n## Style\n- Cohesive dark theme with ONE accent color via CSS variables, rounded corners, generous spacing.\n- Tasteful scroll-reveal animations (IntersectionObserver). Fully responsive, 60fps.\n\nProduct: [DESCRIBE YOUR PRODUCT HERE].\nOutput the full index.html and nothing else."
  },
  {
    "id": "claude-admin-dashboard",
    "preview": "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80",
    "title": "Admin Dashboard CRUD (Claude)",
    "category": "coding",
    "tags": [
      "dashboard",
      "crud",
      "claude"
    ],
    "tier": "premium",
    "gradient": [
      "#373b44",
      "#4286f4"
    ],
    "builders": [
      "Claude",
      "Cursor"
    ],
    "description": "A spec that gets Claude to build a clean admin dashboard with full CRUD, auth, and a data table — plain CSS.",
    "prompt": null
  },
  {
    "id": "claude-refactor",
    "preview": "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&q=80",
    "title": "Refactor Assistant (Claude)",
    "category": "coding",
    "tags": [
      "refactor",
      "review",
      "claude"
    ],
    "tier": "premium",
    "gradient": [
      "#525252",
      "#3d72b4"
    ],
    "builders": [
      "Claude",
      "Cursor"
    ],
    "description": "Turns Claude into a careful refactoring partner that improves code without changing behavior.",
    "prompt": null
  }
];
