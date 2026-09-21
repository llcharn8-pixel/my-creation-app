import type { ContentPiece } from "@/lib/types";
import { AdminDeleteButton } from "@/components/admin-delete-button";

export function AdminTable({ pieces }: { pieces: ContentPiece[] }) {
  if (pieces.length === 0) {
    return <p className="text-sm text-neutral-500">No content pieces exist yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-md border border-neutral-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-neutral-50 text-neutral-600">
          <tr>
            <th className="px-4 py-2 font-medium">Title</th>
            <th className="px-4 py-2 font-medium">Owner</th>
            <th className="px-4 py-2 font-medium">Topic</th>
            <th className="px-4 py-2 font-medium">Status</th>
            <th className="px-4 py-2 font-medium">Score</th>
            <th className="px-4 py-2 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pieces.map((piece) => (
            <tr key={piece.id} className="border-t border-neutral-200">
              <td className="px-4 py-2 font-medium">{piece.title}</td>
              <td className="px-4 py-2 font-mono text-xs text-neutral-500">
                {piece.user_id ?? (
                  <span className="italic text-amber-700">
                    unowned (legacy demo)
                  </span>
                )}
              </td>
              <td className="px-4 py-2 text-neutral-600">
                {piece.topics?.name ?? "—"}
              </td>
              <td className="px-4 py-2 text-neutral-600">{piece.status}</td>
              <td className="px-4 py-2 text-neutral-600">{piece.score ?? 0}</td>
              <td className="px-4 py-2 text-right">
                <AdminDeleteButton id={piece.id} title={piece.title} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
