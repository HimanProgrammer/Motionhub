"use client";

import { usePathname } from "next/navigation";

/* Keying by pathname re-mounts this wrapper on every route change, which restarts
   the CSS fade-in animation below — a lightweight page-transition with no library. */
export default function PageTransition({ children }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-fade">
      {children}
    </div>
  );
}
