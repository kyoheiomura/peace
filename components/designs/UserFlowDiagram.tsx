import Link from "next/link";
import { PhoneFrame } from "@/components/PhoneFrame";
import {
  gameFlowEmbedPath,
  type GameFlowEmbedSlug,
} from "@/lib/gameFlowScreens";

type FlowEdge = {
  label: string;
  note?: string;
};

type FlowNode = {
  id: string;
  title: string;
  screenId?: string;
  route?: string;
  summary: string;
  embed: GameFlowEmbedSlug;
  extraEmbeds?: { slug: GameFlowEmbedSlug; caption: string }[];
  edges?: FlowEdge[];
  back?: string;
  adopted?: boolean;
  rationale?: string[];
  links?: { href: string; label: string }[];
};

const FLOW: FlowNode[] = [
  {
    id: "lp",
    title: "ランディング（LP）",
    route: "/",
    embed: "lp",
    summary:
      "PCでは PhoneFrame 内に /game を iframe 表示。モバイルは「プレイする」で /game へフルスクリーン遷移。",
    edges: [{ label: "プレイする ▶", note: "router.push('/game')" }],
    links: [{ href: "/", label: "LP を開く" }],
  },
  {
    id: "title",
    title: "タイトル",
    screenId: "screen-title",
    route: "/game",
    embed: "title",
    summary:
      "進行保存ありなら「続きから」。初回はオンボーディング、2回目以降はキャラ選択へ直行。「すぐゲーム開始」はオンボをスキップ。",
    edges: [
      { label: "ゲーム開始 / 30秒でわかる ▶" },
      { label: "続きから ▶", note: "localStorage から復帰" },
      { label: "すぐゲーム開始", note: "オンボ省略 → type" },
    ],
    links: [{ href: "/game", label: "本番ゲーム" }],
  },
  {
    id: "onboarding",
    title: "オンボーディング（初回のみ）",
    screenId: "onboarding-1 → 3",
    embed: "onboarding-1",
    extraEmbeds: [
      { slug: "onboarding-2", caption: "2/3 · 選び方のコツ" },
      { slug: "onboarding-3", caption: "3/3 · 結果の見方" },
    ],
    summary:
      "3画面で遊び方・選び方・結果の見方を説明。スキップ可能。完了後は localStorage に記録し、次回から表示しない。",
    edges: [
      { label: "次へ ▶", note: "1 → 2 → 3" },
      { label: "スキップ", note: "いつでも type へ" },
      { label: "タイプ選択へ ▶", note: "3画面目の CTA" },
    ],
    back: "← 各画面で title または前のオンボへ",
    rationale: [
      "初回だけ30秒説明。リピーターの摩擦を減らすため localStorage で制御。",
      "「すぐゲーム開始」で同じ導線を維持しつつスキップ可能にした。",
    ],
  },
  {
    id: "type",
    title: "キャラ選択（タイプ）",
    screenId: "screen-type",
    embed: "type",
    adopted: true,
    summary:
      "採用レイアウト: 2×8 · 2×4表示＋縦スライドで16タイプ。上部に選択中タイプのヒーロー、下部グリッドでタップ選択。",
    edges: [{ label: "このタイプで開始 ▶", note: "→ stage" }],
    back: "← title",
    rationale: [
      "4×4（象限4ページ）は「どのページに誰がいるか」を覚える負荷が大きい。",
      "2×8 縦スライドは一覧性と1画面内の密度のバランスが良い（char-picker 比較で決定）。",
      "横スライド案は lib/charPickerConfig.ts で切替可能だが、本番は vertical を採用。",
      "選択と同時にシナリオが切り替わるため、ヒーロー＋ニックネームで即フィードバック。",
    ],
    links: [
      { href: "/designs/char-picker", label: "キャラ選択デザイン比較" },
    ],
  },
  {
    id: "stage",
    title: "ステージ選択",
    screenId: "screen-stage",
    embed: "stage",
    summary:
      "5ステージをリスト表示。クリア済み ✓、次におすすめのステージをハイライト。キャラはヒーロー表示のみ（変更は type へ戻る）。",
    edges: [{ label: "ステージをタップ", note: "→ choice（そのステージのシナリオ）" }],
    back: "← type（タイプ選択へ）",
    rationale: [
      "MBTI はゲーム中ほぼ変えない前提のため、大きなピッカーは廃止。",
      "戻るは title ではなく type にし、誤ってホームに落ちる体験を防ぐ。",
    ],
  },
  {
    id: "choice",
    title: "切り出し（1/2）",
    screenId: "screen-choice",
    embed: "choice",
    summary: "ステージの状況説明を読み、「どう切り出す？」の3択から選ぶ。",
    edges: [
      {
        label: "選択肢タップ → 確認モーダル → 確定",
        note: "→ action",
      },
    ],
    back: "← stage",
  },
  {
    id: "action",
    title: "振る舞い（2/2）",
    screenId: "screen-action",
    embed: "action",
    summary:
      "前の切り出しを要約表示しつつ「どう振る舞う？」を選ぶ。状況文が長いときは折りたたみ。",
    edges: [
      {
        label: "選択肢タップ → 確認 → 確定",
        note: "スコア反映後 → result",
      },
    ],
    back: "← choice",
  },
  {
    id: "result",
    title: "チャレンジ結果",
    screenId: "screen-result",
    embed: "result",
    summary:
      "クリア表示・選択した2回答の振り返り・アコーディオンで3つの学びカード。詳細解説は detail へも遷移可。",
    edges: [
      { label: "解説カードを展開", note: "同一画面内" },
      { label: "詳細へ（任意）", note: "→ detail" },
      { label: "次のステージへ / ステージ選択へ", note: "goNextFromLesson 相当" },
    ],
    back: "◀ ステージ選択画面に戻る",
    rationale: [
      "feedback + lesson を1画面に統合し、往復を減らした。",
      "「次のステージへ」は未クリアの最小番号へ直行（ステージ選択を挟まない）。",
    ],
  },
  {
    id: "detail",
    title: "解説詳細（任意）",
    screenId: "screen-detail",
    embed: "detail",
    summary: "結果画面のアコーディオンから深掘りするフルスクリーン解説。",
    edges: [
      { label: "次の解説へ ▶", note: "カード間を順送り" },
      {
        label: "最後の解説後",
        note: "未クリア stage → choice / 全クリア → clear / それ以外 → stage",
      },
    ],
    back: "← result · ◀ ステージ選択へ",
  },
  {
    id: "loop",
    title: "ステージ周回",
    embed: "stage-loop",
    summary:
      "1ステージクリアごとに stage に戻り、次の未クリアをプレイ。5/5 でクリア証へ。プレビューはステージ1〜3クリア済みの状態。",
    edges: [
      { label: "result / detail から stage へ", note: "進捗・スコアは維持" },
      { label: "5ステージすべてクリア", note: "→ clear" },
    ],
  },
  {
    id: "clear",
    title: "クリア証（5/5）",
    screenId: "screen-clear",
    embed: "clear",
    summary: "スコア・コンボ・信頼度の総括。もう一度プレイ・結果コピー・ステージ選択へ。",
    edges: [
      { label: "もう一度プレイ ▶", note: "confirm 後に進捗リセット → stage" },
      { label: "結果をコピー" },
      { label: "◀ ステージ選択へ" },
    ],
    links: [{ href: "/", label: "← トップ（LP）" }],
  },
];

