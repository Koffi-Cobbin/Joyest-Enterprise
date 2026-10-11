"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Route error boundary (Next 16: `retry` re-renders the segment).
 * Error detail is shown only in dev — messages can carry internals.
 */
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
      <p aria-hidden="true" className="font-ui text-sm font-semibold uppercase tracking-[0.25em] text-accent">
        Something went sideways
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-secondary">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-muted">
        An unexpected error occurred while loading this page. Try again, or head
        back home.
      </p>

      {process.env.NODE_ENV !== "production" && error.message ? (
        <pre className="mt-6 max-w-full overflow-x-auto rounded-lg bg-surface px-4 py-3 text-left text-xs text-muted shadow-sm">
          {error.message}
          {error.digest ? `\nDigest: ${error.digest}` : ""}
        </pre>
      ) : null}

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => retry()}
          className="min-h-11 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Try again
        </button>
        <Link
          href="/"
          className="min-h-11 rounded-lg border-2 border-secondary px-6 py-3 font-semibold text-secondary transition-colors hover:bg-secondary hover:text-background"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
