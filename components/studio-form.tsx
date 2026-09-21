"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/app/actions";
import type { ContentPiece, Topic } from "@/lib/types";

const initialState: ActionResult = { ok: true };

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none";
const labelClass = "block text-sm font-medium mb-1 text-neutral-800";

export function StudioForm({
  topics,
  piece,
  action,
  publishLabel = "Publish",
}: {
  topics: Topic[];
  piece?: ContentPiece;
  action: (prevState: ActionResult, formData: FormData) => Promise<ActionResult>;
  publishLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {state.ok === false && (
        <div
          role="alert"
          className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      )}

      <input type="hidden" name="hook_source" defaultValue={piece?.hook_source ?? ""} />
      <input type="hidden" name="body_source" defaultValue={piece?.body_source ?? ""} />
      <input type="hidden" name="cta_source" defaultValue={piece?.cta_source ?? ""} />
      <input
        type="hidden"
        name="review_status"
        defaultValue={piece?.review_status ?? "unreviewed"}
      />

      <div>
        <label className={labelClass} htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          defaultValue={piece?.title}
          required
          placeholder="e.g. The 5AM Lie"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="topic_id">
            Topic
          </label>
          <select
            id="topic_id"
            name="topic_id"
            defaultValue={piece?.topic_id ?? ""}
            className={inputClass}
          >
            <option value="">No topic</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="audience">
            Audience
          </label>
          <input
            id="audience"
            name="audience"
            defaultValue={piece?.audience ?? ""}
            placeholder="Who is this for?"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="format">
            Format
          </label>
          <select
            id="format"
            name="format"
            defaultValue={piece?.format ?? "post"}
            className={inputClass}
          >
            <option value="post">Post</option>
            <option value="carousel">Carousel</option>
            <option value="script">Script</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="media_type">
            Media
          </label>
          <select
            id="media_type"
            name="media_type"
            defaultValue={piece?.media_type ?? "text"}
            className={inputClass}
          >
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="breakthrough_angle">
          Breakthrough angle
        </label>
        <textarea
          id="breakthrough_angle"
          name="breakthrough_angle"
          defaultValue={piece?.breakthrough_angle ?? ""}
          rows={2}
          placeholder="What transformation does this promise the reader?"
          className={inputClass}
        />
      </div>

      <div className="space-y-4 border-t border-neutral-200 pt-4">
        <h3 className="text-sm font-semibold text-neutral-700">
          Hook, body &amp; CTA
        </h3>

        <div>
          <label className={labelClass} htmlFor="hook">
            Hook
          </label>
          <input
            id="hook"
            name="hook"
            defaultValue={piece?.hook ?? ""}
            placeholder="Opening line that creates tension"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="body">
            Body
          </label>
          <textarea
            id="body"
            name="body"
            defaultValue={piece?.body ?? ""}
            rows={5}
            placeholder="The transformation story — before and after"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="cta">
            CTA
          </label>
          <input
            id="cta"
            name="cta"
            defaultValue={piece?.cta ?? ""}
            placeholder="One explicit action for the reader"
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          name="status"
          value="draft"
          disabled={pending}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save draft"}
        </button>
        <button
          type="submit"
          name="status"
          value="published"
          disabled={pending}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {pending ? "Publishing…" : publishLabel}
        </button>
      </div>
    </form>
  );
}
