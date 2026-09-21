import Link from "next/link";
import type { ContentPiece } from "@/lib/types";
import { DeleteButton } from "@/components/delete-button";
import { PublishButton } from "@/components/publish-button";

export function LibraryTable({ pieces }: { pieces: ContentPiece[] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-neutral-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-neutral-50 text-neutral-600">
          <tr>
            <th className="px-4 py-2 font-medium">Title</th>
            <th className="px-4 py-2 font-medium">Topic</th>
            <th className="px-4 py-2 font-medium">Format</th>
            <th className="px-4 py-2 font-medium">Status</th>
            <th className="px-4 py-2 font-medium">Score</th>
            <th className="px-4 py-2 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pieces.map((piece) => (
            <tr key={piece.id} className="border-t border-neutral-200">
              <td className="px-4 py-2 font-medium">{piece.title}</td>
              <td className="px-4 py-2 text-neutral-600">
                {piece.topics?.name ?? "—"}
              </td>
              <td className="px-4 py-2 text-neutral-600">{piece.format}</td>
              <td className="px-4 py-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    piece.status === "published"
                      ? "bg-green-100 text-green-800"
                      : "bg-neutral-100 text-neutral-700"
                  }`}
                >
                  {piece.status}
                </span>
              </td>
              <td className="px-4 py-2 text-neutral-600">{piece.score ?? 0}</td>
              <td className="px-4 py-2">
                <div className="flex items-center justify-end gap-3">
                  <Link
                    href={`/${piece.id}/edit`}
                    className="text-sm text-neutral-700 hover:underline"
                  >
                    Edit
                  </Link>
                  {piece.status === "draft" && <PublishButton id={piece.id} />}
                  <DeleteButton id={piece.id} title={piece.title} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
