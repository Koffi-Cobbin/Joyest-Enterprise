"use client";

import { useMemo, useState } from "react";
import EmptyState from "@/components/EmptyState";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/data/products";

/** Client-side catalog: search box + product grid (category filtering stays URL-driven) */
export default function ShopCatalog({
  products,
}: {
  products: readonly Product[];
}) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q),
    );
  }, [products, query]);

  const countLabel = query.trim()
    ? `${visible.length} ${visible.length === 1 ? "product" : "products"} match “${query.trim()}”`
    : `Showing ${visible.length} ${visible.length === 1 ? "product" : "products"}`;

  return (
    <>
      {/* Search + live result count share one row on phones */}
      <div className="mt-4 flex items-center gap-3 sm:mt-8 sm:justify-center">
        <div className="w-full max-w-md">
          <label htmlFor="shop-search" className="sr-only">
            Search products
          </label>
          <input
            id="shop-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products…"
            className="min-h-11 w-full rounded-full border border-foreground/10 bg-surface px-5 text-sm shadow-sm transition-colors placeholder:text-muted focus:border-primary focus:outline-2 focus:outline-primary/30"
          />
        </div>
        <p
          aria-live="polite"
          role="status"
          className="hidden shrink-0 text-sm text-muted sm:block sm:text-center"
        >
          {countLabel}
        </p>
      </div>

      {/* Phones: count sits on its own tighter line under the search */}
      <p aria-live="polite" role="status" className="mt-3 text-sm text-muted sm:hidden">
        {countLabel}
      </p>

      {visible.length > 0 ? (
        <ul className="mt-4 grid gap-6 sm:mt-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="No products found"
          message={`Nothing matches “${query.trim()}” — try a different word, or browse everything.`}
          actionHref="/shop"
          actionLabel="Browse all products"
          onActionClick={() => setQuery("")}
        />
      )}
    </>
  );
}
