"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CATEGORIES, PROMPTS_PUBLIC as LOCAL_PROMPTS } from "@/lib/promptsPublic";
import { getPrompts, subscribeToPrompts } from "@/lib/supabaseClient";
import { getPreview, isVideo } from "@/lib/previews";
import { useReveal } from "@/lib/useReveal";
import AuthModal from "./AuthModal";
import TemplatePreviewModal from "./TemplatePreviewModal";

export default function Gallery({ auth }) {
  const [prompts, setPrompts] = useState(LOCAL_PROMPTS);
  const [activeCat, setActiveCat] = useState("all");
  const [authOpen, setAuthOpen] = useState(false);
  const [previewPrompt, setPreviewPrompt] = useState(null);
  const revealRef = useReveal([prompts, activeCat]);

  const { configured, refresh } = auth;

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
              const media = getPreview(p);
              return (
                <Link className="card in" key={p.id} href={`/templates/${p.id}`}>
                  <div className="card-preview" style={{ background: grad }}>
                    {media && isVideo(media) ? (
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
                    <button
                      type="button"
                      className="card-preview-btn"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPreviewPrompt(p); }}
                    >
                      👁 Preview
                    </button>
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
                      <span className="btn btn-primary btn-sm">View template →</span>
                      <span className="builders">{(p.builders || []).slice(0, 3).join(" · ")}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSignedIn={() => { setAuthOpen(false); refresh(); }} />
      <TemplatePreviewModal prompt={previewPrompt} onClose={() => setPreviewPrompt(null)} />
    </section>
  );
}
