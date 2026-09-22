import Link from "next/link";
import type { ContentPiece } from "@/lib/types";

export function TopPieces({ pieces }: { pieces: ContentPiece[] }) {
  if (pieces.length === 0) return null;

  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
      <h2 className="mb-2 text-sm font-semibold text-amber-900">
        Top 3 by score
      </h2>
      <ol className="space-y-1">
        {pieces.map((p, i) => (
          <li key={p.id} className="flex items-center justify-between text-sm">
            <span className="min-w-0 truncate">
              <span className="mr-2 font-semibold text-amber-700">#{i + 1}</span>
              <Link href={`/${p.id}`} className="hover:underline">
                {p.title}
              </Link>
            </span>
            <span className="ml-2 shrink-0 font-medium text-amber-800">
              {p.score ?? 0}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
