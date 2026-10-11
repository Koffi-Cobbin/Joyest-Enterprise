import type { Metadata } from "next";
import Link from "next/link";
import HomeHero from "@/components/HomeHero";
import HowItWorks from "@/components/HowItWorks";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { business } from "@/data/business";
import { getCategories, getFeaturedProducts } from "@/lib/catalog";
import { buildWhatsAppUrl } from "@/lib/contact";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [categories, featured] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <>
      <HomeHero />

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
                      <span className="line-clamp-1 text-xs text-muted sm:line-clamp-none sm:text-sm">
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
