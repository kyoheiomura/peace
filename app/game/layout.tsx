import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="game-body">{children}</div>;
}
