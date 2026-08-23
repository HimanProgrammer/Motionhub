"use client";

import { useEffect, useRef, useState } from "react";

/* Animates a number from 0 up to the numeric part of `label` (e.g. "2,300+" -> counts to 2300,
   keeps the "+"/"," formatting) once the element scrolls into view. Returns [ref, displayText]. */
export function useCountUp(label, duration = 1200) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(label.replace(/[0-9]/g, "0"));
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const match = label.match(/[\d,]+/);
    if (!match) { setDisplay(label); return; }
    const target = parseInt(match[0].replace(/,/g, ""), 10);
    const prefix = label.slice(0, match.index);
    const suffix = label.slice(match.index + match[0].length);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !done.current) {
            done.current = true;
            const start = performance.now();
            function tick(now) {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              const val = Math.round(target * eased);
              setDisplay(prefix + val.toLocaleString() + suffix);
              if (t < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label]);

  return [ref, display];
}
