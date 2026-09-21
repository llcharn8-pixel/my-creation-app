"use client";

import { useTransition } from "react";
import { publishPieceAction } from "@/app/actions";

export function PublishButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm("Publish this piece?")) {
          startTransition(() => {
            void publishPieceAction(id, new FormData());
          });
        }
      }}
      className="text-sm text-neutral-700 hover:underline disabled:opacity-50"
    >
      {pending ? "Publishing…" : "Publish"}
    </button>
  );
}
