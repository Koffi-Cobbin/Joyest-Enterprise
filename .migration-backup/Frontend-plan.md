# Joyest Enterprise: Frontend Plan

Next.js app with a public **Client** interface and a protected **Admin** interface. This document covers the UI, routing, components and frontend delivery. See `2-backend-plan.md` for Supabase, data and security.

## 1. Client brief at a glance

**Joyest Enterprise** (Esther Nerley Nettey, Ablekuma) is a consumer goods brand with three lines: Nutritional Foods (e.g. Tom Brown), Natural Hair Care, and Aromatic Natural Spices.

| Area | What they said |
|---|---|
| Site type / purpose | Business website to establish an online presence |
| Audience | Health-conscious families and busy parents, home cooks and chefs, natural hair care enthusiasts |
| Top 3 goals | Build trust and authenticity, easy product discovery across categories, convert visitors into repeat buyers |
| Features | Contact form, WhatsApp integration, product listings, image/video gallery |
| Special request | Accordion tabs on product pages (ingredients, health benefits, prep/recipe ideas) |
| Reference site | Magic Spoon: quick highlight badges, nutrition facts, recipe ideas, bundle deals |
| Content updates | Both the client and the developer |
| Brand and content | They need help with both; no materials yet |

## 2. Frontend stack

- Next.js (App Router) with TypeScript
- Tailwind CSS and shadcn/ui
- Server components plus ISR for catalog pages (fast and SEO-friendly)
- `next/image` for optimised images (important for mobile users on slower connections)
- Forms: React Hook Form with Zod validation
- Cart state: Zustand or React Context, persisted to `localStorage`
- Analytics: Plausible or GA4, with optional Meta/TikTok pixel

### Suggested structure

```
/app
  /(client)
    page.tsx                 home
    /shop                    all products and category pages
    /product/[slug]
    /bundles
    /recipes, /recipes/[slug]
    /gallery
    /about
    /contact
    /cart, /checkout, /order/[ref]
  /(admin)
    /admin/login
    /admin (dashboard)
    /admin/products, /categories, /bundles, /recipes
    /admin/gallery, /testimonials
    /admin/orders, /inquiries, /subscribers
    /admin/settings, /users
/components   ui, product, cart, admin
/lib          supabase clients, utils, validators
/types
```

## 3. Client interface

1. **Home**
   - Hero with primary CTA
   - Three category tiles (Foods, Hair Care, Spices)
   - Trust strip (natural, locally sourced, no preservatives; confirm claims with client)
   - Featured products, bundle deals, recipe highlights
   - Testimonials
   - TikTok / YouTube embeds
   - WhatsApp CTA
2. **Shop and category pages**
   - Product grid with highlight badges on cards
   - Filters (category, concern, e.g. "hair growth" or "protein-rich") and search
3. **Product page**
   - Image gallery and variant selector (size/weight)
   - Quick-glance badges (the Magic Spoon pattern)
   - **Accordion tabs:** Ingredients, Health Benefits, How to Prepare / Use, Recipe Ideas
   - Add to cart and "Order via WhatsApp"
   - Related products and bundles
4. **Bundles:** dedicated page showing savings clearly
5. **Recipes:** listing and detail pages, each with a "shop this recipe" product link
6. **Gallery:** images and videos
7. **About / Our Story:** founder story, sourcing, process (key for the trust goal)
8. **Contact:** form, WhatsApp button, location/map, FAQ
9. **Cart and checkout (guest)**
   - Order summary and customer details form
   - Confirmation page with order reference
   - Pre-filled WhatsApp message to the business

### Cross-cutting requirements

- Mobile-first design (most visitors will be on phones)
- Accessibility: WCAG AA contrast, keyboard navigation, alt text
- SEO: metadata per page, sitemap, `robots.txt`, JSON-LD `Product` and `Recipe` schema
- Performance targets: Lighthouse 90+ on mobile
- Floating WhatsApp button on all public pages
- Cookie/consent banner only if tracking pixels are added

## 4. Admin interface (UI)

- **Login:** email/password or magic link; redirect to `/admin`
- **Dashboard:** new orders, unread inquiries, quick links
- **Products:** table with search/filter; form with image drag-and-drop reordering, variants, badges, accordion content editor, draft/publish, duplicate
- **Categories, bundles, recipes, gallery, testimonials:** simple CRUD pages with image/video upload and previews
- **Orders:** status filters, detail view, status and payment toggles, internal notes, "message customer on WhatsApp" button, CSV export
- **Inquiries and subscribers:** inbox style, mark as read, export
- **Site settings:** WhatsApp number, hero text and images, announcement bar, social links, delivery info
- **Users:** invite and manage staff (owner only)
- **Design principle:** the client is non-technical, so use plain labels, helpful empty states, image previews, and confirmation before destructive actions

## 5. Design direction (pending brand work)

The client has no brand identity yet. Until that is agreed:

- Warm, earthy palette (greens, golds, deep browns) suited to natural wellness
- Clean typography, with generous whitespace and strong product photography
- Reusable tokens in Tailwind config so a brand update is a quick change

## 6. Frontend delivery phases

| Phase | Work | Est. time |
|---|---|---|
| 0. Discovery | Confirm sitemap, collect content, agree design direction | 3–5 days |
| 1. Foundations | Repo, Tailwind and shadcn setup, layout, design tokens | 2–3 days |
| 2. Admin UI | Layout, auth screens, products and settings screens | 5–6 days |
| 3. Storefront | Home, shop, product page with accordions, contact | 6–8 days |
| 4. Cart and orders UI | Cart, checkout, confirmation, WhatsApp message, admin orders | 4–5 days |
| 5. Content features | Recipes, bundles, gallery, testimonials | 4–5 days |
| 6. QA and launch | SEO, accessibility, performance, cross-device testing, client training | 4–5 days |

Frontend and backend phases run in parallel; combined timeline is roughly 5–7 weeks, depending on how quickly the client supplies content.
