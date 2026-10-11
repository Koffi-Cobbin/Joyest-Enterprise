# Joyest Enterprise

An imported Ghanaian storefront for nutritional foods, natural hair care, and aromatic spices.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/joyest run typecheck` — check the Joyest web artifact
- `pnpm --filter @workspace/api-server run typecheck` — check the API server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required app secrets: `SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Optional app configuration: `ADMIN_NOTIFICATION_EMAIL`, `RESEND_FROM_EMAIL`, `WHATSAPP_NUMBER`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/joyest/` — Vite storefront and imported brand assets
- `artifacts/api-server/src/routes/joyest.ts` — migrated catalog, orders, contact, and admin APIs
- `.migration-backup/` — untouched imported Vercel source, including its Supabase migration

## Architecture decisions

- Keep the existing Supabase backend; the API artifact talks to it directly instead of migrating its schema into the workspace database.

## Product

The source import contains a short home page and storefront shell. It also includes catalog, checkout, contact, and admin API routes; storefront subpages were not included in the import.

## User preferences

No additional preferences recorded.

## Gotchas

Configure the Supabase secrets before expecting live catalog, order, contact, or admin data.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
