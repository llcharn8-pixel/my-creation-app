"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AuthResult = { ok: true } | { ok: false; error: string };
export type SignUpResult =
  | { ok: true; message?: string }
  | { ok: false; error: string };

export async function signInAction(
  _prevState: AuthResult,
  formData: FormData,
): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/");
  redirect("/");
}

export async function signUpAction(
  _prevState: SignUpResult,
  formData: FormData,
): Promise<SignUpResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }
  if (password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { ok: false, error: error.message };

  if (data.session) {
    revalidatePath("/");
    redirect("/");
  }

  return {
    ok: true,
    message: "Check your email to confirm your account, then log in.",
  };
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/login");
}

export type ForgotPasswordResult =
  | { ok: true; submitted?: boolean }
  | { ok: false; error: string };

export async function requestPasswordResetAction(
  _prevState: ForgotPasswordResult,
  formData: FormData,
): Promise<ForgotPasswordResult> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { ok: false, error: "Email is required." };

  const supabase = await createClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/reset-password`,
  });
  // Supabase doesn't reveal whether the email exists (avoids enumeration),
  // so an error here is something else going wrong (rate limit, etc.).
  if (error) return { ok: false, error: error.message };

  return { ok: true, submitted: true };
}
