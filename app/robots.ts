import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// The admin area is password-gated (HMAC session + requireAdmin). Every admin
// route also emits `robots: { index: false, follow: false }` via
// app/admin/layout.tsx, so indexing is blocked at the page level too —
// robots.txt is a second, crawler-facing layer, not the only guard.
const ADMIN_RULES = [
  { userAgent: "Googlebot", allow: "/", disallow: "/admin" },
  { userAgent: "Bingbot", allow: "/", disallow: "/admin" },
  { userAgent: "GPTBot", allow: "/", disallow: "/admin" },
  { userAgent: "ClaudeBot", allow: "/", disallow: "/admin" },
  { userAgent: "*", allow: "/", disallow: "/admin" },
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: ADMIN_RULES,
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
