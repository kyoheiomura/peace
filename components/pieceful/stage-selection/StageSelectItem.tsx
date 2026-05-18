import type { StageId } from "@/lib/stageSelection";
import { Boss } from "./Boss";
import { Piece } from "./Piece";
import { Stage } from "./Stage";

type StageSelectItemProps = {
  stageId: StageId;
  cleared?: boolean;
  next?: boolean;
  onSelect: (stageId: StageId) => void;
};

export function StageSelectItem({
  stageId,
  cleared = false,
  next = false,
  onSelect,
}: StageSelectItemProps) {
  return (
    <button
      type="button"
      className={[
        "pf-ss-item",
        cleared ? "cleared" : "",
        next ? "next" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => onSelect(stageId)}
    >
      <span className="pf-ss-item-shell">
        <Piece stageId={stageId} />
        <span className="pf-ss-item-info">
          <span className="pf-ss-item-info-frame">
            <Stage stageId={stageId} />
            <Boss stageId={stageId} />
          </span>
        </span>
      </span>
      {cleared ? <span className="pf-ss-cleared-mark" aria-hidden>✓</span> : null}
    </button>
  );
}
