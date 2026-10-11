import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

/**
 * Server-side Supabase clients (no @supabase/ssr — no user auth in this app).
 * Both return null when env vars are missing so the site falls back to the
 * static catalog files and never breaks in dev/build.
 *
 * `ws` is passed as the realtime transport: supabase-js 2.117 requires a
 * WebSocket implementation on Node < 22 even though this app never subscribes
 * to realtime channels. The cast below skips a TS-only signature mismatch
 * between ws and realtime-js's WebSocketLikeConstructor.
 */

type ClientOptions = NonNullable<Parameters<typeof createClient>[2]>;

const clientOptions = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  realtime: { transport: WebSocket },
} as unknown as ClientOptions;

/** Public reads (anon key, RLS-protected) */
export const supabaseServer = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, clientOptions);
};

/** Server-only writes (service_role, bypasses RLS) — route handlers only */
export const supabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, clientOptions);
};
