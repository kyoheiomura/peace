"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { charPickerScrollSubcopy } from "../lib/charPickerConfig";
import { charImages, charNick, type CharacterType } from "../lib/characters";
import { mbtiScenarios } from "../lib/mbtiScenarios";
import { OnboardingScreens } from "./pieceful/OnboardingScreens";
import { CharPicker2x8Scroll } from "./pieceful/CharPicker2x8Scroll";
import { StageSelectionScreen } from "./pieceful/stage-selection/StageSelectionScreen";
import { ALL_STAGE_IDS } from "../lib/stageSelection";
import {
  ACTION_SCREEN_LAYOUT,
  computeActionLayoutMetrics,
} from "../lib/actionScreenLayout";

const stages: Record<
  number,
  {
    title: string;
    sub: string;
    kicker: string;
    npc: string;
    npcTag: string;
    npcImg: string;
    scenario: string;
    choices: {
      id: string;
      risk: string;
      score: number;
      grade: string;
      title: string;
      text: string;
      message: string;
      quote: string;
    }[];
    actions: {
      id: string;
      risk: string;
      score: number;
      text: string;
      feedback: string;
    }[];
    lessons: [string, string][];
  }
> = {
  1: {
    title: "ステージ1：先輩・上司",
    sub: "遅延報告ミッション",
    kicker: "⚠️ 納期遅延 / 早期相談",
    npc: "田中部長",
    npcTag: "論理派・責任者",
    npcImg: "/img/1.png",
    scenario:
      "あなたは社内プロジェクトのリーダー。来週金曜納期の成果物について、協力会社から納品遅延の連絡が入った。全体スケジュールは3日遅れる見込み。",
    choices: [
      {
        id: "A",
        risk: "安全",
        score: 25,
        grade: "S",
        title: "最高の切り出し",
        text: "「納期に影響する遅延が判明しました。現状・影響・対応案を3分で共有して、判断をいただきたいです。」",
        message:
          "事実、影響、相談事項が先に見えるので、責任者が判断しやすい伝え方です。",
        quote: "「いいね。まず全体影響から確認しよう。」",
      },
      {
        id: "B",
        risk: "危険",
        score: -10,
        grade: "C",
        title: "勢いはあるが危険",
        text: "「ちょっと大変なことになりました！でも多分なんとかなると思います！」",
        message:
          "緊急感は伝わりますが、根拠と判断材料が不足しています。上司の不安を増やしやすい切り出しです。",
        quote: "「多分では判断できない。事実を整理して。」",
      },
      {
        id: "C",
        risk: "保留",
        score: 5,
        grade: "B",
        title: "相談姿勢は良い",
        text: "「協力会社の納品が遅れそうです。どうすればいいでしょうか……？」",
        message:
          "相談はできていますが、丸投げに見えやすいです。最低限の状況整理と案を添えると信頼が上がります。",
        quote: "「状況は分かった。あなたの案は？」",
      },
    ],
    actions: [
      {
        id: "A",
        risk: "安全",
        score: 20,
        text: "影響範囲・代替案・判断してほしい点を1枚にまとめ、すぐ15分の確認時間を依頼する。",
        feedback:
          "行動まで完璧。上司の時間を奪わず、判断の質を上げています。",
      },
      {
        id: "B",
        risk: "危険",
        score: -8,
        text: "全員に「遅れます」とだけチャットで流し、詳細は聞かれたら答える。",
        feedback:
          "関係者の不安が増えます。報告は「影響」と「次アクション」をセットにしましょう。",
      },
      {
        id: "C",
        risk: "保留",
        score: 0,
        text: "協力会社からの続報を待って、確定してから報告する。",
        feedback:
          "遅延リスクは早めに共有した方が信頼を守れます。未確定でも「リスク」として報告しましょう。",
      },
    ],
    lessons: [
      [
        "なぜ正解なのか？",
        "上司が知りたいのは「何が起きたか」「どれくらい危ないか」「何を決めればいいか」です。感情より判断材料を先に出すと信頼されます。",
      ],
      [
        "あなたの落とし穴",
        "自分で抱え込みすぎると、報告が遅れてしまいます。完璧な解決策がなくても、早めのリスク共有が強い武器です。",
      ],
      [
        "現場での応用",
        "報告テンプレは「結論→影響→原因→対応案→相談したい判断」の順番が便利です。",
      ],
      [
        "プロの技",
        "悪いニュースほど早く、小さく、選択肢つきで出す。これが予防的コミュニケーションです。",
      ],
    ],
  },
  2: {
    title: "ステージ2：同僚",
    sub: "協力依頼ミッション",
    kicker: "🤝 巻き込み / 役割分担",
    npc: "佐藤さん",
    npcTag: "実行派・同僚",
    npcImg: "/img/7.png",
    scenario:
      "急ぎの資料作成で、同僚の佐藤さんにレビューをお願いしたい。ただし佐藤さんも別案件で忙しそう。相手の負担を増やしすぎず、協力してもらう必要がある。",
    choices: [
      {
        id: "A",
        risk: "安全",
        score: 22,
        grade: "S",
        title: "協力しやすい依頼",
        text: "「10分だけレビューをお願いできますか？見てほしいのは数字の整合性だけです。今日16時までだと助かります。」",
        message:
          "所要時間・範囲・期限が明確なので、相手が引き受けやすい依頼です。",
        quote: "「それなら見られるよ。数字だけ確認するね。」",
      },
      {
        id: "B",
        risk: "危険",
        score: -8,
        grade: "C",
        title: "重く見える依頼",
        text: "「この資料、全体的に良い感じに見てもらえますか？」",
        message:
          "範囲が曖昧で、相手の負担が読めません。忙しい相手ほど断りたくなります。",
        quote: "「全体的にって、どこまで見ればいい？」",
      },
      {
        id: "C",
        risk: "保留",
        score: 6,
        grade: "B",
        title: "気遣いはある",
        text: "「忙しいところすみません。もし無理なら大丈夫なんですが、少しだけ見てもらえませんか？」",
        message:
          "丁寧ですが、何をどれくらい見ればいいかが不足しています。",
        quote: "「少しって何分くらい？」",
      },
    ],
    actions: [
      {
        id: "A",
        risk: "安全",
        score: 18,
        text: "レビュー観点を3つに絞って、該当ページにコメントを入れてから依頼する。",
        feedback: "相手の作業コストを下げる依頼は、協力を生みます。",
      },
      {
        id: "B",
        risk: "危険",
        score: -5,
        text: "資料一式を丸ごと送り「気になるところを全部ください」と頼む。",
        feedback:
          "相手の脳内タスクが増えます。依頼は小さく切りましょう。",
      },
      {
        id: "C",
        risk: "保留",
        score: 3,
        text: "口頭で軽く頼み、あとで資料を送る。",
        feedback:
          "悪くはありませんが、依頼内容が残る形にすると認識ズレを防げます。",
      },
    ],
    lessons: [
      [
        "協力依頼の基本",
        "依頼は「時間・範囲・期限」を添えると一気に通りやすくなります。",
      ],
      [
        "NGパターン",
        "「いい感じに」「ざっくり」は、忙しい相手には重く聞こえます。",
      ],
      [
        "相手への配慮",
        "遠慮するより、負担を具体的に小さくする方が親切です。",
      ],
      [
        "職場で使える型",
        "「10分だけ」「この2ページだけ」「観点は数字だけ」のように依頼を小さくします。",
      ],
    ],
  },
  3: {
    title: "ステージ3：後輩",
    sub: "フィードバックミッション",
    kicker: "🌱 育成 / 伝え方",
    npc: "山本さん",
    npcTag: "共感派・後輩",
    npcImg: "/img/10.png",
    scenario:
      "後輩の山本さんが作った提案書に、良い点はあるものの、目的と結論がずれている。やる気を下げずに、修正してもらう必要がある。",
    choices: [
      {
        id: "A",
        risk: "安全",
        score: 24,
        grade: "S",
        title: "伸ばすフィードバック",
        text: "「調査量はすごく良いです。さらに伝わる資料にするために、最初に結論を1行足してみよう。」",
        message:
          "良い点を認めてから、次の改善点を具体化できています。",
        quote: "「ありがとうございます。結論から直してみます！」",
      },
      {
        id: "B",
        risk: "危険",
        score: -12,
        grade: "C",
        title: "心が折れやすい",
        text: "「これだと何が言いたいのか分からない。最初からやり直して。」",
        message:
          "問題点は伝わりますが、改善方向が見えず、相手の意欲を下げやすいです。",
        quote: "「すみません……どこから直せばいいですか？」",
      },
      {
        id: "C",
        risk: "保留",
        score: 4,
        grade: "B",
        title: "優しいが曖昧",
        text: "「全体的にはいいと思うよ。もう少し分かりやすくしてみて。」",
        message:
          "優しさはありますが、何を直せばいいかが曖昧です。",
        quote: "「分かりやすく……どのあたりでしょう？」",
      },
    ],
    actions: [
      {
        id: "A",
        risk: "安全",
        score: 18,
        text: "良い点を1つ、直す点を1つ、次の確認タイミングを1つ伝える。",
        feedback: "後輩が迷わず動ける、育成に強い行動です。",
      },
      {
        id: "B",
        risk: "危険",
        score: -7,
        text: "自分で直した方が早いので、黙って全部修正して返す。",
        feedback:
          "短期的には早いですが、後輩の学習機会が消えます。",
      },
      {
        id: "C",
        risk: "保留",
        score: 2,
        text: "修正点をたくさん箇条書きで送る。",
        feedback:
          "情報量が多すぎると優先順位が分からなくなります。まず1〜2点に絞りましょう。",
      },
    ],
    lessons: [
      [
        "育成の型",
        "「認める→焦点を絞る→次の一歩」の順番が有効です。",
      ],
      [
        "後輩の不安",
        "抽象的なダメ出しは、相手に自己否定として届きやすいです。",
      ],
      [
        "具体化のコツ",
        "「結論を1行足す」「1枚目を入れ替える」のように行動レベルで伝えます。",
      ],
      [
        "伸びる関係",
        "相手の努力を見つけて言語化すると、改善提案が受け取られやすくなります。",
      ],
    ],
  },
  4: {
    title: "ステージ4：クライアント",
    sub: "期待調整ミッション",
    kicker: "🧑‍💼 提案 / 合意形成",
    npc: "鈴木様",
    npcTag: "慎重派・顧客",
    npcImg: "/img/5.png",
    scenario:
      "クライアントから「来週までに追加機能も入れられますよね？」と相談された。実装は可能だが、品質確認の時間が足りなくなるリスクがある。関係を壊さず期待調整したい。",
    choices: [
      {
        id: "A",
        risk: "安全",
        score: 24,
        grade: "S",
        title: "信頼を守る期待調整",
        text: "「可能性はあります。ただ、品質確認を十分に取るなら、追加機能は範囲を絞るか、納期を分けるのが安全です。」",
        message:
          "否定せず、リスクと選択肢を提示できています。顧客が判断しやすい伝え方です。",
        quote: "「なるほど。範囲を絞る案で考えたいです。」",
      },
      {
        id: "B",
        risk: "危険",
        score: -10,
        grade: "C",
        title: "安請け合い",
        text: "「はい、大丈夫だと思います！なんとかします！」",
        message:
          "一時的には安心されますが、後から品質・納期トラブルになりやすいです。",
        quote: "「ではそれでお願いします。」",
      },
      {
        id: "C",
        risk: "保留",
        score: 3,
        grade: "B",
        title: "正しいが冷たい",
        text: "「それは無理です。今から追加はできません。」",
        message:
          "境界線は引けていますが、代替案がなく関係性が硬くなりやすいです。",
        quote: "「そうですか……他に方法はないですか？」",
      },
    ],
    actions: [
      {
        id: "A",
        risk: "安全",
        score: 18,
        text: "追加機能を「必須・できれば・次回」の3段階に分ける打ち合わせを提案する。",
        feedback: "期待調整が具体的になり、合意を作りやすい行動です。",
      },
      {
        id: "B",
        risk: "危険",
        score: -8,
        text: "社内に戻ってから、メンバーに残業で対応するよう頼む。",
        feedback:
          "顧客の期待を守る前に、社内の信頼を失う危険があります。",
      },
      {
        id: "C",
        risk: "保留",
        score: 2,
        text: "見積もりを出すまで回答を保留する。",
        feedback:
          "保留は有効ですが、いつ何を回答するかを明確にすると安心されます。",
      },
    ],
    lessons: [
      [
        "顧客対応の基本",
        "できない理由だけでなく、選べる道を提示すると前向きな会話になります。",
      ],
      [
        "安請け合いの罠",
        "「大丈夫です」は短期的に気持ちいいですが、長期的な信頼を削ることがあります。",
      ],
      [
        "期待調整の型",
        "「可能性→リスク→選択肢→おすすめ」の順で伝えると合意形成しやすいです。",
      ],
      [
        "プロの一言",
        "「安全に進めるなら」を枕詞にすると、品質を守る提案として届きます。",
      ],
    ],
  },
  5: {
    title: "ステージ5：他部署",
    sub: "巻き込みミッション",
    kicker: "🌀 部署間連携 / 合意形成",
    npc: "高橋さん",
    npcTag: "慎重派・他部署",
    npcImg: "/img/12.png",
    scenario:
      "新しい施策を進めるため、他部署の高橋さんに協力してもらう必要がある。ただ、高橋さんの部署には直接メリットが見えにくく、優先順位も高くなさそう。",
    choices: [
      {
        id: "A",
        risk: "安全",
        score: 23,
        grade: "S",
        title: "相手目線の巻き込み",
        text: "「この施策で御部署の問い合わせ対応が減る可能性があります。まず負担が少ない形で10分だけ相談できますか？」",
        message:
          "相手部署のメリットと負担の小ささを先に伝えられています。",
        quote: "「問い合わせが減るなら、一度聞きたいです。」",
      },
      {
        id: "B",
        risk: "危険",
        score: -9,
        grade: "C",
        title: "自部署都合に見える",
        text: "「こちらの施策で必要なので、御部署でも対応をお願いします。」",
        message:
          "目的は伝わりますが、相手にとっての意味が見えません。押し付けに感じられます。",
        quote: "「こちらも予定があるので、急には難しいです。」",
      },
      {
        id: "C",
        risk: "保留",
        score: 5,
        grade: "B",
        title: "丁寧だが弱い",
        text: "「お忙しいところ恐縮ですが、可能であれば少し協力いただけないでしょうか。」",
        message:
          "丁寧ですが、なぜ協力する価値があるのかが不足しています。",
        quote: "「内容次第ですね。」",
      },
    ],
    actions: [
      {
        id: "A",
        risk: "安全",
        score: 18,
        text: "相手部署のメリット、必要作業、所要時間を1枚にまとめて事前共有する。",
        feedback:
          "他部署連携では、相手の説明コストを下げる準備が効きます。",
      },
      {
        id: "B",
        risk: "危険",
        score: -6,
        text: "上司から高橋さんの部署に依頼してもらう。",
        feedback:
          "上から通すだけだと、協力ではなく作業命令になりやすいです。",
      },
      {
        id: "C",
        risk: "保留",
        score: 3,
        text: "まず雑談で関係を作ってから、後日あらためて相談する。",
        feedback:
          "関係づくりは良いですが、目的とメリットの説明もセットにしましょう。",
      },
    ],
    lessons: [
      [
        "巻き込みの基本",
        "他部署には「自分たちにどんな意味があるか」を先に示す必要があります。",
      ],
      [
        "押し付けの回避",
        "自部署の目的だけを語ると、相手には追加作業として届きます。",
      ],
      [
        "資料の作り方",
        "相手のメリット、必要な協力、作業時間、期限を1枚で見える化します。",
      ],
      [
        "合意形成のコツ",
        "小さく始める提案にすると、相手は参加しやすくなります。",
      ],
    ],
  },
};

