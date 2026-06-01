"use client";

import dynamic from "next/dynamic";

const PiecefulGame = dynamic(
  () => import("@/components/PiecefulGame"),
  { ssr: false }
);

export default function GamePage() {
  return <PiecefulGame />;
}

