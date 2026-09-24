import type { ContentFormat } from "@/lib/types";
import { callGemini, GeminiError } from "@/lib/ai/gemini";

export type DraftedField = {
  value: string;
  source: "ai";
  confidence: number;
  review_status: "unreviewed";
};

export type DraftResult = {
  hook: DraftedField;
  body: DraftedField;
  cta: DraftedField;
  // Set when the real model couldn't be used and a basic template was
  // returned instead, so the UI can say so rather than failing silently.
  notice?: string;
};

export type DraftInput = {
  breakthroughAngle: string;
  format: ContentFormat;
  audience: string;
};

function isEnabled(): boolean {
  return process.env.AI_DRAFT_ENABLED !== "false";
}

// ---------------------------------------------------------------------------
// Real model path — calls Google's Gemini API directly (same approach as
// this account's other apps), which has a genuine free tier. Falls back to
// the heuristic generator below if no key is configured, or the call
// fails/returns something unusable — the app must keep working with AI
// switched off or misconfigured.
// ---------------------------------------------------------------------------

const DEFAULT_MODEL = "gemini-3.6-flash";
const FALLBACK_MODEL = "gemini-3.1-flash-lite";

const SYSTEM_PROMPT = `You are an expert direct-response copywriter specializing in breakthrough, transformation-driven content for creators and entrepreneurs.

Return ONLY valid JSON matching this exact shape, nothing else — no prose, no markdown fences:
{
  "hook": { "value": "...", "confidence": 0.0 },
  "body": { "value": "...", "confidence": 0.0 },
  "cta": { "value": "...", "confidence": 0.0 }
}

Quality framework (follow it):
- ATTENTION — hook: at most 25 words. Use a pattern interrupt, a contrarian claim, a specific number, or a curiosity gap. Speak directly to the reader ("you") or name the audience so the right people stop scrolling. It must earn the next sentence. No generic filler or clichés.
- SPECIFICITY — prefer concrete numbers, named examples, and quoted lines over vague claims ("reclaim 10 hours a week", not "save time"). One idea only; write to one person.
- TRANSFORMATION — body: show a concrete BEFORE state and AFTER state grounded in the given breakthrough angle, then bridge them. Sell the outcome and who the reader becomes, not the feature or process.
- PROOF — include at least one credibility element: a number, a mini-example, or a short real-feeling scenario.
- ACTION — cta: exactly one explicit, low-friction action with a timeframe or object ("Save this and rewrite your headline today"). Never vague ("engage more") and never two asks.
- CRAFT — make it skimmable: short lines, white space, one thought per line or slide. Vary sentence length; cut any word that doesn't earn its place.

Structure by format:
- post: Problem → Agitate → Solution, or Before → After → Bridge. A few tight paragraphs separated by blank lines.
- carousel: one idea per slide, labeled "Slide 1:", "Slide 2:", etc.; slide 1 is the hook-restating promise, a middle slide shows the before/after, the last slide lands the takeaway.
- script: Hook → Story/Proof → Offer, written in natural spoken rhythm for the camera, with short sentences.

confidence is your own honest estimate (0 to 1) of how strong and publish-ready that field is.`;

function buildUserPrompt(input: DraftInput): string {
  return `Format: ${input.format}
Audience: ${input.audience || "a general audience"}
Breakthrough angle (the transformation this piece promises): ${input.breakthroughAngle}`;
}

function clampConfidence(n: unknown): number {
  const v = Number(n);
  return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0.85;
}

