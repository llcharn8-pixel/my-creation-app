export type ContentFormat = "post" | "carousel" | "script";
export type MediaType = "text" | "image" | "video";
export type ContentStatus = "draft" | "published";
export type FieldSource = "ai" | "user";
export type ReviewStatus = "unreviewed" | "reviewed";

export type Topic = {
  id: string;
  user_id: string | null;
  name: string;
  description: string | null;
  created_at: string;
};

export type ContentPiece = {
  id: string;
  user_id: string | null;
  title: string;
  topic_id: string | null;
  format: ContentFormat;
  media_type: MediaType;
  audience: string | null;
  breakthrough_angle: string | null;
  hook: string | null;
  body: string | null;
  cta: string | null;
  status: ContentStatus;
  hook_source: FieldSource | null;
  hook_confidence: number | null;
  body_source: FieldSource | null;
  body_confidence: number | null;
  cta_source: FieldSource | null;
  cta_confidence: number | null;
  review_status: ReviewStatus;
  score: number | null;
  created_at: string;
  topics?: { name: string } | null;
};

export type ContentPieceInput = {
  title: string;
  topic_id: string | null;
  format: ContentFormat;
  media_type: MediaType;
  audience: string | null;
  breakthrough_angle: string | null;
  hook: string | null;
  body: string | null;
  cta: string | null;
  status: ContentStatus;
  hook_source?: FieldSource | null;
  hook_confidence?: number | null;
  body_source?: FieldSource | null;
  body_confidence?: number | null;
  cta_source?: FieldSource | null;
  cta_confidence?: number | null;
  review_status?: ReviewStatus;
  score?: number | null;
};

export type Activity = {
  id: string;
  user_id: string | null;
  content_id: string;
  action: string;
  detail: string | null;
  created_at: string;
};
