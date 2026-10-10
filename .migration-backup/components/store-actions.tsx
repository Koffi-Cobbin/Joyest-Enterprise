"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import type { Product, ProductVariant } from "@/lib/types";
import { useCart } from "@/lib/cart-context";

export function AddToCartButton({ product, variant, compact = false }: { product: Product; variant?: ProductVariant | null; compact?: boolean }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const disabled = !!variant && !variant.in_stock;
  return <button className={compact ? "icon-add" : "button button-dark add-button"} disabled={disabled} onClick={() => {
    addItem(product, variant); setAdded(true); window.setTimeout(() => setAdded(false), 1300);
  }} aria-label={disabled ? `${variant?.label} unavailable` : `Add ${product.name} to bag`}>
    {disabled ? "Unavailable" : added ? <><Check size={15} /> Added</> : compact ? <Plus size={17} /> : <>Add to bag <Plus size={15} /></>}
  </button>;
}

export function QuantityControl({ value, onChange, label }: { value: number; onChange: (value: number) => void; label: string }) {
  return <div className="quantity-control" aria-label={`${label} quantity`}>
    <button onClick={() => onChange(Math.max(1, value - 1))} aria-label={`Decrease ${label} quantity`}>−</button>
    <span aria-live="polite">{value}</span>
    <button onClick={() => onChange(Math.min(50, value + 1))} aria-label={`Increase ${label} quantity`}>+</button>
  </div>;
}
