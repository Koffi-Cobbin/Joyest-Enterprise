import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import Reveal from "@/components/Reveal";
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

const tabClasses = (active: boolean): string =>
  `rounded-full px-4 py-2 text-sm font-medium transition-colors min-h-11 inline-flex items-center ${
    active
      ? "bg-secondary text-background"
      : "bg-surface text-foreground hover:text-primary"
  }`;

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
        <div className="text-center">
          <h1 className="font-serif text-4xl font-semibold text-secondary">
            {activeCategoryName ?? "Shop"}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted">
            {activeCategoryName
              ? `Browse our ${activeCategoryName.toLowerCase()} selection.`
              : "Browse everything we offer — nutritional foods, natural hair care, aromatic spices and more."}
          </p>
        </div>

        <nav aria-label="Product categories" className="mt-8 flex flex-wrap justify-center gap-2">
          <Link href="/shop" className={tabClasses(activeCategory === undefined)}>
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.id}`}
              className={tabClasses(activeCategory === category.id)}
            >
              {category.name}
            </Link>
          ))}
        </nav>
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
