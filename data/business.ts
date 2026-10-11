export type BusinessHours = {
  days: string;
  time: string;
};

/**
 * Business contact details — from the client's project enquiry (2026-10-09).
 */
export const business = {
  name: "Joyest",
  fullName: "Joyest Enterprise",
  tagline: "Rooted in Ghana. Made for everyday wellness.",
  /** Currency symbol shown next to all prices */
  currency: "₵",
  /** Include country code, spaces OK — normalised for wa.me links in lib/contact.ts */
  whatsapp: "+233 55 816 0945",
  phone: "+233 55 816 0945",
  email: "joyestsarkcess29@gmail.com",
  hours: [
    { days: "Monday – Friday", time: "8:00 AM – 6:00 PM" },
    { days: "Saturday", time: "9:00 AM – 4:00 PM" },
    { days: "Sunday", time: "Closed" },
  ] satisfies BusinessHours[],
  address: "Ablekuma – Agape Down, Accra",
} as const;
