# Joyest Enterprise

An imported Ghanaian storefront for nutritional foods, natural hair care, and aromatic spices.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/joyest run typecheck` — check the Joyest web artifact
- `pnpm --filter @workspace/api-server run typecheck` — check the API server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- Required app secrets: `SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Optional app configuration: `ADMIN_NOTIFICATION_EMAIL`, `RESEND_FROM_EMAIL`, `WHATSAPP_NUMBER`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Web: React and Vite
- API: Express 5, Supabase JavaScript client and SSR
- Validation: Zod
- API build: esbuild

## Where things live

- `artifacts/joyest/` — Vite storefront and imported brand assets
- `artifacts/api-server/src/routes/joyest.ts` — migrated catalog, orders, contact, and admin APIs
- `artifacts/api-server/supabase/migrations/202610100001_initial_schema.sql` — Supabase schema setup
- `.migration-backup/` — untouched imported Vercel source

## Architecture decisions

- Keep the existing Supabase backend; the API artifact talks to it directly instead of migrating its schema into the workspace database.

## Product

The source import contains a short home page and storefront shell. It also includes catalog, checkout, contact, and admin API routes; storefront subpages were not included in the import.

## User preferences

No additional preferences recorded.

## Gotchas

Apply the included initial migration once in the linked Supabase project before expecting live catalog, order, contact, or admin data. It creates tables, policies, storage buckets, and default categories; don't rerun it against a project where it was already applied.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
