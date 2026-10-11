import "server-only";
import type { ProductDetails } from "@/data/products";
import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * Admin data layer — ALL service-role (bypasses RLS). Every caller must
 * have passed requireAdmin() first. Public reads stay in lib/catalog.ts.
 */

export type AdminProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string | null;
  description: string;
  featured: boolean;
  badges: string[] | null;
  image: string | null;
  video: string | null;
  details: ProductDetails | null;
  sort_order: number;
};

export type AdminCategory = {
  id: string;
  name: string;
};

export type AdminOrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type AdminOrder = {
  id: string;
  ref: string;
  customer_name: string | null;
  note: string | null;
  total: number;
  currency: string;
  status: string;
  items: AdminOrderItem[];
  created_at: string;
};

export type OrderStatus = "new" | "confirmed" | "fulfilled" | "cancelled";

export type ProductInput = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string | null;
  description: string;
  featured: boolean;
  badges: string[];
  image: string | null;
  video: string | null;
  details: ProductDetails | null;
  sortOrder: number;
};

const admin = () => {
  const sb = supabaseAdmin();
  if (!sb) throw new Error("Supabase admin client unavailable (env missing)");
  return sb;
};

const PRODUCT_COLUMNS =
  "id,name,category,price,unit,description,featured,badges,image,video,details,sort_order";

// ---------- Catalog: admin reads ----------

export async function listProductsAdmin(): Promise<AdminProduct[]> {
  const { data, error } = await admin()
    .from("products")
    .select(PRODUCT_COLUMNS)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`listProductsAdmin: ${error.message}`);
  return (data ?? []) as AdminProduct[];
}

export async function getProductAdmin(
  id: string,
): Promise<AdminProduct | null> {
  const { data, error } = await admin()
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`getProductAdmin: ${error.message}`);
  return (data as AdminProduct) ?? null;
}

export async function listCategoriesAdmin(): Promise<AdminCategory[]> {
  const { data, error } = await admin()
    .from("categories")
    .select("id,name")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`listCategoriesAdmin: ${error.message}`);
  return (data ?? []) as AdminCategory[];
}

// ---------- Catalog: admin mutations ----------

export async function createProduct(input: ProductInput): Promise<void> {
  const { error } = await admin().from("products").insert({
    id: input.id,
    name: input.name,
    category: input.category,
    price: input.price,
    unit: input.unit,
    description: input.description,
    featured: input.featured,
    badges: input.badges.length ? input.badges : null,
    image: input.image,
    video: input.video,
    details: input.details,
    sort_order: input.sortOrder,
  });
  if (error) {
    if (error.code === "23505") {
      throw new Error(`A product with the id “${input.id}” already exists.`);
    }
    throw new Error(`createProduct: ${error.message}`);
  }
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<void> {
  const { error } = await admin()
    .from("products")
    .update({
      name: input.name,
      category: input.category,
      price: input.price,
      unit: input.unit,
      description: input.description,
      featured: input.featured,
      badges: input.badges.length ? input.badges : null,
      image: input.image,
      video: input.video,
      details: input.details,
      sort_order: input.sortOrder,
    })
    .eq("id", id);
  if (error) throw new Error(`updateProduct: ${error.message}`);
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await admin().from("products").delete().eq("id", id);
  if (error) throw new Error(`deleteProduct: ${error.message}`);
}

// ---------- Storage (product images) ----------

const IMAGE_BUCKET = "product-images";
const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function uploadProductImage(file: File): Promise<string> {
  const ext = IMAGE_TYPES[file.type];
  if (!ext) throw new Error("Image must be JPEG, PNG, WebP or AVIF.");
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be 5MB or smaller.");
  }
  const path = `${crypto.randomUUID()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await admin()
    .storage.from(IMAGE_BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: false });
  if (error) throw new Error(`Image upload failed: ${error.message}`);
  const { data } = admin().storage.from(IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ---------- Orders ----------

export async function listOrdersAdmin(
  status?: string,
): Promise<AdminOrder[]> {
  let query = admin()
    .from("orders")
    .select("id,ref,customer_name,note,total,currency,status,items,created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw new Error(`listOrdersAdmin: ${error.message}`);
  return (data ?? []) as AdminOrder[];
}

export async function setOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<void> {
  const { error } = await admin()
    .from("orders")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(`setOrderStatus: ${error.message}`);
}

// ---------- Dashboard ----------

export async function getAdminStats(): Promise<{
  productCount: number;
  newOrders: number;
  openOrders: number;
}> {
  const sb = admin();
  const [products, newOrders, openOrders] = await Promise.all([
    sb.from("products").select("id", { count: "exact", head: true }),
    sb
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    sb
      .from("orders")
      .select("id", { count: "exact", head: true })
      .in("status", ["new", "confirmed"]),
  ]);
  if (products.error || newOrders.error || openOrders.error) {
    throw new Error("getAdminStats failed");
  }
  return {
    productCount: products.count ?? 0,
    newOrders: newOrders.count ?? 0,
    openOrders: openOrders.count ?? 0,
  };
}
