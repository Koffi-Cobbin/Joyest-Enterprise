import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminContext } from "@/lib/supabase/admin-auth";

const productSchema = z.object({
  name: z.string().trim().min(2).max(140),
  slug: z.string().trim().min(2).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  category_id: z.string().uuid().nullable().optional(),
  short_desc: z.string().trim().max(250).nullable().optional(),
  description: z.string().trim().max(10000).nullable().optional(),
  base_price: z.number().min(0).max(10000000),
  status: z.enum(["draft", "published"]),
  badges: z.array(z.string().trim().min(1).max(32)).max(8).default([]),
  is_featured: z.boolean().default(false)
});

export async function GET() {
  const context = await getAdminContext();
  if (!context) return NextResponse.json({ error: "Sign in with an admin account to continue." }, { status: 401 });
  const { data, error } = await context.supabase
    .from("products")
    .select("id, name, slug, category_id, short_desc, description, base_price, status, badges, is_featured, updated_at")
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Products could not be loaded." }, { status: 503 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const context = await getAdminContext();
  if (!context) return NextResponse.json({ error: "Sign in with an admin account to continue." }, { status: 401 });
  const parsed = productSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check the product details and try again." }, { status: 400 });

  const value = parsed.data;
  const slug = value.slug ?? value.name.toLowerCase().normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const { data, error } = await context.supabase.from("products").insert({
    ...value,
    slug,
    category_id: value.category_id || null,
    short_desc: value.short_desc || null,
    description: value.description || null
  }).select("id, name, slug, category_id, short_desc, description, base_price, status, badges, is_featured").single();
  if (error) return NextResponse.json({ error: error.code === "23505" ? "That product URL is already in use." : "Product could not be saved." }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request: Request) {
  const context = await getAdminContext();
  if (!context) return NextResponse.json({ error: "Sign in with an admin account to continue." }, { status: 401 });
  const body = await request.json().catch(() => null) as ({ id?: string } & Record<string, unknown>) | null;
  if (!body || typeof body.id !== "string") return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success || Object.keys(parsed.data).length === 0) return NextResponse.json({ error: "Check the product details and try again." }, { status: 400 });
  const { id, ...updates } = body;
  const cleanUpdates = parsed.data;
  const { data, error } = await context.supabase.from("products")
    .update(cleanUpdates)
    .eq("id", id)
    .is("deleted_at", null)
    .select("id, name, slug, category_id, short_desc, description, base_price, status, badges, is_featured")
    .single();
  if (error) return NextResponse.json({ error: "Product could not be updated." }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const context = await getAdminContext();
  if (!context) return NextResponse.json({ error: "Sign in with an admin account to continue." }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id || !z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "A valid product ID is required." }, { status: 400 });
  const { error } = await context.supabase.from("products")
    .update({ deleted_at: new Date().toISOString(), status: "draft" })
    .eq("id", id)
    .is("deleted_at", null);
  if (error) return NextResponse.json({ error: "Product could not be archived." }, { status: 400 });
  return NextResponse.json({ ok: true });
}
