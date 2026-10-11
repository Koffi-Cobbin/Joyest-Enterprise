export type CartItem = {
  productId: string;
  quantity: number;
};

/** Shape guard for items restored from localStorage */
export const isCartItem = (value: unknown): value is CartItem => {
  if (typeof value !== "object" || value === null) return false;
  const item = value as CartItem;
  return (
    typeof item.productId === "string" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
};

export const addItem = (
  items: readonly CartItem[],
  productId: string,
  quantity = 1,
): readonly CartItem[] => {
  const existing = items.find((item) => item.productId === productId);
  if (!existing) {
    return [...items, { productId, quantity }];
  }
  return items.map((item) =>
    item.productId === productId
      ? { ...item, quantity: item.quantity + quantity }
      : item,
  );
};

export const setItemQuantity = (
  items: readonly CartItem[],
  productId: string,
  quantity: number,
): readonly CartItem[] => {
  if (quantity <= 0) {
    return items.filter((item) => item.productId !== productId);
  }
  return items.map((item) =>
    item.productId === productId ? { ...item, quantity } : item,
  );
};

export const removeItem = (
  items: readonly CartItem[],
  productId: string,
): readonly CartItem[] =>
  items.filter((item) => item.productId !== productId);

export const countItems = (items: readonly CartItem[]): number =>
  items.reduce((sum, item) => sum + item.quantity, 0);
