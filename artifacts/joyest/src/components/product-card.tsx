import type { Product } from "@/lib/types";
import { Price } from "@/components/ui";
import { AddToCartButton } from "@/components/store-actions";

export function ProductCard({ product, imageUrl }: { product: Product; imageUrl: string | null }) {
  return <article className="product-card">
    <a href={`/product/${product.slug}`} className="product-image" aria-label={`View ${product.name}`}>
      {imageUrl ? <img src={imageUrl} alt={product.product_images?.[0]?.alt || product.name} /> : <div className="image-placeholder"><span>Joyest</span><small>everyday goodness</small></div>}
      {product.badges?.length > 0 && <span className="product-badge">{product.badges[0]}</span>}
    </a>
    <div className="product-info">
      <span className="product-category">{product.categories?.name ?? "Joyest selection"}</span>
      <a href={`/product/${product.slug}`} className="product-name">{product.name}</a>
      {product.short_desc && <p>{product.short_desc}</p>}
      <div className="product-bottom"><Price amount={product.base_price} /><AddToCartButton product={product} /></div>
    </div>
  </article>;
}
