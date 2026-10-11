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
          <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((category, index) => (
              <Reveal key={category.id} delay={index * 80}>
                <li className="h-full">
                  <Link
                    href={`/shop?category=${category.id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-xl bg-surface shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {category.image ? (
                      // Static /public photo; switch to next/image when optimization is configured
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={category.image}
                        alt=""
                        className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-background via-accent/20 to-primary/15"
                      >
                        <span className="font-ui text-[10px] font-semibold uppercase tracking-[0.25em] text-muted">
                          Joyest
                        </span>
                      </span>
                    )}
                    <span className="flex flex-1 flex-col items-center gap-1 p-5 text-center">
                      <span className="font-semibold transition-colors group-hover:text-primary">
                        {category.name}
                      </span>
                      <span className="text-sm text-muted">{category.description}</span>
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
