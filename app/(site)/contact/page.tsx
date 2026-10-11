import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { business } from "@/data/business";
import {
  buildMailtoUrl,
  buildTelUrl,
  buildWhatsAppUrl,
} from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Joyest — order or ask questions via WhatsApp, phone or email.",
  alternates: { canonical: "/contact" },
};

const ORDER_MESSAGE = `Hello ${business.name}! I'd like to place an order.`;

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="text-center">
        <h1 className="font-serif text-4xl font-semibold text-secondary">
          Contact Us
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted">
          Questions or ready to order? Reach us any way you like —
          WhatsApp is usually fastest.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <a
          href={buildWhatsAppUrl(business.whatsapp, ORDER_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 flex-col items-center gap-2 rounded-xl bg-[#25D366] p-6 text-center text-white shadow-sm transition-transform hover:scale-[1.02]"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          <span className="font-semibold">WhatsApp</span>
          <span className="text-sm text-white/90">{business.whatsapp}</span>
        </a>
        <a
          href={buildTelUrl(business.phone)}
          className="flex min-h-11 flex-col items-center gap-2 rounded-xl bg-surface p-6 text-center shadow-sm transition-transform hover:scale-[1.02]"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
          </svg>
          <span className="font-semibold">Call Us</span>
          <span className="text-sm text-muted">{business.phone}</span>
        </a>
        <a
          href={buildMailtoUrl(business.email, `Hello ${business.name}`)}
          className="flex min-h-11 flex-col items-center gap-2 rounded-xl bg-surface p-6 text-center shadow-sm transition-transform hover:scale-[1.02]"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M22 6l-10 7L2 6" />
          </svg>
          <span className="font-semibold">Email</span>
          <span className="break-all text-sm text-muted">{business.email}</span>
        </a>
      </div>

      <section aria-labelledby="message-heading" className="mt-12 rounded-xl bg-surface p-6 shadow-sm">
        <h2 id="message-heading" className="font-serif text-xl font-semibold text-secondary">
          Send Us a Message
        </h2>
        <div className="mt-4">
          <ContactForm />
        </div>
      </section>

      <section aria-labelledby="hours-heading" className="mt-12 rounded-xl bg-surface p-6 shadow-sm">
        <h2 id="hours-heading" className="font-serif text-xl font-semibold text-secondary">
          Business Hours
        </h2>
        <ul className="mt-4 divide-y divide-black/5">
          {business.hours.map((slot) => (
            <li key={slot.days} className="flex justify-between gap-4 py-2 text-sm">
              <span className="font-medium">{slot.days}</span>
              <span className="text-muted">{slot.time}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="location-heading" className="mt-8 rounded-xl bg-surface p-6 shadow-sm">
        <h2 id="location-heading" className="font-serif text-xl font-semibold text-secondary">
          Find Us
        </h2>
        <p className="mt-2 text-muted">{business.address}</p>
        <div
          className="mt-4 flex min-h-44 items-center justify-center rounded-lg bg-background text-sm text-muted"
          role="img"
          aria-label="Map placeholder"
        >
          Map coming soon
        </div>
      </section>
    </div>
  );
}
