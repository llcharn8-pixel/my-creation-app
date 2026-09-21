"use client";

import { useTransition } from "react";
import { adminClaimPieceAction } from "@/app/admin-actions";

export function AdminClaimButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          void adminClaimPieceAction(id, new FormData());
        });
      }}
      className="text-sm text-neutral-700 hover:underline disabled:opacity-50"
    >
      {pending ? "Claiming…" : "Claim"}
    </button>
  );
}
