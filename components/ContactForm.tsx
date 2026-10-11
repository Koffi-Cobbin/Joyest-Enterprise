"use client";

import { useState } from "react";
import { business } from "@/data/business";
import { buildMailtoUrl } from "@/lib/contact";

const inputClasses =
  "min-h-11 w-full rounded-lg border border-foreground/10 bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted focus:border-primary focus:outline-2 focus:outline-primary/30";

/**
 * Contact form — composes a prefilled email via mailto (static site, no backend).
 * WhatsApp stays the fastest channel; the form covers visitors who prefer email.
 */
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const body = [
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      "",
      message.trim(),
    ].join("\n");
    window.location.href = buildMailtoUrl(
      business.email,
      `Website enquiry from ${name.trim() || "visitor"}`,
      body,
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="contact-name"
          className="font-ui text-xs font-semibold uppercase tracking-wide text-muted"
        >
          Your name
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Ama"
          autoComplete="name"
          required
          maxLength={80}
          className={`mt-1 ${inputClasses}`}
        />
      </div>
      <div>
        <label
          htmlFor="contact-email"
          className="font-ui text-xs font-semibold uppercase tracking-wide text-muted"
        >
          Email address
        </label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
          maxLength={120}
          className={`mt-1 ${inputClasses}`}
        />
      </div>
      <div>
        <label
          htmlFor="contact-message"
          className="font-ui text-xs font-semibold uppercase tracking-wide text-muted"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Tell us what you need — products, quantities, delivery…"
          required
          rows={5}
          maxLength={2000}
          className={`mt-1 resize-y ${inputClasses}`}
        />
      </div>
      <button
        type="submit"
        className="min-h-11 w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary sm:w-auto"
      >
        Send message
      </button>
      <p className="text-xs text-muted">
        This opens your email app with the message ready to send to{" "}
        {business.email}. For the fastest reply, message us on WhatsApp instead.
      </p>
    </form>
  );
}
