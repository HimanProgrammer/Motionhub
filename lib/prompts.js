/* MotionHub — prompt catalog (master-prompt format, PLAIN CSS — no Tailwind).
   These seed the database via the admin "Seed starter prompts" button. */

export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "motion", label: "Motion Sites" },
  { id: "coding", label: "Coding (Claude)" },
  { id: "saas", label: "SaaS" },
  { id: "agency", label: "Agency" },
  { id: "portfolio", label: "Portfolio" },
  { id: "ecommerce", label: "E‑commerce" },
  { id: "ai", label: "AI / Web3" },
];

export const PROMPTS = [
  {
    id: "summit-video-hero",
    title: "SUMMIT — Background Video Hero",
    category: "motion",
    tags: ["hero", "video", "travel"],
    tier: "premium",
    gradient: ["#0b1f3a", "#F4BA3B"],
    builders: ["Claude", "Cursor", "v0"],
    description: "A cinematic full-screen background-video hero for a travel brand, with glass nav, kinetic headline, and a video modal.",
    prompt:
`# SUMMIT — Background Video Hero (Master Prompt)

Create a pixel-perfect, 100% responsive hero section for SUMMIT, an adventure & travel brand. Absolute design fidelity, typography precision, a mobile drawer, an interactive video modal, and an ambient background video.

## Tech Stack (IMPORTANT: plain CSS only — NO Tailwind, NO CSS framework)
- HTML5 semantic layout.
- Plain, hand-written CSS with CSS custom properties (:root variables) and glassmorphism (backdrop-filter: blur). No utility classes, no build step.
- Google Fonts: "Outfit" (display) + "Plus Jakarta Sans" (body).
- Icons: Remix Icon CDN (https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css).
- Pure vanilla JavaScript.

## Assets
- Background video: https://videos.pexels.com/video-files/3129671/3129671-uhd_3840_2160_30fps.mp4
  autoplay, loop, muted, playsinline, object-fit: cover to fill the viewport, with a dark vignette gradient overlay for readability.

## Visual & Interactive Requirements
1. Header/Nav: mountain-peak SVG logo + "SUMMIT" (uppercase, extra-bold, letter-spacing ~0.16em, white). Desktop links: Home, About, Services, Stories, Contact with an animated hover underline. Pill outline button "Let's Talk ↗". Mobile: hamburger (ri-menu-3-line) opens a full-screen slide-over drawer with blurred glass backdrop.
2. Hero content (left): headline on three lines — "Explore." / "Dream." / "Discover." — the last word in warm amber (#F4BA3B) with a soft text glow; clamp() display sizing. Subtitle: "We inspire journeys that awaken curiosity and create unforgettable experiences." CTA row: primary amber pill "Start Your Journey ↗"; secondary circular ▶ play button + "Watch Video" that opens a fullscreen backdrop-blur video modal.
3. Bottom bar: left "SCROLL DOWN" (uppercase, wide tracking) with a vertical gradient line + animated ↓; right social row (Instagram, Facebook, Twitter/X, Globe).
4. Interactions: sound mute/unmute toggle for the video; showreel modal with ESC + click-outside + close-button handlers and body scroll-lock; staggered fade-up entrance for headline lines.
5. 60fps, transforms only, fully responsive. Output a single self-contained index.html (inline <style> + <script>).`,
  },
  {
    id: "nova-studio-hero",
    title: "NOVA — Split-Screen Studio Hero",
    category: "agency",
    tags: ["agency", "split", "3d-tilt"],
    tier: "premium",
    gradient: ["#0e0e0e", "#C6FF3D"],
    builders: ["Claude", "Cursor", "v0"],
    description: "A split-screen creative-studio hero with a kinetic headline, magnetic buttons, and a cursor-tilt image panel.",
    prompt:
`# NOVA — Split-Screen Creative Studio Hero (Master Prompt)

Pixel-perfect, fully responsive split-screen hero for NOVA, a premium branding studio.

## Tech Stack (plain CSS only — NO Tailwind)
- HTML5 semantic layout.
- Hand-written CSS with :root variables, CSS grid for the split layout, glassmorphism for the drawer. No utility framework, no build step.
- Google Fonts: "Clash Display" (headings) + "Inter" (body).
- Icons: Remix Icon CDN.
- Vanilla JS.

## Assets
- Feature image (right panel): https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80
  object-fit: cover, rounded corners, subtle grain + dark gradient overlay.

## Visual & Interactive Requirements
1. Nav: "◐ NOVA" (uppercase, bold, wide tracking). Links: Work, Studio, Services, Journal, Contact with a left→right hover underline wipe. Pill outline "Start a project ↗". Mobile hamburger → full-screen drawer with backdrop blur and staggered link fade-in.
2. Left column: eyebrow "● Available for new work — 2026" with a pulsing green dot; headline "We build / brands that / move." with "move." in electric lime (#C6FF3D) + glow, words rising with a staggered fade-up; subtitle; CTA row — primary lime pill "See our work ↗" that is MAGNETIC (moves toward the cursor within ~40px, springs back on leave), secondary circular ▶ + "Showreel" opening a fullscreen video modal; a muted auto-scrolling client marquee that pauses on hover.
3. Right column: the cover image tilts subtly in 3D toward the cursor (max 6°) with a moving glare highlight; resets on mouse leave; disabled on touch.
4. Bottom bar: left "SCROLL" (wide tracking) + animated ↓; right social icons (Instagram, Behance, Twitter/X, LinkedIn).
5. Reveal-on-load timeline (eyebrow → headline words → subtitle → CTAs, ~80ms apart). 60fps, transforms only. On mobile the image panel drops below the content. Output one self-contained index.html.`,
  },
  {
    id: "aurora-saas-hero",
    title: "Aurora SaaS Gradient Hero",
    category: "saas",
    tags: ["saas", "hero", "gradient"],
    tier: "free",
    gradient: ["#6d5efc", "#00d4ff"],
    builders: ["Claude", "Cursor", "v0", "Lovable"],
    description: "A SaaS hero with an animated aurora gradient mesh background and a floating product card — pure CSS, no images.",
    prompt:
`# Aurora SaaS Hero (Master Prompt)

A modern SaaS landing hero with an animated "aurora" gradient background — no image or video assets, everything drawn in CSS.

## Tech Stack (plain CSS only — NO Tailwind)
- HTML5 semantic layout.
- Hand-written CSS with :root variables; the aurora is layered radial-gradients animated with @keyframes + blur. No framework, no build step.
- Google Fonts: "Space Grotesk" + "Inter".
- Icons: Remix Icon CDN.
- Vanilla JS for the scroll reveal only.

## Visual & Interactive Requirements
1. Full-width dark hero. Background: 3 blurred radial-gradient blobs (purple #6d5efc, cyan #00d4ff, pink #fa71cd) drifting slowly and independently via @keyframes.
2. Nav: wordmark + links (Product, Pricing, Docs, Blog) + a primary pill "Get started".
3. Centered content: a glass pill badge "New — v2.0 is live" with a green status dot; a bold headline (max 8 words) using clamp(); a one-line subhead; two buttons (primary filled gradient + secondary ghost).
4. To the right (or below on mobile): a floating product-screenshot card built from CSS (rounded, soft glow, faint UI mockup inside) with a gentle up/down float animation.
5. Staggered fade-up entrance for each element. Fully responsive (single column on mobile). 60fps, transforms only. Output a single self-contained index.html.`,
  },
  {
    id: "horizon-agency-video",
    title: "HORIZON — Video Agency Hero",
    category: "agency",
    tags: ["agency", "video", "bold"],
    tier: "premium",
    gradient: ["#101014", "#ff5f6d"],
    builders: ["Claude", "Cursor"],
    description: "A bold full-bleed video hero for a digital agency, with oversized type, a marquee, and a reel modal.",
    prompt:
`# HORIZON — Video Agency Hero (Master Prompt)

A bold, full-bleed background-video hero for HORIZON, a digital agency.

## Tech Stack (plain CSS only — NO Tailwind)
- HTML5 semantic layout.
- Hand-written CSS with :root variables + glassmorphism. No framework, no build step.
- Google Fonts: "Anton" (oversized display) + "Inter" (body).
- Icons: Remix Icon CDN.
- Vanilla JS.

## Assets
- Background video: https://videos.pexels.com/video-files/2098989/2098989-hd_1920_1080_30fps.mp4
  autoplay, loop, muted, playsinline, object-fit: cover, with a dark-to-transparent gradient overlay.

## Visual & Interactive Requirements
1. Sticky glass nav: wordmark "HORIZON" + links (Work, Studio, Services, Contact) + pill button "Let's build ↗". Mobile drawer with blur.
2. Center/left: an oversized clamp() headline like "We make brands impossible to ignore." with one word highlighted in coral (#ff5f6d); a short subtitle; primary pill "See the work ↗" + secondary ▶ "Watch reel" opening a fullscreen backdrop-blur video modal (ESC + click-outside + scroll-lock).
3. A thin auto-scrolling marquee of services (Branding · Web · Motion · Strategy) that pauses on hover.
4. Bottom-left "SCROLL" + animated ↓; bottom-right award/stat chips ("50+ projects", "12 awards").
5. Staggered entrance, 60fps, fully responsive. Output one self-contained index.html.`,
  },
  {
    id: "lumen-portfolio-hero",
    title: "LUMEN — Portfolio Reveal Hero",
    category: "portfolio",
    tags: ["portfolio", "reveal", "minimal"],
    tier: "free",
    gradient: ["#1a1a2e", "#e94560"],
    builders: ["Claude", "v0", "Lovable"],
    description: "A minimal photographer/designer portfolio hero with a clip-path image reveal and elegant type.",
    prompt:
`# LUMEN — Portfolio Reveal Hero (Master Prompt)

A minimal, elegant portfolio hero for a photographer/designer named LUMEN.

## Tech Stack (plain CSS only — NO Tailwind)
- HTML5 semantic layout.
- Hand-written CSS with :root variables; clip-path + transitions for the reveal. No framework, no build step.
- Google Fonts: "Fraunces" (serif display) + "Inter".
- Icons: Remix Icon CDN.
- Vanilla JS (IntersectionObserver for reveals).

## Assets
- Hero image: https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=80
  object-fit: cover; revealed with an expanding clip-path wipe on load.

## Visual & Interactive Requirements
1. Sparse nav: "LUMEN" wordmark left; links (Work, About, Contact) right; lots of whitespace.
2. Large serif headline "Light, framed." with a thin animated underline; a one-line subtitle; a text link "View selected work →" that slides its arrow on hover.
3. The hero image reveals via an expanding clip-path wipe on load; a caption ("Selected · 2020–2026") fades up over it.
4. A small "available for commissions" chip with a pulsing dot.
5. Restrained, editorial spacing; 60fps; fully responsive (image stacks under the text on mobile). Output one self-contained index.html.`,
  },
  {
    id: "vertex-web3-hero",
    title: "VERTEX — Neon Web3 Hero",
    category: "ai",
    tags: ["web3", "neon", "grid"],
    tier: "premium",
    gradient: ["#0f0c29", "#00f0ff"],
    builders: ["Claude", "Cursor", "v0"],
    description: "A futuristic Web3/AI hero with an animated perspective grid floor, neon glow type, and a floating token.",
    prompt:
`# VERTEX — Neon Web3 Hero (Master Prompt)

A futuristic Web3/AI landing hero with a neon aesthetic — everything drawn in CSS, no assets.

## Tech Stack (plain CSS only — NO Tailwind)
- HTML5 semantic layout.
- Hand-written CSS with :root variables; the grid floor, glow, and particles are pure CSS + @keyframes. No framework, no build step.
- Google Fonts: "Orbitron" (display) + "Inter".
- Icons: Remix Icon CDN.
- Vanilla JS (minimal).

## Visual & Interactive Requirements
1. Dark background with an animated perspective "grid floor" receding into the distance (CSS transform: perspective + moving background-position).
2. Nav: "▲ VERTEX" + links (Protocol, Docs, Ecosystem, DAO) + a pill "Launch app" with an animated gradient border.
3. Center: neon glowing headline (accent cyan #00f0ff) with a subtle flicker; a subhead; primary "Launch app" + secondary ghost "Read docs".
4. A floating, slowly rotating token/coin shape (CSS 3D transforms) with a glow; faint particle dots drifting upward.
5. Stat row ("$2.4B TVL", "180k wallets", "0.2s finality"). 60fps, transforms only, fully responsive. Output one self-contained index.html.`,
  },
  {
    id: "bento-features",
    title: "Bento Feature Grid Section",
    category: "saas",
    tags: ["features", "bento", "grid"],
    tier: "free",
    gradient: ["#11998e", "#38ef7d"],
    builders: ["Claude", "v0", "Lovable"],
    description: "An Apple-style bento grid of feature cards with hover lift, animated icons, and scroll reveal.",
    prompt:
`# Bento Feature Grid (Master Prompt)

A premium "bento box" features section for a SaaS site.

## Tech Stack (plain CSS only — NO Tailwind)
- HTML5 semantic layout.
- Hand-written CSS using CSS grid with spanning cells (grid-column/grid-row span) and glassmorphism. No framework, no build step.
- Google Fonts: "Space Grotesk" + "Inter".
- Icons: Remix Icon CDN.
- Vanilla JS (IntersectionObserver reveal).

## Visual & Interactive Requirements
1. A section heading + one-line subhead, centered.
2. An asymmetric grid of 5–6 cards of varying sizes (some span 2 columns or 2 rows). Each card: an animated Remix icon, a short title, one sentence of copy.
3. On hover: card lifts slightly, border glows, icon animates.
4. Dark theme with subtle glassmorphism (blur + translucent borders + faint gradient accents per card).
5. Cards fade/slide in on scroll, staggered. Fully responsive — collapse to one column on mobile. Output one self-contained section (HTML + inline style + script).`,
  },
  {
    id: "flux-pricing-section",
    title: "FLUX — Animated Pricing Section",
    category: "saas",
    tags: ["pricing", "toggle", "saas"],
    tier: "premium",
    gradient: ["#2193b0", "#6dd5ed"],
    builders: ["Claude", "v0", "Lovable"],
    description: "A 3-tier pricing block with an animated monthly/yearly toggle, count-up prices, and a highlighted plan.",
    prompt:
`# FLUX — Animated Pricing Section (Master Prompt)

A polished pricing section with three tiers (Starter, Pro, Unlimited).

## Tech Stack (plain CSS only — NO Tailwind)
- HTML5 semantic layout.
- Hand-written CSS with :root variables, gradient border on the featured card (border-box trick). No framework, no build step.
- Google Fonts: "Space Grotesk" + "Inter".
- Icons: Remix Icon CDN.
- Vanilla JS for the toggle + number animation.

## Visual & Interactive Requirements
1. A monthly/yearly toggle at the top; switching animates the prices counting up/down and shows a "Save 20%" badge on yearly.
2. The middle "Pro" plan is highlighted: scaled up, gradient border, "Most popular" ribbon.
3. Each card: price, billing note, a feature list with ri-check-line ticks, and a CTA button.
4. Hover raises the card with a soft glow.
5. Fully responsive (stack on mobile). Output one self-contained section (HTML + inline style + script).`,
  },
  {
    id: "claude-fullstack",
    title: "Full-Stack App Starter (Claude)",
    category: "coding",
    tags: ["fullstack", "claude", "app"],
    tier: "premium",
    gradient: ["#4776e6", "#8e54e9"],
    builders: ["Claude", "Cursor"],
    description: "A precise build spec that gets Claude to scaffold a clean full-stack app with auth and a database — plain CSS, no Tailwind.",
    prompt:
`# Full-Stack App Starter (Master Prompt for Claude)

You are my senior full-stack engineer. Build a production-ready starter app.

## Stack (IMPORTANT)
- Next.js (App Router) in JavaScript — NO TypeScript.
- Plain CSS using CSS Modules — NO Tailwind, NO CSS framework.
- Supabase for auth + Postgres.

## Requirements
1. Email/password auth: sign up, log in, log out, and a protected /dashboard route.
2. A "projects" table (id, user_id, title, created_at) with Row Level Security so users only see their own rows.
3. Dashboard: list, create, and delete projects with optimistic UI.
4. Clean, accessible components; loading and error states everywhere; a simple dark theme via CSS variables.
5. Include the SQL for the table + RLS policies, and a .env.example.

## Deliverables
- Print the file tree first, then each file in full.
- Explain setup steps (Supabase keys, running the SQL, npm run dev) at the end.
- Make sensible choices and note them — do not ask me questions.`,
  },
  {
    id: "claude-landing",
    title: "One-Shot Landing Page (Claude)",
    category: "coding",
    tags: ["landing", "claude", "html"],
    tier: "free",
    gradient: ["#00c6ff", "#0072ff"],
    builders: ["Claude", "v0"],
    description: "One prompt that makes Claude output a complete, self-contained animated landing page in a single file — plain CSS.",
    prompt:
`# One-Shot Landing Page (Master Prompt for Claude)

Build a complete, single-file landing page (index.html with inline <style> and <script>).

## Rules
- Plain, hand-written CSS only — NO Tailwind, NO external CSS framework. You may load Google Fonts and Remix Icon via CDN.
- Vanilla JS only. No build step.

## Sections, in order
1. Sticky glass nav with smooth-scroll links.
2. Animated gradient hero (CSS @keyframes) with headline + primary/secondary CTAs.
3. A 3-item "how it works" row.
4. A bento features grid.
5. A testimonials slider (auto-advance, pause on hover).
6. Pricing (3 tiers, one highlighted).
7. FAQ accordion.
8. Footer.

## Style
- Cohesive dark theme with ONE accent color via CSS variables, rounded corners, generous spacing.
- Tasteful scroll-reveal animations (IntersectionObserver). Fully responsive, 60fps.

Product: [DESCRIBE YOUR PRODUCT HERE].
Output the full index.html and nothing else.`,
  },
  {
    id: "claude-admin-dashboard",
    title: "Admin Dashboard CRUD (Claude)",
    category: "coding",
    tags: ["dashboard", "crud", "claude"],
    tier: "premium",
    gradient: ["#373b44", "#4286f4"],
    builders: ["Claude", "Cursor"],
    description: "A spec that gets Claude to build a clean admin dashboard with full CRUD, auth, and a data table — plain CSS.",
    prompt:
`# Admin Dashboard CRUD (Master Prompt for Claude)

Act as my senior engineer and build an admin dashboard.

## Stack
- Next.js (App Router) in JavaScript — NO TypeScript.
- Plain CSS Modules — NO Tailwind.
- Supabase (auth + Postgres).

## Requirements
1. Login-protected /admin route; only users with profiles.is_admin = true can access it.
2. A resource ("items") with fields: id, title, category, status, updated_at.
3. Full CRUD: a data table listing items with search + filter; create/edit in a side panel or modal; delete with a confirm dialog; optimistic UI.
4. A "raw JSON" edit mode for power users (edit the record as JSON, validate, save).
5. SQL for the table + RLS (admin-only writes, public read optional) and a signup trigger that creates a profile row.
6. Accessible, keyboard-friendly, dark theme via CSS variables; loading/empty/error states.

## Deliverables
- File tree, then each file in full, then setup steps. Make choices; don't ask questions.`,
  },
  {
    id: "claude-refactor",
    title: "Refactor Assistant (Claude)",
    category: "coding",
    tags: ["refactor", "review", "claude"],
    tier: "premium",
    gradient: ["#525252", "#3d72b4"],
    builders: ["Claude", "Cursor"],
    description: "Turns Claude into a careful refactoring partner that improves code without changing behavior.",
    prompt:
`# Refactor Assistant (Master Prompt for Claude)

Act as a meticulous senior engineer doing a refactor pass on the code I paste next.

## Rules
- Preserve behavior exactly. No feature changes.
- Improve naming, remove duplication, extract small functions, add guard clauses.
- Keep the SAME language, style, and formatting conventions as the original (if it uses plain CSS, do NOT introduce Tailwind; if JS, do NOT introduce TypeScript).
- Point out any bug or edge case you spot, but list them SEPARATELY — don't silently change behavior.

## Output
1. A short bullet list of what you changed and why.
2. The full refactored file(s).

Wait for my code, then begin.`,
  },
];
