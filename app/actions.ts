"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createContentPiece,
  updateContentPiece,
  deleteContentPiece,
  getContentPiece,
} from "@/lib/data/content";
import { logActivity, logAudit } from "@/lib/data/activities";
import { createTopic } from "@/lib/data/topics";
import type {
  ContentPieceInput,
  ContentFormat,
  MediaType,
  ContentStatus,
  FieldSource,
} from "@/lib/types";

export type ActionResult = { ok: true } | { ok: false; error: string };

function parsePieceInput(formData: FormData): ContentPieceInput {
  const status = (formData.get("status") as ContentStatus) || "draft";
  const asSource = (v: FormDataEntryValue | null): FieldSource | null =>
    v === "ai" || v === "user" ? v : null;

  return {
    title: String(formData.get("title") ?? "").trim(),
    topic_id: (formData.get("topic_id") as string) || null,
    format: (formData.get("format") as ContentFormat) || "post",
    media_type: (formData.get("media_type") as MediaType) || "text",
    audience: (formData.get("audience") as string) || null,
    breakthrough_angle: (formData.get("breakthrough_angle") as string) || null,
    hook: (formData.get("hook") as string) || null,
    body: (formData.get("body") as string) || null,
    cta: (formData.get("cta") as string) || null,
    status,
    hook_source: asSource(formData.get("hook_source")),
    body_source: asSource(formData.get("body_source")),
    cta_source: asSource(formData.get("cta_source")),
    review_status:
      (formData.get("review_status") as "unreviewed" | "reviewed") ||
      "unreviewed",
  };
}

export async function createPieceAction(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const input = parsePieceInput(formData);
  if (!input.title) return { ok: false, error: "Title is required." };

  let pieceId: string;
  try {
    const piece = await createContentPiece(input);
    pieceId = piece.id;
    await logActivity(
      piece.id,
      "created",
      `Created "${piece.title}" as ${piece.status}`,
    );
    await logAudit("create", "content_pieces", piece.id, `status=${piece.status}`);
    if (piece.status === "published") {
      await logActivity(piece.id, "published", null);
    }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not save piece.",
    };
  }

  revalidatePath("/");
  redirect(`/?created=${pieceId}`);
}

export async function updatePieceAction(
  id: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const input = parsePieceInput(formData);
  if (!input.title) return { ok: false, error: "Title is required." };

  try {
    const piece = await updateContentPiece(id, input);
    await logActivity(piece.id, "edited", "Fields updated");
    await logAudit("edit", "content_pieces", piece.id, `status=${piece.status}`);
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not update piece.",
    };
  }

  revalidatePath("/");
  revalidatePath(`/${id}/edit`);
  redirect("/");
}

export async function deletePieceAction(
  id: string,
  _formData: FormData,
): Promise<void> {
  const piece = await getContentPiece(id);
  await deleteContentPiece(id);
  await logAudit(
    "delete",
    "content_pieces",
    id,
    piece ? `Deleted "${piece.title}"` : null,
  );
  revalidatePath("/");
}

export async function publishPieceAction(
  id: string,
  _formData: FormData,
): Promise<void> {
  const piece = await updateContentPiece(id, { status: "published" });
  await logActivity(id, "published", null);
  await logAudit("publish", "content_pieces", piece.id, null);
  revalidatePath("/");
}

export async function createTopicAction(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const description = (formData.get("description") as string) || null;
  if (!name) return { ok: false, error: "Name is required." };

  try {
    await createTopic({ name, description });
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not create topic.",
    };
  }

  revalidatePath("/topics");
  revalidatePath("/new");
  return { ok: true };
}
