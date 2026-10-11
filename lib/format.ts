/** Format a numeric price with the shop currency (e.g. ₵8 or ₵8.50) */
export const formatPrice = (value: number, currency: string): string => {
  const amount = Number.isInteger(value) ? value.toString() : value.toFixed(2);
  return `${currency}${amount}`;
};
