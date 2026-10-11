/**
 * Root segment loading UI — shown while a route's dynamic parts resolve.
 * Header/footer stay mounted (layout); this fills the content slot.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] items-center justify-center px-4"
    >
      <span className="sr-only">Loading…</span>
      <div className="flex flex-col items-center gap-4" aria-hidden="true">
        <span className="flex size-12 animate-pulse items-center justify-center rounded-xl bg-primary font-serif text-2xl font-semibold text-background">
          J
        </span>
        <span className="font-ui text-xs font-semibold uppercase tracking-[0.25em] text-muted">
          Joyest
        </span>
      </div>
    </div>
  );
}
