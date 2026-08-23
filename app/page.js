"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import AnimatedStat from "@/components/AnimatedStat";
import { useAuth } from "@/lib/useAuth";
import { useReveal } from "@/lib/useReveal";

export default function HomePage() {
  const auth = useAuth();
  const howRef = useReveal([]);
  const faqRef = useReveal([]);

  return (
    <>
      <Header auth={auth} />

      <section className="hero">
        <div className="hero-aurora" />
        <div className="container">
          <span className="pill"><span className="dot" /> 2,000+ prompts · new drops weekly</span>
          <h1>
            Prompts that build <span className="accent-text">motion websites</span> &amp; coded sites through Claude
          </h1>
          <p className="sub">
            Browse a design, copy the prompt, paste it into Claude, Cursor, v0 or Lovable — and launch a stunning
            animated site in minutes. No design skills required.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#gallery">Browse prompts</a>
            <Link className="btn btn-ghost" href="/pricing">See pricing</Link>
          </div>
          <div className="hero-stats">
            <AnimatedStat value="2,300+" label="Motion prompts" />
            <AnimatedStat value="150+" label="Animated sections" />
            <AnimatedStat value="40+" label="Claude coding kits" />
          </div>
        </div>
      </section>

      <Gallery auth={auth} />

      <section className="section" id="how">
        <div className="container" ref={howRef}>
          <div className="section-head reveal">
            <h2>How it works</h2>
            <p>Three steps from idea to a live, animated website.</p>
          </div>
          <div className="grid reveal-group" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
            <div className="card" style={{ "--i": 0 }}>
              <div className="card-body">
                <h3>1 · Browse &amp; copy</h3>
                <p className="desc">Find a motion design or a Claude coding kit you love and copy its prompt with one click.</p>
              </div>
            </div>
            <div className="card" style={{ "--i": 1 }}>
              <div className="card-body">
                <h3>2 · Paste into your AI</h3>
                <p className="desc">Drop it into Claude, Cursor, v0, Bolt or Lovable. Add your product details where marked.</p>
              </div>
            </div>
            <div className="card" style={{ "--i": 2 }}>
              <div className="card-body">
                <h3>3 · Customize &amp; launch</h3>
                <p className="desc">Tweak colors and copy, then ship. You own the output — no lock‑in, no watermark.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="container" style={{ maxWidth: 760 }} ref={faqRef}>
          <div className="section-head reveal">
            <h2>Questions</h2>
            <p>Everything you need to know before going Unlimited.</p>
          </div>
          <div className="reveal-group">
            <div className="card" style={{ marginBottom: 14, "--i": 0 }}>
              <div className="card-body">
                <h3>What exactly am I buying?</h3>
                <p className="desc">Access to copy every premium prompt in the library — motion‑site designs and Claude coding kits. The prompts generate the code; you own whatever your AI builds.</p>
              </div>
            </div>
            <div className="card" style={{ marginBottom: 14, "--i": 1 }}>
              <div className="card-body">
                <h3>Which AI tools do the prompts work with?</h3>
                <p className="desc">Claude, Cursor, v0, Bolt, Lovable and Replit. Each prompt lists its best‑fit builders.</p>
              </div>
            </div>
            <div className="card" style={{ "--i": 2 }}>
              <div className="card-body">
                <h3>Do I need to code?</h3>
                <p className="desc">No. Copy, paste, and describe your product. For coding kits, Claude scaffolds the whole app for you.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
