"use client";

import { useRef, useState } from "react";
import { useCart } from "@/components/CartProvider";

type AddToCartButtonProps = {
  productId: string;
  /** Quantity added per click (detail page picker feeds this) */
  quantity?: number;
  /** Extra classes — e.g. "mt-auto" on cards, "mt-6" on detail pages */
  className?: string;
};

export default function AddToCartButton({
  productId,
  quantity = 1,
  className = "",
}: AddToCartButtonProps) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  const handleClick = (): void => {
    add(productId, quantity);
    setAdded(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`min-h-11 w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${className}`}
    >
      {added ? "Added!" : "Add to cart"}
    </button>
  );
}
