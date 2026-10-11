import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * POST /api/orders — capture an order in Supabase (background save alongside
 * the WhatsApp/email flow). Uses the service_role key (server-only, bypasses
 * RLS). The client fire-and-forgets this call — WhatsApp still works if it fails.
 */

type OrderItem = { id: string; name: string; price: number; quantity: number };

const isOrderItem = (value: unknown): value is OrderItem => {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    item.id.length > 0 &&
    item.id.length <= 100 &&
    typeof item.name === "string" &&
    item.name.length > 0 &&
    item.name.length <= 200 &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    item.price >= 0 &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity >= 1 &&
    item.quantity <= 999
  );
};

const badRequest = (error: string) =>
  NextResponse.json({ ok: false, error }, { status: 400 });

export async function POST(request: Request) {
  const admin = supabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: "Orders not configured" },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return badRequest("Invalid JSON");
  }

  const { ref, customerName, note, items, total, currency } = body;

  if (typeof ref !== "string" || ref.length < 5 || ref.length > 40) {
    return badRequest("Invalid order ref");
  }
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return badRequest("Invalid items");
  }
  if (!items.every(isOrderItem)) {
    return badRequest("Invalid item shape");
  }
  if (typeof total !== "number" || !Number.isFinite(total) || total < 0) {
    return badRequest("Invalid total");
  }

  const { error } = await admin.from("orders").insert({
    ref,
    customer_name:
      typeof customerName === "string" && customerName.trim()
        ? customerName.trim().slice(0, 80)
        : null,
    note:
      typeof note === "string" && note.trim()
        ? note.trim().slice(0, 200)
        : null,
    total,
    currency:
      typeof currency === "string" && currency ? currency.slice(0, 8) : "₵",
    items: items as OrderItem[],
  });

  if (error) {
    // Unique violation — the ref was already saved (e.g. double-click); treat as success
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    console.error("order insert failed:", error.message);
    return NextResponse.json(
      { ok: false, error: "Could not save order" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
