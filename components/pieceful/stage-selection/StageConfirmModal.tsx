"use client";

import type { StageId } from "@/lib/stageSelection";
import { STAGE_LABELS, STAGE_BOSSES, STAGE_PIECE_IMAGES, STAGE_DESCRIPTIONS } from "@/lib/stageSelection";

const STAGE_COLORS: Record<StageId, string> = {
  1: "#FF007A",
  2: "#8A2BE2",
  3: "#FF8C00",
  4: "#32CD32",
  5: "#00BFFF",
};

type StageConfirmModalProps = {
  stageId: StageId | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export function StageConfirmModal({
  stageId,
  onConfirm,
  onCancel,
}: StageConfirmModalProps) {
  if (stageId === null) return null;

  return (
    <div
      className="sc-confirm-backdrop active"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="sc-confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${STAGE_LABELS[stageId]} ${STAGE_BOSSES[stageId]}を開始しますか？`}
      >
        <div className="sc-confirm-header">
          <div className="sc-confirm-piece">
            <img src={STAGE_PIECE_IMAGES[stageId]} alt="" draggable={false} />
          </div>
          <div className="sc-confirm-titles">
            <span className="sc-confirm-stage">{STAGE_LABELS[stageId]}</span>
            <span className="sc-confirm-boss" style={{ color: STAGE_COLORS[stageId] }}>
              {STAGE_BOSSES[stageId]}
            </span>
          </div>
        </div>
        <p className="sc-confirm-body">
          {STAGE_DESCRIPTIONS[stageId]}
        </p>
        <div className="sc-confirm-btns">
          <button
            type="button"
            className="sc-confirm-btn sc-confirm-btn--cancel"
            onClick={onCancel}
          >
            戻る
          </button>
          <button
            type="button"
            className="sc-confirm-btn sc-confirm-btn--ok"
            onClick={onConfirm}
          >
            決定
          </button>
        </div>
      </div>
    </div>
  );
}
