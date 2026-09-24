import type { ContentFormat } from "@/lib/types";

const TENSION_WORDS = [
  "stop",
  "never",
  "wrong",
  "mistake",
  "secret",
  "truth",
  "lie",
  "broke",
  "fails",
  "myth",
  "don't",
  "why",
  "how",
];

const ACTION_VERBS = [
  "try",
  "click",
  "reply",
  "comment",
  "tag",
  "share",
  "save",
  "download",
  "join",
  "book",
  "message",
  "dm",
  "subscribe",
  "start",
  "grab",
  "send",
  "audit",
  "write",
  "post",
  "follow",
];

const OUTCOME_WORDS = [
  "become",
  "reclaim",
  "without",
  "result",
  "finally",
  "instead",
  "escape",
  "gain",
  "save",
  "double",
  "triple",
];

const FORMAT_LENGTH_RANGES: Record<ContentFormat, [number, number]> = {
  post: [40, 150],
  carousel: [20, 140],
  script: [30, 220],
};

function wordCount(text: string | null | undefined): number {
  return (text ?? "").trim().split(/\s+/).filter(Boolean).length;
}

function includesAny(text: string, list: string[]): boolean {
  const lower = text.toLowerCase();
  return list.some((w) => lower.includes(w));
}

function hasNumber(text: string): boolean {
  return /\d/.test(text);
}

function hasTension(hook: string): boolean {
  return hook.includes("?") || includesAny(hook, TENSION_WORDS) || hasNumber(hook);
}

function hasBeforeAfter(body: string): boolean {
  const lower = body.toLowerCase();
  return lower.includes("before") && lower.includes("after");
}

function addressesReader(text: string, audience: string | null): boolean {
  const lower = text.toLowerCase();
  if (/\b(you|your|you're)\b/.test(lower)) return true;
  return !!audience && lower.includes(audience.trim().toLowerCase());
}

function isSkimmable(body: string): boolean {
  const lines = body.split(/\n+/).filter((l) => l.trim());
  if (lines.length >= 3) return true;
  const sentences = body.split(/[.!?]+/).filter((s) => s.trim());
  if (sentences.length === 0) return false;
  return wordCount(body) / sentences.length <= 18;
}

function fitsFormatLength(body: string, format: ContentFormat): boolean {
  const wc = wordCount(body);
  const [min, max] = FORMAT_LENGTH_RANGES[format];
  return wc >= min && wc <= max;
}

export type ScoreInput = {
  hook: string | null;
  body: string | null;
  cta: string | null;
  breakthrough_angle: string | null;
  audience: string | null;
  format: ContentFormat;
};

// Rule-based rubric (0-100) based on the standard content framework:
// attention (hook) -> specificity -> transformation -> proof -> action (CTA)
// -> craft (skimmability/format fit) -> audience.
export function scoreContent(piece: ScoreInput): number {
  const hook = piece.hook ?? "";
  const body = piece.body ?? "";
  const cta = piece.cta ?? "";
  const angle = piece.breakthrough_angle ?? "";
  const audience = piece.audience?.trim() ?? "";
  let score = 0;

  // Hook / attention (20)
  if (hook) {
    if (wordCount(hook) <= 25) score += 6;
    if (hasTension(hook)) score += 8;
    if (addressesReader(hook, audience)) score += 6;
  }

  // Specificity (15)
  if (wordCount(angle) >= 8) score += 7;
  if (hasNumber(hook + " " + body) || /["“”]/.test(body)) score += 8;

  // Transformation (20)
  if (body) {
    if (hasBeforeAfter(body)) score += 12;
    if (includesAny(body, OUTCOME_WORDS)) score += 8;
  }

  // Proof / credibility (10)
  if (/\d+\s?(%|x|hours?|days?|weeks?|minutes?|k\b)/i.test(body)) score += 6;
  if (/\b(for example|e\.g\.|result|case|when i|i (tried|tested))\b/i.test(body))
    score += 4;

  // CTA / action (20)
  if (cta && wordCount(cta) <= 20 && includesAny(cta, ACTION_VERBS)) {
    score += 14;
    if (/\b(today|tonight|this week|now|before|your|next)\b/i.test(cta))
      score += 6;
  }

  // Craft (10)
  if (body && fitsFormatLength(body, piece.format)) score += 5;
  if (body && isSkimmable(body)) score += 5;

  // Audience named (5)
  if (audience) score += 5;

  return Math.min(100, score);
}
