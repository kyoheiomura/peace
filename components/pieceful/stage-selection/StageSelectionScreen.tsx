"use client";

import { useCallback, useState } from "react";
import { charImages } from "@/lib/characters";
import { ALL_STAGE_IDS, type StageId } from "@/lib/stageSelection";
import { StageConfirmModal } from "./StageConfirmModal";
import { StageSelectItem } from "./StageSelectItem";

type StageSelectionScreenProps = {
  character: string;
  group: "analyst" | "sentinel" | "diplomat" | "explorer";
  clearedStages: Set<number>;
  nextUnclearedStage: number | null;
  onBack: () => void;
  onSelectStage: (stageId: StageId) => void;
};

export function StageSelectionScreen({
  character,
  group,
  clearedStages,
  nextUnclearedStage,
  onBack,
  onSelectStage,
}: StageSelectionScreenProps) {
  const [pendingStageId, setPendingStageId] = useState<StageId | null>(null);

  const handleConfirm = useCallback(() => {
    if (pendingStageId === null) return;
    onSelectStage(pendingStageId);
    setPendingStageId(null);
  }, [pendingStageId, onSelectStage]);

  const handleCancel = useCallback(() => {
    setPendingStageId(null);
  }, []);

  return (
    <>
      <div className="pf-stage-layout pf-ss-layout-stitch">
        <button
          type="button"
          className="pf-type-back-btn"
          onClick={onBack}
          aria-label="タイプ選択へ戻る"
        >
          ←
        </button>

        <section className={`pf-ss-profile-stitch pf-ss-profile--${group}`}>
          <div className="pf-ss-profile-char">
            <img src={charImages[character]} alt="" />
          </div>
          <div className="pf-ss-profile-body">
            <div className="pf-ss-profile-name">
              <span>{character}</span>
            </div>
            <p className="pf-ss-profile-copy">ステージを選択しよう！</p>
          </div>
        </section>

        <div className="pf-ss-list-stitch" role="list">
          {ALL_STAGE_IDS.map((id) => (
            <StageSelectItem
              key={id}
              stageId={id}
              cleared={clearedStages.has(id)}
              next={nextUnclearedStage === id}
              onSelect={setPendingStageId}
            />
          ))}
        </div>
      </div>

      <StageConfirmModal
        stageId={pendingStageId}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}
