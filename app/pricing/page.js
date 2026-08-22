"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/lib/useAuth";
import { useReveal } from "@/lib/useReveal";
import { setUnlimited } from "@/lib/supabaseClient";

export default function PricingPage() {
  const auth = useAuth();
  const { user, unlimited, configured, refresh } = auth;
  const revealRef = useReveal([]);
  const [authOpen, setAuthOpen] = useState(false);
  const [msg, setMsg] = useState("");

  async function goUnlimited() {
    if (!configured) { setMsg("Payments aren't wired up yet — this is a demo unlock."); return; }
    if (!user) { setAuthOpen(true); return; }
    try {
      await setUnlimited(true);
      await refresh();
    } catch (e) {
      setMsg(e.message || "Could not unlock.");
    }
  }
  async function turnOff() {
    if (!configured || !user) return;
    await setUnlimited(false);
    await refresh();
  }

  let statusLine;
  if (unlimited) {
    statusLine = (
      <>
        ✅ Unlimited is active on your account. Every premium prompt is unlocked.{" "}
        <a href="/#gallery" style={{ color: "var(--accent-2)" }}>Browse now →</a>
        {configured && (
          <>
            {" "}·{" "}
            <a href="#" style={{ color: "var(--muted)" }} onClick={(e) => { e.preventDefault(); turnOff(); }}>
              turn off (demo)
            </a>
          </>
        )}
      </>
    );
  } else if (configured && !user) {
    statusLine = (
      <>
        Log in or create an account first, then click a plan to unlock.{" "}
        <a href="#" style={{ color: "var(--accent-2)" }} onClick={(e) => { e.preventDefault(); setAuthOpen(true); }}>
          Log in →
        </a>
      </>
    );
  } else {
    statusLine = msg || "Payments aren't wired up yet — these buttons unlock premium prompts in demo mode so you can preview the full library.";
  }

  return (
    <>
      <Header auth={auth} unlimitedCta={false} />

      <section className="hero" style={{ padding: "76px 0 34px" }}>
        <div className="hero-aurora" />
        <div className="container">
          <span className="pill"><span className="dot" /> One library. Every prompt.</span>
          <h1>Go <span className="accent-text">Unlimited</span></h1>
          <p className="sub">Unlock every premium motion‑site design and Claude coding kit. New prompts added weekly — yours to keep.</p>
        </div>
      </section>

      <section className="section" id="plans" style={{ paddingTop: 20 }}>
        <div className="container" ref={revealRef}>
          <div className="pricing-grid">
            <div className="price-card reveal">
              <h3>Free</h3>
              <div className="price">$0</div>
              <ul>
                <li>Copy all Free prompts</li>
                <li>Motion‑site hero &amp; section starters</li>
                <li>Works with Claude, Cursor, v0</li>
              </ul>
              <a className="btn btn-ghost" href="/#gallery">Browse free prompts</a>
            </div>

            <div className="price-card featured reveal">
              <span className="ribbon">Most popular</span>
              <h3>Unlimited — Yearly</h3>
              <div className="price">$149<small> / year</small></div>
              <ul>
                <li>Everything in Free</li>
                <li>All 2,300+ premium prompts</li>
                <li>All Claude coding kits</li>
                <li>New drops every week</li>
                <li>Commercial use, no watermark</li>
              </ul>
              <button className="btn btn-primary" onClick={goUnlimited}>Go Unlimited</button>
            </div>

            <div className="price-card reveal">
              <h3>Lifetime</h3>
              <div className="price">$239<small> once</small></div>
              <ul>
                <li>Everything in Unlimited</li>
                <li>Pay once, keep forever</li>
                <li>All future prompt drops</li>
                <li>Priority new‑request queue</li>
              </ul>
              <button className="btn btn-ghost" onClick={goUnlimited}>Get Lifetime</button>
            </div>
          </div>

          <p style={{ textAlign: "center", color: "var(--muted)", marginTop: 26, fontSize: 14 }}>{statusLine}</p>
        </div>
      </section>

      <Footer />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSignedIn={() => { setAuthOpen(false); refresh(); }} />
    </>
  );
}
