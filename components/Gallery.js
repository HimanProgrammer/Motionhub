"use client";

import { useEffect, useState } from "react";
import { CATEGORIES, PROMPTS as LOCAL_PROMPTS } from "@/lib/prompts";
import { getPrompts, subscribeToPrompts } from "@/lib/supabaseClient";
import { useReveal } from "@/lib/useReveal";
import PromptModal from "./PromptModal";
import AuthModal from "./AuthModal";

// Looping site preview per prompt (video where a real clip exists, image otherwise).
const PREVIEWS = {
  "summit-video-hero": "https://videos.pexels.com/video-files/3129671/3129671-uhd_3840_2160_30fps.mp4",
  "nova-studio-hero": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80",
  "aurora-saas-hero": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80",
  "horizon-agency-video": "https://videos.pexels.com/video-files/2098989/2098989-hd_1920_1080_30fps.mp4",
  "lumen-portfolio-hero": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80",
  "vertex-web3-hero": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80",
  "bento-features": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
  "flux-pricing-section": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
  "claude-fullstack": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
  "claude-landing": "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80",
  "claude-admin-dashboard": "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80",
  "claude-refactor": "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&q=80",
};

export default function Gallery({ auth }) {
  const [prompts, setPrompts] = useState(LOCAL_PROMPTS);
  const [activeCat, setActiveCat] = useState("all");
  const [openPrompt, setOpenPrompt] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const revealRef = useReveal([prompts, activeCat]);

  const { unlimited, user, configured, refresh } = auth;

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    function load() {
      getPrompts().then((db) => { if (!cancelled && db && db.length) setPrompts(db); });
    }
    load();
    // Live sync: when the admin adds/edits/deletes a prompt, this tab refetches
    // automatically in the background — no reload needed.
    const unsubscribe = subscribeToPrompts(load);
    return () => { cancelled = true; unsubscribe(); };
  }, [configured]);

  const list = prompts.filter(
    (p) => activeCat === "all" || p.category === activeCat || (p.tags || []).includes(activeCat)
  );

  return (
    <section className="section" id="gallery">
      <div className="container" ref={revealRef}>
        <div className="section-head reveal">
          <h2>The prompt library</h2>
          <p>Copy‑paste prompts for animated motion sites and full builds through Claude. Free ones are ready to grab — premium unlocks with Go Unlimited.</p>
        </div>

        <div className="filters">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={"chip" + (c.id === activeCat ? " active" : "")}
              onClick={() => setActiveCat(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>No prompts yet in this category.</p>
        ) : (
          <div className="grid">
            {list.map((p) => {
              const grad = `linear-gradient(135deg,${p.gradient[0]},${p.gradient[1]})`;
              const locked = p.tier === "premium" && !unlimited;
              const media = p.preview || PREVIEWS[p.id];
              return (
                <article className="card in" key={p.id}>
                  <div className="card-preview" style={{ background: grad }}>
                    {media && /\.(mp4|webm)(\?|$)/i.test(media) ? (
                      <video
                        className="card-media"
                        src={media}
                        autoPlay loop muted playsInline preload="metadata"
                        aria-hidden="true"
                      />
                    ) : media ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="card-media" src={media} alt="" loading="lazy" aria-hidden="true" />
                    ) : null}
                    <span className="card-media-veil" />
                    <span className={"badge " + (p.tier === "premium" ? "premium" : "free")}>
                      {p.tier === "premium" ? "Premium" : "Free"}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="card-title-row">
                      <h3>{p.title}</h3>
                      <span className="card-cat">{(CATEGORIES.find((c) => c.id === p.category) || {}).label || p.category}</span>
                    </div>
                    <p className="desc">{p.description}</p>
                    <div className="tags">
                      {(p.tags || []).slice(0, 3).map((t) => <span className="tag" key={t}>#{t}</span>)}
                    </div>
                    <div className="card-actions">
                      <button className="btn btn-primary btn-sm" onClick={() => setOpenPrompt(p)}>
                        {locked ? "🔒 Unlock" : "Copy prompt"}
                      </button>
                      <span className="builders">{(p.builders || []).slice(0, 3).join(" · ")}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <PromptModal
        prompt={openPrompt}
        unlocked={openPrompt ? openPrompt.tier !== "premium" || unlimited : false}
        canLogIn={configured && !user}
        onClose={() => setOpenPrompt(null)}
        onRequestLogin={() => setAuthOpen(true)}
      />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSignedIn={() => { setAuthOpen(false); refresh(); }} />
    </section>
  );
}
