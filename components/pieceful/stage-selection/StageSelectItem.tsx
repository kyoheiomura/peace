import type { StageId } from "@/lib/stageSelection";
import { STAGE_LABELS, STAGE_BOSSES, STAGE_PIECE_IMAGES } from "@/lib/stageSelection";

const STAGE_COLORS: Record<StageId, string> = {
  1: "rgb(255, 0, 127)",
  2: "rgb(138, 43, 226)",
  3: "rgb(255, 140, 0)",
  4: "rgb(50, 205, 50)",
  5: "rgb(0, 191, 255)",
};

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
        "pf-ss-item-stitch",
        cleared ? "cleared" : "",
        next ? "next" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => onSelect(stageId)}
    >
      <div className="pf-ss-item-piece">
        <img src={STAGE_PIECE_IMAGES[stageId]} alt="" draggable={false} />
      </div>
      <div className="pf-ss-item-text">
        <span className="pf-ss-item-label">{STAGE_LABELS[stageId]}</span>
        <span className="pf-ss-item-boss" style={{ color: STAGE_COLORS[stageId] }}>
          {STAGE_BOSSES[stageId]}
        </span>
      </div>
      {cleared ? <span className="pf-ss-cleared-mark-stitch" aria-hidden>✓</span> : null}
    </button>
  );
}
