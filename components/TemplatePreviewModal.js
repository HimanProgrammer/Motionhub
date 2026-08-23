"use client";

import { createPortal } from "react-dom";
import Link from "next/link";
import { getDemoUrl } from "@/lib/previews";

/* Live preview: the actual running demo website for this template, in a sandboxed
   iframe — not just a static image. "View full template" hands off to /templates/[id]. */
export default function TemplatePreviewModal({ prompt, onClose }) {
  if (!prompt) return null;
  if (typeof document === "undefined") return null;

  const demo = getDemoUrl(prompt);
  const grad = `linear-gradient(135deg,${prompt.gradient[0]},${prompt.gradient[1]})`;

  return createPortal(
    <div className="modal-overlay open" style={{ padding: 12 }} onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div
        className="modal"
        style={{
          maxWidth: "min(1200px, 100%)", width: "100%", height: "92vh", maxHeight: "92vh",
          display: "flex", flexDirection: "column",
          background: `linear-gradient(var(--bg-2),var(--bg-2)) padding-box, ${grad} border-box`,
          border: "1px solid transparent",
        }}
      >
        <div className="modal-head" style={{ flex: "none" }}>
          <div>
            <h3 style={{ margin: 0 }}>{prompt.title}</h3>
            <span className={"badge " + (prompt.tier === "premium" ? "premium" : "free")} style={{ marginTop: 6, display: "inline-block" }}>
              {prompt.tier === "premium" ? "Premium" : "Free"}
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span className="builders" style={{ marginRight: 4 }}>Works with {(prompt.builders || []).join(", ")}</span>
            <Link className="btn btn-primary btn-sm" href={`/templates/${prompt.id}`} onClick={onClose}>View full template →</Link>
            <a className="btn btn-ghost btn-sm" href={demo} target="_blank" rel="noreferrer">Open in new tab ↗</a>
            <button className="modal-close" aria-label="Close" onClick={onClose}>×</button>
          </div>
        </div>
        <div style={{ flex: 1, padding: "0 22px 22px", minHeight: 0 }}>
          <iframe
            title={`Live preview of ${prompt.title}`}
            src={demo}
            sandbox="allow-scripts allow-same-origin"
            style={{ width: "100%", height: "100%", border: "1px solid var(--border)", borderRadius: 12, background: "#0a0a12" }}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
