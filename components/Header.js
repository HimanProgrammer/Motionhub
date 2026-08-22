"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "@/lib/supabaseClient";
import AuthModal from "./AuthModal";

export default function Header({ auth, unlimitedCta = true }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const { user, profile, configured, unlimited, isAdmin, refresh } = auth;

  async function handleLogout() {
    await signOut();
    refresh();
  }

  return (
    <header className="site-header">
      <div className="container nav">
        <Link className="brand" href="/"><span className="logo-dot" /> MotionHub</Link>
        <nav className={"nav-links" + (menuOpen ? " open" : "")}>
          <Link href="/#gallery">Prompts</Link>
          <Link href="/#how">How it works</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/#faq">FAQ</Link>
        </nav>
        <div className="nav-cta">
          {configured && (
            <span style={{ marginRight: 6 }}>
              {user ? (
                <>
                  <span className="builders" style={{ margin: "0 6px" }}>
                    {user.email}
                    {unlimited && <span className="badge free" style={{ position: "static", marginLeft: 6 }}>Unlimited</span>}
                  </span>
                  {isAdmin && <Link className="btn btn-ghost btn-sm" href="/admin" style={{ marginRight: 8 }}>Admin</Link>}
                  <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Log out</button>
                </>
              ) : (
                <button className="btn btn-ghost btn-sm" onClick={() => setAuthOpen(true)}>Log in</button>
              )}
            </span>
          )}
          {unlimitedCta && <Link className="btn btn-primary btn-sm" href="/pricing">Go Unlimited</Link>}
          <button className="menu-toggle" aria-label="Menu" onClick={() => setMenuOpen((v) => !v)}>☰</button>
        </div>
      </div>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSignedIn={() => { setAuthOpen(false); refresh(); }}
      />
    </header>
  );
}
