"use client";

import { createPortal } from "react-dom";

/* Full-screen live preview, rendered in a sandboxed iframe.
   Pass either `html` (AI-generated markup, shown via srcDoc) or `src` (a static demo
   page under /public, loaded directly — used for the "live website" template previews). */
export default function PreviewModal({ html, src, title, onClose }) {
  if (!html && !src) return null;
  if (typeof document === "undefined") return null;

  function openInNewTab() {
    if (src) { window.open(src, "_blank"); return; }
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  return createPortal(
    <div
      className="modal-overlay open"
      style={{ padding: 12 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div
        className="modal"
        style={{
          maxWidth: "min(1200px, 100%)",
          width: "100%",
          height: "92vh",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          background: "var(--bg-2)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="modal-head" style={{ flex: "none" }}>
          <h3>👁 Preview — {title}</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={openInNewTab}>Open in new tab ↗</button>
            <button className="modal-close" aria-label="Close" onClick={onClose}>×</button>
          </div>
        </div>
        <div style={{ flex: 1, padding: "0 22px 22px", minHeight: 0 }}>
          <iframe
            title={`Preview of ${title}`}
            {...(src ? { src } : { srcDoc: html })}
            sandbox="allow-scripts allow-same-origin"
            style={{ width: "100%", height: "100%", border: "1px solid var(--border)", borderRadius: 12, background: "#0a0a12" }}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
