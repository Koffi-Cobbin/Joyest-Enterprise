import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

export function getPublicSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Add SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to Replit Secrets.");
  client ??= createClient(url, key, { auth: { persistSession: false } });
  return client;
}
