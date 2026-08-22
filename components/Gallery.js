"use client";

import { useEffect, useState } from "react";
import { CATEGORIES, PROMPTS as LOCAL_PROMPTS } from "@/lib/prompts";
import { getPrompts, subscribeToPrompts } from "@/lib/supabaseClient";
import { useReveal } from "@/lib/useReveal";
import PromptModal from "./PromptModal";
import AuthModal from "./AuthModal";

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
              return (
                <article className="card in" key={p.id}>
                  <div className="card-preview" style={{ background: grad }}>
                    <span />
                    <span className={"badge " + (p.tier === "premium" ? "premium" : "free")}>
                      {p.tier === "premium" ? "Premium" : "Free"}
                    </span>
                  </div>
                  <div className="card-body">
                    <h3>{p.title}</h3>
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
