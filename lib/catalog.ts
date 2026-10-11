import { categories as staticCategories } from "@/data/categories";
import type { Category, CategoryId } from "@/data/categories";
import { products as staticProducts } from "@/data/products";
import type { Product } from "@/data/products";
import { supabaseServer } from "@/lib/supabase/server";

/**
 * Catalog data layer — reads from Supabase when configured, otherwise
 * falls back to the static files in data/ so dev/build never break.
 */

type ProductRow = {
  id: string;
  name: string;
  category: CategoryId;
  price: number | string;
  unit: string | null;
  description: string;
  featured: boolean;
  badges: string[] | null;
  image: string | null;
  video: string | null;
  details: Product["details"] | null;
};

type CategoryRow = {
  id: CategoryId;
  name: string;
  description: string;
  image: string | null;
};

const mapProduct = (row: ProductRow): Product => ({
  id: row.id,
  name: row.name,
  category: row.category,
  price: Number(row.price),
  unit: row.unit ?? undefined,
  description: row.description,
  featured: row.featured || undefined,
  badges: row.badges?.length ? row.badges : undefined,
  image: row.image ?? undefined,
  video: row.video ?? undefined,
  details: row.details ?? undefined,
});

const mapCategory = (row: CategoryRow): Category => ({
  id: row.id,
  name: row.name,
  description: row.description,
  image: row.image ?? undefined,
});

export async function getCategories(): Promise<readonly Category[]> {
  const sb = supabaseServer();
  if (!sb) return staticCategories;
  const { data, error } = await sb
    .from("categories")
    .select("id,name,description,image")
    .order("sort_order", { ascending: true });
  if (error || !data || data.length === 0) return staticCategories;
  return data.map(mapCategory);
}

export async function getProducts(): Promise<readonly Product[]> {
  const sb = supabaseServer();
  if (!sb) return staticProducts;
  const { data, error } = await sb
    .from("products")
    .select(
      "id,name,category,price,unit,description,featured,badges,image,video,details",
    )
    .order("sort_order", { ascending: true });
  if (error || !data || data.length === 0) return staticProducts;
  return data.map(mapProduct);
}

export async function getFeaturedProducts(): Promise<readonly Product[]> {
  const all = await getProducts();
  return all.filter((product) => product.featured);
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const sb = supabaseServer();
  if (!sb) return staticProducts.find((product) => product.id === slug);
  const { data } = await sb
    .from("products")
    .select(
      "id,name,category,price,unit,description,featured,badges,image,video,details",
    )
    .eq("id", slug)
    .maybeSingle();
  if (data) return mapProduct(data);
  // Fallback to static catalog (e.g. product exists in data/ but not yet seeded)
  return staticProducts.find((product) => product.id === slug);
}

export async function findCategoryById(
  id: CategoryId,
): Promise<Category | undefined> {
  const all = await getCategories();
  return all.find((category) => category.id === id);
}
