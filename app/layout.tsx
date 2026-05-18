import type { Metadata } from "next";
import { AgentationDev } from "@/components/AgentationDev";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pieceful - MBTI Communication Quest",
  description: "MBTIタイプ別キャラクターで、職場コミュニケーションを攻略するミニゲーム。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DotGothic16&family=M+PLUS+Rounded+1c:wght@400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <AgentationDev />
      </body>
    </html>
  );
}
