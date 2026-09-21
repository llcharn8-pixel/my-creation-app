"use client";

import { useTransition } from "react";
import { signOutAction } from "@/app/auth-actions";

export function SignOutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => signOutAction())}
      className="text-sm text-neutral-500 hover:text-neutral-900 hover:underline disabled:opacity-50"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
