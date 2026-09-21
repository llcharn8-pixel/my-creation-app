import type { ContentFormat } from "@/lib/types";

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
};

export type DraftInput = {
  breakthroughAngle: string;
  format: ContentFormat;
  audience: string;
};

function isEnabled(): boolean {
  return process.env.AI_DRAFT_ENABLED !== "false";
}

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

export function draftContentFields(input: DraftInput): DraftResult {
  if (!isEnabled()) {
    throw new Error("AI drafting is currently disabled.");
  }
  const angle = input.breakthroughAngle.trim();
  if (!angle) {
    throw new Error("Write a breakthrough angle first.");
  }

  const hook = draftHook(angle, input.audience);
  const body = draftBody(angle, input.format);
  const cta = draftCta(input.audience);

  return {
    hook: {
      value: hook,
      source: "ai",
      confidence: confidenceFor(angle, 0.78),
      review_status: "unreviewed",
    },
    body: {
      value: body,
      source: "ai",
      confidence: confidenceFor(angle, 0.74),
      review_status: "unreviewed",
    },
    cta: {
      value: cta,
      source: "ai",
      confidence: confidenceFor(angle, 0.81),
      review_status: "unreviewed",
    },
  };
}
