"use client";

import { useTransition } from "react";
import { adminDeletePieceAction } from "@/app/admin-actions";

export function AdminDeleteButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(`Delete "${title}"? This can't be undone.`)) {
          startTransition(() => {
            void adminDeletePieceAction(id, new FormData());
          });
        }
      }}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
