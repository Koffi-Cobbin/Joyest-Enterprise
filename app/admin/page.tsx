import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import {
  getAdminStats,
  listOrdersAdmin,
} from "@/lib/admin/data";
import { StatusBadge, formatDate, formatMoney } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Dashboard" };

export default function AdminHomePage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-serif text-3xl">Dashboard</h1>
      <Suspense fallback={<p className="font-ui text-sm text-muted">Loading stats…</p>}>
        <StatsPanel />
      </Suspense>
      <Suspense fallback={<p className="font-ui text-sm text-muted">Loading orders…</p>}>
        <RecentOrdersPanel />
      </Suspense>
    </div>
  );
}

async function StatsPanel() {
  await requireAdmin();
  const stats = await getAdminStats();
  const cards = [
    { label: "Products", value: stats.productCount, href: "/admin/products" },
    { label: "New orders", value: stats.newOrders, href: "/admin/orders?status=new" },
    { label: "Open orders", value: stats.openOrders, href: "/admin/orders" },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.label}
          href={card.href}
          className="rounded-xl border border-muted/20 bg-surface p-6 transition-colors hover:border-primary/40"
        >
          <p className="font-ui text-xs uppercase tracking-[0.16em] text-muted">
            {card.label}
          </p>
          <p className="mt-2 font-serif text-4xl">{card.value}</p>
        </Link>
      ))}
    </div>
  );
}

async function RecentOrdersPanel() {
  await requireAdmin();
  const orders = (await listOrdersAdmin()).slice(0, 5);
  return (
    <section className="rounded-xl border border-muted/20 bg-surface">
      <div className="flex items-center justify-between border-b border-muted/15 px-6 py-4">
        <h2 className="font-serif text-xl">Latest orders</h2>
        <Link href="/admin/orders" className="font-ui text-sm text-primary hover:underline">
          View all
        </Link>
      </div>
      {orders.length === 0 ? (
        <p className="px-6 py-8 font-ui text-sm text-muted">
          No orders yet — they appear here as customers check out via WhatsApp.
        </p>
      ) : (
        <ul className="divide-y divide-muted/10">
          {orders.map((order) => (
            <li key={order.id} className="flex flex-wrap items-center justify-between gap-2 px-6 py-4">
              <div>
                <p className="font-ui text-sm font-medium">{order.ref}</p>
                <p className="font-ui text-xs text-muted">
                  {order.customer_name ?? "Unnamed"} · {formatDate(order.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-ui text-sm">{formatMoney(order.total, order.currency)}</span>
                <StatusBadge status={order.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
