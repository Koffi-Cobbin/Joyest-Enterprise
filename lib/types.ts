export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_path: string | null;
  sort_order: number;
};

export type ProductVariant = {
  id: string;
  label: string;
  price: number;
  in_stock: boolean;
};

export type ProductImage = {
  id: string;
  storage_path: string;
  alt: string;
  sort_order: number;
};

export type ProductDetails = {
  ingredients: string | null;
  benefits: string | null;
  usage: string | null;
  nutrition: Record<string, string | number>;
};

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  short_desc: string | null;
  description: string | null;
  base_price: number;
  status: "draft" | "published";
  badges: string[];
  is_featured: boolean;
  categories?: Pick<Category, "name" | "slug"> | null;
  product_images?: ProductImage[];
  product_variants?: ProductVariant[];
  product_details?: ProductDetails | ProductDetails[] | null;
};

export type Bundle = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image_path: string | null;
};

export type Recipe = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  ingredients: string[] | { name: string; quantity?: string }[];
  steps: string[] | { text: string }[];
  image_path: string | null;
};

export type GalleryItem = {
  id: string;
  type: "image" | "video";
  storage_path: string | null;
  embed_url: string | null;
  caption: string | null;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  photo_path: string | null;
};

export type CartItem = {
  productId: string;
  variantId: string | null;
  name: string;
  slug: string;
  variantLabel: string | null;
  unitPrice: number;
  imageUrl: string | null;
  quantity: number;
};
