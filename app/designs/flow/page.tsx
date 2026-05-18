import Link from "next/link";
import { UserFlowDiagram } from "@/components/designs/UserFlowDiagram";

export default function UserFlowDesignPage() {
  return (
    <main className="design-gallery design-flow-page">
      <header className="design-gallery-header">
        <p className="design-gallery-eyebrow">DESIGN · USER FLOW</p>
        <h1>全体導線マップ</h1>
        <p>
          Pieceful の画面遷移を上から下へ追える縦型フローです。各ステップに本番相当のゲーム画面プレビューを並べています（
          <code>components/PiecefulGame.tsx</code>
          ・採用済みキャラ選択 UI）。
        </p>
        <p>
          <Link href="/designs/char-picker">キャラ選択レイアウト比較</Link>
          {" · "}
          <Link href="/game">本番ゲーム</Link>
          {" · "}
          <Link href="/">LP</Link>
        </p>
      </header>

      <section className="design-gallery-section" aria-labelledby="flow-map-heading">
        <h2 id="flow-map-heading">メインフロー（縦）</h2>
        <p className="design-flow-intro">
          左が導線の説明、右が実画面プレビューです。オンボーディングは3画面すべて表示しています。
        </p>
        <UserFlowDiagram />
      </section>

      <section className="design-gallery-section design-flow-legend">
        <h2>凡例</h2>
        <ul className="design-flow-legend-list">
          <li>
            <span className="design-flow-badge">採用決定</span>
            デザイン比較の結果、本番に反映済みの仕様
          </li>
          <li>
            <code>screen-*</code> … PiecefulGame 内の section id
          </li>
          <li>
            プレビュー … <code>/designs/flow/embed/*</code>（本番 UI・INTJ・ステージ1 基準）
          </li>
          <li>
            進行保存 … <code>pieceful:progress</code>（localStorage）で画面・スコア・クリア状況を復帰
          </li>
        </ul>
      </section>
    </main>
  );
}
