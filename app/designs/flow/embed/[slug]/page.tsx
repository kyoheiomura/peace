import { notFound } from "next/navigation";
import { CharPickerDesign } from "@/components/designs/CharPickerDesign";
import { LpFlowPreview } from "@/components/designs/LpFlowPreview";
import {
  PiecefulGame,
  type PiecefulPreviewScreen,
} from "@/components/PiecefulGame";
import {
  GAME_FLOW_EMBED_SLUGS,
  isGameFlowEmbedSlug,
  type GameFlowEmbedSlug,
} from "@/lib/gameFlowScreens";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GAME_FLOW_EMBED_SLUGS.map((slug) => ({ slug }));
}

function previewForSlug(slug: GameFlowEmbedSlug): {
  screen?: PiecefulPreviewScreen;
  clearedStages?: number[];
} | null {
  switch (slug) {
    case "title":
      return { screen: "title" };
    case "onboarding-1":
      return { screen: "onboarding-1" };
    case "onboarding-2":
      return { screen: "onboarding-2" };
    case "onboarding-3":
      return { screen: "onboarding-3" };
    case "stage":
      return { screen: "stage", clearedStages: [1] };
    case "stage-loop":
      return { screen: "stage", clearedStages: [1, 2, 3] };
    case "choice":
      return { screen: "choice" };
    case "action":
      return { screen: "action" };
    case "result":
      return { screen: "result" };
    case "detail":
      return { screen: "detail" };
    case "clear":
      return { screen: "clear" };
    default:
      return null;
  }
}

export default async function GameFlowEmbedPage({ params }: Props) {
  const { slug } = await params;

  if (!isGameFlowEmbedSlug(slug)) {
    notFound();
  }

  if (slug === "lp") {
    return <LpFlowPreview />;
  }

  if (slug === "type") {
    return (
      <CharPickerDesign layout="2x8" page={1} totalPages={2} selected="INTJ" />
    );
  }

  const preview = previewForSlug(slug);
  if (!preview?.screen) {
    notFound();
  }

  return (
    <PiecefulGame
      embed
      previewScreen={preview.screen}
      previewClearedStages={preview.clearedStages}
    />
  );
}
