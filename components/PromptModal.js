"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { runPrompt, getSavedKey, saveKey } from "@/lib/runPrompt";
import PreviewModal from "./PreviewModal";

const MODELS = {
  claude: ["claude-sonnet-5", "claude-opus-5", "claude-fable-5", "claude-haiku-4-5-20251001"],
  openai: ["gpt-4o", "gpt-4o-mini", "gpt-4.1"],
};

function copyText(text, done) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}
function fallbackCopy(text, done) {
  const ta = document.createElement("textarea");
  ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
  document.body.appendChild(ta); ta.select();
  try { document.execCommand("copy"); } catch (e) {}
  document.body.removeChild(ta);
  done?.();
}

/* Shows a single prompt: full text + copy/run/preview if unlocked, blurred preview + paywall if not. */
export default function PromptModal({ prompt, unlocked, canLogIn, onClose, onRequestLogin }) {
  const [copied, setCopied] = useState(false);
  const [provider, setProvider] = useState("claude");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(MODELS.claude[0]);
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState("");
  const [resultHtml, setResultHtml] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showRunPanel, setShowRunPanel] = useState(false);

  if (!prompt) return null;

  function openRunPanel() {
    setApiKey(getSavedKey(provider));
    setRunError("");
    setShowRunPanel(true);
  }
  function switchProvider(p) {
    setProvider(p);
    setModel(MODELS[p][0]);
    setApiKey(getSavedKey(p));
  }
  async function doRun() {
    if (!apiKey.trim()) { setRunError("Enter your API key first."); return; }
    saveKey(provider, apiKey.trim());
    setRunning(true);
    setRunError("");
    try {
      const html = await runPrompt({ provider, apiKey: apiKey.trim(), model, prompt: prompt.prompt });
      setResultHtml(html);
      setShowPreview(true);
    } catch (e) {
      setRunError(e.message || "Run failed.");
    } finally {
      setRunning(false);
    }
  }

  const locked = prompt.tier === "premium" && !unlocked;
  const grad = `linear-gradient(135deg,${prompt.gradient[0]},${prompt.gradient[1]})`;

  // Portal to document.body — avoids the containing-block trap created by any ancestor
  // using backdrop-filter/transform (e.g. the sticky header), which breaks position:fixed centering.
  if (typeof document === "undefined") return null;
  return createPortal(
    <>
      <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
        <div
          className="modal"
          style={{
            background: `linear-gradient(var(--bg-2),var(--bg-2)) padding-box, ${grad} border-box`,
            border: "1px solid transparent",
          }}
        >
          <div className="modal-head">
            <h3>{prompt.title}</h3>
            <button className="modal-close" aria-label="Close" onClick={onClose}>×</button>
          </div>

          {locked ? (
            <div className="modal-body">
              <div className="prompt-box">
                <pre className="prompt-blur">{prompt.prompt.slice(0, 240)}…</pre>
              </div>
              <div className="paywall">
                <div className="lock">🔒</div>
                <h4>This is a Premium prompt</h4>
                <p>Go Unlimited to copy every premium motion &amp; Claude coding prompt, forever.</p>
                {canLogIn ? (
                  <button className="btn btn-primary" onClick={() => { onClose?.(); onRequestLogin?.(); }}>Log in / Sign up</button>
                ) : (
                  <Link className="btn btn-primary" href="/pricing">Go Unlimited →</Link>
                )}
              </div>
            </div>
          ) : (
            <div className="modal-body">
              <p className="desc" style={{ color: "var(--muted)", margin: "2px 0 0" }}>{prompt.description}</p>
              <div className="prompt-box"><pre>{prompt.prompt}</pre></div>

              <div className="copy-row">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => copyText(prompt.prompt, () => { setCopied(true); setTimeout(() => setCopied(false), 1600); })}
                >
                  {copied ? "✓ Copied" : "📋 Copy prompt"}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={openRunPanel}>▶ Run with AI</button>
                {resultHtml && (
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowPreview(true)}>👁 Preview</button>
                )}
                <span className="builders">Works with {(prompt.builders || []).join(", ")}</span>
                <span className={"copied-note" + (copied ? " show" : "")}>Copied!</span>
              </div>

              {showRunPanel && (
                <div className="prompt-box" style={{ marginTop: 14 }}>
                  <label className="builders">Provider</label>
                  <div style={{ display: "flex", gap: 8, margin: "6px 0 14px" }}>
                    <button className={"chip" + (provider === "claude" ? " active" : "")} onClick={() => switchProvider("claude")}>Claude</button>
                    <button className={"chip" + (provider === "openai" ? " active" : "")} onClick={() => switchProvider("openai")}>OpenAI</button>
                  </div>

                  <label className="builders">Model</label>
                  <select className="fld" value={model} onChange={(e) => setModel(e.target.value)}>
                    {MODELS[provider].map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>

                  <label className="builders">
                    Your {provider === "claude" ? "Anthropic" : "OpenAI"} API key
                  </label>
                  <input
                    className="fld" type="password" placeholder={provider === "claude" ? "sk-ant-…" : "sk-…"}
                    value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                  />
                  <p className="builders" style={{ margin: "-8px 0 12px" }}>
                    Stored only in your browser (localStorage). Sent to our server just to relay this one
                    request to {provider === "claude" ? "Anthropic" : "OpenAI"} — never saved by us.
                  </p>

                  {runError && <p style={{ color: "#ff8a9c", fontSize: 14, margin: "0 0 10px" }}>{runError}</p>}

                  <div className="card-actions">
                    <button className="btn btn-primary btn-sm" onClick={doRun} disabled={running}>
                      {running ? "Running…" : "▶ Run prompt"}
                    </button>
                    {resultHtml && (
                      <button className="btn btn-ghost btn-sm" onClick={() => setShowPreview(true)}>👁 Preview result</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showPreview && resultHtml && (
        <PreviewModal html={resultHtml} title={prompt.title} onClose={() => setShowPreview(false)} />
      )}
    </>,
    document.body
  );
}
