# Data Model

## topics
| field | type | notes |
|---|---|---|
| id | uuid pk | |
| user_id | uuid nullable | owner scope at lock-down |
| name | text | unique per owner |
| description | text | |
| created_at | timestamptz | |

## content_pieces (core engine)
| field | type | notes |
|---|---|---|
| id | uuid pk | |
| user_id | uuid nullable | owner scope later |
| title | text | required |
| topic_id | uuid → topics | nullable |
| format | text | post / carousel / script |
| media_type | text | text / image / video |
| audience | text | who it's for |
| breakthrough_angle | text | the transformation promised |
| hook | text | opening line |
| body | text | main content |
| cta | text | call to action |
| status | text | draft / published |
| hook_source | text | 'ai' / 'user' (AI field) |
| hook_confidence | numeric | 0–1 (AI field) |
| body_source / body_confidence | text / numeric | AI field pair |
| cta_source / cta_confidence | text / numeric | AI field pair |
| review_status | text | unreviewed / reviewed (AI field) |
| score | numeric | rule-based ranking value |
| created_at | timestamptz | |

AI-generated fields store **value + source + confidence + review_status** per the data rule.

## activities
| field | type | notes |
|---|---|---|
| id | uuid pk | |
| user_id | uuid nullable | |
| content_id | uuid → content_pieces | cascade delete |
| action | text | created / edited / published / scored |
| detail | text | change summary |
| created_at | timestamptz | |

## audit_logs
| field | type | notes |
|---|---|---|
| id | uuid pk | |
| user_id | uuid nullable | |
| action | text | logged verb |
| target_table | text | affected table |
| target_id | uuid | affected row |
| detail | text | |
| created_at | timestamptz | |

## Relationships
topics 1—N content_pieces · content_pieces 1—N activities.

## RLS (demo-first v1)
Permissive read+write on all tables so demo works without login. Lock-down sprint replaces with `auth.uid() = user_id` owner policies.