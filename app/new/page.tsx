import Link from "next/link";
import { StudioForm } from "@/components/studio-form";
import { getTopics } from "@/lib/data/topics";
import { createPieceAction } from "@/app/actions";

export default async function NewPiecePage() {
  const topics = await getTopics();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-neutral-500 hover:underline">
          ← Back to library
        </Link>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">New piece</h1>
        <p className="text-sm text-neutral-500">
          Pick a topic, format and audience, then write the breakthrough angle,
          hook, body and CTA.
        </p>
      </div>

      <StudioForm topics={topics} action={createPieceAction} />
    </div>
  );
}
