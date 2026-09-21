import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client — bypasses RLS entirely. Server-only; never import
 * this from a client component or expose the key to the browser. Used
 * exclusively by the admin panel, which gates every call on ADMIN_EMAILS.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
