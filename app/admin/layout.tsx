import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { template: "%s · Joyest Admin", default: "Joyest Admin" },
  robots: { index: false, follow: false },
};

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-muted/20 bg-surface">
        <div className="mx-auto max-w-5xl px-4">
          {/* Row 1: brand + sign out */}
          <div className="flex items-center justify-between gap-3 py-2">
            <Link
              href="/admin"
              className="font-serif text-lg font-medium sm:text-xl"
            >
              Joyest <span className="text-muted">Admin</span>
            </Link>
            <form method="post" action="/api/admin/logout">
              <button
                type="submit"
                className="min-h-11 px-2 font-ui text-sm text-muted transition-colors hover:text-clay"
              >
                Sign out
              </button>
            </form>
          </div>
          {/* Row 2: nav — horizontally scrollable on narrow screens */}
          <nav
            aria-label="Admin"
            className="-mx-1 flex items-stretch gap-1 overflow-x-auto px-1"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-11 items-center whitespace-nowrap rounded-t-md px-4 font-ui text-sm text-muted transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
