#!/usr/bin/env node
/**
 * One-time bootstrap: pushes the current catalog into Supabase.
 * After seeding, Supabase is the source of truth (edit rows there, not in data/).
 *
 * Usage:  pnpm seed
 * Needs:  .env or .env.local with NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
 * Schema: run supabase/schema.sql in the SQL editor first.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import WebSocket from "ws";

// --- load env from .env.local or .env ---
function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    try {
      const text = readFileSync(join(process.cwd(), file), "utf8");
      for (const line of text.split("\n")) {
        const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
        if (match && match[2] && !process.env[match[1]]) {
          process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
        }
      }
      return;
    } catch {
      /* try next file */
    }
  }
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local or .env");
  console.error("(Seeding writes rows — the anon key is blocked by RLS on purpose.)");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  realtime: { transport: WebSocket },
});

// --- catalog (bootstrap copy of data/categories.ts + data/products.ts) ---
const categories = [
  { id: "nutritional-foods", name: "Nutritional Foods", description: "Nourishing homemade foods for everyday wellness", image: "/products/nutritional-foods.webp", sort_order: 1 },
  { id: "hair-care", name: "Natural Hair Care", description: "Natural care for healthy hair and skin", image: "/products/hair-care.jpeg", sort_order: 2 },
  { id: "spices", name: "Aromatic Spices", description: "Aromatic natural spices and flavour boosters", image: "/products/spices.jpeg", sort_order: 3 },
  { id: "more", name: "More", description: "Household goods and everything in between", image: "/products/more.webp", sort_order: 4 },
];

const products = [
  { id: "tom-brown", name: "Tom Brown Mix", category: "nutritional-foods", price: 35, unit: "per pack", description: "Nutritious roasted grain blend — a filling breakfast for the whole family.", featured: true, badges: ["Bestseller"], image: "/products/tom-brown.jpeg", video: null, details: { ingredients: "Roasted maize, millet, soybeans, groundnuts, dried ginger and a touch of sugar.", benefits: "High in protein and fibre — keeps you full and focused through the morning.", usage: "Mix 3–4 tablespoons with hot water or milk, stir until smooth. Sweeten to taste; pair with bread or koose." }, sort_order: 1 },
  { id: "meat-pie", name: "Homemade Meat Pie", category: "nutritional-foods", price: 8, unit: "per piece", description: "Flaky pastry stuffed with seasoned minced meat and potatoes.", featured: true, badges: ["Bestseller"], image: "/products/meat-pie.jpeg", video: null, details: { ingredients: "Wheat flour, minced meat, potatoes, onions, mixed spices, butter, egg.", benefits: "Freshly baked every morning — filling, comforting and made to order.", usage: "Best enjoyed warm. Order ahead for events and office lunches." }, sort_order: 2 },
  { id: "coconut-jam", name: "Coconut Jam", category: "nutritional-foods", price: 25, unit: "per jar", description: "Rich, creamy coconut jam — perfect on bread or pastries.", featured: false, badges: ["New"], image: "/products/coconut-jam.jpeg", video: null, details: null, sort_order: 3 },
  { id: "plantain-chips", name: "Crunchy Plantain Chips", category: "nutritional-foods", price: 12, unit: "per pack", description: "Thinly sliced, lightly salted plantain chips.", featured: false, badges: null, image: "/products/plantain-chips.jpeg", video: null, details: null, sort_order: 4 },
  { id: "shea-butter-cream", name: "Whipped Shea Butter Cream", category: "hair-care", price: 45, unit: "per jar", description: "Deeply nourishing shea butter cream for soft, glowing skin.", featured: true, badges: ["Bestseller"], image: "/products/shea-butter-cream.jpeg", video: null, details: { ingredients: "Raw shea butter, coconut oil, vitamin E, natural fragrance.", benefits: "Locks in moisture for days — ideal for dry hair ends, scalp care and skin.", usage: "Warm a small amount between palms; smooth into hair ends or scalp, or apply to clean skin after bathing." }, sort_order: 5 },
  { id: "black-soap", name: "Authentic Black Soap", category: "hair-care", price: 20, unit: "per bar", description: "Traditional natural black soap for face, body and hair.", featured: false, badges: ["Handmade"], image: "/products/black-soap.jpeg", video: null, details: null, sort_order: 6 },
  { id: "lip-balm", name: "Natural Lip Balm", category: "hair-care", price: 10, unit: "per tube", description: "Moisturising lip balm with a gentle herbal scent.", featured: false, badges: null, image: "/products/lip-balm.jpeg", video: null, details: null, sort_order: 7 },
  { id: "pepper-blend", name: "Hot Pepper Blend", category: "spices", price: 15, unit: "per pack", description: "Fiery blended peppers for soups, stews and marinades.", featured: true, badges: ["Bestseller"], image: "/products/pepper-blend.jpeg", video: null, details: null, sort_order: 8 },
  { id: "suya-spice", name: "Suya Spice", category: "spices", price: 18, unit: "per pack", description: "Classic yaji spice mix — great on grilled meats.", featured: false, badges: null, image: "/products/suya-spice.jpeg", video: null, details: { usage: "Rub generously onto grilled meat or chicken; serve with onions, tomatoes and extra pepper." }, sort_order: 9 },
  { id: "shito", name: "Shito Pepper Sauce", category: "spices", price: 30, unit: "per jar", description: "Spicy black pepper sauce with smoked fish flavour.", featured: false, badges: ["New"], image: "/products/shito.jpeg", video: null, details: null, sort_order: 10 },
  { id: "liquid-soap", name: "Multi-Purpose Liquid Soap", category: "more", price: 22, unit: "per bottle", description: "Concentrated liquid soap for home and kitchen.", featured: false, badges: null, image: "/products/liquid-soap.jpeg", video: null, details: null, sort_order: 11 },
];

async function seed() {
  console.log("Seeding categories…");
  const { error: catError } = await supabase
    .from("categories")
    .upsert(categories, { onConflict: "id" });
  if (catError) {
    console.error(" categories failed:", catError.message);
    console.error(" (Did you run supabase/schema.sql in the SQL editor?)");
    process.exit(1);
  }
  console.log(`  ${categories.length} categories upserted`);

  console.log("Seeding products…");
  const { error: prodError } = await supabase
    .from("products")
    .upsert(products, { onConflict: "id" });
  if (prodError) {
    console.error(" products failed:", prodError.message);
    process.exit(1);
  }
  console.log(`  ${products.length} products upserted`);

  console.log("Done. Supabase is now the catalog source of truth.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
