import type { StageId } from "@/lib/stageSelection";
import { STAGE_LABELS } from "@/lib/stageSelection";

type StageProps = {
  stageId: StageId;
  className?: string;
};

/** ステージ番号ラベル（例: ステージ1） */
export function Stage({ stageId, className }: StageProps) {
  return (
    <span className={["pf-ss-stage-label", className].filter(Boolean).join(" ")}>
      {STAGE_LABELS[stageId]}
    </span>
  );
}
