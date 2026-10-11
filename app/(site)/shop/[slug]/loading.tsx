/**
 * Product detail loading skeleton — mirrors the two-column layout:
 * square-ish media on the left, title/price/purchase column on the right.
 * Shown by the segment loading boundary while /shop/[slug] resolves.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto max-w-6xl px-4 py-10"
    >
      <span className="sr-only">Loading product…</span>
      <div aria-hidden="true" className="grid gap-10 lg:grid-cols-2">
        {/* Media block — same aspect classes as ProductMedia size="lg" */}
        <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-foreground/5 sm:aspect-square" />
        <div className="flex flex-col gap-4">
          <div className="h-4 w-28 animate-pulse rounded-md bg-foreground/5" />
          <div className="h-10 w-3/4 animate-pulse rounded-md bg-foreground/5" />
          <div className="h-7 w-24 animate-pulse rounded-md bg-foreground/5" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded-md bg-foreground/5" />
            <div className="h-4 w-2/3 animate-pulse rounded-md bg-foreground/5" />
          </div>
          <div className="mt-4 h-12 w-full animate-pulse rounded-lg bg-primary/20" />
          <div className="mt-4 space-y-3 border-t border-foreground/10 pt-6">
            <div className="h-11 w-full animate-pulse rounded-md bg-foreground/5" />
            <div className="h-11 w-full animate-pulse rounded-md bg-foreground/5" />
            <div className="h-11 w-full animate-pulse rounded-md bg-foreground/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