async function draftWithModel(input: DraftInput): Promise<DraftResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("no AI key is configured");

  const primary = process.env.AI_DRAFT_MODEL || DEFAULT_MODEL;
  const fallback = process.env.AI_DRAFT_FALLBACK_MODEL || FALLBACK_MODEL;

  try {
    const request = {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: buildUserPrompt(input) }] }],
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
    };

    // Free-tier load and quota are tracked per model, so if the primary is
    // overloaded or out of quota, a second model often still works.
    let data: unknown;
    try {
      data = await callGemini(apiKey, primary, request);
    } catch (err) {
      if (!(err instanceof GeminiError) || primary === fallback) throw err;
      console.error(`Primary model failed, trying ${fallback}:`, err.message);
      try {
        data = await callGemini(apiKey, fallback, request);
      } catch (err2) {
        throw new GeminiError(
          `${err.message}; backup model also failed: ${
            err2 instanceof Error ? err2.message : "unknown error"
          }`,
        );
      }
    }

    const text: string | undefined = (
      data as { candidates?: { content?: { parts?: { text?: string }[] } }[] }
    )?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("the AI returned an empty response");

    const jsonText = text.match(/\{[\s\S]*\}/)?.[0];
    if (!jsonText) throw new Error("the AI returned an unreadable response");

    const parsed = JSON.parse(jsonText);
    const hook = String(parsed?.hook?.value ?? "").trim();
    const body = String(parsed?.body?.value ?? "").trim();
    const cta = String(parsed?.cta?.value ?? "").trim();
    if (!hook || !body || !cta) throw new Error("the AI response was incomplete");

    return {
      hook: {
        value: hook,
        source: "ai",
        confidence: clampConfidence(parsed?.hook?.confidence),
        review_status: "unreviewed",
      },
      body: {
        value: body,
        source: "ai",
        confidence: clampConfidence(parsed?.body?.confidence),
        review_status: "unreviewed",
      },
      cta: {
        value: cta,
        source: "ai",
        confidence: clampConfidence(parsed?.cta?.confidence),
        review_status: "unreviewed",
      },
    };
  } catch (err) {
    console.error("Gemini draft error:", err);
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Heuristic fallback — no network call, always available.
// ---------------------------------------------------------------------------

function words(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

function truncateWords(text: string, max: number): string {
  return words(text).slice(0, max).join(" ");
}

function draftHook(angle: string, audience: string): string {
  const who = audience.trim() || "people";
  const core = truncateWords(angle, 14).replace(/\.$/, "");
  return `Most ${who} get this wrong: ${core.toLowerCase()}. What if you didn't have to?`;
}

function draftBody(angle: string, format: ContentFormat): string {
  const pace =
    format === "carousel"
      ? "across a few short slides"
      : format === "script"
        ? "in under a minute"
        : "in one sitting";
  return (
    `Before: the default path here quietly wastes effort. ${angle.trim()} ` +
    `After: the same effort lands, because the starting point changed, not the hustle. ` +
    `You can walk someone through this ${pace} — the shift is the point, not the length.`
  );
}

function draftCta(audience: string): string {
  const who = audience.trim();
  return who
    ? `Try this one shift this week if you're a ${who.toLowerCase()}, then tell me what changed.`
    : `Try this one shift this week, then tell me what changed.`;
}

function confidenceFor(text: string, base: number): number {
  const len = words(text).length;
  const bump = Math.min(0.12, len / 300);
  return Math.round((base + bump) * 100) / 100;
}

function draftHeuristic(angle: string, input: DraftInput): DraftResult {
  return {
    hook: {
      value: draftHook(angle, input.audience),
      source: "ai",
      confidence: confidenceFor(angle, 0.78),
      review_status: "unreviewed",
    },
    body: {
      value: draftBody(angle, input.format),
      source: "ai",
      confidence: confidenceFor(angle, 0.74),
      review_status: "unreviewed",
    },
    cta: {
      value: draftCta(input.audience),
      source: "ai",
      confidence: confidenceFor(angle, 0.81),
      review_status: "unreviewed",
    },
  };
}

// ---------------------------------------------------------------------------

export async function draftContentFields(input: DraftInput): Promise<DraftResult> {
  if (!isEnabled()) {
    throw new Error("AI drafting is currently disabled.");
  }
  const angle = input.breakthroughAngle.trim();
  if (!angle) {
    throw new Error("Write a breakthrough angle first.");
  }

  try {
    return await draftWithModel({ ...input, breakthroughAngle: angle });
  } catch (err) {
    const reason = err instanceof Error ? err.message : "unknown error";
    return {
      ...draftHeuristic(angle, input),
      notice: `The AI model couldn't be used (${reason}), so this is a basic template. Wait a minute and try again.`,
    };
  }
}
