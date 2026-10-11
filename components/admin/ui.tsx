/** Tiny shared bits for the admin area — plain tokens from the brand theme. */

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: "bg-accent/15 text-accent",
    confirmed: "bg-primary/15 text-primary",
    fulfilled: "bg-muted/15 text-muted",
    cancelled: "bg-clay/15 text-clay",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 font-ui text-xs font-medium ${styles[status] ?? "bg-muted/15 text-muted"}`}
    >
      {status}
    </span>
  );
}

export function formatMoney(total: number | string, currency = "₵"): string {
  return `${currency}${Number(total).toFixed(2)}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }) +
    " " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function AdminSectionHeading({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-serif text-3xl">{title}</h1>
      {children}
    </div>
  );
}
