import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";

// Storefront only — /admin is intentionally excluded (password-gated, noindex).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const pages = ["/", "/shop", "/about", "/contact"].map((path) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
  }));

  const productPages = products.map((product) => ({
    url: `${SITE_URL}/shop/${product.id}`,
  }));

  return [...pages, ...productPages];
}
