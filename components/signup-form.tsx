"use client";

import { useActionState } from "react";
import { signUpAction, type SignUpResult } from "@/app/auth-actions";

const initialState: SignUpResult = { ok: true };

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signUpAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.ok === false && (
        <div
          role="alert"
          className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      )}
      {state.ok === true && state.message && (
        <div className="rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
          {state.message}
        </div>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {pending ? "Signing up…" : "Sign up"}
      </button>
    </form>
  );
}
