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
  2: "同期",
  3: "後輩",
  4: "クライアント",
  5: "他部署",
};

export const STAGE_DESCRIPTIONS: Record<StageId, string> = {
  1: "上司や先輩とのやり取りを通して、信頼関係を築くコミュニケーションを学ぼう！",
  2: "同僚との協力を通して、円滑なコミュニケーションを学ぼう！",
  3: "後輩との関わりを通して、指導とサポートのコミュニケーションを学ぼう！",
  4: "クライアントとの対応を通して、丁寧で的確なコミュニケーションを学ぼう！",
  5: "他部署との連携を通して、社内調整のコミュニケーションを学ぼう！",
};
