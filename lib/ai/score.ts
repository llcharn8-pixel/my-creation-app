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
  "try", "click", "reply", "comment", "tag", "share", "save", "download",
  "join", "book", "message", "dm", "subscribe", "start", "grab", "send",
  "audit", "write", "post", "follow", "practice", "cut", "stop", "notice",
  "ask", "tell", "pick", "choose", "use", "take", "watch", "read", "pause",
  "count", "give", "leave", "say", "drop", "swap", "replace", "rewrite",
  "test", "schedule", "set", "make", "check", "list", "review", "remember",
  "focus", "commit", "plan", "imagine", "pin", "bookmark", "screenshot",
  "answer", "record", "open", "run", "aim",
];

const OUTCOME_WORDS = [
  "become", "became", "reclaim", "without", "result", "finally", "instead",
  "escape", "gain", "save", "double", "triple", "shift", "confident",
  "changed", "transform", "freedom", "calm", "clarity", "peer", "less",
  "faster", "easier", "stronger", "closer", "lighter",
];

// A "before" state (the problem or old way) and an "after" state (the
// change or result) can be written many ways, not just the literal words
// "before" and "after", so recognize the common natural phrasings.
const BEFORE_RE =
  /\b(before|used to|instead of|stuck|struggl\w*|anxiety|fear|wasted|exhausted|frustrat\w*|overwhelm\w*|problem|the old way|couldn't|never)\b/i;
const AFTER_RE =
  /\b(after|now|became|become|shifted|changed|finally|started|stopped|result|today|these days|from .{1,40} to)\b/i;

const EXAMPLE_RE =
  /\b(for example|for instance|e\.g\.|imagine|picture this|when i|i (used to|started|stopped|tried|tested|was|felt|found|learned|noticed))\b/i;

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
  return BEFORE_RE.test(body) && AFTER_RE.test(body);
}

function hasActionVerb(text: string): boolean {
  const words = text.toLowerCase().match(/[a-z']+/g) ?? [];
  return words.some((w) => ACTION_VERBS.includes(w));
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
export type Evaluation = { score: number; hints: string[] };

// Same rubric as scoreContent, but also reports what's missing so the
// studio form can show a live score and tell the user how to improve it.
export function evaluateContent(piece: ScoreInput): Evaluation {
  const hook = piece.hook ?? "";
  const body = piece.body ?? "";
  const cta = piece.cta ?? "";
  const angle = piece.breakthrough_angle ?? "";
  const audience = piece.audience?.trim() ?? "";
  let score = 0;
  const hints: string[] = [];

  const check = (ok: boolean, points: number, hint: string) => {
    if (ok) score += points;
    else hints.push(hint);
  };

  // Hook / attention (20)
  check(!!hook && wordCount(hook) <= 25, 6, hook ? "Shorten the hook to 25 words or fewer." : "Write a hook.");
  check(!!hook && hasTension(hook), 8, "Give the hook tension: a question, a number, or a contrarian claim.");
  check(!!hook && addressesReader(hook, audience), 6, 'Speak to the reader ("you") or name the audience in the hook.');

  // Specificity (15)
  check(wordCount(angle) >= 8, 7, "Make the breakthrough angle more specific (8+ words).");
  check(hasNumber(hook + " " + body) || /["“”]/.test(body), 8, "Add a concrete number or a quoted example.");

  // Transformation (20)
  check(!!body && hasBeforeAfter(body), 12, 'Show a clear "before" and "after" in the body.');
  check(!!body && includesAny(body, OUTCOME_WORDS), 8, "Describe the outcome, or who the reader becomes.");

  // Proof / credibility (10)
  check(/\d+\s?(%|x|hours?|days?|weeks?|minutes?|k\b)/i.test(body), 6, 'Add proof with a result, like "10 hours" or "30%".');
  check(EXAMPLE_RE.test(body), 4, 'Add a mini-example ("for example…", "when I…").');

  // CTA / action (20)
  const ctaOk = !!cta && wordCount(cta) <= 20 && hasActionVerb(cta);
  check(ctaOk, 14, "The CTA needs one explicit action verb (20 words or fewer).");
  check(ctaOk && /\b(today|tonight|this week|now|before|your|next)\b/i.test(cta), 6, 'Add a timeframe or object to the CTA ("today", "your…").');

  // Craft (10)
  check(!!body && fitsFormatLength(body, piece.format), 5, `The body length doesn't fit a ${piece.format}.`);
  check(!!body && isSkimmable(body), 5, "Break the body into shorter lines or sentences.");

  // Audience named (5)
  check(!!audience, 5, "Name the audience.");

  return { score: Math.min(100, score), hints };
}

export function scoreContent(piece: ScoreInput): number {
  return evaluateContent(piece).score;
}
