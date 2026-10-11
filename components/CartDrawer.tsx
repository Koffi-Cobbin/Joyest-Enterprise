"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/CartProvider";
import EmptyState from "@/components/EmptyState";
import { business } from "@/data/business";
import { buildMailtoUrl, buildWhatsAppUrl } from "@/lib/contact";
import { formatPrice } from "@/lib/format";
import { buildOrderMessage } from "@/lib/order";

const inputClasses =
  "min-h-11 w-full rounded-lg border border-foreground/10 bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted focus:border-primary focus:outline-2 focus:outline-primary/30";

export default function CartDrawer() {
  const { lines, subtotal, isOpen, close, setQuantity, remove, clear, orderRef } =
    useCart();
  const [customerName, setCustomerName] = useState("");
  const [note, setNote] = useState("");
  const savedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  const trimmedName = customerName.trim();
  const trimmedNote = note.trim();
  const orderMessage = buildOrderMessage(lines, business.currency, business.name, {
    ref: orderRef ?? undefined,
    customerName: trimmedName || undefined,
    note: trimmedNote || undefined,
  });

  /** Fire-and-forget: record the order in Supabase; WhatsApp/email still proceed if this fails */
  const saveOrder = (): void => {
    if (!orderRef || savedRef.current === orderRef) return;
    savedRef.current = orderRef;
    void fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ref: orderRef,
        customerName: trimmedName || undefined,
        note: trimmedNote || undefined,
        items: lines.map((line) => ({
          id: line.product.id,
          name: line.product.name,
          price: line.product.price,
          quantity: line.quantity,
        })),
        total: subtotal,
        currency: business.currency,
      }),
    }).catch(() => {
      /* keep ordering flow intact even if the save fails */
    });
  };

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close cart"
        onClick={close}
        className="absolute inset-0 bg-black/40"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-heading"
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surface shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-foreground/5 px-5 py-4">
          <h2 id="cart-heading" className="font-serif text-xl font-semibold text-secondary">
            Your Cart
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close cart"
            className="flex size-11 items-center justify-center rounded-md transition-colors hover:bg-background"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 items-center">
            <EmptyState
              title="Your cart is empty"
              message="Browse our nutritional foods, hair care, spices and more — add something to your order!"
              actionHref="/shop"
              actionLabel="Browse the shop"
              onActionClick={close}
            />
          </div>
        ) : (
          <ul className="flex-1 divide-y divide-foreground/5 overflow-y-auto px-5">
            {lines.map((line) => (
              <li key={line.product.id} className="flex items-center gap-3 py-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{line.product.name}</p>
                  <p className="text-sm text-muted">
                    {formatPrice(line.product.price, business.currency)}
                    {line.product.unit ? ` ${line.product.unit}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label={`Decrease quantity of ${line.product.name}`}
                    onClick={() => setQuantity(line.product.id, line.quantity - 1)}
                    className="flex size-11 items-center justify-center rounded-md border border-foreground/10 font-semibold hover:bg-background"
                  >
                    −
                  </button>
                  <span className="w-7 text-center text-sm font-semibold" aria-label={`Quantity ${line.quantity}`}>
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label={`Increase quantity of ${line.product.name}`}
                    onClick={() => setQuantity(line.product.id, line.quantity + 1)}
                    className="flex size-11 items-center justify-center rounded-md border border-foreground/10 font-semibold hover:bg-background"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${line.product.name} from cart`}
                  onClick={() => remove(line.product.id)}
                  className="flex size-11 items-center justify-center rounded-md text-muted transition-colors hover:bg-background hover:text-primary-dark"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        {lines.length > 0 && (
          <div className="border-t border-foreground/5 px-5 pt-4">
            <p className="font-ui text-xs font-semibold uppercase tracking-wide text-muted">
              Order reference: <span className="text-foreground">{orderRef}</span>
            </p>
            <div className="mt-3 space-y-2">
              <div>
                <label htmlFor="cart-customer-name" className="font-ui text-xs font-semibold uppercase tracking-wide text-muted">
                  Your name (optional)
                </label>
                <input
                  id="cart-customer-name"
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="e.g. Ama"
                  autoComplete="name"
                  maxLength={80}
                  className={`mt-1 ${inputClasses}`}
                />
              </div>
              <div>
                <label htmlFor="cart-note" className="font-ui text-xs font-semibold uppercase tracking-wide text-muted">
                  Delivery note (optional)
                </label>
                <input
                  id="cart-note"
                  type="text"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="e.g. Deliver to East Legon on Saturday"
                  maxLength={200}
                  className={`mt-1 ${inputClasses}`}
                />
              </div>
            </div>
          </div>
        )}

        <footer className="border-t border-foreground/5 px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Subtotal</span>
            <span className="text-lg font-bold text-primary">
              {formatPrice(subtotal, business.currency)}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted">
            Delivery and payment details are confirmed directly with us.
          </p>

          {lines.length > 0 && (
            <div className="mt-4 space-y-2">
              <a
                href={buildWhatsAppUrl(business.whatsapp, orderMessage)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  saveOrder();
                  close();
                }}
                className="flex min-h-12 w-full items-center justify-center rounded-lg bg-[#25D366] font-semibold text-foreground transition-transform hover:scale-[1.01]"
              >
                Order on WhatsApp
              </a>
              <a
                href={buildMailtoUrl(
                  business.email,
                  `Order ${orderRef ?? ""} from ${business.fullName}`.trim(),
                  orderMessage,
                )}
                onClick={() => {
                  saveOrder();
                  close();
                }}
                className="flex min-h-11 w-full items-center justify-center rounded-lg border-2 border-secondary font-semibold text-secondary transition-colors hover:bg-secondary hover:text-background"
              >
                Order by Email
              </a>
              <button
                type="button"
                onClick={clear}
                className="w-full py-2 text-sm text-muted underline transition-colors hover:text-primary-dark"
              >
                Clear cart
              </button>
            </div>
          )}
        </footer>
      </aside>
    </div>
  );
}
