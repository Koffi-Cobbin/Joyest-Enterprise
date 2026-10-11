import { Router, type IRouter, type Request, type Response } from "express";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { ReplitConnectors } from "@replit/connectors-sdk";
import { z } from "zod";

const router: IRouter = Router();
const collections = ["categories", "products", "bundles", "recipes", "gallery", "testimonials"] as const;
const productSelect = `
  id, category_id, name, slug, short_desc, description, base_price, status,
  badges, is_featured,
  categories(name, slug),
  product_images(id, storage_path, alt, sort_order),
  product_variants(id, label, price, in_stock),
  product_details(ingredients, benefits, usage, nutrition)
`;

let publicClient: SupabaseClient | undefined;
let adminClient: SupabaseClient | undefined;

function getSupabaseConfig(admin = false) {
  const url = process.env.SUPABASE_URL;
  const key = admin ? process.env.SUPABASE_SERVICE_ROLE_KEY : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase configuration is missing.");
  return { url, key };
}

function getPublicClient() {
  const { url, key } = getSupabaseConfig();
  publicClient ??= createClient(url, key, { auth: { persistSession: false } });
  return publicClient;
}

function getAdminClient() {
  const { url, key } = getSupabaseConfig(true);
  adminClient ??= createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return adminClient;
}

async function getAdminContext(req: Request, res: Response) {
  const { url, key } = getSupabaseConfig();
  const sessionClient = createServerClient(url, key, {
    cookies: {
      getAll: () => Object.entries(req.cookies ?? {}).map(([name, value]) => ({ name, value })),
      setAll: (cookies) => {
        for (const { name, value, options } of cookies) res.cookie(name, value, options);
      }
    }
  });
  const { data: { user }, error } = await sessionClient.auth.getUser();
  if (error || !user) return null;
  const admin = getAdminClient();
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError || !profile) return null;
  return { user, profile, supabase: admin };
}

const rateWindows = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = rateWindows.get(key);
  if (!current || current.resetAt <= now) {
    rateWindows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  current.count += 1;
  return { allowed: current.count <= limit, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
}

function requestIp(req: { headers: Record<string, string | string[] | undefined> }) {
  return String(req.headers["x-forwarded-for"] ?? "unknown").split(",")[0].trim() || "unknown";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character] ?? character);
}

async function sendTransactionalEmail(message: { to: string; subject: string; text: string; html: string }) {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) return;
  const response = await new ReplitConnectors().proxy("resend", "/emails", {
    method: "POST",
    body: { from, ...message }
  });
  if (!response.ok) throw new Error(`Email delivery failed (${response.status}).`);
}

router.get("/catalog", async (req, res): Promise<void> => {
  const collection = req.query.collection;
  if (typeof collection !== "string" || !collections.includes(collection as typeof collections[number])) {
    res.status(400).json({ error: "Choose a valid catalog collection." });
    return;
  }
  try {
    let data: unknown;
    const supabase = getPublicClient();
    switch (collection) {
      case "categories": {
        const result = await supabase.from("categories").select("id, name, slug, description, image_path, sort_order").order("sort_order");
        if (result.error) throw result.error;
        data = result.data ?? [];
        break;
      }
      case "products": {
        let query = supabase.from("products").select(productSelect).eq("status", "published").is("deleted_at", null).order("created_at", { ascending: false });
        if (typeof req.query.category === "string" && req.query.category) query = query.eq("categories.slug", req.query.category);
        if (req.query.featured === "true") query = query.eq("is_featured", true);
        const search = typeof req.query.q === "string" ? req.query.q.replace(/[^\p{L}\p{N}\s-]/gu, "").trim().slice(0, 80) : "";
        if (search) query = query.ilike("name", `%${search}%`);
        const result = await query;
        if (result.error) throw result.error;
        data = result.data ?? [];
        break;
      }
      case "bundles": {
        const result = await supabase.from("bundles").select("id, name, slug, description, price, image_path").eq("status", "published").order("created_at", { ascending: false });
        if (result.error) throw result.error;
        data = result.data ?? [];
        break;
      }
      case "recipes": {
        const result = await supabase.from("recipes").select("id, title, slug, summary, ingredients, steps, image_path").eq("status", "published").order("created_at", { ascending: false });
        if (result.error) throw result.error;
        data = result.data ?? [];
        break;
      }
      case "gallery": {
        const result = await supabase.from("gallery_items").select("id, type, storage_path, embed_url, caption").order("sort_order");
        if (result.error) throw result.error;
        data = result.data ?? [];
        break;
      }
      case "testimonials": {
        const result = await supabase.from("testimonials").select("id, quote, author, photo_path").order("created_at", { ascending: false });
        if (result.error) throw result.error;
        data = result.data ?? [];
        break;
      }
    }
    res.json(data);
  } catch (error) {
    req.log.error({ err: error }, "Catalog request failed");
    res.status(503).json({ error: "The catalog could not be loaded. Apply the Supabase migration and try again." });
  }
});

