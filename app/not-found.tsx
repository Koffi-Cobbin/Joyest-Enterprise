import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
      <p aria-hidden="true" className="font-ui text-sm font-semibold uppercase tracking-[0.25em] text-accent">
        404 — lost & found
      </p>
      <h1 className="mt-3 font-serif text-5xl font-semibold text-secondary">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-muted">
        The page you&apos;re looking for doesn&apos;t exist — but plenty of
        everyday goodness does. Try the shop instead.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="min-h-11 rounded-lg border-2 border-secondary px-6 py-3 font-semibold text-secondary transition-colors hover:bg-secondary hover:text-background"
        >
          Back home
        </Link>
        <Link
          href="/shop"
          className="min-h-11 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Browse the shop
        </Link>
      </div>
    </div>
  );
}
