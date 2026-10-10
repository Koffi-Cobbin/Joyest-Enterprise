import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminContext } from "@/lib/supabase/admin-auth";

const updateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "confirmed", "paid", "delivered", "cancelled"]).optional(),
  payment_status: z.enum(["unpaid", "paid", "refunded"]).optional(),
  notes: z.string().trim().max(2000).nullable().optional()
}).refine((data) => data.status !== undefined || data.payment_status !== undefined || data.notes !== undefined);

export async function GET(request: Request) {
  const context = await getAdminContext();
  if (!context) return NextResponse.json({ error: "Sign in with an admin account to continue." }, { status: 401 });
  const status = new URL(request.url).searchParams.get("status");
  let query = context.supabase.from("orders")
    .select("id, ref, name, phone, email, address, status, payment_status, notes, total, created_at, order_items(id, name_snapshot, unit_price_snapshot, qty)")
    .order("created_at", { ascending: false })
    .limit(100);
  if (status && ["new", "confirmed", "paid", "delivered", "cancelled"].includes(status)) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Orders could not be loaded." }, { status: 503 });
  return NextResponse.json(data ?? []);
}

export async function PATCH(request: Request) {
  const context = await getAdminContext();
  if (!context) return NextResponse.json({ error: "Sign in with an admin account to continue." }, { status: 401 });
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check the order update and try again." }, { status: 400 });
  const { id, ...updates } = parsed.data;
  const { data, error } = await context.supabase.from("orders")
    .update(updates)
    .eq("id", id)
    .select("id, ref, status, payment_status, notes")
    .single();
  if (error) return NextResponse.json({ error: "Order could not be updated." }, { status: 400 });
  return NextResponse.json(data);
}