const inquirySchema = z.object({
  website: z.string().max(0).optional(),
  name: z.string().trim().min(2).max(100),
  email: z.union([z.string().trim().email().max(254), z.literal("")]).optional(),
  phone: z.string().trim().max(32).optional(),
  message: z.string().trim().min(10).max(3000)
});

router.post("/contact", async (req, res): Promise<void> => {
  const rate = checkRateLimit(`inquiry:${requestIp(req)}`, 5, 60_000);
  if (!rate.allowed) {
    res.status(429).json({ error: "Please wait before sending another message." });
    return;
  }
  const parsed = inquirySchema.safeParse(req.body);
  if (!parsed.success || parsed.data.website) {
    res.status(400).json({ error: parsed.success ? "Unable to send this message." : "Check the form and try again." });
    return;
  }
  try {
    const { error } = await getAdminClient().from("inquiries").insert({
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      message: parsed.data.message
    });
    if (error) throw error;
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    if (adminEmail) {
      try {
        await sendTransactionalEmail({
          to: adminEmail,
          subject: `New website inquiry from ${parsed.data.name}`,
          text: `${parsed.data.name}\n${parsed.data.email || parsed.data.phone || "No reply details"}\n\n${parsed.data.message}`,
          html: `<h1>New inquiry</h1><p>${escapeHtml(parsed.data.name)} · ${escapeHtml(parsed.data.email || parsed.data.phone || "No reply details")}</p><p>${escapeHtml(parsed.data.message)}</p>`
        });
      } catch (err) {
        req.log.warn({ err }, "Inquiry email could not be delivered");
      }
    }
    res.status(201).json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Inquiry persistence failed");
    res.status(503).json({ error: "We couldn't save your message. Please try again later." });
  }
});

const orderSchema = z.object({
  website: z.string().max(0).optional(),
  customer: z.object({
    name: z.string().trim().min(2).max(100),
    phone: z.string().trim().regex(/^[+\d][\d\s().-]{5,30}$/),
    email: z.union([z.string().trim().email().max(254), z.literal("")]).optional(),
    address: z.string().trim().max(500).optional()
  }),
  items: z.array(z.object({
    productId: z.string().uuid(),
    variantId: z.string().uuid().nullable().optional(),
    quantity: z.number().int().min(1).max(50)
  })).min(1).max(30)
});

