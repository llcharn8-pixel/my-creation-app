import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentPiece } from "@/lib/data/content";
import { getTopics } from "@/lib/data/topics";
import { StudioForm } from "@/components/studio-form";
import { updatePieceAction } from "@/app/actions";

export default async function EditPiecePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [piece, topics] = await Promise.all([getContentPiece(id), getTopics()]);

  if (!piece) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-neutral-500 hover:underline">
          ← Back to library
        </Link>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Edit piece</h1>
      </div>

      <StudioForm
        topics={topics}
        piece={piece}
        action={updatePieceAction.bind(null, id)}
        publishLabel="Save & publish"
      />
    </div>
  );
}
