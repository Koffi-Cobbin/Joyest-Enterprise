"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, Product, ProductVariant } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  total: number;
  ready: boolean;
  addItem: (product: Product, variant?: ProductVariant | null) => void;
  removeItem: (productId: string, variantId: string | null) => void;
  setQuantity: (productId: string, variantId: string | null, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "joyest-cart-v1";

function imageUrl(path: string | undefined) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return base ? `${base}/storage/v1/object/public/catalog/${path.split("/").map(encodeURIComponent).join("/")}` : null;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setItems(parsed as CartItem[]);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback((product: Product, variant?: ProductVariant | null) => {
    if (variant && !variant.in_stock) return;
    const variantId = variant?.id ?? null;
    const selected = product.product_variants?.find((entry) => entry.id === variantId);
    const item: CartItem = {
      productId: product.id,
      variantId,
      name: product.name,
      slug: product.slug,
      variantLabel: selected?.label ?? null,
      unitPrice: Number(selected?.price ?? product.base_price),
      imageUrl: imageUrl(product.product_images?.[0]?.storage_path),
      quantity: 1
    };
    setItems((current) => {
      const existing = current.find((entry) => entry.productId === product.id && entry.variantId === variantId);
      if (existing) return current.map((entry) => entry === existing
        ? { ...entry, quantity: Math.min(50, entry.quantity + 1) }
        : entry);
      return [...current, item];
    });
  }, []);

  const removeItem = useCallback((productId: string, variantId: string | null) => {
    setItems((current) => current.filter((entry) => !(entry.productId === productId && entry.variantId === variantId)));
  }, []);

  const setQuantity = useCallback((productId: string, variantId: string | null, quantity: number) => {
    setItems((current) => current.map((entry) => entry.productId === productId && entry.variantId === variantId
      ? { ...entry, quantity: Math.max(1, Math.min(50, quantity)) }
      : entry));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const value = useMemo(() => ({
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    ready,
    addItem,
    removeItem,
    setQuantity,
    clearCart
  }), [items, ready, addItem, removeItem, setQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider.");
  return context;
}
