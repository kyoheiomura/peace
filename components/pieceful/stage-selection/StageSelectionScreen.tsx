"use client";

import { charImages } from "@/lib/characters";
import { ALL_STAGE_IDS, type StageId } from "@/lib/stageSelection";
import { StageSelectItem } from "./StageSelectItem";

type StageSelectionScreenProps = {
  character: string;
  clearedStages: Set<number>;
  nextUnclearedStage: number | null;
  onBack: () => void;
  onSelectStage: (stageId: StageId) => void;
};

export function StageSelectionScreen({
  character,
  clearedStages,
  nextUnclearedStage,
  onBack,
  onSelectStage,
}: StageSelectionScreenProps) {
  return (
    <div className="pf-stage-layout pf-ss-layout">
      <div className="pf-topbar pf-ss-topbar">
        <button
          type="button"
          className="pf-back-btn"
          onClick={onBack}
          aria-label="タイプ選択へ戻る"
        >
          ←
        </button>
      </div>

      <header className="pf-ss-hero">
        <div className="pf-ss-hero-shell">
          <img
            className="pf-ss-hero-char"
            src={charImages[character]}
            alt=""
          />
          <div className="pf-ss-hero-body">
            <div className="pf-ss-name-plate">
              <span className="pf-ss-name-plate-inner">{character}</span>
            </div>
            <p className="pf-ss-hero-copy">ステージを選択しよう！</p>
          </div>
        </div>
      </header>

      <div className="pf-ss-list" role="list">
        {ALL_STAGE_IDS.map((id) => (
          <StageSelectItem
            key={id}
            stageId={id}
            cleared={clearedStages.has(id)}
            next={nextUnclearedStage === id}
            onSelect={onSelectStage}
          />
        ))}
      </div>

      <div className="pf-ss-floor" aria-hidden />
    </div>
  );
}
