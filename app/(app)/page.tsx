import Link from "next/link";
import { getContentPieces } from "@/lib/data/content";
import { getTopics } from "@/lib/data/topics";
import { LibraryTable } from "@/components/library-table";
import { TopPieces } from "@/components/top-pieces";

type SearchParams = { status?: string; topic?: string; q?: string };

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { status, topic, q } = await searchParams;
  const [pieces, topics, allPieces] = await Promise.all([
    getContentPieces({ status, topicId: topic, search: q }),
    getTopics(),
    getContentPieces(),
  ]);

  const hasFilters = Boolean(status || topic || q);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
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

      <TopPieces pieces={allPieces.slice(0, 3)} />

      <form action="/" method="get" className="flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-600" htmlFor="q">
            Search
          </label>
          <input
            id="q"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search title…"
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm focus:border-neutral-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-600" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status ?? ""}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
          >
            <option value="">All</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-600" htmlFor="topic">
            Topic
          </label>
          <select
            id="topic"
            name="topic"
            defaultValue={topic ?? ""}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
          >
            <option value="">All</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50"
        >
          Filter
        </button>
        {hasFilters && (
          <Link href="/" className="text-sm text-neutral-500 hover:underline">
            Clear
          </Link>
        )}
      </form>

      {pieces.length === 0 ? (
        <div className="rounded-md border border-dashed border-neutral-300 px-6 py-12 text-center">
          {hasFilters ? (
            <>
              <p className="text-neutral-600">No pieces match your filters.</p>
              <Link href="/" className="mt-4 inline-block text-sm text-neutral-700 hover:underline">
                Clear filters
              </Link>
            </>
          ) : (
            <>
              <p className="text-neutral-600">No content yet. Create your first piece.</p>
              <Link
                href="/new"
                className="mt-4 inline-block rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
              >
                New piece
              </Link>
            </>
          )}
        </div>
      ) : (
        <LibraryTable pieces={pieces} />
      )}
    </div>
  );
}
