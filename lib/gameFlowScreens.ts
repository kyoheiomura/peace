/** 導線マップ用 embed スラッグ（/designs/flow/embed/[slug]） */
export type GameFlowEmbedSlug =
  | "lp"
  | "title"
  | "onboarding-1"
  | "onboarding-2"
  | "onboarding-3"
  | "type"
  | "stage"
  | "stage-loop"
  | "choice"
  | "action"
  | "result"
  | "detail"
  | "clear";

export const GAME_FLOW_EMBED_SLUGS: GameFlowEmbedSlug[] = [
  "lp",
  "title",
  "onboarding-1",
  "onboarding-2",
  "onboarding-3",
  "type",
  "stage",
  "stage-loop",
  "choice",
  "action",
  "result",
  "detail",
  "clear",
];

export function gameFlowEmbedPath(slug: GameFlowEmbedSlug): string {
  return `/designs/flow/embed/${slug}`;
}

export function isGameFlowEmbedSlug(value: string): value is GameFlowEmbedSlug {
  return (GAME_FLOW_EMBED_SLUGS as string[]).includes(value);
}
