"use client";

import { createPortal } from "react-dom";
import Link from "next/link";
import { getPreview, isVideo } from "@/lib/previews";

/* Quick-look preview: media + title/desc/builders in a modal, without leaving the gallery.
   "View full template" hands off to the real /templates/[id] page. */
export default function TemplatePreviewModal({ prompt, onClose }) {
  if (!prompt) return null;
  if (typeof document === "undefined") return null;

  const media = getPreview(prompt);
  const grad = `linear-gradient(135deg,${prompt.gradient[0]},${prompt.gradient[1]})`;

  return createPortal(
    <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div
        className="modal"
        style={{
          maxWidth: 760, width: "100%",
          background: `linear-gradient(var(--bg-2),var(--bg-2)) padding-box, ${grad} border-box`,
          border: "1px solid transparent",
        }}
      >
        <div className="modal-head">
          <h3>{prompt.title}</h3>
          <button className="modal-close" aria-label="Close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="tpl-media" style={{ background: grad, minHeight: 300 }}>
            {media && isVideo(media) ? (
              <video src={media} autoPlay loop muted playsInline preload="metadata" />
            ) : media ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={media} alt={prompt.title} />
            ) : null}
            <span className={"badge " + (prompt.tier === "premium" ? "premium" : "free")}>
              {prompt.tier === "premium" ? "Premium" : "Free"}
            </span>
          </div>

          <p className="desc" style={{ color: "var(--muted)", margin: "16px 0 0" }}>{prompt.description}</p>

          <div className="tags" style={{ marginTop: 12 }}>
            {(prompt.tags || []).map((t) => <span className="tag" key={t}>#{t}</span>)}
          </div>

          <div className="copy-row" style={{ marginTop: 16 }}>
            <Link className="btn btn-primary btn-sm" href={`/templates/${prompt.id}`} onClick={onClose}>
              View full template →
            </Link>
            <span className="builders">Works with {(prompt.builders || []).join(", ")}</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
