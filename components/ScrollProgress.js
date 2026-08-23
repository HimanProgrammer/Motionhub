"use client";

import { useEffect } from "react";

/* Thin gradient bar pinned to the top of the viewport, tracking scroll progress
   across the whole site. Pure CSS custom property, updated via rAF-throttled scroll. */
export default function ScrollProgress() {
  useEffect(() => {
    let ticking = false;
    function update() {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      h.style.setProperty("--scroll", pct + "%");
      ticking = false;
    }
    function onScroll() {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div className="scroll-progress" aria-hidden="true" />;
}
