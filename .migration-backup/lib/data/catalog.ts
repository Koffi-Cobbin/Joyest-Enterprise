import "server-only";
import { getPublicSupabaseClient } from "@/lib/supabase/public";
import type { Bundle, Category, GalleryItem, Product, Recipe, Testimonial } from "@/lib/types";

const productSelect = `
  id, category_id, name, slug, short_desc, description, base_price, status,
  badges, is_featured,
  categories(name, slug),
  product_images(id, storage_path, alt, sort_order),
  product_variants(id, label, price, in_stock),
  product_details(ingredients, benefits, usage, nutrition)
`;

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await getPublicSupabaseClient()
    .from("categories")
    .select("id, name, slug, description, image_path, sort_order")
    .order("sort_order");
  if (error) throw new Error(`Could not load categories: ${error.message}`);
  return (data ?? []) as Category[];
}

export async function getProducts(options: {
  category?: string;
  search?: string;
  featured?: boolean;
} = {}): Promise<Product[]> {
  let query = getPublicSupabaseClient()
    .from("products")
    .select(productSelect)
    .eq("status", "published")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });
  if (options.category) query = query.eq("categories.slug", options.category);
  if (options.featured) query = query.eq("is_featured", true);
  const search = options.search?.replace(/[^\p{L}\p{N}\s-]/gu, "").trim().slice(0, 80);
  if (search) query = query.ilike("name", `%${search}%`);
  const { data, error } = await query;
  if (error) throw new Error(`Could not load products: ${error.message}`);
  return (data ?? []) as unknown as Product[];
}

export async function getProduct(slug: string): Promise<Product | null> {
  const { data, error } = await getPublicSupabaseClient()
    .from("products")
    .select(productSelect)
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();
  if (error) throw new Error(`Could not load product: ${error.message}`);
  return data as unknown as Product | null;
}

export async function getBundles(): Promise<Bundle[]> {
  const { data, error } = await getPublicSupabaseClient()
    .from("bundles")
    .select("id, name, slug, description, price, image_path")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Could not load bundles: ${error.message}`);
  return (data ?? []) as Bundle[];
}

export async function getRecipes(): Promise<Recipe[]> {
  const { data, error } = await getPublicSupabaseClient()
    .from("recipes")
    .select("id, title, slug, summary, ingredients, steps, image_path")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Could not load recipes: ${error.message}`);
  return (data ?? []) as Recipe[];
}

export async function getGallery(): Promise<GalleryItem[]> {
  const { data, error } = await getPublicSupabaseClient()
    .from("gallery_items")
    .select("id, type, storage_path, embed_url, caption")
    .order("sort_order");
  if (error) throw new Error(`Could not load gallery: ${error.message}`);
  return (data ?? []) as GalleryItem[];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await getPublicSupabaseClient()
    .from("testimonials")
    .select("id, quote, author, photo_path")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Could not load testimonials: ${error.message}`);
  return (data ?? []) as Testimonial[];
}
