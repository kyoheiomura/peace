import type { StageId } from "@/lib/stageSelection";
import { STAGE_BOSSES } from "@/lib/stageSelection";

type BossProps = {
  stageId: StageId;
  className?: string;
};

/** 相手カテゴリ（先輩・上司、同僚 など） */
export function Boss({ stageId, className }: BossProps) {
  return (
    <span className={["pf-ss-boss-label", className].filter(Boolean).join(" ")}>
      {STAGE_BOSSES[stageId]}
    </span>
  );
}
