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

  return (
    <>
      <div className="mt-8 flex justify-center">
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
      </div>

      <p aria-live="polite" className="mt-4 text-center text-sm text-muted" role="status">
        {query.trim()
          ? `${visible.length} ${visible.length === 1 ? "product" : "products"} match “${query.trim()}”`
          : `Showing ${visible.length} ${visible.length === 1 ? "product" : "products"}`}
      </p>

      {visible.length > 0 ? (
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
