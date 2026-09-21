import { createClient } from "@/lib/supabase/server";
import type { ContentPiece, ContentPieceInput } from "@/lib/types";

export type ContentFilters = {
  status?: string;
  topicId?: string;
  search?: string;
};

export async function getContentPieces(
  filters: ContentFilters = {},
): Promise<ContentPiece[]> {
  const supabase = await createClient();
  let query = supabase
    .from("content_pieces")
    .select("*, topics(name)")
    .order("score", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.topicId) query = query.eq("topic_id", filters.topicId);
  if (filters.search) query = query.ilike("title", `%${filters.search}%`);

  const { data, error } = await query;
  if (error) throw new Error(`Failed to load content: ${error.message}`);
  return (data ?? []) as unknown as ContentPiece[];
}

export async function getContentPiece(
  id: string,
): Promise<ContentPiece | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_pieces")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Failed to load piece: ${error.message}`);
  return data;
}

export async function createContentPiece(
  input: ContentPieceInput,
): Promise<ContentPiece> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_pieces")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(`Failed to create piece: ${error.message}`);
  return data;
}

export async function updateContentPiece(
  id: string,
  input: Partial<ContentPieceInput>,
): Promise<ContentPiece> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_pieces")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update piece: ${error.message}`);
  return data;
}

export async function deleteContentPiece(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("content_pieces").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete piece: ${error.message}`);
}