const PROGRESS_KEY = "pieceful:v1:progress" as const;
const ONBOARDING_KEY = "pieceful:onboardingCompleted" as const;
export type PiecefulPreviewScreen =
  | "title"
  | "onboarding-1"
  | "onboarding-2"
  | "onboarding-3"
  | "type"
  | "stage"
  | "scene"
  | "choice"
  | "action"
  | "result"
  | "detail"
  | "clear";

type Screen = PiecefulPreviewScreen;

export type PiecefulGameProps = {
  /** iframe embed: phone-mockup ラッパーを外す */
  embed?: boolean;
  /** 導線マップ用: 固定画面を表示 */
  previewScreen?: PiecefulPreviewScreen;
  previewClearedStages?: number[];
  /** title プレビューで「続きから」を見せる */
  previewHasSave?: boolean;
};

function hasCompletedOnboarding(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(ONBOARDING_KEY) === "true";
  } catch {
    return false;
  }
}

function markOnboardingCompleted(): void {
  try {
    localStorage.setItem(ONBOARDING_KEY, "true");
  } catch {
    /* ignore */
  }
}

const DETAIL_BADGES = ["話の目的を先に示す", "タイプ別の注意点", "現場で使う順番"] as const;

function splitScenarioParagraphs(text: string): string[] {
  const parts = text
    .split(/(?<=[。！？])/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length <= 3) return parts;
  return [parts[0]!, parts.slice(1, -1).join(""), parts.at(-1)!].filter(Boolean);
}

