"use client";

import { useCountUp } from "@/lib/useCountUp";

export default function AnimatedStat({ value, label }) {
  const [ref, display] = useCountUp(value);
  return (
    <div className="stat" ref={ref}>
      <b>{display}</b>
      <span>{label}</span>
    </div>
  );
}
