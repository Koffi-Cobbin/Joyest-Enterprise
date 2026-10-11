import type { CategoryId } from "./categories";

export type ProductDetails = {
  ingredients?: string;
  benefits?: string;
  usage?: string;
};

export type Product = {
  id: string;
  name: string;
  category: CategoryId;
  price: number; // numeric so the currency symbol lives in one place (business.ts)
  unit?: string; // e.g. "per pack", "per kg"
  description: string;
  featured?: boolean;
  /** Merch chips shown on cards/detail (e.g. "Bestseller", "New") — first one displays */
  badges?: readonly string[];
  /** Photo path (e.g. "/products/meat-pie.jpg"); branded placeholder shown until set */
  image?: string;
  /** Optional YouTube link — rendered as an embedded video on the product page */
  video?: string;
  /** Extra detail sections for the product page — rendered only when present */
  details?: ProductDetails;
};

/**
 * Sample catalog — replace with the real product list.
 * Prices are plain numbers; currency is set in data/business.ts.
 * Categories follow the client's three core verticals: nutritional foods,
 * natural hair care, aromatic natural spices.
 */
export const products: readonly Product[] = [
  // Nutritional Foods
  {
    id: "tom-brown",
    name: "Tom Brown Mix",
    category: "nutritional-foods",
    price: 35,
    unit: "per pack",
    description:
      "Nutritious roasted grain blend — a filling breakfast for the whole family.",
    image: "/products/tom-brown.jpeg",
    featured: true,
    badges: ["Bestseller"],
    details: {
      ingredients:
        "Roasted maize, millet, soybeans, groundnuts, dried ginger and a touch of sugar.",
      benefits:
        "High in protein and fibre — keeps you full and focused through the morning.",
      usage:
        "Mix 3–4 tablespoons with hot water or milk, stir until smooth. Sweeten to taste; pair with bread or koose.",
    },
  },
  {
    id: "meat-pie",
    name: "Homemade Meat Pie",
    category: "nutritional-foods",
    price: 8,
    unit: "per piece",
    description: "Flaky pastry stuffed with seasoned minced meat and potatoes.",
    image: "/products/meat-pie.jpeg",
    featured: true,
    badges: ["Bestseller"],
    details: {
      ingredients:
        "Wheat flour, minced meat, potatoes, onions, mixed spices, butter, egg.",
      benefits: "Freshly baked every morning — filling, comforting and made to order.",
      usage: "Best enjoyed warm. Order ahead for events and office lunches.",
    },
  },
  {
    id: "coconut-jam",
    name: "Coconut Jam",
    category: "nutritional-foods",
    price: 25,
    unit: "per jar",
    description: "Rich, creamy coconut jam — perfect on bread or pastries.",
    image: "/products/coconut-jam.jpeg",
    badges: ["New"],
  },
  {
    id: "plantain-chips",
    name: "Crunchy Plantain Chips",
    category: "nutritional-foods",
    price: 12,
    unit: "per pack",
    description: "Thinly sliced, lightly salted plantain chips.",
    image: "/products/plantain-chips.jpeg",
  },
  // Natural Hair Care
  {
    id: "shea-butter-cream",
    name: "Whipped Shea Butter Cream",
    category: "hair-care",
    price: 45,
    unit: "per jar",
    description: "Deeply nourishing shea butter cream for soft, glowing skin.",
    image: "/products/shea-butter-cream.jpeg",
    featured: true,
    badges: ["Bestseller"],
    details: {
      ingredients: "Raw shea butter, coconut oil, vitamin E, natural fragrance.",
      benefits:
        "Locks in moisture for days — ideal for dry hair ends, scalp care and skin.",
      usage:
        "Warm a small amount between palms; smooth into hair ends or scalp, or apply to clean skin after bathing.",
    },
  },
  {
    id: "black-soap",
    name: "Authentic Black Soap",
    category: "hair-care",
    price: 20,
    unit: "per bar",
    description: "Traditional natural black soap for face, body and hair.",
    image: "/products/black-soap.jpeg",
    badges: ["Handmade"],
  },
  {
    id: "lip-balm",
    name: "Natural Lip Balm",
    category: "hair-care",
    price: 10,
    unit: "per tube",
    description: "Moisturising lip balm with a gentle herbal scent.",
    image: "/products/lip-balm.jpeg",
  },
  // Aromatic Natural Spices
  {
    id: "pepper-blend",
    name: "Hot Pepper Blend",
    category: "spices",
    price: 15,
    unit: "per pack",
    description: "Fiery blended peppers for soups, stews and marinades.",
    image: "/products/pepper-blend.jpeg",
    featured: true,
    badges: ["Bestseller"],
  },
  {
    id: "suya-spice",
    name: "Suya Spice",
    category: "spices",
    price: 18,
    unit: "per pack",
    description: "Classic yaji spice mix — great on grilled meats.",
    image: "/products/suya-spice.jpeg",
    details: {
      usage:
        "Rub generously onto grilled meat or chicken; serve with onions, tomatoes and extra pepper.",
    },
  },
  {
    id: "shito",
    name: "Shito Pepper Sauce",
    category: "spices",
    price: 30,
    unit: "per jar",
    description: "Spicy black pepper sauce with smoked fish flavour.",
    image: "/products/shito.jpeg",
    badges: ["New"],
  },
  // More
  {
    id: "liquid-soap",
    name: "Multi-Purpose Liquid Soap",
    category: "more",
    price: 22,
    unit: "per bottle",
    description: "Concentrated liquid soap for home and kitchen.",
    image: "/products/liquid-soap.jpeg",
  },
] as const;

export const getFeaturedProducts = (): readonly Product[] =>
  products.filter((product) => product.featured);

export const findProductBySlug = (slug: string): Product | undefined =>
  products.find((product) => product.id === slug);
