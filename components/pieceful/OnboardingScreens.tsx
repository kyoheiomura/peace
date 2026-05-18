"use client";

type OnboardingScreensProps = {
  isActive: (screen: string) => string;
  go: (screen: string) => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
};

export function OnboardingScreens({
  isActive,
  go,
  skipOnboarding,
  completeOnboarding,
}: OnboardingScreensProps) {
  return (
    <>
      <section
        id="screen-onboarding-1"
        className={isActive("onboarding-1")}
        aria-labelledby="onboarding-1-heading"
      >
        <div className="pf-screen pf-paper">
          <div className="pf-safe">
            <div className="pf-first-layout">
              <div className="pf-topbar">
                <button
                  type="button"
                  className="pf-back-btn"
                  onClick={() => go("title")}
                  aria-label="トップへ戻る"
                >
                  ←
                </button>
                <div>
                  <h2 id="onboarding-1-heading" className="pf-screen-title">
                    はじめての方へ
                  </h2>
                  <p className="pf-screen-sub">30秒で遊び方を確認</p>
                </div>
                <span className="pf-mini-btn">1/3</span>
              </div>
              <div className="pf-brief-badge">このゲームでやること</div>
              <div className="pf-brief-card">
                <h3>
                  職場の会話で
                  <br />
                  信頼ゲージを上げよう
                </h3>
                <p>
                  あなたのタイプを選び、相手に合わせて「どう切り出すか」「どう振る舞うか」を選ぶ練習ゲームです。
                </p>
                <div className="pf-brief-steps">
                  <div className="pf-brief-step">
                    <strong>1</strong>
                    タイプを選ぶ
                  </div>
                  <div className="pf-brief-step">
                    <strong>2</strong>
                    言い方を選ぶ
                  </div>
                  <div className="pf-brief-step">
                    <strong>3</strong>
                    理由を学ぶ
                  </div>
                </div>
              </div>
              <div className="pf-coach-bubble">
                正解を当てるより「なぜその伝え方が効くか」を覚えるのが目的です。
              </div>
              <div className="pf-skip-row">
                <button type="button" className="pf-soft-btn" onClick={skipOnboarding}>
                  スキップ
                </button>
                <button
                  type="button"
                  className="pf-big-btn pf-big-btn-compact"
                  onClick={() => go("onboarding-2")}
                >
                  次へ ▶
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="screen-onboarding-2"
        className={isActive("onboarding-2")}
        aria-labelledby="onboarding-2-heading"
      >
        <div className="pf-screen pf-paper">
          <div className="pf-safe">
            <div className="pf-first-layout">
              <div className="pf-topbar">
                <button
                  type="button"
                  className="pf-back-btn"
                  onClick={() => go("onboarding-1")}
                  aria-label="前の画面へ"
                >
                  ←
                </button>
                <div>
                  <h2 id="onboarding-2-heading" className="pf-screen-title">
                    選び方のコツ
                  </h2>
                  <p className="pf-screen-sub">迷っても大丈夫</p>
                </div>
                <span className="pf-mini-btn">2/3</span>
              </div>
              <div className="pf-brief-badge">最初は直感でOK</div>
              <div className="pf-brief-card">
                <h3>
                  「自分なら言いそう」
                  <br />
                  を選んでください
                </h3>
                <p>
                  きれいな答えを選ぶより、普段の自分に近い選択をすると学びが増えます。
                </p>
                <div className="pf-metric-row">
                  <div className="pf-metric">
                    <strong>A</strong>
                    丁寧
                  </div>
                  <div className="pf-metric">
                    <strong>B</strong>
                    即行動
                  </div>
                  <div className="pf-metric">
                    <strong>C</strong>
                    遠慮
                  </div>
                </div>
              </div>
              <div className="pf-coach-bubble">
                選択後に「そのタイプの強み」と「落とし穴」が表示されます。
              </div>
              <div className="pf-skip-row">
                <button type="button" className="pf-soft-btn" onClick={skipOnboarding}>
                  スキップ
                </button>
                <button
                  type="button"
                  className="pf-big-btn pf-big-btn-compact"
                  onClick={() => go("onboarding-3")}
                >
                  次へ ▶
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="screen-onboarding-3"
        className={isActive("onboarding-3")}
        aria-labelledby="onboarding-3-heading"
      >
        <div className="pf-screen pf-paper">
          <div className="pf-safe">
            <div className="pf-first-layout">
              <div className="pf-topbar">
                <button
                  type="button"
                  className="pf-back-btn"
                  onClick={() => go("onboarding-2")}
                  aria-label="前の画面へ"
                >
                  ←
                </button>
                <div>
                  <h2 id="onboarding-3-heading" className="pf-screen-title">
                    結果の見方
                  </h2>
                  <p className="pf-screen-sub">失敗しても練習になる</p>
                </div>
                <span className="pf-mini-btn">3/3</span>
              </div>
              <div className="pf-brief-badge">見てほしいポイント</div>
              <div className="pf-brief-card">
                <h3>
                  結果よりも
                  <br />
                  次に使えるコツを見る
                </h3>
                <div className="pf-brief-steps">
                  <div className="pf-brief-step">
                    <strong>✓</strong>
                    なぜ正解?
                  </div>
                  <div className="pf-brief-step">
                    <strong>!</strong>
                    落とし穴
                  </div>
                  <div className="pf-brief-step">
                    <strong>→</strong>
                    明日使う
                  </div>
                </div>
                <p>
                  現実の職場で使えるように、最後に短い実践ヒントを出します。
                </p>
              </div>
              <div className="pf-coach-bubble">
                ここまで見たら、あとは1ステージ3分で遊べます。
              </div>
              <button
                type="button"
                className="pf-big-btn"
                onClick={completeOnboarding}
              >
                タイプ選択へ ▶
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
