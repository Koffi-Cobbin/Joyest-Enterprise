import Link from "next/link";
import { business } from "@/data/business";
import { categories } from "@/data/categories";
import { buildMailtoUrl, buildTelUrl, buildWhatsAppUrl } from "@/lib/contact";

// Cache the year at build/request time — new Date() is unstable during prerender in Next 16
async function getCopyrightYear(): Promise<number> {
  "use cache";
  return new Date().getFullYear();
}

export default async function Footer() {
  const year = await getCopyrightYear();
  return (
    <footer className="bg-secondary text-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset; switch to next/image when optimizing */}
          <img
            src="/joyest-logo.jpg"
            alt="Joyest Enterprise"
            className="h-20 w-auto rounded-xl"
          />
          <p className="mt-3 text-sm text-background/80">{business.tagline}</p>
        </div>

        <nav aria-label="Shop by category">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">
            Shop
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/shop?category=${category.id}`}
                  className="text-background/90 transition-colors hover:text-accent"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">
            Contact
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-background/90">
            <li>
              <a
                href={buildWhatsAppUrl(
                  business.whatsapp,
                  `Hello ${business.name}! I'd like to place an order.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                WhatsApp: {business.whatsapp}
              </a>
            </li>
            <li>
              <a href={buildTelUrl(business.phone)} className="transition-colors hover:text-accent">
                Call: {business.phone}
              </a>
            </li>
            <li>
              <a
                href={buildMailtoUrl(business.email)}
                className="transition-colors hover:text-accent"
              >
                {business.email}
              </a>
            </li>
            <li className="text-background/80">{business.address}</li>
          </ul>

          <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-accent">
            Hours
          </h2>
          <ul className="mt-3 space-y-1 text-sm text-background/90">
            {business.hours.map((slot) => (
              <li key={slot.days}>
                <span className="text-background/80">{slot.days}:</span> {slot.time}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-background/10 py-4 text-center text-xs text-background/70">
        © {year} {business.fullName}. All rights reserved.
      </div>
    </footer>
  );
}
