import type { Metadata } from "next";
import Link from "next/link";
import { business } from "@/data/business";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Joyest — your local source for nutritional foods, natural hair care, aromatic spices and more.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  {
    title: "Quality products",
    body: "We carefully pick every item we stock, from nourishing foods to trusted hair care and aromatic spices.",
  },
  {
    title: "Friendly service",
    body: "Visit us in person or message us anytime — we're happy to help you find what you need.",
  },
  {
    title: "Easy ordering",
    body: "No complicated checkout. Browse the shop, then order via WhatsApp, phone or email.",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="text-center">
        <h1 className="font-serif text-4xl font-semibold text-secondary">
          About {business.name}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-muted">
          {business.fullName} — {business.tagline}
        </p>
      </div>

      <section aria-labelledby="story-heading" className="mt-12">
        <h2 id="story-heading" className="font-serif text-2xl font-semibold text-secondary">
          Our story
        </h2>
        {/* TODO: owner to personalise with the real Joyest story */}
        <p className="mt-4 leading-relaxed text-muted">
          Joyest started with a simple idea: bring everyday wellness closer to
          home — nourishing foods, natural hair care, and aromatic spices,
          together in one friendly local shop. What began as a small
          selection for friends and neighbours has grown into a catalogue our
          community relies on.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          We believe shopping should be personal. That&apos;s why you can
          reach us directly on WhatsApp, by phone, or by email — no accounts,
          no fuss. Just tell us what you need, and we&apos;ll take care of the
          rest.
        </p>
      </section>

      <section aria-labelledby="values-heading" className="mt-12">
        <h2 id="values-heading" className="font-serif text-2xl font-semibold text-secondary">
          What we stand for
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {VALUES.map((value) => (
            <li key={value.title} className="rounded-xl bg-surface p-6 shadow-sm">
              <h3 className="font-semibold">{value.title}</h3>
              <p className="mt-2 text-sm text-muted">{value.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 text-center">
        <Link
          href="/shop"
          className="inline-flex min-h-11 items-center rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Start Shopping
        </Link>
      </div>
    </div>
  );
}
