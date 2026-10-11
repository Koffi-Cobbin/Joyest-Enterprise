import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { setOrderStatusAction } from "@/app/admin/orders/actions";
import {
  AdminSectionHeading,
  StatusBadge,
  formatDate,
  formatMoney,
} from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import {
  listOrdersAdmin,
  type AdminOrder,
  type OrderStatus,
} from "@/lib/admin/data";

export const metadata: Metadata = { title: "Orders" };

const FILTERS = [
  { label: "All", value: "" },
  { label: "New", value: "new" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Fulfilled", value: "fulfilled" },
  { label: "Cancelled", value: "cancelled" },
] as const;

export default function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  return (
    <div className="flex flex-col gap-6">
      <AdminSectionHeading title="Orders" />
      <Suspense fallback={<p className="font-ui text-sm text-muted">Loading orders…</p>}>
        <OrdersPanel searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function OrdersPanel({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();
  const { status } = await searchParams;
  const validStatus = FILTERS.some((f) => f.value === status) ? status : undefined;
  const orders = await listOrdersAdmin(validStatus);

  return (
    <div className="flex flex-col gap-5">
      <nav className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = (validStatus ?? "") === f.value;
          return (
            <Link
              key={f.value || "all"}
              href={f.value ? `/admin/orders?status=${f.value}` : "/admin/orders"}
              className={`rounded-full px-3.5 py-1.5 font-ui text-sm transition-colors ${
                active
                  ? "bg-primary text-background"
                  : "border border-muted/25 bg-surface text-muted hover:text-foreground"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </nav>

      {orders.length === 0 ? (
        <p className="rounded-xl border border-muted/20 bg-surface px-6 py-10 text-center font-ui text-sm text-muted">
          No {validStatus ? validStatus : ""} orders found.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </ul>
      )}
    </div>
  );
}

const NEXT_ACTIONS: Record<string, { status: OrderStatus; label: string }[]> = {
  new: [
    { status: "confirmed", label: "Mark confirmed" },
    { status: "fulfilled", label: "Mark fulfilled" },
    { status: "cancelled", label: "Cancel" },
  ],
  confirmed: [
    { status: "fulfilled", label: "Mark fulfilled" },
    { status: "new", label: "Back to new" },
    { status: "cancelled", label: "Cancel" },
  ],
  fulfilled: [
    { status: "confirmed", label: "Reopen" },
    { status: "new", label: "Back to new" },
  ],
  cancelled: [
    { status: "new", label: "Restore" },
  ],
};

function OrderCard({ order }: { order: AdminOrder }) {
  const actions = NEXT_ACTIONS[order.status] ?? [];
  return (
    <li className="rounded-xl border border-muted/20 bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <p className="font-ui text-sm font-semibold">{order.ref}</p>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-1 font-ui text-sm text-muted">
            {order.customer_name ?? "Unnamed customer"} · {formatDate(order.created_at)}
          </p>
        </div>
        <p className="font-serif text-xl">{formatMoney(order.total, order.currency)}</p>
      </div>

      <ul className="mt-4 divide-y divide-muted/10 border-t border-muted/10">
        {order.items?.map((item, i) => (
          <li key={`${order.id}-${i}`} className="flex justify-between py-2 font-ui text-sm">
            <span>
              {item.quantity} × {item.name}
            </span>
            <span className="text-muted">
              {formatMoney(Number(item.price) * Number(item.quantity), order.currency)}
            </span>
          </li>
        ))}
      </ul>

      {order.note ? (
        <p className="mt-3 rounded-md bg-background px-3 py-2 font-ui text-sm text-muted">
          <span className="font-medium text-foreground">Note: </span>
          {order.note}
        </p>
      ) : null}

      {actions.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {actions.map((action) => (
            <form key={action.status} action={setOrderStatusAction} className="inline">
              <input type="hidden" name="id" value={order.id} />
              <input type="hidden" name="status" value={action.status} />
              <button
                type="submit"
                className={`rounded-md px-3.5 py-1.5 font-ui text-xs font-medium transition-colors ${
                  action.status === "fulfilled" || action.status === "confirmed"
                    ? "bg-primary text-background hover:bg-primary-dark"
                    : "border border-muted/30 text-muted hover:text-foreground"
                }`}
              >
                {action.label}
              </button>
            </form>
          ))}
        </div>
      ) : null}
    </li>
  );
}
