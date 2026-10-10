import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

export function getAdminSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to Replit Secrets.");
  client ??= createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  return client;
}
