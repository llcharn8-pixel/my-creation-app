"use client";

import { useActionState, useState, useTransition } from "react";
import type { ActionResult } from "@/app/actions";
import { draftFieldsAction } from "@/app/actions";
import type {
  ContentFormat,
  ContentPiece,
  FieldSource,
  ReviewStatus,
  Topic,
} from "@/lib/types";

const initialState: ActionResult = { ok: true };

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none";
const labelClass = "block text-sm font-medium mb-1 text-neutral-800";

function AiBadge({ confidence }: { confidence?: number | null }) {
  return (
    <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
      AI{confidence != null ? ` · ${Math.round(confidence * 100)}%` : ""}
    </span>
  );
}

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
  const [isDrafting, startDraft] = useTransition();
  const [aiError, setAiError] = useState<string | null>(null);

  const [format, setFormat] = useState<ContentFormat>(piece?.format ?? "post");
  const [audience, setAudience] = useState(piece?.audience ?? "");
  const [angle, setAngle] = useState(piece?.breakthrough_angle ?? "");

  const [hook, setHook] = useState(piece?.hook ?? "");
  const [body, setBody] = useState(piece?.body ?? "");
  const [cta, setCta] = useState(piece?.cta ?? "");

  const [hookSource, setHookSource] = useState<FieldSource | null>(
    piece?.hook_source ?? null,
  );
  const [bodySource, setBodySource] = useState<FieldSource | null>(
    piece?.body_source ?? null,
  );
  const [ctaSource, setCtaSource] = useState<FieldSource | null>(
    piece?.cta_source ?? null,
  );

  const [hookConfidence, setHookConfidence] = useState<number | null>(
    piece?.hook_confidence ?? null,
  );
  const [bodyConfidence, setBodyConfidence] = useState<number | null>(
    piece?.body_confidence ?? null,
  );
  const [ctaConfidence, setCtaConfidence] = useState<number | null>(
    piece?.cta_confidence ?? null,
  );

  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>(
    piece?.review_status ?? "unreviewed",
  );

  function onHookChange(value: string) {
    setHook(value);
    if (hookSource === "ai") {
      setHookSource("user");
      setHookConfidence(null);
      setReviewStatus("reviewed");
    }
  }
  function onBodyChange(value: string) {
    setBody(value);
    if (bodySource === "ai") {
      setBodySource("user");
      setBodyConfidence(null);
      setReviewStatus("reviewed");
    }
  }
  function onCtaChange(value: string) {
    setCta(value);
    if (ctaSource === "ai") {
      setCtaSource("user");
      setCtaConfidence(null);
      setReviewStatus("reviewed");
    }
  }

  function handleDraft() {
    setAiError(null);
    startDraft(async () => {
      const result = await draftFieldsAction({
        breakthroughAngle: angle,
        format,
        audience,
      });
      if (!result.ok) {
        setAiError(result.error);
        return;
      }
      setHook(result.draft.hook.value);
      setBody(result.draft.body.value);
      setCta(result.draft.cta.value);
      setHookSource("ai");
      setBodySource("ai");
      setCtaSource("ai");
      setHookConfidence(result.draft.hook.confidence);
      setBodyConfidence(result.draft.body.confidence);
      setCtaConfidence(result.draft.cta.confidence);
      setReviewStatus("unreviewed");
    });
  }

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

      <input type="hidden" name="hook_source" value={hookSource ?? ""} readOnly />
      <input type="hidden" name="body_source" value={bodySource ?? ""} readOnly />
      <input type="hidden" name="cta_source" value={ctaSource ?? ""} readOnly />
      <input
        type="hidden"
        name="hook_confidence"
        value={hookConfidence ?? ""}
        readOnly
      />
      <input
        type="hidden"
        name="body_confidence"
        value={bodyConfidence ?? ""}
        readOnly
      />
      <input
        type="hidden"
        name="cta_confidence"
        value={ctaConfidence ?? ""}
        readOnly
      />
      <input type="hidden" name="review_status" value={reviewStatus} readOnly />

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
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
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
            value={format}
            onChange={(e) => setFormat(e.target.value as ContentFormat)}
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
          value={angle}
          onChange={(e) => setAngle(e.target.value)}
          rows={2}
          placeholder="What transformation does this promise the reader?"
          className={inputClass}
        />
      </div>

      <div className="space-y-4 border-t border-neutral-200 pt-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-neutral-700">
            Hook, body &amp; CTA
          </h3>
          <button
            type="button"
            onClick={handleDraft}
            disabled={isDrafting || !angle.trim()}
            title={!angle.trim() ? "Write a breakthrough angle first" : undefined}
            className="rounded-md border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDrafting ? "Drafting…" : "Draft with AI"}
          </button>
        </div>
        {aiError && (
          <p role="alert" className="text-sm text-red-700">
            {aiError}
          </p>
        )}

        <div>
          <label className={`${labelClass} flex items-center`} htmlFor="hook">
            Hook
            {hookSource === "ai" && <AiBadge confidence={hookConfidence} />}
          </label>
          <input
            id="hook"
            name="hook"
            value={hook}
            onChange={(e) => onHookChange(e.target.value)}
            placeholder="Opening line that creates tension"
            className={inputClass}
          />
        </div>

        <div>
          <label className={`${labelClass} flex items-center`} htmlFor="body">
            Body
            {bodySource === "ai" && <AiBadge confidence={bodyConfidence} />}
          </label>
          <textarea
            id="body"
            name="body"
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            rows={5}
            placeholder="The transformation story — before and after"
            className={inputClass}
          />
        </div>

        <div>
          <label className={`${labelClass} flex items-center`} htmlFor="cta">
            CTA
            {ctaSource === "ai" && <AiBadge confidence={ctaConfidence} />}
          </label>
          <input
            id="cta"
            name="cta"
            value={cta}
            onChange={(e) => onCtaChange(e.target.value)}
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
