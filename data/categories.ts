export type CategoryId =
  | "nutritional-foods"
  | "hair-care"
  | "spices"
  | "more";

/** Client's three core verticals (project enquiry, 2026-10-09) + "More" catch-all for future products */
export type Category = {
  id: CategoryId;
  name: string;
  description: string;
  /** Tile photo (e.g. "/products/nutritional-foods.webp"); branded gradient tile shown until set */
  image?: string;
};

export const categories: readonly Category[] = [
  {
    id: "nutritional-foods",
    name: "Nutritional Foods",
    description: "Nourishing homemade foods for everyday wellness",
    image: "/products/nutritional-foods.webp",
  },
  {
    id: "hair-care",
    name: "Natural Hair Care",
    description: "Natural care for healthy hair and skin",
    image: "/products/hair-care.jpeg",
  },
  {
    id: "spices",
    name: "Aromatic Spices",
    description: "Aromatic natural spices and flavour boosters",
    image: "/products/spices.jpeg",
  },
  {
    id: "more",
    name: "More",
    description: "Household goods and everything in between",
    image: "/products/more.webp",
  },
] as const;
