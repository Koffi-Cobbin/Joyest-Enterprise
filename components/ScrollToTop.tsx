"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scroll to top on page navigation — smoothly, but always arriving.
 *
 * Next 16 keeps CSS `scroll-behavior: smooth` during SPA navigation (the old
 * instant-jump override is opt-in only) and preserves routes with <Activity>,
 * so the browser's native smooth scroll can be interrupted by streamed
 * content or scroll restoration, leaving the user mid-page. This component
 * starts the smooth scroll, then snaps to the top if the animation didn't
 * finish — and respects prefers-reduced-motion (instant jump).
 */
const ARRIVAL_GUARD_MS = 700;

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.scrollY <= 0) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      window.scrollTo(0, 0);
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });

    // Guarantee arrival if the animation was interrupted
    const guard = window.setTimeout(() => {
      if (window.scrollY > 0) window.scrollTo(0, 0);
    }, ARRIVAL_GUARD_MS);

    return () => window.clearTimeout(guard);
  }, [pathname]);

  return null;
}
