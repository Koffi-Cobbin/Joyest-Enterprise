"use client";

import { useLinkStatus } from "next/link";

/**
 * Spinner overlay shown while the nearest parent <Link> is navigating.
 * Covers the product card so the click feels instant even before the
 * route's loading boundary appears (dev compile / slow networks).
 */
export default function LinkPendingOverlay() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-20 flex items-center justify-center bg-surface/60"
    >
      <span className="size-8 animate-spin rounded-full border-[3px] border-primary/25 border-t-primary" />
    </div>
  );
}
