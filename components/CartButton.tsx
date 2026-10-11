"use client";

import { useCart } from "@/components/CartProvider";

export default function CartButton() {
  const { count, open } = useCart();

  return (
    <button
      type="button"
      onClick={open}
      aria-label={count > 0 ? `Open cart, ${count} items` : "Open cart"}
      className="relative flex size-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.5l1.7 12.1a1.5 1.5 0 0 0 1.49 1.28h9.72a1.5 1.5 0 0 0 1.48-1.24l1.36-7.64H5.1M9 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm9 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
        />
      </svg>
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white"
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}
