"use client";

import { useTransition } from "react";
import { deletePieceAction } from "@/app/actions";

export function DeleteButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(`Delete "${title}"? This can't be undone.`)) {
          startTransition(() => {
            void deletePieceAction(id, new FormData());
          });
        }
      }}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
