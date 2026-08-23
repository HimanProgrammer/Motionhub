/* Looping site preview per prompt id (video where a real clip exists, image otherwise).
   Kept here so both the gallery cards and the template detail page share one source. */
export const PREVIEWS = {
  "summit-video-hero": "https://videos.pexels.com/video-files/3129671/3129671-uhd_3840_2160_30fps.mp4",
  "nova-studio-hero": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80",
  "aurora-saas-hero": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&q=80",
  "horizon-agency-video": "https://videos.pexels.com/video-files/2098989/2098989-hd_1920_1080_30fps.mp4",
  "lumen-portfolio-hero": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=80",
  "vertex-web3-hero": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1600&q=80",
  "bento-features": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80",
  "flux-pricing-section": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80",
  "claude-fullstack": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=80",
  "claude-landing": "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1600&q=80",
  "claude-admin-dashboard": "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&q=80",
  "claude-refactor": "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1600&q=80",
};

export function getPreview(p) {
  return (p && (p.preview || PREVIEWS[p.id])) || "";
}
export function isVideo(url) {
  return /\.(mp4|webm)(\?|$)/i.test(url || "");
}

/* "Perfect for" bullets shown on the template page, by category. */
const USE_CASES = {
  motion: ["Landing pages that need a wow moment", "Travel, lifestyle & event brands", "Product launches & campaigns", "Anywhere a cinematic hero fits"],
  agency: ["Creative & branding studios", "Design & marketing agencies", "Freelancer & studio portfolios", "Pitch and case-study sites"],
  saas: ["SaaS & startup landing pages", "Product & feature showcases", "Pricing & conversion pages", "Developer-tool marketing sites"],
  portfolio: ["Photographers & designers", "Personal & creative portfolios", "Editorial & minimal brands", "Selected-work showcases"],
  ecommerce: ["Product & storefront launches", "DTC & lifestyle brands", "Campaign & drop pages", "Catalog hero sections"],
  ai: ["AI / Web3 products", "Protocol & token landing pages", "Futuristic tech brands", "Dashboards with a neon aesthetic"],
  coding: ["Full builds through Claude", "Rapid prototypes & MVPs", "Dashboards & internal tools", "Production-ready starters"],
};
export function useCasesFor(category) {
  return USE_CASES[category] || USE_CASES.saas;
}
