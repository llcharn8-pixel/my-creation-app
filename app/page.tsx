import Link from "next/link";
import { getContentPieces } from "@/lib/data/content";

export default async function LibraryPage() {
  const pieces = await getContentPieces();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Library</h1>
          <p className="text-sm text-neutral-500">
            {pieces.length} piece{pieces.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          New piece
        </Link>
      </div>

      {pieces.length === 0 ? (
        <div className="rounded-md border border-dashed border-neutral-300 px-6 py-12 text-center">
          <p className="text-neutral-600">No content yet. Create your first piece.</p>
          <Link
            href="/new"
            className="mt-4 inline-block rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            New piece
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-neutral-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-4 py-2 font-medium">Title</th>
                <th className="px-4 py-2 font-medium">Topic</th>
                <th className="px-4 py-2 font-medium">Format</th>
                <th className="px-4 py-2 font-medium">Status</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
