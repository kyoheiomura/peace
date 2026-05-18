import type { StageId } from "@/lib/stageSelection";
import { STAGE_PIECE_IMAGES } from "@/lib/stageSelection";

type PieceProps = {
  stageId: StageId;
  className?: string;
};

export function Piece({ stageId, className }: PieceProps) {
  return (
    <span className={["pf-ss-piece", className].filter(Boolean).join(" ")}>
      <img src={STAGE_PIECE_IMAGES[stageId]} alt="" draggable={false} />
    </span>
  );
}
