"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/app/actions";
import { createTopicAction } from "@/app/actions";

const initialState: ActionResult = { ok: true };

export function TopicForm() {
  const [state, formAction, pending] = useActionState(
    createTopicAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-md border border-neutral-200 p-4 sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label className="mb-1 block text-sm font-medium" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="e.g. Parenting"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
        />
      </div>
      <div className="flex-1">
        <label className="mb-1 block text-sm font-medium" htmlFor="description">
          Description
        </label>
        <input
          id="description"
          name="description"
          placeholder="Optional"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add topic"}
      </button>
      {state.ok === false && (
        <p role="alert" className="text-sm text-red-700 sm:basis-full">
          {state.error}
        </p>
      )}
    </form>
  );
}
