import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth";
import type { Topic } from "@/lib/types";

export async function getTopics(): Promise<Topic[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(`Failed to load topics: ${error.message}`);
  return data ?? [];
}

export async function createTopic(input: {
  name: string;
  description?: string | null;
}): Promise<Topic> {
  const supabase = await createClient();
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("topics")
    .insert({
      name: input.name,
      description: input.description ?? null,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create topic: ${error.message}`);
  return data;
}
