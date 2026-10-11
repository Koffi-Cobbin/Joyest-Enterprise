/** Strip everything except digits — for phone numbers in URLs (wa.me, tel:) */
export const digitsOnly = (value: string): string => value.replace(/\D/g, "");

/** Build a WhatsApp deep link; message is URL-encoded when provided */
export const buildWhatsAppUrl = (phone: string, message?: string): string => {
  const base = `https://wa.me/${digitsOnly(phone)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

/** Build a tel: link from a display phone number */
export const buildTelUrl = (phone: string): string => `tel:${digitsOnly(phone)}`;

/** Build a mailto: link with optional subject/body */
export const buildMailtoUrl = (
  email: string,
  subject?: string,
  body?: string,
): string => {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString();
  return `mailto:${email}${query ? `?${query}` : ""}`;
};
