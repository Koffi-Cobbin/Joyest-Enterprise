import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import HomeHero from "@/components/HomeHero";
import HowItWorks from "@/components/HowItWorks";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { ProductCardSkeleton } from "@/components/LoadingSkeleton";
import { business } from "@/data/business";
import { getCategories, getFeaturedProducts } from "@/lib/catalog";
import { buildWhatsAppUrl } from "@/lib/contact";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/** Placeholder for the data-driven sections (categories + featured) while
 *  the Supabase reads stream in behind the Suspense boundary. */
function HomeCatalogSkeleton() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading categories and products…</span>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-4" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="overflow-hidden rounded-xl bg-surface shadow-sm" aria-hidden="true">
            <div className="animate-pulse aspect-[4/3] w-full bg-foreground/5" />
            <div className="flex flex-col items-center gap-2 p-5">
              <div className="animate-pulse h-4 w-2/3 rounded-md bg-foreground/5" />
              <div className="animate-pulse h-3 w-full rounded-md bg-foreground/5" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
        {Array.from({ length: 3 }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

async function HomeCatalog() {
  const [categories, featured] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <>
      <section aria-labelledby="categories-heading" className="mx-auto max-w-6xl px-4 py-16">
        <Reveal>
          <h2
            id="categories-heading"
            className="text-center font-serif text-3xl font-semibold text-secondary"
          >
            Shop by Category
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-4">
            {categories.map((category, index) => (
              <Reveal key={category.id} delay={index * 80}>
                <li className="h-full">
                  <Link
                    href={`/shop?category=${category.id}`}
                    className="group flex h-full flex-row items-stretch overflow-hidden rounded-xl bg-surface shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:flex-col sm:items-center"
                  >
                    {category.image ? (
                      // Static /public photo; switch to next/image when optimization is configured
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={category.image}
                        alt=""
                        className="aspect-square w-24 shrink-0 object-cover transition-transform duration-500 group-hover:scale-[1.04] sm:aspect-[4/3] sm:w-full"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex aspect-square w-24 shrink-0 items-center justify-center bg-gradient-to-br from-background via-accent/20 to-primary/15 sm:aspect-[4/3] sm:w-full"
                      >
                        <span className="font-ui text-[10px] font-semibold uppercase tracking-[0.25em] text-muted">
                          Joyest
                        </span>
                      </span>
                    )}
                    <span className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 p-3 text-left sm:flex-none sm:items-center sm:gap-1 sm:p-5 sm:text-center">
                      <span className="truncate text-[15px] font-semibold leading-snug transition-colors group-hover:text-primary sm:overflow-visible sm:whitespace-normal sm:text-base">
                        {category.name}
                      </span>
                      <span className="text-xs text-muted sm:text-sm">
                        {category.description}
                      </span>
                    </span>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        </Reveal>
      </section>

      <section aria-labelledby="featured-heading" className="bg-surface/60 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <h2
              id="featured-heading"
              className="text-center font-serif text-3xl font-semibold text-secondary"
            >
              Customer Favourites
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <p className="mt-8 text-center">
              <Link
                href="/shop"
                className="font-semibold text-primary hover:underline"
              >
                Browse all products →
              </Link>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export default function Home() {
  return (
    <>
      <HomeHero />

      {/* Catalog reads hit Supabase; stream them behind Suspense so the static
          shell (hero + copy) prerenders instantly per Cache Components. */}
      <Suspense fallback={<HomeCatalogSkeleton />}>
        <HomeCatalog />
      </Suspense>

      <HowItWorks />

      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <Reveal>
          <h2 className="font-serif text-3xl font-semibold text-secondary">
            A local shop you can trust
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted">
            From nourishing foods to natural hair care, aromatic spices and more — Joyest
            brings you everyday wellness with a personal touch. Ordering is
            simple: browse, then reach us on WhatsApp, by phone, or email.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={buildWhatsAppUrl(
                business.whatsapp,
                `Hello ${business.name}! I saw your website and have a question.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-11 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Chat on WhatsApp
            </a>
            <Link
              href="/contact"
              className="min-h-11 rounded-lg border-2 border-secondary px-6 py-3 font-semibold text-secondary transition-colors hover:bg-secondary hover:text-background"
            >
              Contact Us
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
