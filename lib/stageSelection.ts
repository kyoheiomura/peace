export const ALL_STAGE_IDS = [1, 2, 3, 4, 5] as const;

export type StageId = (typeof ALL_STAGE_IDS)[number];

export const STAGE_PIECE_IMAGES: Record<StageId, string> = {
  1: "/img/stage/pieces/1.png",
  2: "/img/stage/pieces/2.png",
  3: "/img/stage/pieces/3.png",
  4: "/img/stage/pieces/4.png",
  5: "/img/stage/pieces/5.png",
};

export const STAGE_LABELS: Record<StageId, string> = {
  1: "ステージ1",
  2: "ステージ2",
  3: "ステージ3",
  4: "ステージ4",
  5: "ステージ5",
};

export const STAGE_BOSSES: Record<StageId, string> = {
  1: "先輩・上司",
  2: "同僚",
  3: "後輩",
  4: "クライアント",
  5: "他部署",
};
