import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getCurrentUserId(): Promise<string> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in.");
  return user.id;
}
