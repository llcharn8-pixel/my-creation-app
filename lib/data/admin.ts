import { createAdminClient } from "@/lib/supabase/admin";
import type { ContentPiece } from "@/lib/types";

export async function getAllContentPiecesForAdmin(): Promise<ContentPiece[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("content_pieces")
    .select("*, topics(name)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to load admin content: ${error.message}`);
  return (data ?? []) as unknown as ContentPiece[];
}

export async function adminDeleteContentPiece(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("content_pieces").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete piece: ${error.message}`);
}

/**
 * Reassigns an unowned legacy piece (and its topic, if that's also unowned)
 * to the given user, so it becomes a normal owned row they can edit through
 * the regular app — not just view/delete from the admin panel.
 */
export async function adminClaimContentPiece(
  id: string,
  userId: string,
): Promise<void> {
  const supabase = createAdminClient();

  const { data: piece, error: fetchError } = await supabase
    .from("content_pieces")
    .select("topic_id")
    .eq("id", id)
    .single();
  if (fetchError) throw new Error(`Failed to load piece: ${fetchError.message}`);

  if (piece?.topic_id) {
    const { data: topic } = await supabase
      .from("topics")
      .select("user_id")
      .eq("id", piece.topic_id)
      .maybeSingle();
    if (topic && !topic.user_id) {
      await supabase
        .from("topics")
        .update({ user_id: userId })
        .eq("id", piece.topic_id);
    }
  }

  const { error } = await supabase
    .from("content_pieces")
    .update({ user_id: userId })
    .eq("id", id);
  if (error) throw new Error(`Failed to claim piece: ${error.message}`);
}
