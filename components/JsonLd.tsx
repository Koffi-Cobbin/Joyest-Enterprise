import { business } from "@/data/business";
import { getSiteUrl } from "@/lib/site";

const DESCRIPTION =
  "Shop nutritional foods, natural hair care, aromatic spices and more at Joyest. Order easily via WhatsApp, phone, or email.";

/** LocalBusiness/Store structured data — helps Google show rich results (hours, contact, location) */
const storeSchema = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: business.fullName,
  description: DESCRIPTION,
  url: getSiteUrl(),
  image: getSiteUrl("/og-image.png"),
  telephone: business.phone,
  email: business.email,
  priceRange: business.currency,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Ablekuma – Agape Down",
    addressLocality: "Accra",
    addressRegion: "Greater Accra",
    addressCountry: "GH",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "09:00",
      closes: "16:00",
    },
  ],
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
    />
  );
}