type LessonCard = { title: string; body: string };

type PendingPick = {
  kind: "choice" | "action";
  id: string;
  label: string;
};

function normalizePickId(id: string): string {
  return id.trim().toUpperCase();
}

function readPickLabelFromButton(btn: HTMLElement): string {
  const spans = btn.querySelectorAll(":scope > span");
  if (spans.length >= 2) {
    return (spans[spans.length - 1].textContent ?? "").trim();
  }
  return (btn.textContent ?? "").trim();
}

type PiecefulProgressV1 = {
  version: 1;
  selectedType: string;
  currentScreen: Screen;
  currentStage: number | null;
  score: number;
  combo: number;
  maxCombo: number;
  trust: number;
  clearedStages: number[];
  updatedAt: string;
};

function getNextUnclearedStage(cleared: Set<number>): number | null {
  for (const id of ALL_STAGE_IDS) {
    if (!cleared.has(id)) return id;
  }
  return null;
}

function isAllCleared(cleared: Set<number>): boolean {
  return ALL_STAGE_IDS.every((id) => cleared.has(id));
}

/** **強調** 記法を赤文字の span に変換して表示する */
function renderEmphasisText(text: string, keyPrefix = "em"): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <span key={`${keyPrefix}-${key++}`} className="pf-emphasis">
        {match[1]}
      </span>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? parts : [text];
}

function FormattedScenarioText({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/).filter((p) => p.length > 0);
  if (paragraphs.length === 0) return null;
  if (paragraphs.length === 1) {
    return <p>{renderEmphasisText(paragraphs[0], "p0")}</p>;
  }
  return (
    <>
      {paragraphs.map((para, i) => (
        <p key={i} className={i > 0 ? "pf-detail-para" : undefined}>
          {renderEmphasisText(para, `p${i}`)}
        </p>
      ))}
    </>
  );
}

const RESULT_LESSON_TITLES = [
  "なぜ正解なのか",
  "あなたの落とし穴",
  "明日から使えるヒント",
  "もっと知りたい人へ",
] as const;

function ResultCtaBlock({ className }: { className?: string }) {
  return (
    <div className={["pf-result-cta", className].filter(Boolean).join(" ")}>
      <p className="pf-result-cta-kicker">＼あなたの強みを活かす！／</p>
      <button type="button" className="pf-yellow-pill pf-result-cta-btn">
        詳しい解説と実践のコツを見る
      </button>
    </div>
  );
}

