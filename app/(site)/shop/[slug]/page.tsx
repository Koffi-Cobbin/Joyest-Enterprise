import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductMedia from "@/components/ProductMedia";
import ProductPurchase from "@/components/ProductPurchase";
import { getYouTubeId } from "@/lib/youtube";
import { business } from "@/data/business";
import { findCategoryById, getProductBySlug, getProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

type Params = Promise<{ slug: string }>;

export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.id }));
};

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Product not found" };
  }
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/shop/${product.id}` },
  };
}

const detailRow = (label: string, body: string) => (
  <details className="group border-b border-foreground/10 py-4">
    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-ui text-sm font-semibold uppercase tracking-wide text-foreground">
      {label}
      <span aria-hidden="true" className="text-muted transition-transform group-open:rotate-45">
        +
      </span>
    </summary>
    <p className="mt-3 leading-relaxed text-muted">{body}</p>
  </details>
);

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = await findCategoryById(product.category);
  const details = product.details;
  const videoId = product.video ? getYouTubeId(product.video) : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav aria-label="Breadcrumb" className="font-ui text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/shop" className="transition-colors hover:text-primary">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/shop?category=${product.category}`}
              className="transition-colors hover:text-primary"
            >
              {category?.name ?? "Products"}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground">{product.name}</li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative">
          {product.badges?.[0] ? (
            <span className="absolute left-4 top-4 z-10 rounded-full bg-secondary px-3 py-1 font-ui text-xs font-semibold uppercase tracking-wide text-background">
              {product.badges[0]}
            </span>
          ) : null}
          <ProductMedia product={product} size="lg" />
          {videoId ? (
            <div className="mt-6">
              <h2 className="font-serif text-xl font-semibold text-secondary">
                Video
              </h2>
              <div className="mt-3 aspect-video overflow-hidden rounded-xl">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                  title={`${product.name} video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* Sticky purchase column on desktop (borrowed from Joyest's detail layout) */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          {category ? (
            <p className="font-ui text-sm font-semibold uppercase tracking-wide text-accent">
              {category.name}
            </p>
          ) : null}
          <h1 className="mt-2 font-serif text-4xl font-semibold text-secondary">
            {product.name}
          </h1>
          <p className="mt-3 text-2xl font-bold text-primary">
            {formatPrice(product.price, business.currency)}
            {product.unit ? (
              <span className="text-base font-normal text-muted"> {product.unit}</span>
            ) : null}
          </p>
          <p className="mt-4 leading-relaxed text-muted">{product.description}</p>

          <div className="mt-8 border-t border-foreground/10 pt-6">
            <ProductPurchase productId={product.id} />
          </div>

          {details ? (
            <div className="mt-8">
              <h2 className="font-serif text-xl font-semibold text-secondary">
                Product details
              </h2>
              <div className="mt-2">
                {details.ingredients
                  ? detailRow("Ingredients", details.ingredients)
                  : null}
                {details.benefits ? detailRow("Benefits", details.benefits) : null}
                {details.usage ? detailRow("How to use", details.usage) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <p className="mt-12 text-center">
        <Link
          href="/shop"
          className="font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        >
          ← Back to all products
        </Link>
      </p>
    </div>
  );
}
