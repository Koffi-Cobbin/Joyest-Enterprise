import Link from "next/link";
import { business } from "@/data/business";
import { buildWhatsAppUrl } from "@/lib/contact";

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-secondary text-background">
      {/* Vertical micro-label motif (borrowed from Joyest) */}
      <span
        aria-hidden="true"
        className="vertical-label absolute left-5 top-1/2 hidden -translate-y-1/2 font-ui text-xs text-background/50 lg:block"
      >
        {business.fullName} · Accra
      </span>

      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:py-28">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          Akwaaba — welcome
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl lg:text-6xl">
          {business.fullName}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-background/85">
          {business.tagline}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="min-h-11 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Shop Now
          </Link>
          <a
            href={buildWhatsAppUrl(
              business.whatsapp,
              `Hello ${business.name}! I'd like to place an order.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-11 rounded-lg border-2 border-background/40 px-6 py-3 font-semibold text-background transition-colors hover:border-accent hover:text-accent"
          >
            Order on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
