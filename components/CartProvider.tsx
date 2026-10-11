"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  addItem,
  countItems,
  isCartItem,
  removeItem,
  setItemQuantity,
  type CartItem,
} from "@/lib/cart";
import { products } from "@/data/products";
import { generateOrderRef } from "@/lib/order";
import { cartTotal, resolveCartLines, type CartLine } from "@/lib/order";

const STORAGE_KEY = "joyest-cart-v1";

type CartContextValue = {
  lines: readonly CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  /** Human-friendly order reference (JE-YYYYMMDD-XX) for the current cart */
  orderRef: string | null;
  open: () => void;
  close: () => void;
  add: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<readonly CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [orderRef, setOrderRef] = useState<string | null>(null);

  // Restore cart after mount (localStorage is unavailable during SSR).
  // Mint an order ref in the same pass so a restored cart always has one.
  useEffect(() => {
    let restored: readonly CartItem[] = [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        restored = parsed.filter(isCartItem);
      }
    } catch {
      // Corrupt storage — start with an empty cart
    }
    /* eslint-disable react-hooks/set-state-in-effect -- syncing cart + ref from localStorage is exactly what this effect is for */
    setItems(restored);
    if (restored.length > 0) {
      setOrderRef(generateOrderRef());
    }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const lines = resolveCartLines(items, products);
    return {
      lines,
      count: countItems(items),
      subtotal: cartTotal(lines),
      isOpen,
      orderRef,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add: (productId: string, quantity = 1) => {
        setItems((current) => addItem(current, productId, quantity));
        // Mint a fresh ref when the cart goes from empty → non-empty
        if (items.length === 0) setOrderRef(generateOrderRef());
      },
      setQuantity: (productId: string, quantity: number) =>
        setItems((current) => setItemQuantity(current, productId, quantity)),
      remove: (productId: string) => setItems((current) => removeItem(current, productId)),
      clear: () => {
        setItems([]);
        setOrderRef(null);
      },
    };
  }, [items, isOpen, orderRef]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
