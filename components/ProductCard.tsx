import Link from "next/link";
import type { Product } from "@/data/products";
import { business } from "@/data/business";
import { formatPrice } from "@/lib/format";
import AddToCartButton from "@/components/AddToCartButton";
import LinkPendingOverlay from "@/components/LinkPendingOverlay";
import ProductMedia from "@/components/ProductMedia";

export default function ProductCard({ product }: { product: Product }) {
  const badge = product.badges?.[0];

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-xl bg-surface shadow-sm transition-shadow hover:shadow-md">
      {badge ? (
        <span className="absolute left-4 top-4 z-10 rounded-full bg-secondary px-3 py-1 font-ui text-xs font-semibold uppercase tracking-wide text-background">
          {badge}
        </span>
      ) : null}

      <Link
        href={`/shop/${product.id}`}
        className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        tabIndex={-1}
        aria-hidden="true"
      >
        {/* Spinner covers the whole card (article is the positioned ancestor) while the product route loads */}
        <LinkPendingOverlay />
        <ProductMedia product={product} />
      </Link>

      <div className="flex flex-1 flex-col p-6 pt-4">
        <h3 className="font-serif text-lg font-semibold">
          <Link
            href={`/shop/${product.id}`}
            className="transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{product.description}</p>
        <p className="pt-3 pb-4 text-lg font-semibold text-primary">
          {formatPrice(product.price, business.currency)}
          {product.unit ? (
            <span className="text-sm font-normal text-muted"> {product.unit}</span>
          ) : null}
        </p>
        <AddToCartButton productId={product.id} className="mt-auto" />
      </div>
    </article>
  );
}
