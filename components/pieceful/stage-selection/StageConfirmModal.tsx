"use client";

import type { StageId } from "@/lib/stageSelection";
import { Boss } from "./Boss";
import { Piece } from "./Piece";
import { Stage } from "./Stage";

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
      className="pf-confirm-backdrop active pf-ss-confirm-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="pf-confirm-modal pf-ss-confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pf-ss-confirm-title"
      >
        <h2 id="pf-ss-confirm-title" className="pf-confirm-title">
          このステージで始めますか？
        </h2>
        <div className="pf-ss-confirm-preview">
          <Piece stageId={stageId} />
          <span className="pf-ss-confirm-labels">
            <Stage stageId={stageId} />
            <Boss stageId={stageId} />
          </span>
        </div>
        <div className="pf-confirm-actions">
          <button
            type="button"
            className="pf-confirm-btn cancel"
            onClick={onCancel}
          >
            やめる
          </button>
          <button
            type="button"
            className="pf-confirm-btn confirm"
            onClick={onConfirm}
          >
            決定
          </button>
        </div>
      </div>
    </div>
  );
}
