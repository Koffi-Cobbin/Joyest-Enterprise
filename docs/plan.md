# Joyest Enterprise — Web Shop Build Plan

**Business:** Joyest Enterprise (brand name: **Joyest**, rebranded from Esthee on 2026-10-11) — local shop selling Nutritional Foods, Natural Hair Care, and Aromatic Natural Spices (client's three core verticals, per project enquiry 2026-10-09), plus a "More" catch-all for products she plans to add later.
**Status:** Approved — ready to build
**Created:** 2026-01-09 (updated: 2026-10-11)
**Tracking:** See [task-log.md](task-log.md)

---

## 1. Goals

- Simple, fast, mobile-first website for Joyest.
- Showcase the product catalog by category (Nutritional Foods, Natural Hair Care, Aromatic Spices, More).
- Customers order by contacting the seller directly — **WhatsApp, phone, or email** (no payment/checkout backend).
- Owner can edit products, prices, and contact details in plain TypeScript files.

## 2. Key Decisions (approved)

| Decision | Choice | Why |
|----------|--------|-----|
| Brand palette | **Market Spice** (see §3) | Warm & appetizing for foods/spices, premium enough for hair care; passes WCAG AA |
| Ordering flow | **Cart → WhatsApp message** | Customer builds a cart, one button opens WhatsApp with the full order pre-written. Zero backend |
| Data | Static TS data files (`data/`) | No database needed; owner edits one file to update catalog |
| Framework | Next.js (App Router) + TypeScript | Plan requirement; current version to be verified via docs lookup before scaffolding |
| Styling | Tailwind CSS (installed as package) | Project styling standard targets plain HTML via CDN; in Next.js the package is the correct equivalent |

## 3. Brand Colors — "Joyest Everyday Editorial" (rebranded 2026-10-11)

Palette borrowed from the Joyest Enterprise reference app; contrast-checked WCAG AA.

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary | Deep Leaf Green | `#334B3C` | Buttons, links, highlights |
| Primary (dark) | Ink | `#28352D` | Hover states, text-on-light |
| Secondary | Ink | `#28352D` | Header/footer, dark bands, headings |
| Accent | Sun Gold | `#CF9251` | Badges, announcement bar, micro-labels |
| Clay | Clay | `#B96D4B` | Decorative highlights |
| Background | Cream | `#FBF8EF` | Page background |
| Surface | White | `#FFFFFF` | Cards/panels |
| Text | Ink | `#28352D` | Body text |
| Muted | Leaf Gray | `#5F6F63` | Secondary text |

**Rules:** defined as semantic CSS custom properties (`--color-primary`, …) mapped into the Tailwind theme — no hardcoded colors in components. Contrast: white on primary ≈ 9.6:1 (WCAG AA ✅); ink on cream ≈ 12:1 ✅; muted on cream ≈ 5:1 ✅.

**Typography:** Google Fonts — headings: *Newsreader* (display serif); body: *DM Sans*; UI micro-labels: *Manrope* (`font-ui`). Editorial motifs: film-grain overlay, reveal-on-scroll, vertical micro-labels — all with `prefers-reduced-motion` support.

## 4. Pages & Features

| Route | Contents |
|-------|----------|
| `/` Home | Hero, category tiles (Nutritional Foods, Natural Hair Care, Aromatic Spices, More), featured products, story teaser, contact CTA |
| `/shop` | Full catalog, category filter tabs, product cards (image, name, price, description, "Add to cart") |
| `/about` | Joyest's story and values |
| `/contact` | WhatsApp / phone / email buttons, contact form (mailto compose), business hours, location, map placeholder |

**Shared components:** responsive header/nav (mobile menu), footer, floating WhatsApp button, cart drawer/summary, SEO metadata + Open Graph.

**Ordering flow:**
1. Customer adds products to cart (client-side state).
2. Cart shows items, quantities, total.
3. "Order on WhatsApp" builds a plain-text order message (pure function in `lib/order.ts`) and opens `https://wa.me/<number>?text=<encoded>`.
4. Alternate actions: `tel:` call link and `mailto:` email link with same prefilled order body.

## 5. Project Structure

```
app/
  layout.tsx          # Fonts, metadata, header/footer
  page.tsx            # Home
  globals.css         # Theme tokens (brand colors)
  shop/page.tsx       # Catalog + filters
  about/page.tsx
  contact/page.tsx
components/
  Header.tsx, Footer.tsx, Hero.tsx,
  ProductCard.tsx, CategoryFilter.tsx,
  CartDrawer.tsx, ContactButtons.tsx, WhatsAppButton.tsx, ...
data/
  products.ts         # id, name, category, price, description, image
  categories.ts       # Nutritional Foods, Natural Hair Care, Aromatic Spices, More
  business.ts         # name, WhatsApp number, phone, email, hours, address
lib/
  order.ts            # Pure functions: build order message, format prices
  cart.ts             # Cart state helpers (immutable per code standards)
docs/
  plan.md             # This file
  task-log.md         # Progress tracking
```

## 6. Build Phases

| # | Phase | Deliverable |
|---|-------|-------------|
| 1 | Scaffold | Next.js + TypeScript + Tailwind app; brand tokens; fonts; **verify current Next.js docs first (ExternalScout)** |
| 2 | Data layer | `data/products.ts`, `categories.ts`, `business.ts` with sample catalog + placeholder contact info |
| 3 | Layout | Header/nav (mobile-first), footer, theme applied |
| 4 | Home | Hero, categories, featured products, CTAs |
| 5 | Shop | Catalog grid + category filtering + add-to-cart |
| 6 | About + Contact | Both pages complete |
| 7 | Ordering | Cart drawer, `lib/order.ts` message builder, WhatsApp/phone/email integration |
| 8 | Polish & validate | Responsive (375/768/1024/1440px), accessibility (semantic HTML, focus states, 44px touch targets), SEO metadata, `next build` passes |

Each phase ends with validation; failures are reported before any fix is applied (stop-on-failure rule).

## 7. Out of Scope (v1)

- Online payment / checkout
- User accounts, database, CMS
- Real product photography (styled placeholders used; clear slots for real images later)

**Future ideas:** real photos, CMS or admin edit page, delivery info, product reviews, deployment (Vercel).

## 8. Open Items (need from owner)

- [ ] Real WhatsApp number, phone, email → fill into `data/business.ts` (placeholders used meanwhile)
- [ ] Business hours and address
- [ ] Product photos
- [ ] Actual product list & prices (sample catalog used to start)
