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
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-serif text-xl font-medium">
              Joyest <span className="text-muted">Admin</span>
            </Link>
            <nav className="flex items-center gap-5">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-ui text-sm text-muted transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <form method="post" action="/api/admin/logout">
            <button
              type="submit"
              className="font-ui text-sm text-muted transition-colors hover:text-clay"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
