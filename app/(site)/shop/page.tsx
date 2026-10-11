import type { Metadata } from "next";
import { Suspense } from "react";
import Reveal from "@/components/Reveal";
import CategoryFilterStrip from "@/components/CategoryFilterStrip";
import ShopCatalog from "@/components/ShopCatalog";
import ProductGridSkeleton from "@/components/LoadingSkeleton";
import type { CategoryId } from "@/data/categories";
import { getCategories, getProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse nutritional foods, natural hair care, aromatic spices and more at Joyest. Find your favourites and order via WhatsApp.",
  alternates: { canonical: "/shop" },
};

type SearchParams = Promise<{ category?: string }>;

function ShopPageFallback() {
  return (
    <>
      <h1 className="sr-only">Shop</h1>
      <ProductGridSkeleton />
    </>
  );
}

async function ShopContent({ searchParams }: { searchParams: SearchParams }) {
  const [params, categories, products] = await Promise.all([
    searchParams,
    getCategories(),
    getProducts(),
  ]);
  const isValidCategory = (value: string | undefined): value is CategoryId =>
    typeof value === "string" &&
    categories.some((category) => category.id === value);
  const activeCategory = isValidCategory(params.category) ? params.category : undefined;
  const visibleProducts = activeCategory
    ? products.filter((product) => product.category === activeCategory)
    : products;
  const activeCategoryName = categories.find(
    (category) => category.id === activeCategory,
  )?.name;

  return (
    <>
      <Reveal>
        <div className="sm:text-center">
          <h1 className="font-serif text-2xl font-semibold text-secondary sm:text-4xl">
            {activeCategoryName ?? "Shop"}
          </h1>
          <p className="mt-1.5 text-sm text-muted sm:mx-auto sm:mt-3 sm:max-w-2xl sm:text-base">
            {activeCategoryName
              ? `Browse our ${activeCategoryName.toLowerCase()} selection.`
              : "Browse everything we offer — nutritional foods, natural hair care, aromatic spices and more."}
          </p>
        </div>

        {/* Phones: horizontal scroll strip (no wrap); sm+: wrapped centered pills */}
        <CategoryFilterStrip categories={categories} activeCategory={activeCategory} />
      </Reveal>

      <ShopCatalog products={visibleProducts} />
    </>
  );
}

export default function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Suspense fallback={<ShopPageFallback />}>
        <ShopContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
