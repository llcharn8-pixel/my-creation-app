import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth";

export async function logActivity(
  contentId: string,
  action: string,
  detail?: string | null,
): Promise<void> {
  const supabase = await createClient();
  const userId = await getCurrentUserId();
  const { error } = await supabase.from("activities").insert({
    content_id: contentId,
    action,
    detail: detail ?? null,
    user_id: userId,
  });
  if (error) console.error(`Failed to log activity (${action}):`, error.message);
}

export async function logAudit(
  action: string,
  targetTable: string,
  targetId: string,
  detail?: string | null,
): Promise<void> {
  const supabase = await createClient();
  const userId = await getCurrentUserId();
  const { error } = await supabase.from("audit_logs").insert({
    action,
    target_table: targetTable,
    target_id: targetId,
    detail: detail ?? null,
    user_id: userId,
  });
  if (error) console.error(`Failed to log audit (${action}):`, error.message);
}
