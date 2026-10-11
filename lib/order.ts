import type { CartItem } from "./cart";
import { formatPrice } from "./format";
import type { Product } from "@/data/products";

export type CartLine = {
  product: Product;
  quantity: number;
};

export type OrderMessageOptions = {
  /** Human-friendly reference both sides can quote (e.g. JE-20261011-42) */
  ref?: string;
  /** Optional customer name appended to the message */
  customerName?: string;
  /** Optional delivery note / address hint appended to the message */
  note?: string;
};

/** Resolve cart items against the catalog; unknown products are dropped */
export const resolveCartLines = (
  items: readonly CartItem[],
  products: readonly Product[],
): readonly CartLine[] =>
  items.flatMap((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return product ? [{ product, quantity: item.quantity }] : [];
  });

/** Total price of all lines (unit price × quantity) */
export const cartTotal = (lines: readonly CartLine[]): number =>
  lines.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0,
  );

/**
 * Generate a human-friendly order reference (borrowed from Joyest's JE-YYYY-NNNN).
 * Format: JE-YYYYMMDD-XX (XX = 10–99)
 */
export const generateOrderRef = (now: Date = new Date()): string => {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const suffix = String(Math.floor(Math.random() * 90) + 10);
  return `JE-${year}${month}${day}-${suffix}`;
};

/**
 * Build the plain-text WhatsApp/email order message (pure).
 *
 * Hello Joyest! I'd like to place an order:
 * Order ref: JE-20261011-42
 *
 * 2x Meat Pie — ₵16
 * ...
 * Total: ₵61
 *
 * Name: Ama
 * Note: Deliver to East Legon
 */
export const buildOrderMessage = (
  lines: readonly CartLine[],
  currency: string,
  shopName: string,
  options: OrderMessageOptions = {},
): string => {
  const itemLines = lines.map(
    (line) =>
      `${line.quantity}x ${line.product.name} — ${formatPrice(
        line.product.price * line.quantity,
        currency,
      )}`,
  );

  const sections = [
    `Hello ${shopName}! I'd like to place an order:`,
    ...(options.ref ? ["", `Order ref: ${options.ref}`] : []),
    "",
    ...itemLines,
    "",
    `Total: ${formatPrice(cartTotal(lines), currency)}`,
  ];

  if (options.customerName || options.note) {
    sections.push("");
    if (options.customerName) sections.push(`Name: ${options.customerName}`);
    if (options.note) sections.push(`Note: ${options.note}`);
  }

  sections.push("", "Thank you!");
  return sections.join("\n");
};
