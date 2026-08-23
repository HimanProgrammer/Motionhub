"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PreviewModal from "@/components/PreviewModal";
import { CATEGORIES, PROMPTS_PUBLIC as LOCAL_PROMPTS } from "@/lib/promptsPublic";
import { getPrompts, subscribeToPrompts } from "@/lib/supabaseClient";
import { getPreview, isVideo, useCasesFor } from "@/lib/previews";
import { runPrompt, getSavedKey, saveKey } from "@/lib/runPrompt";
import { useAuth } from "@/lib/useAuth";
import { useReveal } from "@/lib/useReveal";

const MODELS = {
  claude: ["claude-sonnet-5", "claude-opus-5", "claude-fable-5", "claude-haiku-4-5-20251001"],
  openai: ["gpt-4o", "gpt-4o-mini", "gpt-4.1"],
};

function catLabel(id) {
  return (CATEGORIES.find((c) => c.id === id) || {}).label || id;
}
function copyText(text, done) {
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done, done);
  else done?.();
}

export default function TemplatePage() {
  const { id } = useParams();
  const auth = useAuth();
  const { unlimited, user, configured } = auth;

  const [prompts, setPrompts] = useState(LOCAL_PROMPTS);
  const [copied, setCopied] = useState(false);
  const [provider, setProvider] = useState("claude");
  const [model, setModel] = useState(MODELS.claude[0]);
  const [apiKey, setApiKey] = useState("");
  const [showRun, setShowRun] = useState(false);
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState("");
  const [resultHtml, setResultHtml] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const relatedRef = useReveal([id]);

  // Merge DB prompts over the local seed so admin edits show here too.
  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    const load = () => getPrompts().then((db) => { if (!cancelled && db && db.length) setPrompts(db); });
    load();
    const unsub = subscribeToPrompts(load);
    return () => { cancelled = true; unsub(); };
  }, [configured]);

  const p = prompts.find((x) => x.id === id);
  const related = prompts.filter((x) => x.id !== id).slice(0, 6);
  const locked = p && p.tier === "premium" && !unlimited;
  const media = getPreview(p);

  function switchProvider(pr) { setProvider(pr); setModel(MODELS[pr][0]); setApiKey(getSavedKey(pr)); }
  function openRun() { setApiKey(getSavedKey(provider)); setRunError(""); setShowRun(true); }
  async function doRun() {
    if (!apiKey.trim()) { setRunError("Enter your API key first."); return; }
    saveKey(provider, apiKey.trim());
    setRunning(true); setRunError("");
    try {
      const html = await runPrompt({ provider, apiKey: apiKey.trim(), model, prompt: p.prompt });
      setResultHtml(html); setShowPreview(true);
    } catch (e) { setRunError(e.message || "Run failed."); }
    finally { setRunning(false); }
  }

  if (!p) {
    return (
      <>
        <Header auth={auth} />
        <main className="container" style={{ padding: "80px 0", textAlign: "center" }}>
          <h1>Template not found</h1>
          <p style={{ color: "var(--muted)" }}>This template doesn’t exist or was removed.</p>
          <Link className="btn btn-primary" href="/#gallery">← Back to all templates</Link>
        </main>
        <Footer />
      </>
    );
  }

  const grad = `linear-gradient(135deg,${p.gradient[0]},${p.gradient[1]})`;

  return (
    <>
      <Header auth={auth} />
      <main className="tpl">
        <div className="container">
          <Link href="/#gallery" className="tpl-back">← All templates</Link>

          {/* Hero: preview + info side by side */}
          <div className="tpl-hero">
            <div className="tpl-media" style={{ background: grad }}>
              {media && isVideo(media) ? (
                <video src={media} autoPlay loop muted playsInline preload="metadata" />
              ) : media ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={media} alt={p.title} />
              ) : null}
              <span className={"badge " + (p.tier === "premium" ? "premium" : "free")}>
                {p.tier === "premium" ? "Premium" : "Free"}
              </span>
            </div>

            <div className="tpl-info">
              <span className="tpl-cat">{catLabel(p.category)}</span>
              <h1>{p.title}</h1>
              <p className="tpl-desc">{p.description}</p>

              <div className="tpl-actions">
                {locked ? (
                  <Link className="btn btn-primary" href="/pricing">🔒 Unlock — Go Unlimited</Link>
                ) : (
                  <>
                    <button className="btn btn-primary" onClick={() => copyText(p.prompt, () => { setCopied(true); setTimeout(() => setCopied(false), 1600); })}>
                      {copied ? "✓ Copied" : "📋 Copy prompt"}
                    </button>
                    <button className="btn btn-ghost" onClick={openRun}>▶ Run with AI</button>
                    {resultHtml && <button className="btn btn-ghost" onClick={() => setShowPreview(true)}>👁 Preview</button>}
                  </>
                )}
              </div>

              <div className="tpl-builders">
                <span className="tpl-eyebrow">Works with</span>
                <div className="tpl-chips">
                  {(p.builders || []).map((b) => <span className="chip" key={b}>{b}</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* Run panel */}
          {showRun && !locked && (
            <div className="tpl-run">
              <h3>Run this prompt with your own API key</h3>
              <div className="tpl-run-grid">
                <div>
                  <label className="tpl-eyebrow">Provider</label>
                  <div className="tpl-chips" style={{ margin: "6px 0 14px" }}>
                    <button className={"chip" + (provider === "claude" ? " active" : "")} onClick={() => switchProvider("claude")}>Claude</button>
                    <button className={"chip" + (provider === "openai" ? " active" : "")} onClick={() => switchProvider("openai")}>OpenAI</button>
                  </div>
                  <label className="tpl-eyebrow">Model</label>
                  <select className="fld" value={model} onChange={(e) => setModel(e.target.value)}>
                    {MODELS[provider].map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="tpl-eyebrow">Your {provider === "claude" ? "Anthropic" : "OpenAI"} API key</label>
                  <input className="fld" type="password" placeholder={provider === "claude" ? "sk-ant-…" : "sk-…"} value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                  <p className="tpl-note">Stored only in your browser. Relayed once to {provider === "claude" ? "Anthropic" : "OpenAI"} — never saved by us.</p>
                  {runError && <p style={{ color: "#ff8a9c", fontSize: 14 }}>{runError}</p>}
                  <button className="btn btn-primary" onClick={doRun} disabled={running}>{running ? "Running…" : "▶ Run prompt"}</button>
                </div>
              </div>
            </div>
          )}

          {/* Two-column body */}
          <div className="tpl-body">
            <div className="tpl-main">
              <section className="tpl-section">
                <h2>About this template</h2>
                <p>{p.description} This is a copy‑paste master prompt — paste it into Claude (or any builder below) to generate a pixel‑perfect, fully responsive result in plain HTML &amp; CSS, no Tailwind.</p>
              </section>

              {!locked && (
                <section className="tpl-section">
                  <h2>The prompt</h2>
                  <div className="prompt-box"><pre>{p.prompt}</pre></div>
                </section>
              )}
            </div>

            <aside className="tpl-side">
              <div className="tpl-panel">
                <h4>Perfect for</h4>
                <ul className="tpl-list">
                  {useCasesFor(p.category).map((u) => <li key={u}>{u}</li>)}
                </ul>
              </div>
              <div className="tpl-panel">
                <h4>Category</h4>
                <div className="tpl-chips"><span className="chip">{catLabel(p.category)}</span></div>
                <h4 style={{ marginTop: 16 }}>Tags</h4>
                <div className="tags">
                  {(p.tags || []).map((t) => <span className="tag" key={t}>#{t}</span>)}
                </div>
              </div>
            </aside>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <section className="tpl-section" ref={relatedRef}>
              <h2>More templates</h2>
              <div className="grid reveal-group">
                {related.map((r, i) => {
                  const rm = getPreview(r);
                  const rg = `linear-gradient(135deg,${r.gradient[0]},${r.gradient[1]})`;
                  return (
                    <Link className="card" key={r.id} href={`/templates/${r.id}`} style={{ "--i": i }}>
                      <div className="card-preview" style={{ background: rg }}>
                        {rm && isVideo(rm) ? (
                          <video className="card-media" src={rm} autoPlay loop muted playsInline preload="metadata" aria-hidden="true" />
                        ) : rm ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img className="card-media" src={rm} alt="" loading="lazy" aria-hidden="true" />
                        ) : null}
                        <span className="card-media-veil" />
                        <span className={"badge " + (r.tier === "premium" ? "premium" : "free")}>{r.tier === "premium" ? "Premium" : "Free"}</span>
                      </div>
                      <div className="card-body">
                        <div className="card-title-row"><h3>{r.title}</h3><span className="card-cat">{catLabel(r.category)}</span></div>
                        <p className="desc">{r.description}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />

      {showPreview && resultHtml && (
        <PreviewModal html={resultHtml} title={p.title} onClose={() => setShowPreview(false)} />
      )}
    </>
  );
}
