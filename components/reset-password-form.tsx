"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none";

export function ResetPasswordForm() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Supabase's default recovery email redirects here with the session
    // tokens in the URL fragment; the browser client picks them up
    // automatically and fires PASSWORD_RECOVERY once that happens.
    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });

    // Fallback in case the event fired before this listener was attached.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setPending(false);

    if (error) {
      setError(error.message);
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/"), 1500);
  }

  if (done) {
    return (
      <div className="rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
        Password updated. Redirecting…
      </div>
    );
  }

  if (!ready) {
    return (
      <p className="text-center text-sm text-neutral-500">
        Verifying your reset link…
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          role="alert"
          className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="password">
          New password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="confirm">
          Confirm password
        </label>
        <input
          id="confirm"
          type="password"
          required
          minLength={6}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