function FlowConnector() {
  return (
    <div className="design-flow-connector" aria-hidden>
      <span className="design-flow-connector-line" />
      <span className="design-flow-connector-chevron">▼</span>
    </div>
  );
}

function FlowPreview({
  slug,
  caption,
}: {
  slug: GameFlowEmbedSlug;
  caption?: string;
}) {
  return (
    <figure className="design-flow-preview">
      {caption ? <figcaption>{caption}</figcaption> : null}
      <PhoneFrame src={gameFlowEmbedPath(slug)} />
    </figure>
  );
}

export function UserFlowDiagram() {
  return (
    <ol className="design-flow-track">
      {FLOW.map((node, index) => (
        <li key={node.id} className="design-flow-item">
          <div className="design-flow-row">
            <article
              className={[
                "design-flow-node",
                node.adopted ? "design-flow-node--adopted" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <header className="design-flow-node-head">
                <span className="design-flow-node-id">{node.id}</span>
                {node.adopted ? (
                  <span className="design-flow-badge">採用決定</span>
                ) : null}
                <h3>{node.title}</h3>
                {node.screenId ? (
                  <p className="design-flow-meta">
                    <code>{node.screenId}</code>
                    {node.route ? (
                      <>
                        {" · "}
                        <Link href={node.route}>{node.route}</Link>
                      </>
                    ) : null}
                  </p>
                ) : null}
              </header>

              <p className="design-flow-summary">{node.summary}</p>

              {node.rationale?.length ? (
                <div className="design-flow-rationale">
                  <p className="design-flow-rationale-label">採用理由・設計メモ</p>
                  <ul>
                    {node.rationale.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {node.edges?.length ? (
                <div className="design-flow-edges">
                  <p className="design-flow-edges-label">進む</p>
                  <ul>
                    {node.edges.map((edge) => (
                      <li key={edge.label}>
                        <strong>{edge.label}</strong>
                        {edge.note ? (
                          <span className="design-flow-edge-note">{edge.note}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {node.back ? (
                <p className="design-flow-back">
                  <span className="design-flow-back-label">戻る</span> {node.back}
                </p>
              ) : null}

              {node.links?.length ? (
                <p className="design-flow-links">
                  {node.links.map((link) => (
                    <Link key={link.href} href={link.href}>
                      {link.label}
                    </Link>
                  ))}
                </p>
              ) : null}
            </article>

            <div className="design-flow-previews">
              <FlowPreview slug={node.embed} caption={node.title} />
              {node.extraEmbeds?.map((extra) => (
                <FlowPreview
                  key={extra.slug}
                  slug={extra.slug}
                  caption={extra.caption}
                />
              ))}
            </div>
          </div>

          {index < FLOW.length - 1 ? <FlowConnector /> : null}
        </li>
      ))}
    </ol>
  );
}
