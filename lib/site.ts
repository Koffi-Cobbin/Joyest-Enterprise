/** Canonical site URL — single source of truth for metadata, sitemap, robots, OG.
 * Swap to the custom domain here once one is bought. */
export const SITE_URL = "https://joyest.vercel.app";

export const getSiteUrl = (path = "/"): string =>
  new URL(path, SITE_URL).toString();
