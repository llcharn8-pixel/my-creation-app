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
];

const FORMAT_LENGTH_RANGES: Record<ContentFormat, [number, number]> = {
  post: [40, 150],
  carousel: [20, 120],
  script: [30, 220],
};

function wordCount(text: string | null | undefined): number {
  return (text ?? "").trim().split(/\s+/).filter(Boolean).length;
}

function hasTension(hook: string): boolean {
  const lower = hook.toLowerCase();
  return lower.includes("?") || TENSION_WORDS.some((w) => lower.includes(w));
}

function hasBeforeAfter(body: string): boolean {
  const lower = body.toLowerCase();
  return lower.includes("before") && lower.includes("after");
}

function isSingleExplicitAction(cta: string): boolean {
  const wc = wordCount(cta);
  if (wc === 0 || wc > 20) return false;
  const lower = cta.toLowerCase();
  return ACTION_VERBS.some((v) => lower.includes(v));
}

function isSpecificAngle(angle: string): boolean {
  return wordCount(angle) >= 8;
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

export function scoreContent(piece: ScoreInput): number {
  let score = 0;
  const hook = piece.hook ?? "";
  const body = piece.body ?? "";
  const cta = piece.cta ?? "";
  const angle = piece.breakthrough_angle ?? "";

  if (hook && wordCount(hook) <= 25 && hasTension(hook)) score += 20;
  if (body && hasBeforeAfter(body)) score += 25;
  if (cta && isSingleExplicitAction(cta)) score += 20;
  if (angle && isSpecificAngle(angle)) score += 15;
  if (body && fitsFormatLength(body, piece.format)) score += 10;
  if (piece.audience && piece.audience.trim().length > 0) score += 10;

  return Math.min(100, score);
}
