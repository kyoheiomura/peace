/** 導線マップ embed 用の LP 簡易プレビュー（スマホ枠内） */
export function LpFlowPreview() {
  return (
    <main className="lp-flow-embed">
      <div className="lp-flow-embed-inner">
        <p className="lp-flow-embed-eyebrow">MBTI COMMUNICATION GAME</p>
        <h1 className="lp-flow-embed-title">Pieceful</h1>
        <p className="lp-flow-embed-lead">
          伝え方ひとつで、職場の空気が変わる。MBTIタイプ別に「切り出し」と「行動」を選び、信頼を積み上げるゲーム。
        </p>
        <ul className="lp-flow-embed-features">
          <li>5ステージの実践シナリオ</li>
          <li>16タイプ別の切り出し練習</li>
          <li>信頼ゲージ・コンボでフィードバック</li>
        </ul>
        <button type="button" className="lp-flow-embed-cta" tabIndex={-1}>
          プレイする ▶
        </button>
        <p className="lp-flow-embed-note">PCでは右の PhoneFrame に /game を表示</p>
      </div>
    </main>
  );
}