function ResultAccordionItem({
  index,
  title,
  body,
  isOpen,
  onToggle,
}: {
  index: number;
  title: string;
  body: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelId = `result-accordion-panel-${index}`;
  const headId = `result-accordion-head-${index}`;
  return (
    <div className={`pf-result-accordion${isOpen ? " is-open" : ""}`}>
      <button
        type="button"
        id={headId}
        className="pf-result-accordion-head"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="pf-result-accordion-title">
          {index + 1}. {title}
        </span>
        <span className="pf-result-accordion-arrow" aria-hidden>
          {isOpen ? "▲" : "▼"}
        </span>
      </button>
      {isOpen ? (
        <div
          id={panelId}
          className="pf-result-accordion-body"
          role="region"
          aria-labelledby={headId}
        >
          <FormattedScenarioText text={body} />
        </div>
      ) : null}
    </div>
  );
}

function normalizeRestoredScreen(screen: string, cleared: Set<number>): Screen {
  if (
    screen === "mission" ||
    screen === "scene" ||
    screen === "choice" ||
    screen === "feedback" ||
    screen === "action" ||
    screen === "result" ||
    screen === "lesson" ||
    screen === "detail"
  ) {
    return "stage";
  }
  if (screen === "clear") {
    return isAllCleared(cleared) ? "clear" : "stage";
  }
  if (
    screen === "title" ||
    screen === "onboarding-1" ||
    screen === "onboarding-2" ||
    screen === "onboarding-3" ||
    screen === "type" ||
    screen === "stage"
  ) {
    return screen as Screen;
  }
  return "title";
}

/* ── helper ── */

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/* ── component ── */

export function PiecefulGame({
  embed = false,
  previewScreen,
  previewClearedStages,
  previewHasSave = false,
}: PiecefulGameProps = {}) {
  const isPreview = Boolean(previewScreen);

  /* state */
  const [currentScreen, setCurrentScreen] = useState<Screen>(
    previewScreen ?? "title"
  );
  const [character, setCharacter] = useState(
    isPreview ? "INTJ" : "ESTP"
  );
  const [stage, setStage] = useState(1);
  const [trust, setTrust] = useState(35);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [guideOpen, setGuideOpen] = useState(false);
  const [clearedStages, setClearedStages] = useState<Set<number>>(new Set());
  const [hasSave, setHasSave] = useState(false);
  const [detailIndex, setDetailIndex] = useState(0);
  const [sceneParagraphs, setSceneParagraphs] = useState<string[]>([]);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [selectedChoiceText, setSelectedChoiceText] = useState("");
  const [selectedActionText, setSelectedActionText] = useState("");
  const [lessonCards, setLessonCards] = useState<LessonCard[]>([]);
  const [resultExpandedSection, setResultExpandedSection] = useState<number | null>(
    null
  );
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [pendingPick, setPendingPick] = useState<PendingPick | null>(null);
  const [priorChoiceOpen, setPriorChoiceOpen] = useState(false);
  const [priorChoiceOverflows, setPriorChoiceOverflows] = useState(false);
  const [scenarioClampPx, setScenarioClampPx] = useState<number | null>(null);

  /* refs for DOM containers that get innerHTML */
  const choicesRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const toastElRef = useRef<HTMLDivElement>(null);
  const confettiRef = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  /* refs for HUD elements */
  const trustLabelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const trustFillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const comboLabelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const starLabelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chosenImgRef = useRef<HTMLImageElement>(null);
  const chosenTypeRef = useRef<HTMLSpanElement>(null);
  const chosenNickRef = useRef<HTMLSpanElement>(null);
  const coachImgRef = useRef<HTMLImageElement>(null);

  /* refs for feedback elements */
  const resultCardRef = useRef<HTMLDivElement>(null);
  const gradeRef = useRef<HTMLDivElement>(null);
  const feedbackHeadingRef = useRef<HTMLHeadingElement>(null);
  const feedbackMessageRef = useRef<HTMLParagraphElement>(null);
  const npcQuoteRef = useRef<HTMLDivElement>(null);
  const coachBubbleRef = useRef<HTMLDivElement>(null);
  const resultSubRef = useRef<HTMLParagraphElement>(null);
  const actionFlowRef = useRef<HTMLDivElement>(null);
  const kiridashiRef = useRef<HTMLDivElement>(null);
  const priorScenarioBodyRef = useRef<HTMLDivElement>(null);
  const resultConfettiFiredRef = useRef(false);

  /* store lastAnswer / lastChoice as refs (used only by logic, not rendering) */
  const lastAnswerRef = useRef<Record<string, unknown> | null>(null);
  const lastChoiceRef = useRef<string | null>(null);
  const lastActionRef = useRef<string | null>(null);

  /* local copy of trust for syncHud (avoids stale closure) */
  const trustRef = useRef(trust);
  const scoreRef = useRef(score);
  const comboRef = useRef(combo);
  const characterRef = useRef(character);
  const clearedRef = useRef(clearedStages);

  useEffect(() => {
    trustRef.current = trust;
  }, [trust]);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  useEffect(() => {
    comboRef.current = combo;
  }, [combo]);
  useEffect(() => {
    characterRef.current = character;
  }, [character]);
  useEffect(() => {
    clearedRef.current = clearedStages;
  }, [clearedStages]);

  const priorScenarioParagraphs = useMemo(() => {
    if (sceneParagraphs.length > 0) return sceneParagraphs;
    const s = stages[stage];
    const csv = mbtiScenarios[character]?.[stage];
    const raw = csv?.situation || s?.scenario || "";
    return splitScenarioParagraphs(raw);
  }, [sceneParagraphs, stage, character]);

  const measureActionLayout = useCallback(() => {
    const layout = actionFlowRef.current;
    const body = priorScenarioBodyRef.current;
    if (!layout || !body) return;

    const topbar =
      layout.querySelector<HTMLElement>(".pf-topbar")?.offsetHeight ?? 46;
    const kiridashi = kiridashiRef.current?.offsetHeight ?? 56;
    const prompt =
      layout.querySelector<HTMLElement>(".pf-prompt")?.offsetHeight ?? 28;

    const metrics = computeActionLayoutMetrics(
      layout.clientHeight,
      topbar + kiridashi + prompt + 4 * 3
    );

    body.style.maxHeight = "none";
    body.style.overflow = "visible";
    const fullHeight = body.scrollHeight;
    const estimatedLines = priorScenarioParagraphs.reduce(
      (sum, p) =>
        sum + Math.max(1, Math.ceil(p.length / ACTION_SCREEN_LAYOUT.charsPerLine)),
      0
    );
    const overflows =
      fullHeight > metrics.scenarioClampPx + 2 ||
      estimatedLines > metrics.maxCollapsedLines;

    setPriorChoiceOverflows(overflows);
    if (!overflows) {
      setScenarioClampPx(null);
      setPriorChoiceOpen(false);
      return;
    }
    if (priorChoiceOpen) {
      setScenarioClampPx(null);
    } else {
      setScenarioClampPx(metrics.scenarioClampPx);
    }
  }, [priorChoiceOpen, priorScenarioParagraphs]);

  useEffect(() => {
    if (currentScreen !== "action") return;
    const run = () => measureActionLayout();
    run();
    const raf = requestAnimationFrame(() => requestAnimationFrame(run));

    const layout = actionFlowRef.current;
    if (!layout) {
      return () => cancelAnimationFrame(raf);
    }

    const observer = new ResizeObserver(() => measureActionLayout());
    observer.observe(layout);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [
    currentScreen,
    priorScenarioParagraphs,
    selectedChoiceText,
    measureActionLayout,
  ]);

  useEffect(() => {
    if (currentScreen !== "action") return;
    measureActionLayout();
  }, [priorChoiceOpen, currentScreen, measureActionLayout]);

  /* ── helper: active class ── */
  const isActive = (screen: Screen) =>
    currentScreen === screen ? "screen active" : "screen";

  /* ── syncHud ── */
  const syncHud = useCallback(() => {
    const t = clamp(trustRef.current, 0, 100);
    trustLabelRefs.current.forEach((el) => {
      if (el) el.textContent = `${t}%`;
    });
    trustFillRefs.current.forEach((el) => {
      if (el) el.style.width = `${t}%`;
    });
    comboLabelRefs.current.forEach((el) => {
      if (el) el.textContent = `🔥 COMBO ${comboRef.current}`;
    });
    starLabelRefs.current.forEach((el) => {
      if (el) el.textContent = `⭐ ${scoreRef.current}`;
    });
    if (chosenImgRef.current)
      chosenImgRef.current.src = charImages[characterRef.current];
    if (chosenTypeRef.current)
      chosenTypeRef.current.textContent = characterRef.current;
    if (chosenNickRef.current)
      chosenNickRef.current.textContent = charNick[characterRef.current];
    if (coachImgRef.current)
      coachImgRef.current.src = charImages[characterRef.current];
  }, []);


  /* ── ref for phone-screen scroll container ── */
  const appRef = useRef<HTMLElement>(null);

  /* ── go: reset scroll in .app and window (PC phone mock + iframe) ── */
  const go = useCallback(
    (screen: Screen) => {
      setCurrentScreen(screen);
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        const container = appRef.current;
        if (container) {
          container.scrollTop = 0;
        }
      });
      setTimeout(syncHud, 0);
    },
    [syncHud]
  );

  /* ── toast ── */
  const toast = useCallback((message: string) => {
    if (!toastElRef.current) return;
    toastElRef.current.textContent = message;
    toastElRef.current.classList.add("show");
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      toastElRef.current?.classList.remove("show");
    }, 1800);
  }, []);

  /* ── burst (confetti) ── */
  const burst = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    if (!confettiRef.current) return;
    confettiRef.current.innerHTML = "";
    const colors = [
      "#facc15",
      "#38bdf8",
      "#ec4899",
      "#22c55e",
      "#fb923c",
      "#a855f7",
    ];
    for (let i = 0; i < 34; i++) {
      const piece = document.createElement("i");
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[i % colors.length];
      piece.style.animationDelay = `${Math.random() * 240}ms`;
      piece.style.animationDuration = `${700 + Math.random() * 650}ms`;
      confettiRef.current.appendChild(piece);
    }
    setTimeout(() => {
      if (confettiRef.current) confettiRef.current.innerHTML = "";
    }, 1500);
  }, []);

  useEffect(() => {
    if (currentScreen !== "result") {
      resultConfettiFiredRef.current = false;
      return;
    }
    if (resultConfettiFiredRef.current) return;
    resultConfettiFiredRef.current = true;
    const timer = setTimeout(burst, 120);
    return () => clearTimeout(timer);
  }, [currentScreen, burst]);

  /* ── selectCharacter ── */
  const selectCharacter = useCallback(
    (type: string, options?: { fromPicker?: boolean }) => {
      setCharacter(type);
      characterRef.current = type;
      if (!options?.fromPicker) {
        toast(`${type}：${charNick[type]} を選択！`);
      }
      syncHud();
      if (!options?.fromPicker) {
        setTimeout(() => go("type"), 180);
      }
    },
    [toast, syncHud, go]
  );

  const choiceButtonHtml = (
    id: string,
    text: string,
    dataAttr: "data-choice-id" | "data-action-id"
  ) =>
    `<button type="button" class="pf-choice" ${dataAttr}="${id}">
      <span class="pf-choice-letter ${id.toLowerCase()}">${id}</span>
      <span>${text}</span>
    </button>`;

  const getChoiceLabel = useCallback((id: string): string => {
    const pickId = normalizePickId(id);
    const csv = mbtiScenarios[characterRef.current]?.[stage];
    if (csv) {
      return csv.kiridashi[pickId as keyof typeof csv.kiridashi] as string;
    }
    return stages[stage]?.choices.find((c) => c.id === pickId)?.text ?? "";
  }, [stage]);

  const getActionLabel = useCallback((id: string): string => {
    const pickId = normalizePickId(id);
    const csv = mbtiScenarios[characterRef.current]?.[stage];
    if (csv) {
      return csv.furumai[pickId as keyof typeof csv.furumai] as string;
    }
    return stages[stage]?.actions.find((a) => a.id === pickId)?.text ?? "";
  }, [stage]);

  /* ── loadStageContent / renderChoices / renderActions ── */
  const loadStageContent = useCallback(() => {
    const s = stages[stage];
    const csv = mbtiScenarios[characterRef.current]?.[stage];
    const scenario = csv?.situation || s.scenario;
    setSceneParagraphs(splitScenarioParagraphs(scenario));
  }, [stage]);

  const renderChoices = useCallback(() => {
    const s = stages[stage];
    const csv = mbtiScenarios[characterRef.current]?.[stage];
    if (!choicesRef.current) return;
    if (csv) {
      const labels = ["A", "B", "C", "D"] as const;
      choicesRef.current.innerHTML = labels
        .map((id) =>
          choiceButtonHtml(id, csv.kiridashi[id], "data-choice-id")
        )
        .join("");
    } else {
      choicesRef.current.innerHTML = s.choices
        .map((c) => choiceButtonHtml(c.id, c.text, "data-choice-id"))
        .join("");
    }
  }, [stage]);

  const renderActions = useCallback(() => {
    const s = stages[stage];
    const csv = mbtiScenarios[characterRef.current]?.[stage];
    if (!actionsRef.current) return;
    if (csv) {
      const labels = ["A", "B", "C", "D"] as const;
      actionsRef.current.innerHTML = labels
        .map((id) =>
          choiceButtonHtml(id, csv.furumai[id], "data-action-id")
        )
        .join("");
    } else {
      actionsRef.current.innerHTML = s.actions
        .map((a) => choiceButtonHtml(a.id, a.text, "data-action-id"))
        .join("");
    }
  }, [stage]);

  /* ── applyScore ── */
  const applyScore = useCallback((delta: number) => {
    const newScore = Math.max(
      0,
      scoreRef.current + Math.max(0, Math.round(delta / 2))
    );
    const newTrust = clamp(trustRef.current + delta, 0, 100);
    const newCombo = delta > 10 ? comboRef.current + 1 : 0;
    setScore(newScore);
    scoreRef.current = newScore;
    setTrust(newTrust);
    trustRef.current = newTrust;
    setCombo(newCombo);
    comboRef.current = newCombo;
    if (newCombo > 0) {
      setMaxCombo((prev) => (newCombo > prev ? newCombo : prev));
    }
  }, []);

  /* ── renderFeedback ── */
  const renderFeedback = useCallback(
    (answer: (typeof stages[1]["choices"][0]) & { score: number; isCsv?: boolean; choiceId?: string; correctId?: string }) => {
      const csv = mbtiScenarios[characterRef.current]?.[stage];
      const isCorrect = answer.isCsv ? answer.choiceId === answer.correctId : answer.score >= 20;
      if (resultCardRef.current) {
        resultCardRef.current.className =
          "result-card " +
          (isCorrect ? "good" : answer.isCsv ? "bad" : answer.score <= 0 ? "bad" : "okay");
      }
      if (gradeRef.current)
        gradeRef.current.textContent = answer.isCsv ? (isCorrect ? "S" : "C") : answer.grade;
      if (feedbackHeadingRef.current)
        feedbackHeadingRef.current.textContent = answer.isCsv
          ? (isCorrect ? "素晴らしい選択！" : "もう少し工夫できるかも")
          : answer.title;
      if (feedbackMessageRef.current)
        feedbackMessageRef.current.textContent = answer.isCsv
          ? (isCorrect ? csv?.result || "相手との信頼が深まりました。" : "相手の立場に立って、もう一度考えてみましょう。")
          : answer.message;
      if (npcQuoteRef.current) {
        const s = stages[stage];
        npcQuoteRef.current.textContent = `${s.npc}「${isCorrect ? "いいね、その伝え方なら進めやすいよ。" : "もう少し具体的に教えてもらえると助かるな。"}」`;
      }
      if (coachBubbleRef.current) {
        coachBubbleRef.current.textContent =
          isCorrect
            ? "いい選択！相手が判断しやすい順番で伝えられています。"
            : "惜しい！相手の不安や負担が増えるポイントを減らそう。";
      }
      renderActions();
      syncHud();
    },
    [stage, syncHud, renderActions]
  );

  /* ── selectAnswer ── */
  const selectAnswer = useCallback(
    (id: string) => {
      const csv = mbtiScenarios[characterRef.current]?.[stage];
      if (csv) {
        const pickId = normalizePickId(id);
        const isCorrect = pickId === csv.kiridashi.correct;
        const scoreDelta = isCorrect ? 25 : -5;
        const answerObj = {
          score: scoreDelta,
          isCsv: true as const,
          choiceId: pickId,
          correctId: csv.kiridashi.correct,
        };
        lastAnswerRef.current = answerObj;
        lastChoiceRef.current = pickId;
        setSelectedChoiceId(pickId);
        setSelectedChoiceText(
          csv.kiridashi[pickId as keyof typeof csv.kiridashi] as string
        );
        applyScore(scoreDelta);
        setPriorChoiceOpen(false);
        renderFeedback(answerObj as Parameters<typeof renderFeedback>[0]);
        go("action");
        return;
      }
      const s = stages[stage];
      const pickId = normalizePickId(id);
      const answer = s.choices.find((c) => c.id === pickId);
      if (!answer) return;
      lastAnswerRef.current = answer;
      lastChoiceRef.current = pickId;
      setSelectedChoiceId(pickId);
      setSelectedChoiceText(answer.text);
      applyScore(answer.score);
      setPriorChoiceOpen(false);
      renderFeedback(answer);
      go("action");
    },
    [stage, applyScore, renderFeedback, go]
  );

  /* ── renderResult ── */
  const renderResult = useCallback(
    (_action: { feedback: string }) => {
      const s = stages[stage];
      const csv = mbtiScenarios[characterRef.current]?.[stage];

      if (resultSubRef.current) {
        resultSubRef.current.textContent = "";
      }

      let cards: LessonCard[];
      if (csv) {
        cards = [
          { title: RESULT_LESSON_TITLES[0], body: csv.naze },
          { title: RESULT_LESSON_TITLES[1], body: csv.otoshiana },
          { title: RESULT_LESSON_TITLES[2], body: csv.hint },
          { title: RESULT_LESSON_TITLES[3], body: csv.more },
        ];
      } else {
        cards = s.lessons.slice(0, 4).map(([title, body], i) => ({
          title: RESULT_LESSON_TITLES[i] ?? title,
          body,
        }));
      }
      setLessonCards(cards);
      setResultExpandedSection(null);
      setDetailIndex(0);
      syncHud();
    },
    [stage, syncHud]
  );

  /* ── selectAction ── */
  const selectAction = useCallback(
    (id: string) => {
      const csv = mbtiScenarios[characterRef.current]?.[stage];
      lastActionRef.current = id;
      /* mark stage as cleared */
      setClearedStages((prev) => {
        const next = new Set(prev);
        next.add(stage);
        clearedRef.current = next;
        return next;
      });

      if (csv) {
        const pickId = normalizePickId(id);
        const isCorrect = pickId === csv.furumai.correct;
        const scoreDelta = isCorrect ? 20 : -5;
        setSelectedActionText(
          csv.furumai[pickId as keyof typeof csv.furumai] as string
        );
        applyScore(scoreDelta);
        toast(isCorrect ? csv.result : "相手の立場に立って行動を選び直してみましょう。");
        setTimeout(() => {
          renderResult({ feedback: isCorrect ? csv.result : "" });
          go("result");
        }, 460);
        return;
      }
      const action = stages[stage].actions.find((a) => a.id === id);
      if (!action) return;
      setSelectedActionText(action.text);
      applyScore(action.score);
      toast(action.feedback);
      setTimeout(() => {
        renderResult(action);
        go("result");
      }, 460);
    },
    [stage, applyScore, toast, go, renderResult]
  );

  const handlePrimaryStart = useCallback(() => {
    syncHud();
    if (onboardingDone) {
      go("type");
    } else {
      go("onboarding-1");
    }
  }, [onboardingDone, syncHud, go]);

  const handleQuickStart = useCallback(() => {
    markOnboardingCompleted();
    setOnboardingDone(true);
    syncHud();
    go("type");
  }, [syncHud, go]);

  const completeOnboarding = useCallback(() => {
    markOnboardingCompleted();
    setOnboardingDone(true);
    go("type");
  }, [go]);

  const skipOnboarding = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  const openPickConfirm = useCallback(
    (kind: PendingPick["kind"], btn: HTMLElement) => {
      const rawId =
        kind === "choice" ? btn.dataset.choiceId : btn.dataset.actionId;
      if (!rawId) return;
      const id = normalizePickId(rawId);
      const labelFromDom = readPickLabelFromButton(btn);
      const label =
        labelFromDom ||
        (kind === "choice" ? getChoiceLabel(id) : getActionLabel(id));
      if (!label) return;
      setPendingPick({ kind, id, label });
    },
    [getChoiceLabel, getActionLabel]
  );

  const cancelPendingPick = useCallback(() => {
    setPendingPick(null);
  }, []);

  const confirmPendingPick = useCallback(() => {
    if (!pendingPick) return;
    const { kind, id } = pendingPick;
    setPendingPick(null);
    if (kind === "choice") {
      setPriorChoiceOpen(false);
      selectAnswer(id);
      return;
    }
    selectAction(id);
  }, [pendingPick, selectAnswer, selectAction]);

  /* ── selectStage ── */
  const selectStage = useCallback(
    (stageNo: number) => {
      setStage(stageNo);
      lastChoiceRef.current = null;
      lastAnswerRef.current = null;
      setSelectedChoiceId(null);
      setSelectedChoiceText("");
      setSelectedActionText("");
      setPendingPick(null);
      setPriorChoiceOpen(false);
      loadStageContent();
      renderChoices();
      go("choice");
    },
    [loadStageContent, renderChoices, go]
  );

  /* ── resetGame ── */
  const resetGame = useCallback((opts?: { screen?: Screen }) => {
    try {
      localStorage.removeItem(PROGRESS_KEY);
    } catch {
      /* ignore */
    }
    setHasSave(false);
    setStage(1);
    setTrust(35);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setClearedStages(new Set());
    trustRef.current = 35;
    scoreRef.current = 0;
    comboRef.current = 0;
    clearedRef.current = new Set();
    lastChoiceRef.current = null;
    lastAnswerRef.current = null;
    setSelectedChoiceId(null);
    setSelectedChoiceText("");
    setSelectedActionText("");
    syncHud();
    go(opts?.screen ?? "stage");
  }, [syncHud, go]);

  const resetGameWithConfirm = useCallback(() => {
    const ok = window.confirm(
      "スコア・コンボ・信頼度・クリア状況を消して、最初からやり直しますか？"
    );
    if (!ok) return;
    resetGame();
  }, [resetGame]);

  const discardSaveAndNew = useCallback(() => {
    const ok = window.confirm(
      "保存された進捗を消して、新しく始めますか？"
    );
    if (!ok) return;
    resetGame({ screen: "title" });
  }, [resetGame]);

  const restoreProgress = useCallback(() => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(PROGRESS_KEY);
    } catch {
      return;
    }
    if (!raw) return;
    let data: PiecefulProgressV1;
    try {
      data = JSON.parse(raw) as PiecefulProgressV1;
    } catch {
      return;
    }
    if (data.version !== 1 || !data.selectedType) return;

    setCharacter(data.selectedType);
    characterRef.current = data.selectedType;
    setTrust(data.trust ?? 35);
    trustRef.current = data.trust ?? 35;
    setScore(data.score ?? 0);
    scoreRef.current = data.score ?? 0;
    setCombo(data.combo ?? 0);
    comboRef.current = data.combo ?? 0;
    setMaxCombo(data.maxCombo ?? data.combo ?? 0);
    const cleared = new Set(data.clearedStages ?? []);
    setClearedStages(cleared);
    clearedRef.current = cleared;
    if (typeof data.currentStage === "number") {
      setStage(data.currentStage);
    }
    const nextScreen = normalizeRestoredScreen(
      data.currentScreen ?? "stage",
      cleared
    );
    syncHud();
    go(nextScreen);
  }, [go, syncHud]);

  const goNextFromLesson = useCallback(() => {
    const next = getNextUnclearedStage(clearedStages);
    if (next !== null) {
      selectStage(next);
      return;
    }
    if (isAllCleared(clearedStages)) {
      go("clear");
      return;
    }
    go("stage");
  }, [clearedStages, selectStage, go]);

  const openDetail = useCallback(
    (index: number) => {
      setDetailIndex(index);
      go("detail");
    },
    [go]
  );

  const goNextDetail = useCallback(() => {
    if (detailIndex < lessonCards.length - 1) {
      setDetailIndex((i) => i + 1);
      return;
    }
    goNextFromLesson();
  }, [detailIndex, lessonCards.length, goNextFromLesson]);

  /* ── openGuide / closeGuide ── */
  const openGuide = useCallback(() => setGuideOpen(true), []);
  const closeGuide = useCallback(
    (e?: React.MouseEvent) => {
      if (e && e.target !== e.currentTarget) return;
      setGuideOpen(false);
    },
    []
  );

  /* ── event delegation for dynamically created buttons ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const choiceBtn = target.closest("[data-choice-id]") as
        | HTMLElement
        | null;
      if (choiceBtn) {
        openPickConfirm("choice", choiceBtn);
        return;
      }

      const actionBtn = target.closest("[data-action-id]") as
        | HTMLElement
        | null;
      if (actionBtn) {
        openPickConfirm("action", actionBtn);
        return;
      }

      const tipBtn = target.closest("[data-tip-index]") as HTMLElement | null;
      if (tipBtn) {
        const idx = Number(tipBtn.dataset.tipIndex);
        if (!Number.isNaN(idx)) {
          setDetailIndex(idx);
          go("detail");
        }
        return;
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [openPickConfirm, go]);

  /* ── keyboard: Escape closes guide / picker ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setGuideOpen(false);
        setPendingPick(null);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  /* ── design preview: 固定画面の初期データ ── */
  useEffect(() => {
    if (!previewScreen) return;

    const previewChar = "INTJ";
    characterRef.current = previewChar;
    setCharacter(previewChar);
    setStage(1);

    if (previewScreen.startsWith("onboarding")) {
      setOnboardingDone(false);
    } else {
      setOnboardingDone(true);
    }

    if (previewClearedStages?.length) {
      const cleared = new Set(previewClearedStages);
      setClearedStages(cleared);
      clearedRef.current = cleared;
    }

    if (previewScreen === "title" && previewHasSave) {
      setHasSave(true);
    }

    if (previewScreen === "clear") {
      const all = new Set(ALL_STAGE_IDS);
      setClearedStages(all);
      clearedRef.current = all;
      setScore(128);
      scoreRef.current = 128;
      setMaxCombo(4);
      setTrust(72);
      trustRef.current = 72;
    }

    if (previewScreen === "choice" || previewScreen === "action") {
      loadStageContent();
    }

    if (previewScreen === "action") {
      const csv = mbtiScenarios[previewChar]?.[1];
      const choiceText =
        csv?.kiridashi.A ??
        stages[1].choices[0]?.text ??
        "選択した言い方";
      lastChoiceRef.current = "A";
      setSelectedChoiceText(choiceText);
    }

    if (previewScreen === "result" || previewScreen === "detail") {
      const csv = mbtiScenarios[previewChar]?.[1];
      const choiceText =
        csv?.kiridashi.A ??
        stages[1].choices[0]?.text ??
        "選択した言い方";
      const actionText =
        csv?.furumai.A ?? stages[1].actions[0]?.text ?? "選択した振る舞い";
      lastChoiceRef.current = "A";
      lastActionRef.current = "A";
      setSelectedChoiceText(choiceText);
      setSelectedActionText(actionText);
      renderResult({ feedback: "" });
    }

    if (previewScreen === "detail") {
      setDetailIndex(0);
    }

    setCurrentScreen(previewScreen);
    syncHud();
  }, [
    previewScreen,
    previewClearedStages,
    previewHasSave,
    loadStageContent,
    renderResult,
    syncHud,
  ]);

  useEffect(() => {
    if (!previewScreen) return;
    const id = requestAnimationFrame(() => {
      if (previewScreen === "choice") renderChoices();
      if (previewScreen === "action") renderActions();
    });
    return () => cancelAnimationFrame(id);
  }, [previewScreen, renderChoices, renderActions]);

  /* ── persist progress (skip trivial title-only new session) ── */
  useEffect(() => {
    if (isPreview) return;
    const trivial =
      currentScreen === "title" &&
      score === 0 &&
      combo === 0 &&
      maxCombo === 0 &&
      trust === 35 &&
      clearedStages.size === 0;
    if (trivial) return;
    try {
      const progress: PiecefulProgressV1 = {
        version: 1,
        selectedType: character,
        currentScreen,
        currentStage: stage,
        score,
        combo,
        maxCombo,
        trust,
        clearedStages: Array.from(clearedStages),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
      setHasSave(true);
    } catch {
      /* ignore */
    }
  }, [
    character,
    currentScreen,
    stage,
    score,
    combo,
    maxCombo,
    trust,
    clearedStages,
  ]);

  /* ── mount: sync HUD + detect save + onboarding ── */
  useEffect(() => {
    syncHud();
    if (isPreview) return;
    setOnboardingDone(hasCompletedOnboarding());
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (raw) {
        const data = JSON.parse(raw) as PiecefulProgressV1;
        if (data?.version === 1 && data.selectedType) setHasSave(true);
      }
    } catch {
      /* ignore */
    }
  }, [syncHud, isPreview]);

  /* ── ref callback helpers ── */
  const addTrustLabelRef = useCallback(
    (el: HTMLSpanElement | null, idx: number) => {
      trustLabelRefs.current[idx] = el;
    },
    []
  );
  const addTrustFillRef = useCallback(
    (el: HTMLDivElement | null, idx: number) => {
      trustFillRefs.current[idx] = el;
    },
    []
  );
  const addComboLabelRef = useCallback(
    (el: HTMLDivElement | null, idx: number) => {
      comboLabelRefs.current[idx] = el;
    },
    []
  );
  const addStarLabelRef = useCallback(
    (el: HTMLDivElement | null, idx: number) => {
      starLabelRefs.current[idx] = el;
    },
    []
  );

  const nextUnclearedStage = getNextUnclearedStage(clearedStages);
  const lessonNextLabel =
    nextUnclearedStage !== null ? "次のステージへ ▶" : "クリア証を見る ▶";

  const shareText = useMemo(
    () =>
      `Piecefulをクリア！\nMBTI: ${character}（${charNick[character]}）\nScore: ${score}\nMaxCombo: ${maxCombo}\nTrust: ${trust}%`,
    [character, score, maxCombo, trust]
  );

  const copyClearResult = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast("結果をコピーしました");
    } catch {
      toast("コピーできませんでした（ブラウザの許可を確認してください）");
    }
  }, [shareText, toast]);

  const appMain = (
      <main
        className={["app pf-app", embed ? "pf-embed-preview" : ""]
          .filter(Boolean)
          .join(" ")}
        ref={appRef}
      >
      <span className="bg-chip chip-1">🌙</span>
      <span className="bg-chip chip-2">☀️</span>
      <span className="bg-chip chip-3">💎</span>
      <span className="bg-chip chip-4">🧩</span>
        {/* ── TITLE ── */}
        <section
          id="screen-title"
          className={isActive("title")}
          aria-labelledby="title-heading"
        >
          <div className="pf-screen pf-paper is-title">
            <div className="pf-safe">
              <div className="pf-home-layout">
                <div className="pf-red-banner">
                  <p className="pf-red-banner-text">
                    <span className="pf-piece-icon" aria-hidden />
                    個性を活かした伝え方で
                    <br />
                    仕事をもっと快適に!
                  </p>
                </div>
                <div>
                  <h1 id="title-heading" className="pf-home-logo">
                    Pieceful
                  </h1>
                  <p className="pf-home-subtitle">- ピースフル -</p>
                </div>
                <div className="pf-home-actions">
                  {hasSave && (
                    <button
                      type="button"
                      className="pf-big-btn"
                      onClick={restoreProgress}
                    >
                      続きから ▶
                    </button>
                  )}
                  <button
                    type="button"
                    className="pf-big-btn"
                    onClick={handlePrimaryStart}
                  >
                    {onboardingDone ? "ゲーム開始 ▶" : "30秒でわかる ▶"}
                  </button>
                  {!onboardingDone && (
                    <button
                      type="button"
                      className="pf-big-btn pink"
                      onClick={handleQuickStart}
                    >
                      すぐゲーム開始
                    </button>
                  )}
                </div>
                <div className="pf-character-callout">
                  <img
                    className="pf-callout-char"
                    src={charImages[character]}
                    alt=""
                  />
                  <div className="pf-speech">
                    {onboardingDone ? (
                      <>
                        タイプを選んで
                        <br />
                        ステージに挑戦!
                      </>
                    ) : (
                      <>
                        まずは3画面で
                        <br />
                        遊び方を確認。
                        <br />
                        そのあと練習!
                      </>
                    )}
                  </div>
                </div>
                <div className="pf-pager" aria-hidden>
                  <span className="on" />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>
        </section>

        <OnboardingScreens
          isActive={isActive}
          go={go}
          skipOnboarding={skipOnboarding}
          completeOnboarding={completeOnboarding}
        />

        {/* ── TYPE ── */}
        <section
          id="screen-type"
          className={isActive("type")}
          aria-labelledby="type-heading"
        >
          <div className="pf-screen pf-paper">
            <div className="pf-safe">
              <div className="pf-type-layout pf-type-layout--picker-2x8">
                <div className="pf-topbar">
                  <button
                    type="button"
                    className="pf-back-btn"
                    onClick={() => go("title")}
                    aria-label="タイトルへ戻る"
                  >
                    ←
                  </button>
                  <div>
                    <h2 id="type-heading" className="pf-screen-title">
                      キャラを選ぼう!
                    </h2>
                    <p className="pf-screen-sub">{charPickerScrollSubcopy()}</p>
                  </div>
                  <span className="pf-mini-btn">ALL</span>
                </div>
                <div className="pf-selected-type pf-selected-type--hero">
                  <img src={charImages[character]} alt="" />
                  <div>
                    <h3>{character}</h3>
                    <p className="pf-selected-type-nick">{charNick[character]}</p>
                    <p className="pf-selected-type-note">
                      選ぶとステージ内容が少し変わります。迷ったらESTPで開始。
                    </p>
                  </div>
                </div>
                <CharPicker2x8Scroll
                  selected={character as CharacterType}
                  onSelect={(type) => selectCharacter(type, { fromPicker: true })}
                />
                <button
                  type="button"
                  className="pf-big-btn"
                  onClick={() => go("stage")}
                >
                  このタイプで開始 ▶
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── STAGE ── */}
        <section
          id="screen-stage"
          className={isActive("stage")}
          aria-labelledby="stage-heading"
        >
          <div className="pf-screen pf-stage-bg">
            <div className="pf-safe">
              <h2 id="stage-heading" className="pf-sr-only">
                ステージ選択
              </h2>
              <StageSelectionScreen
                character={character}
                clearedStages={clearedStages}
                nextUnclearedStage={nextUnclearedStage}
                onBack={() => go("type")}
                onSelectStage={selectStage}
              />
            </div>
          </div>
        </section>

        {/* ── CHOICE ── */}
        <section
          id="screen-choice"
          className={isActive("choice")}
          aria-labelledby="choice-heading"
        >
          <div className="pf-screen pf-paper pf-scene-plain">
            <div className="pf-safe">
              <div className="pf-scene-layout choice-flow">
                <div className="pf-topbar">
                  <button
                    type="button"
                    className="pf-back-btn"
                    onClick={() => {
                      setPendingPick(null);
                      go("stage");
                    }}
                    aria-label="ステージ選択へ戻る"
                  >
                    ←
                  </button>
                  <div>
                    <h2 id="choice-heading" className="pf-screen-title">
                      {stages[stage]?.title ?? ""}
                    </h2>
                  </div>
                  <span className="pf-mini-btn">1/2</span>
                </div>
                <div className="pf-alert-label">
                  {stages[stage]?.kicker ?? ""}
                </div>
                <div className="pf-scene-recap pf-choice-scenario">
                  {sceneParagraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <h3 className="pf-prompt pf-prompt-compact">
                  <span className="pf-prompt-icon" aria-hidden>
                    💬
                  </span>
                  どう切り出す？
                </h3>
                <div
                  id="choices"
                  ref={choicesRef}
                  className="pf-choice-grid"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── ACTION ── */}
        <section
          id="screen-action"
          className={isActive("action")}
          aria-labelledby="action-heading"
        >
          <div className="pf-screen pf-paper pf-scene-plain">
            <div className="pf-safe">
              <div
                ref={actionFlowRef}
                className={[
                  "pf-scene-layout action-flow",
                  priorChoiceOverflows && !priorChoiceOpen
                    ? "is-scenario-clamped"
                    : "",
                  priorChoiceOverflows && priorChoiceOpen
                    ? "is-scenario-expanded"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="pf-topbar">
                  <button
                    type="button"
                    className="pf-back-btn"
                    onClick={() => {
                      setPendingPick(null);
                      go("choice");
                    }}
                    aria-label="切り出し選択へ戻る"
                  >
                    ←
                  </button>
                  <div>
                    <h2 id="action-heading" className="pf-screen-title">
                      どう振る舞う?
                    </h2>
                  </div>
                  <span className="pf-mini-btn">2/2</span>
                </div>
                <div className="pf-action-context">
                <section
                  className="pf-action-scenario-block"
                  aria-label="状況説明"
                >
                  <span className="pf-action-scenario-label">状況</span>
                  <div
                    id="prior-choice-panel"
                    ref={priorScenarioBodyRef}
                    className={[
                      "pf-action-scenario-body",
                      priorChoiceOverflows
                        ? priorChoiceOpen
                          ? "is-open"
                          : "is-clamped"
                        : "fits",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    style={
                      priorChoiceOverflows &&
                      !priorChoiceOpen &&
                      scenarioClampPx
                        ? { maxHeight: scenarioClampPx }
                        : undefined
                    }
                  >
                    {priorScenarioParagraphs.map((p, i) => (
                      <p key={i} className="pf-action-scenario-text">
                        {p}
                      </p>
                    ))}
                  </div>
                  {priorChoiceOverflows ? (
                    <button
                      type="button"
                      className="pf-action-scenario-toggle pf-action-scenario-toggle--foot"
                      aria-expanded={priorChoiceOpen}
                      aria-controls="prior-choice-panel"
                      onClick={() => setPriorChoiceOpen((open) => !open)}
                    >
                      <span aria-hidden>{priorChoiceOpen ? "▲" : "▼"}</span>
                      <span className="pf-sr-only">
                        {priorChoiceOpen
                          ? "状況説明を閉じる"
                          : "状況説明を続きまで表示"}
                      </span>
                    </button>
                  ) : null}
                </section>
                <section
                  ref={kiridashiRef}
                  className="pf-action-kiridashi"
                  aria-label="前の回答：どう切り出す"
                >
                  <p className="pf-action-kiridashi-kicker">
                    <span className="pf-prompt-icon" aria-hidden>
                      💬
                    </span>
                    どう切り出す
                  </p>
                  <div className="pf-action-kiridashi-line">
                    <span
                      className={`pf-choice-letter ${(selectedChoiceId ?? "A").toLowerCase()}`}
                    >
                      {selectedChoiceId ?? "A"}
                    </span>
                    <p className="pf-action-kiridashi-text">
                      {selectedChoiceText || "選択した言い方"}
                    </p>
                  </div>
                </section>
                </div>
                <h3 className="pf-prompt pf-prompt-action pf-prompt-compact">
                  <span className="pf-prompt-icon" aria-hidden>
                    💬
                  </span>
                  どう振る舞う？
                </h3>
                <div
                  id="actions"
                  ref={actionsRef}
                  className="pf-choice-grid pf-choice-grid-action"
                />
                <div className="pf-hidden-feedback" aria-hidden>
                  <div ref={resultCardRef} />
                  <div ref={gradeRef} />
                  <h2 ref={feedbackHeadingRef} />
                  <p ref={feedbackMessageRef} />
                  <div ref={npcQuoteRef} />
                  <div ref={coachBubbleRef} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── RESULT ── */}
        <section
          id="screen-result"
          className={isActive("result")}
          aria-labelledby="result-heading"
        >
          <div className="pf-screen pf-paper">
            <div className="pf-safe pf-result-safe">
              <div className="pf-result-scroll">
                <div className="pf-result-layout">
                <h2 id="result-heading" className="pf-result-title">
                  チャレンジ結果
                </h2>
                <div className="pf-trophies" aria-hidden>
                  🏆 🏆
                </div>
                <p className="pf-clear-label">クリア</p>
                <p id="result-sub" ref={resultSubRef} className="pf-small-note pf-sr-only" aria-hidden />
                <div className="pf-result-answers">
                  <div className="pf-selected-line">
                    <span
                      className={`pf-choice-letter ${(lastChoiceRef.current ?? "a").toLowerCase()}`}
                    >
                      {lastChoiceRef.current ?? "A"}
                    </span>
                    <p className="pf-selected-answer-text">
                      {selectedChoiceText || "選択した言い方"}
                    </p>
                  </div>
                  <div className="pf-selected-line">
                    <span
                      className={`pf-choice-letter ${(lastActionRef.current ?? "a").toLowerCase()}`}
                    >
                      {lastActionRef.current ?? "A"}
                    </span>
                    <p className="pf-selected-answer-text">
                      {selectedActionText || "選択した振る舞い"}
                    </p>
                  </div>
                </div>
                <ResultCtaBlock />
                <div className="pf-result-accordion-list">
                  {lessonCards.map((card, idx) => (
                    <ResultAccordionItem
                      key={card.title}
                      index={idx}
                      title={card.title}
                      body={card.body}
                      isOpen={resultExpandedSection === idx}
                      onToggle={() =>
                        setResultExpandedSection((current) =>
                          current === idx ? null : idx
                        )
                      }
                    />
                  ))}
                </div>
                <ResultCtaBlock className="pf-result-cta-bottom" />
                <button
                  type="button"
                  className="pf-back-wide pf-result-back"
                  onClick={() => go("stage")}
                >
                  ◀ ステージ選択画面に戻る
                </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── DETAIL ── */}
        <section
          id="screen-detail"
          className={isActive("detail")}
          aria-labelledby="detail-heading"
        >
          <div className="pf-screen pf-paper">
            <div className="pf-safe">
              <div className="pf-detail-layout">
                <div className="pf-topbar">
                  <button
                    type="button"
                    className="pf-back-btn"
                    onClick={() => go("result")}
                    aria-label="結果へ戻る"
                  >
                    ←
                  </button>
                  <div>
                    <h2 id="detail-heading" className="pf-screen-title">
                      {lessonCards[detailIndex]?.title ?? "解説"}
                    </h2>
                    <p className="pf-screen-sub">
                      解説 {detailIndex + 1}/{lessonCards.length || 1}
                    </p>
                  </div>
                  <span className="pf-mini-btn">
                    {lastChoiceRef.current ?? "TIP"}
                  </span>
                </div>
                {lessonCards[detailIndex] && (
                  <>
                    <div className="pf-alert-label ok">
                      {detailIndex === 0 ? "✅" : detailIndex === 1 ? "⚠️" : "💡"}{" "}
                      {DETAIL_BADGES[detailIndex] ?? lessonCards[detailIndex].title}
                    </div>
                    <div className="pf-detail-card">
                      <h3>{lessonCards[detailIndex].title}</h3>
                      <FormattedScenarioText text={lessonCards[detailIndex].body} />
                    </div>
                  </>
                )}
                <button
                  type="button"
                  className="pf-yellow-pill"
                  onClick={goNextDetail}
                >
                  {detailIndex < lessonCards.length - 1
                    ? "次の解説へ ▶"
                    : lessonNextLabel}
                </button>
                <button
                  type="button"
                  className="pf-back-wide"
                  onClick={() => go("stage")}
                >
                  ◀ ステージ選択へ
                </button>
                <div className="pf-pager" aria-hidden>
                  {lessonCards.map((_, i) => (
                    <span key={i} className={i === detailIndex ? "on" : ""} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ALL CLEAR ── */}
        <section
          id="screen-clear"
          className={isActive("clear")}
          aria-labelledby="clear-heading"
        >
          <div className="pf-screen pf-paper">
            <div className="pf-safe">
              <div className="pf-result-layout">
                <h2 id="clear-heading" className="pf-result-title">
                  クリア証
                </h2>
                <p className="pf-clear-label">COMPLETE</p>
                <p className="pf-small-note">
                  5ステージをすべて制覇しました。
                </p>
                <dl className="pf-clear-stats">
                  <div>
                    <dt>MBTI</dt>
                    <dd>
                      {character}（{charNick[character]}）
                    </dd>
                  </div>
                  <div>
                    <dt>スコア</dt>
                    <dd>{score}</dd>
                  </div>
                  <div>
                    <dt>最大コンボ</dt>
                    <dd>{maxCombo}</dd>
                  </div>
                  <div>
                    <dt>信頼度</dt>
                    <dd>{clamp(trust, 0, 100)}%</dd>
                  </div>
                </dl>
                <div className="pf-home-actions">
                  <button
                    type="button"
                    className="pf-big-btn"
                    onClick={() => resetGame()}
                  >
                    もう一度プレイ ▶
                  </button>
                  <button
                    type="button"
                    className="pf-big-btn pink"
                    onClick={() => void copyClearResult()}
                  >
                    結果をコピー
                  </button>
                  <button
                    type="button"
                    className="pf-back-wide"
                    onClick={() => go("stage")}
                  >
                    ◀ ステージ選択へ
                  </button>
                </div>
                <p className="pf-lp-link">
                  <a href="/" target="_top" rel="noopener noreferrer">
                    ← トップへ
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
  );

  return (
    <>
      {embed ? appMain : <div className="phone-mockup">{appMain}</div>}

      {/* ── PICK CONFIRM MODAL ── */}
      <div
        className={`pf-confirm-backdrop${pendingPick ? " active" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) cancelPendingPick();
        }}
      >
        <div
          className="pf-confirm-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pf-confirm-title"
        >
          <h2 id="pf-confirm-title" className="pf-confirm-title">
            {pendingPick?.kind === "choice"
              ? "この切り出しで決定しますか？"
              : "この振る舞いで決定しますか？"}
          </h2>
          <div className="pf-confirm-preview">
            {pendingPick ? (
              <>
                <span
                  className={`pf-choice-letter ${pendingPick.id.toLowerCase()}`}
                  aria-hidden
                >
                  {pendingPick.id}
                </span>
                <p>{pendingPick.label}</p>
              </>
            ) : null}
          </div>
          <div className="pf-confirm-actions">
            <button
              type="button"
              className="pf-confirm-btn cancel"
              onClick={cancelPendingPick}
            >
              取り消し
            </button>
            <button
              type="button"
              className="pf-confirm-btn confirm"
              onClick={confirmPendingPick}
            >
              決定
            </button>
          </div>
        </div>
      </div>

      {/* ── GUIDE MODAL ── */}
      <div
        id="guide-modal"
        className={`modal-backdrop${guideOpen ? " active" : ""}`}
        onClick={(e) => closeGuide(e)}
      >
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="guide-title"
        >
          <h2 id="guide-title">📖 Pieceful 攻略ガイド</h2>
          <p>
            このゲームは「正論を言う」よりも、「相手のタイプに合わせて、受け取りやすい順番で伝える」ことが大切です。
          </p>
          <ul>
            <li>
              <strong>論理派</strong>
              には、結論・根拠・選択肢を短く。
            </li>
            <li>
              <strong>共感派</strong>
              には、背景・気持ち・協力の姿勢を先に。
            </li>
            <li>
              <strong>実行派</strong>
              には、今やること・期限・担当を明確に。
            </li>
            <li>
              <strong>慎重派</strong>
              には、リスク・代替案・確認ポイントを添える。
            </li>
          </ul>
          <div className="actions">
            <button className="btn primary" type="button" onClick={() => closeGuide()} aria-label="ガイドを閉じる">
              閉じる
            </button>
          </div>
        </div>
      </div>

      {/* ── TOAST ── */}
      <div id="toast" ref={toastElRef} className="toast" />
      {/* ── CONFETTI ── */}
      <div id="confetti" ref={confettiRef} className="confetti" aria-hidden="true" />
    </>
  );
}
