import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth";
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

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getContentPiece(
  id: string,
): Promise<ContentPiece | null> {
  // Any non-UUID id (e.g. a browser requesting /favicon.ico, which falls
  // through to this dynamic route when no static file matches) should be
  // treated as "not found", not a database error.
  if (!UUID_RE.test(id)) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_pieces")
    .select("*, topics(name)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Failed to load piece: ${error.message}`);
  return data as unknown as ContentPiece | null;
}

export async function createContentPiece(
  input: ContentPieceInput,
): Promise<ContentPiece> {
  const supabase = await createClient();
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("content_pieces")
    .insert({ ...input, user_id: userId })
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