router.post("/orders", async (req, res): Promise<void> => {
  const rate = checkRateLimit(`order:${requestIp(req)}`, 8, 60_000);
  if (!rate.allowed) {
    res.setHeader("Retry-After", String(rate.retryAfter));
    res.status(429).json({ error: "Please wait a moment before trying again." });
    return;
  }
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success || parsed.data.website) {
    res.status(400).json({ error: parsed.success ? "Unable to submit this request." : "Check the customer details and cart items." });
    return;
  }
  try {
    const { data, error } = await getAdminClient().rpc("submit_order", {
      p_name: parsed.data.customer.name,
      p_phone: parsed.data.customer.phone,
      p_email: parsed.data.customer.email || null,
      p_address: parsed.data.customer.address || null,
      p_items: parsed.data.items.map(({ productId, variantId, quantity }) => ({ productId, variantId: variantId ?? null, quantity }))
    });
    if (error) throw error;
    const order = data as { ref: string; total: number; items: { name: string; unitPrice: number; quantity: number }[] };
    const lines = order.items.map((item) => `${item.quantity} × ${item.name} — GH₵${Number(item.unitPrice).toFixed(2)}`).join("\n");
    const total = `GH₵${Number(order.total).toFixed(2)}`;
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    const messages = [
      ...(adminEmail ? [{
        to: adminEmail,
        subject: `New Joyest order ${order.ref}`,
        text: `New order ${order.ref}\n${parsed.data.customer.name}\n${parsed.data.customer.phone}\n${lines}\nTotal: ${total}`,
        html: `<h1>New order ${order.ref}</h1><p>${escapeHtml(parsed.data.customer.name)} · ${escapeHtml(parsed.data.customer.phone)}</p><pre>${escapeHtml(lines)}</pre><strong>Total: ${total}</strong>`
      }] : []),
      ...(parsed.data.customer.email ? [{
        to: parsed.data.customer.email,
        subject: `We received your Joyest order ${order.ref}`,
        text: `Thank you for your order request.\nReference: ${order.ref}\n${lines}\nTotal: ${total}\nWe will confirm availability and delivery details with you.`,
        html: `<h1>Thank you</h1><p>We received order <strong>${order.ref}</strong>.</p><pre>${escapeHtml(lines)}</pre><strong>Total: ${total}</strong><p>We will confirm availability and delivery details with you.</p>`
      }] : [])
    ];
    for (const message of messages) {
      try {
        await sendTransactionalEmail(message);
      } catch (err) {
        req.log.warn({ err }, "Order email could not be delivered");
      }
    }
    const whatsappNumber = process.env.WHATSAPP_NUMBER?.replace(/\D/g, "");
    const whatsappMessage = encodeURIComponent(`Hello, I submitted order ${order.ref}.\n${lines}\nTotal: ${total}`);
    const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}` : null;
    res.status(201).json({ ref: order.ref, total: Number(order.total), whatsappUrl });
  } catch (err) {
    req.log.error({ err }, "Order submission failed");
    res.status(503).json({ error: "Order submission is not configured yet." });
  }
});

const orderUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "confirmed", "paid", "delivered", "cancelled"]).optional(),
  payment_status: z.enum(["unpaid", "paid", "refunded"]).optional(),
  notes: z.string().trim().max(2000).nullable().optional()
}).refine((data) => data.status !== undefined || data.payment_status !== undefined || data.notes !== undefined);

router.get("/admin/orders", async (req, res): Promise<void> => {
  try {
    const context = await getAdminContext(req, res);
    if (!context) {
      res.status(401).json({ error: "Sign in with an admin account to continue." });
      return;
    }
    const status = req.query.status;
    let query = context.supabase.from("orders")
      .select("id, ref, name, phone, email, address, status, payment_status, notes, total, created_at, order_items(id, name_snapshot, unit_price_snapshot, qty)")
      .order("created_at", { ascending: false }).limit(100);
    if (typeof status === "string" && ["new", "confirmed", "paid", "delivered", "cancelled"].includes(status)) query = query.eq("status", status);
    const { data, error } = await query;
    if (error) {
      res.status(503).json({ error: "Orders could not be loaded." });
      return;
    }
    res.json(data ?? []);
  } catch (err) {
    req.log.error({ err }, "Admin order list failed");
    res.status(503).json({ error: "Orders could not be loaded." });
  }
});

router.patch("/admin/orders", async (req, res): Promise<void> => {
  try {
    const context = await getAdminContext(req, res);
    if (!context) {
      res.status(401).json({ error: "Sign in with an admin account to continue." });
      return;
    }
    const parsed = orderUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Check the order update and try again." });
      return;
    }
    const { id, ...updates } = parsed.data;
    const { data, error } = await context.supabase.from("orders").update(updates).eq("id", id)
      .select("id, ref, status, payment_status, notes").single();
    if (error) {
      res.status(400).json({ error: "Order could not be updated." });
      return;
    }
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Admin order update failed");
    res.status(503).json({ error: "Order could not be updated." });
  }
});

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

router.get("/admin/products", async (req, res): Promise<void> => {
  try {
    const context = await getAdminContext(req, res);
    if (!context) {
      res.status(401).json({ error: "Sign in with an admin account to continue." });
      return;
    }
    const { data, error } = await context.supabase.from("products")
      .select("id, name, slug, category_id, short_desc, description, base_price, status, badges, is_featured, updated_at")
      .is("deleted_at", null).order("updated_at", { ascending: false });
    if (error) {
      res.status(503).json({ error: "Products could not be loaded." });
      return;
    }
    res.json(data ?? []);
  } catch (err) {
    req.log.error({ err }, "Admin product list failed");
    res.status(503).json({ error: "Products could not be loaded." });
  }
});

router.post("/admin/products", async (req, res): Promise<void> => {
  try {
    const context = await getAdminContext(req, res);
    if (!context) {
      res.status(401).json({ error: "Sign in with an admin account to continue." });
      return;
    }
    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Check the product details and try again." });
      return;
    }
    const value = parsed.data;
    const slug = value.slug ?? value.name.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const { data, error } = await context.supabase.from("products").insert({
      ...value, slug, category_id: value.category_id || null, short_desc: value.short_desc || null, description: value.description || null
    }).select("id, name, slug, category_id, short_desc, description, base_price, status, badges, is_featured").single();
    if (error) {
      res.status(400).json({ error: error.code === "23505" ? "That product URL is already in use." : "Product could not be saved." });
      return;
    }
    res.status(201).json(data);
  } catch (err) {
    req.log.error({ err }, "Admin product creation failed");
    res.status(503).json({ error: "Product could not be saved." });
  }
});

router.patch("/admin/products", async (req, res): Promise<void> => {
  try {
    const context = await getAdminContext(req, res);
    if (!context) {
      res.status(401).json({ error: "Sign in with an admin account to continue." });
      return;
    }
    const body = req.body as ({ id?: string } & Record<string, unknown>) | null;
    if (!body || typeof body.id !== "string") {
      res.status(400).json({ error: "Product ID is required." });
      return;
    }
    const parsed = productSchema.partial().safeParse(body);
    if (!parsed.success || Object.keys(parsed.data).length === 0) {
      res.status(400).json({ error: "Check the product details and try again." });
      return;
    }
    const { data, error } = await context.supabase.from("products").update(parsed.data).eq("id", body.id).is("deleted_at", null)
      .select("id, name, slug, category_id, short_desc, description, base_price, status, badges, is_featured").single();
    if (error) {
      res.status(400).json({ error: "Product could not be updated." });
      return;
    }
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Admin product update failed");
    res.status(503).json({ error: "Product could not be updated." });
  }
});

router.delete("/admin/products", async (req, res): Promise<void> => {
  try {
    const context = await getAdminContext(req, res);
    if (!context) {
      res.status(401).json({ error: "Sign in with an admin account to continue." });
      return;
    }
    const id = typeof req.query.id === "string" ? req.query.id : "";
    if (!z.string().uuid().safeParse(id).success) {
      res.status(400).json({ error: "A valid product ID is required." });
      return;
    }
    const { error } = await context.supabase.from("products").update({ deleted_at: new Date().toISOString(), status: "draft" })
      .eq("id", id).is("deleted_at", null);
    if (error) {
      res.status(400).json({ error: "Product could not be archived." });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Admin product archive failed");
    res.status(503).json({ error: "Product could not be archived." });
  }
});

export default router;
