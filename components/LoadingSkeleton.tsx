/** Skeleton block helper — soft tinted placeholder with a gentle pulse */
function Block({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`animate-pulse rounded-md bg-foreground/5 ${className}`} />
  );
}

/** One product card placeholder — mirrors ProductCard's structure */
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-surface shadow-sm" aria-hidden="true">
      <Block className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-col gap-3 p-6 pt-4">
        <Block className="h-5 w-3/4" />
        <div className="space-y-2">
          <Block className="h-3 w-full" />
          <Block className="h-3 w-2/3" />
        </div>
        <Block className="h-5 w-1/3" />
        <Block className="mt-3 h-11 w-full rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Full shop-grid placeholder — search pill, result count, and a card grid.
 * Used as the Suspense fallback on /shop so first paint never flashes plain text.
 */
export default function ProductGridSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading products…</span>
      <div className="mt-8 flex justify-center" aria-hidden="true">
        <Block className="h-11 w-full max-w-md rounded-full" />
      </div>
      <div className="mt-4 flex justify-center" aria-hidden="true">
        <Block className="h-4 w-48" />
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
        {Array.from({ length: cards }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
