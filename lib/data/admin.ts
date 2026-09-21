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
