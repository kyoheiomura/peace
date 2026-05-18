"use client";

import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/PhoneFrame";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="lp-shell">
      <section className="lp-hero" aria-labelledby="lp-title">
        <div className="lp-preview">
          <PhoneFrame src="/game" />
        </div>

        <div className="lp-copy">
          <p className="lp-eyebrow">MBTI COMMUNICATION GAME</p>
          <h1 id="lp-title" className="lp-title">
            Pieceful
          </h1>
          <p className="lp-lead">
            伝え方ひとつで、職場の空気が変わる。
            <br />
            MBTIタイプ別に「切り出し」と「行動」を選び、信頼を積み上げる8-bit風コミュニケーションゲーム。
          </p>
          <ul className="lp-features" aria-label="特徴">
            <li>5ステージの実践シナリオ</li>
            <li>16タイプ別の切り出し練習</li>
            <li>信頼ゲージ・コンボでフィードバック</li>
          </ul>
          <button
            type="button"
            className="btn primary lp-cta"
            onClick={() => router.push("/game")}
          >
            プレイする ▶
          </button>
        </div>
      </section>
    </main>
  );
}
