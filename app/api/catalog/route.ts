import { NextResponse } from "next/server";
import { getBundles, getCategories, getGallery, getProducts, getRecipes, getTestimonials } from "@/lib/data/catalog";

const collections = ["categories", "products", "bundles", "recipes", "gallery", "testimonials"] as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const collection = searchParams.get("collection");
  if (!collection || !collections.includes(collection as (typeof collections)[number])) {
    return NextResponse.json({ error: "Choose a valid catalog collection." }, { status: 400 });
  }

  try {
    switch (collection) {
      case "categories":
        return NextResponse.json(await getCategories());
      case "products":
        return NextResponse.json(await getProducts({
          category: searchParams.get("category") ?? undefined,
          search: searchParams.get("q") ?? undefined,
          featured: searchParams.get("featured") === "true"
        }));
      case "bundles":
        return NextResponse.json(await getBundles());
      case "recipes":
        return NextResponse.json(await getRecipes());
      case "gallery":
        return NextResponse.json(await getGallery());
      case "testimonials":
        return NextResponse.json(await getTestimonials());
      default:
        return NextResponse.json({ error: "Unknown catalog collection." }, { status: 400 });
    }
  } catch (error) {
    console.error("Catalog request failed:", error);
    return NextResponse.json(
      { error: "The catalog could not be loaded. Apply the Supabase migration and try again." },
      { status: 503 }
    );
  }
}
