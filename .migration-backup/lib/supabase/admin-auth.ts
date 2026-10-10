import "server-only";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";
import { getSessionSupabaseClient } from "@/lib/supabase/server";

export async function getAdminContext() {
  const sessionClient = await getSessionSupabaseClient();
  const { data: { user }, error: authError } = await sessionClient.auth.getUser();
  if (authError || !user) return null;

  const adminClient = getAdminSupabaseClient();
  const { data: profile, error: profileError } = await adminClient
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError || !profile) return null;
  return { user, profile, supabase: adminClient };
}
