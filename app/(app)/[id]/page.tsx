import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentPiece } from "@/lib/data/content";
import { DeleteButton } from "@/components/delete-button";
import { PublishButton } from "@/components/publish-button";

function Field({
  label,
  value,
  source,
  confidence,
}: {
  label: string;
  value: string | null;
  source?: string | null;
  confidence?: number | null;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-neutral-700">{label}</h3>
        {source === "ai" && (
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
            AI{confidence != null ? ` · ${Math.round(confidence * 100)}%` : ""}
          </span>
        )}
      </div>
      <p className="mt-1 whitespace-pre-wrap text-sm text-neutral-900">
        {value || <span className="text-neutral-400">—</span>}
      </p>
    </div>
  );
}

export default async function ViewPiecePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const piece = await getContentPiece(id);
  if (!piece) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/" className="text-sm text-neutral-500 hover:underline">
          ← Back to library
        </Link>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight">{piece.title}</h1>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              piece.status === "published"
                ? "bg-green-100 text-green-800"
                : "bg-neutral-100 text-neutral-700"
            }`}
          >
            {piece.status}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-neutral-500">
        <span>Topic: {piece.topics?.name ?? "—"}</span>
        <span>Format: {piece.format}</span>
        <span>Media: {piece.media_type}</span>
        <span>Audience: {piece.audience || "—"}</span>
        <span>Score: {piece.score ?? 0}</span>
      </div>

      <div className="space-y-4 rounded-md border border-neutral-200 p-4">
        <Field label="Breakthrough angle" value={piece.breakthrough_angle} />
      </div>

      <div className="space-y-4 rounded-md border border-neutral-200 p-4">
        <Field
          label="Hook"
          value={piece.hook}
          source={piece.hook_source}
          confidence={piece.hook_confidence}
        />
        <Field
          label="Body"
          value={piece.body}
          source={piece.body_source}
          confidence={piece.body_confidence}
        />
        <Field
          label="CTA"
          value={piece.cta}
          source={piece.cta_source}
          confidence={piece.cta_confidence}
        />
      </div>

      <div className="flex items-center gap-4">
        <Link
          href={`/${piece.id}/edit`}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Edit
        </Link>
        {piece.status === "draft" && <PublishButton id={piece.id} />}
        <DeleteButton id={piece.id} title={piece.title} />
      </div>
    </div>
  );
}
