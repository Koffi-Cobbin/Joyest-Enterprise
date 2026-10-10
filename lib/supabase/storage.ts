import "server-only";
import { getPublicSupabaseClient } from "@/lib/supabase/public";

export function getPublicMediaUrl(path: string | null | undefined, bucket = "catalog") {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const { data } = getPublicSupabaseClient().storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
