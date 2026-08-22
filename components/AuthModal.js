"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { signIn, signUp, signInWithGoogle, getProfile } from "@/lib/supabaseClient";

const GOOGLE_SVG = (
  <svg viewBox="0 0 48 48" width="17" height="17" style={{ verticalAlign: "-3px" }} aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35.5 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6.3 5.2C41.9 35.7 44 30.3 44 24c0-1.3-.1-2.3-.4-3.5z" />
  </svg>
);

/* A self-contained login/signup modal. Renders nothing when `open` is false. */
export default function AuthModal({ open, onClose, onSignedIn, initialMode = "in" }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState({ text: "", color: "" });
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  if (!open) return null;
  const isIn = mode === "in";

  async function submit() {
    if (!email || !password) { setMsg({ text: "Enter your email and password.", color: "#ff8a9c" }); return; }
    setBusy(true); setMsg({ text: "", color: "" });
    try {
      const res = isIn ? await signIn(email, password) : await signUp(email, password);
      if (res.error) throw res.error;
      if (!isIn && res.data?.user && !res.data.session) {
        setMsg({ text: "Check your email to confirm, then log in.", color: "#7dffb0" });
        setBusy(false);
        return;
      }
      const profile = await getProfile();
      onSignedIn?.(profile);
    } catch (e) {
      setMsg({ text: e.message || "Something went wrong.", color: "#ff8a9c" });
      setBusy(false);
    }
  }

  async function google() {
    setGoogleBusy(true);
    try {
      const r = await signInWithGoogle();
      if (r?.error) throw r.error;
      // Browser will redirect to Google; nothing else to do here.
    } catch (e) {
      setGoogleBusy(false);
      setMsg({ text: e.message || "Google sign-in isn't enabled in Supabase yet.", color: "#ff8a9c" });
    }
  }

  // Portal to document.body — renders outside any ancestor with backdrop-filter/transform,
  // which would otherwise create a containing block and break position:fixed centering.
  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div
        className="modal"
        style={{
          background: "linear-gradient(var(--bg-2),var(--bg-2)) padding-box, linear-gradient(135deg,#6d5efc,#00d4ff) border-box",
          border: "1px solid transparent",
        }}
      >
        <div className="modal-head">
          <h3>{isIn ? "Log in" : "Create account"}</h3>
          <button className="modal-close" aria-label="Close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <button className="btn btn-ghost google-btn" onClick={google} disabled={googleBusy}>
            {googleBusy ? "Redirecting to Google…" : <>{GOOGLE_SVG} Continue with Google</>}
          </button>
          <div className="auth-divider"><span className="line" />or<span className="line" /></div>

          <label className="builders">Email</label>
          <input
            className="fld" type="email" autoComplete="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <label className="builders">Password</label>
          <input
            className="fld" type="password" autoComplete={isIn ? "current-password" : "new-password"} value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <p style={{ color: msg.color || "#ff8a9c", minHeight: 18, margin: "8px 0 0", fontSize: 14 }}>{msg.text}</p>

          <div className="copy-row">
            <button className="btn btn-primary" onClick={submit} disabled={busy}>
              {busy ? "…" : isIn ? "Log in" : "Sign up"}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => { setMode(isIn ? "up" : "in"); setMsg({ text: "", color: "" }); }}>
              {isIn ? "Need an account? Sign up" : "Have an account? Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
