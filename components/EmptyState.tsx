import Link from "next/link";

type EmptyStateProps = {
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
  onActionClick?: () => void;
};

/** Serif headline + copy + CTA (borrowed from Joyest) */
export default function EmptyState({
  title,
  message,
  actionHref,
  actionLabel,
  onActionClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <h3 className="font-serif text-xl font-semibold text-secondary">{title}</h3>
      <p className="mt-2 max-w-sm text-muted">{message}</p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          onClick={onActionClick}
          className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
