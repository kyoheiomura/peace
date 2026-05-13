"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { mbtiScenarios } from "../lib/mbtiScenarios";

/* ── module-level constants ── */

const characters = [
  ["INTJ", "戦略設計型", "Analyst", "group-analyst"],
  ["INTP", "仮説探究型", "Analyst", "group-analyst"],
  ["ENTJ", "司令塔型", "Analyst", "group-analyst"],
  ["ENTP", "発明家型", "Analyst", "group-analyst"],
  ["ISTJ", "堅実管理型", "Sentinel", "group-sentinel"],
  ["ISFJ", "支援守備型", "Sentinel", "group-sentinel"],
  ["ESTJ", "実行統率型", "Sentinel", "group-sentinel"],
  ["ESFJ", "調整支援型", "Sentinel", "group-sentinel"],
  ["INFP", "価値観共鳴型", "Diplomat", "group-diplomat"],
  ["ENFJ", "伴走リーダー型", "Diplomat", "group-diplomat"],
  ["ENFP", "アイデア共創型", "Diplomat", "group-diplomat"],
  ["INFJ", "洞察設計型", "Diplomat", "group-diplomat"],
  ["ISTP", "現場解決型", "Explorer", "group-explorer"],
  ["ISFP", "感性実装型", "Explorer", "group-explorer"],
  ["ESTP", "瞬発アクション型", "Explorer", "group-explorer"],
  ["ESFP", "ムードメイク型", "Explorer", "group-explorer"],
] as const;

const charImages = Object.fromEntries(
  characters.map((c, i) => [c[0], `/img/${i + 1}.png`])
) as Record<string, string>;

const charNick = Object.fromEntries(
  characters.map((c) => [c[0], c[1]])
) as Record<string, string>;

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
      "あなたは社内プロジェクトのリーダー。来週金曜が納期の重要な成果物について、協力会社から納品遅延の連絡が入った。全体スケジュールは3日ほど後ろ倒しになる見込み。田中部長に事実を報告し、今後の対応を相談しなければならない。",
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

/* ── helper ── */

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/* ── component ── */

export default function Page() {
  /* state */
  const [currentScreen, setCurrentScreen] = useState("title");
  const [character, setCharacter] = useState("ESTP");
  const [stage, setStage] = useState(1);
  const [trust, setTrust] = useState(35);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [guideOpen, setGuideOpen] = useState(false);
  const [charPickerOpen, setCharPickerOpen] = useState(false);
  const [clearedStages, setClearedStages] = useState<Set<number>>(new Set());

  /* refs for DOM containers that get innerHTML */
  const characterGridRef = useRef<HTMLDivElement>(null);
  const choicesRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const lessonGridRef = useRef<HTMLDivElement>(null);
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

  /* refs for mission/feedback elements */
  const missionHeadingRef = useRef<HTMLHeadingElement>(null);
  const missionSubRef = useRef<HTMLParagraphElement>(null);
  const missionKickerRef = useRef<HTMLDivElement>(null);
  const scenarioRef = useRef<HTMLParagraphElement>(null);
  const npcImgRef = useRef<HTMLImageElement>(null);
  const npcNameRef = useRef<HTMLDivElement>(null);
  const npcTagRef = useRef<HTMLSpanElement>(null);
  const resultCardRef = useRef<HTMLDivElement>(null);
  const gradeRef = useRef<HTMLDivElement>(null);
  const feedbackHeadingRef = useRef<HTMLHeadingElement>(null);
  const feedbackMessageRef = useRef<HTMLParagraphElement>(null);
  const npcQuoteRef = useRef<HTMLDivElement>(null);
  const coachBubbleRef = useRef<HTMLDivElement>(null);
  const lessonSubRef = useRef<HTMLParagraphElement>(null);

  /* store lastAnswer / lastChoice as refs (used only by logic, not rendering) */
  const lastAnswerRef = useRef<Record<string, unknown> | null>(null);
  const lastChoiceRef = useRef<string | null>(null);

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

  /* ── helper: active class ── */
  const isActive = (screen: string) =>
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

  /* ── go ── */
  const go = useCallback(
    (screen: string) => {
      setCurrentScreen(screen);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(syncHud, 0);
    },
    [syncHud]
  );

  /* ── initCharacters ── */
  const initCharacters = useCallback(() => {
    if (!characterGridRef.current) return;
    characterGridRef.current.innerHTML = characters
      .map((entry) => {
        const [type, nick, group, cls] = entry;
        const g = group;
        const c = cls;
        return `<button class="character-card ${c}" data-group="${g}" data-type="${type}">
          <img src="${charImages[type]}" alt="${type}キャラクター" />
          <span class="type"><strong>${type}</strong><small>${nick}</small></span>
        </button>`;
      })
      .join("");

    /* attach click handlers via event delegation */
    characterGridRef.current.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest(
        "[data-type]"
      ) as HTMLElement | null;
      if (btn) {
        const type = btn.dataset.type!;
        selectCharacter(type);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  /* ── selectCharacter ── */
  const selectCharacter = useCallback(
    (type: string) => {
      setCharacter(type);
      characterRef.current = type;
      toast(`${type}：${charNick[type]} を選択！`);
      syncHud();
      setTimeout(() => go("stage"), 180);
    },
    [toast, syncHud, go]
  );

  /* ── renderMission ── */
  const renderMission = useCallback(() => {
    const s = stages[stage];
    const csv = mbtiScenarios[characterRef.current]?.[stage];
    if (missionHeadingRef.current)
      missionHeadingRef.current.textContent = s.title;
    if (missionSubRef.current) missionSubRef.current.textContent = s.sub;
    if (missionKickerRef.current)
      missionKickerRef.current.textContent = s.kicker;
    if (scenarioRef.current)
      scenarioRef.current.textContent = csv?.situation || s.scenario;
    if (npcImgRef.current) npcImgRef.current.src = s.npcImg;
    if (npcNameRef.current) npcNameRef.current.textContent = s.npc;
    if (npcTagRef.current) npcTagRef.current.textContent = s.npcTag;
    if (choicesRef.current) {
      if (csv) {
        const labels = ["A", "B", "C", "D"] as const;
        const correct = csv.kiridashi.correct;
        choicesRef.current.innerHTML = labels
          .map((id) => {
            const isCorrect = id === correct;
            return `<button class="choice" data-choice-id="${id}">
              <span class="letter">${id}</span>
              <span class="text">${csv.kiridashi[id]}</span>
              <span class="risk">${isCorrect ? "？" : "？"}</span>
            </button>`;
          })
          .join("");
      } else {
        choicesRef.current.innerHTML = s.choices
          .map(
            (c) => `<button class="choice" data-choice-id="${c.id}">
            <span class="letter">${c.id}</span>
            <span class="text">${c.text}</span>
            <span class="risk">${c.risk}</span>
          </button>`
          )
          .join("");
      }
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
      if (actionsRef.current) {
        if (csv) {
          const labels = ["A", "B", "C", "D"] as const;
          actionsRef.current.innerHTML = labels
            .map((id) => {
              return `<button class="choice" data-action-id="${id}">
                <span class="letter">${id}</span>
                <span class="text">${csv.furumai[id]}</span>
                <span class="risk">？</span>
              </button>`;
            })
            .join("");
        } else {
          actionsRef.current.innerHTML = stages[stage].actions
            .map(
              (a) => `<button class="choice" data-action-id="${a.id}">
            <span class="letter">${a.id}</span>
            <span class="text">${a.text}</span>
            <span class="risk">${a.risk}</span>
          </button>`
            )
            .join("");
        }
      }
      syncHud();
    },
    [stage, syncHud]
  );

  /* ── selectAnswer ── */
  const selectAnswer = useCallback(
    (id: string) => {
      const csv = mbtiScenarios[characterRef.current]?.[stage];
      if (csv) {
        const isCorrect = id === csv.kiridashi.correct;
        const scoreDelta = isCorrect ? 25 : -5;
        const answerObj = { score: scoreDelta, isCsv: true as const, choiceId: id, correctId: csv.kiridashi.correct };
        lastAnswerRef.current = answerObj;
        lastChoiceRef.current = id;
        applyScore(scoreDelta);
        renderFeedback(answerObj as Parameters<typeof renderFeedback>[0]);
        go("feedback");
        return;
      }
      const s = stages[stage];
      const answer = s.choices.find((c) => c.id === id);
      if (!answer) return;
      lastAnswerRef.current = answer;
      lastChoiceRef.current = id;
      applyScore(answer.score);
      renderFeedback(answer);
      go("feedback");
    },
    [stage, applyScore, renderFeedback, go]
  );

  /* ── selectAction ── */
  const selectAction = useCallback(
    (id: string) => {
      const csv = mbtiScenarios[characterRef.current]?.[stage];
      /* mark stage as cleared */
      setClearedStages((prev) => {
        const next = new Set(prev);
        next.add(stage);
        clearedRef.current = next;
        return next;
      });

      if (csv) {
        const isCorrect = id === csv.furumai.correct;
        const scoreDelta = isCorrect ? 20 : -5;
        applyScore(scoreDelta);
        toast(isCorrect ? csv.result : "相手の立場に立って行動を選び直してみましょう。");
        setTimeout(() => {
          renderLesson({ feedback: isCorrect ? csv.result : "" });
          go("lesson");
          /* confetti only when all 5 stages cleared */
          if (clearedRef.current.size >= 5) burst();
        }, 460);
        return;
      }
      const action = stages[stage].actions.find((a) => a.id === id);
      if (!action) return;
      applyScore(action.score);
      toast(action.feedback);
      setTimeout(() => {
        renderLesson(action);
        go("lesson");
        if (clearedRef.current.size >= 5) burst();
      }, 460);
    },
    [stage, applyScore, toast, burst, go]
  );

  /* ── renderLesson ── */
  const renderLesson = useCallback(
    (action: { feedback: string }) => {
      const s = stages[stage];
      const csv = mbtiScenarios[characterRef.current]?.[stage];
      if (lessonSubRef.current)
        lessonSubRef.current.textContent = `${s.title}｜${s.npcTag}を攻略しました。${action.feedback}`;
      if (lessonGridRef.current) {
        if (csv) {
          const cards = [
            { title: "なぜこの対応が正解なのか", body: csv.naze },
            { title: "あなたの落とし穴", body: csv.otoshiana },
            { title: "明日から使えるヒント", body: csv.hint },
            { title: "もっと知りたい人へ", body: csv.more },
          ];
          lessonGridRef.current.innerHTML = cards
            .map(
              (card, idx) => `<article class="lesson-card ${idx === 0 ? "open" : ""}" data-lesson-toggle>
            <div class="lesson-head">
              <h3>${idx + 1}. ${card.title}</h3>
              <span class="toggle">▼</span>
            </div>
            <div class="lesson-body"><div><p>${card.body}</p></div></div>
          </article>`
            )
            .join("");
        } else {
          lessonGridRef.current.innerHTML = s.lessons
            .map(
              ([title, body], idx) => `<article class="lesson-card ${idx === 0 ? "open" : ""}" data-lesson-toggle>
            <div class="lesson-head">
              <h3>${idx + 1}. ${title}</h3>
              <span class="toggle">▼</span>
            </div>
            <div class="lesson-body"><div><p>${body}</p></div></div>
          </article>`
            )
            .join("");
        }
      }
      syncHud();
    },
    [stage, syncHud]
  );

  /* ── selectStage ── */
  const selectStage = useCallback(
    (stageNo: number) => {
      setStage(stageNo);
      lastChoiceRef.current = null;
      lastAnswerRef.current = null;
      renderMission();
      go("mission");
    },
    [renderMission, go]
  );

  /* ── resetGame ── */
  const resetGame = useCallback(() => {
    setStage(1);
    setTrust(35);
    setScore(0);
    setCombo(0);
    setClearedStages(new Set());
    trustRef.current = 35;
    scoreRef.current = 0;
    comboRef.current = 0;
    clearedRef.current = new Set();
    lastChoiceRef.current = null;
    lastAnswerRef.current = null;
    syncHud();
    go("stage");
  }, [syncHud, go]);

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
        selectAnswer(choiceBtn.dataset.choiceId!);
        return;
      }

      const actionBtn = target.closest("[data-action-id]") as
        | HTMLElement
        | null;
      if (actionBtn) {
        selectAction(actionBtn.dataset.actionId!);
        return;
      }

      const lessonCard = target.closest("[data-lesson-toggle]") as
        | HTMLElement
        | null;
      if (lessonCard) {
        lessonCard.classList.toggle("open");
        return;
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [selectAnswer, selectAction]);

  /* ── keyboard: Escape closes guide ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setGuideOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  /* ── mount: init characters + sync HUD ── */
  useEffect(() => {
    initCharacters();
    syncHud();
  }, [initCharacters, syncHud]);

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

  return (
    <>
      {/* ── Desktop-only side info (CSS hidden on mobile) ── */}
      <div className="desktop-side-info">
        <h2 className="desktop-title">Pieceful</h2>
        <p className="desktop-subtitle">ピースフル</p>
        <p className="desktop-desc">MBTIタイプ別キャラクターで<br/>職場コミュニケーションを攻略</p>
        <div className="desktop-features">
          <div className="desktop-feature">
            <span className="desktop-feature-icon">🎮</span>
            <span>5ステージ</span>
          </div>
          <div className="desktop-feature">
            <span className="desktop-feature-icon">🧩</span>
            <span>16タイプ</span>
          </div>
          <div className="desktop-feature">
            <span className="desktop-feature-icon">💬</span>
            <span>実践的</span>
          </div>
        </div>
        <p className="desktop-hint">← モックアップ内でスクロール可能 →</p>
      </div>

      <main className="app">
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
          <div className="window">
            <div className="window-bar" aria-hidden="true">
              <span className="dot red">×</span>
              <span className="dot yellow">−</span>
              <span className="dot green">□</span>
              <span className="bar-title">
                MBTI COMMUNICATION QUEST
              </span>
            </div>
            <div className="window-body hero-grid">
              <div>
                <div className="kicker">
                  🧩 伝え方で、世界がちょっと平和になる
                </div>
                <h1 id="title-heading" className="title">
                  Pieceful
                  <small>ピースフル</small>
                </h1>
                <p className="lead">
                  MBTIタイプ別キャラクターで、職場コミュニケーションを攻略するミニゲーム。
                  <br />
                  報告・相談・提案の「切り出し方」を選び、相手の信頼ゲージを上げよう。
                </p>
                <div className="actions">
                  <button
                    className="btn primary"
                    onClick={() => { syncHud(); go("stage"); }}
                  >
                    ゲーム開始 ▶
                  </button>
                  <button className="btn pink" onClick={openGuide}>
                    遊び方を見る 📖
                  </button>
                </div>
              </div>
              <div className="hero-card" aria-hidden="true">
                <div className="mini-stat">
                  <span className="mini-pill">信頼ゲージ +10</span>
                  <span className="mini-pill">コンボ 0</span>
                  <span className="mini-pill">ミッション 5種</span>
                </div>
                <div className="speech">
                  今日の相手は誰かな？
                  <br />
                  言い方を選ぼう！
                </div>
                <div className="main-mascot">
                  <img src="/img/15.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CHARACTER SELECT (hidden, used for ref) ── */}
        <div style={{ display: "none" }}>
          <div
            id="character-grid"
            ref={characterGridRef}
            className="character-grid"
          />
        </div>

        {/* ── STAGE SELECT ── */}
        <section
          id="screen-stage"
          className={isActive("stage")}
          aria-labelledby="stage-heading"
        >
          <div className="topbar">
            <button
              className="back-btn"
              onClick={() => go("title")}
              aria-label="タイトルへ戻る"
            >
              ←
            </button>
            <div>
              <h2 id="stage-heading" className="screen-title">
                ステージを選ぼう
              </h2>
              <p className="subnote">
                相手によって、刺さる言葉・嫌がられる言葉が変わります。
              </p>
            </div>
            <div className="hud-card" ref={(el) => addStarLabelRef(el, 2)}>
              ⭐ {score}
            </div>
          </div>

          {/* ── MBTI badge + inline picker ── */}
          <div className="mbti-bar">
            <div className="mbti-badge" onClick={() => setCharPickerOpen(!charPickerOpen)}>
              <img src={charImages[character]} alt="" className="mbti-badge-img" />
              <span className="mbti-badge-type">{character}</span>
              <span className="mbti-badge-nick">{charNick[character]}</span>
              <span className="mbti-change-link">変更</span>
            </div>
          </div>
          {charPickerOpen && (
            <div className="mbti-picker-overlay" onClick={() => setCharPickerOpen(false)}>
              <div className="mbti-picker" onClick={(e) => e.stopPropagation()}>
                <h3>MBTIタイプを選択</h3>
                <div className="mbti-picker-grid">
                  {characters.map(([type, nick, group, cls]) => (
                    <button
                      key={type}
                      className={`mbti-picker-card ${character === type ? "selected" : ""} ${cls}`}
                      onClick={() => {
                        selectCharacter(type);
                        setCharPickerOpen(false);
                      }}
                    >
                      <img src={charImages[type]} alt="" />
                      <strong>{type}</strong>
                      <small>{nick}</small>
                    </button>
                  ))}
                </div>
                <button className="btn" onClick={() => setCharPickerOpen(false)} style={{ marginTop: 12 }}>
                  閉じる
                </button>
              </div>
            </div>
          )}

          <div className="stage-map">
            <div className="stage-nodes">
              <button
                className="stage-node stage-1"
                onClick={() => selectStage(1)}
              >
                <img src="/img/stage/st1.png" alt="" />
                <span className="node-label">
                  先輩・上司
                  <small>報連相 / リスク報告</small>
                </span>
              </button>
              <button
                className="stage-node stage-2"
                onClick={() => selectStage(2)}
              >
                <img src="/img/stage/st2.png" alt="" />
                <span className="node-label">
                  同僚
                  <small>協力依頼 / すり合わせ</small>
                </span>
              </button>
              <button
                className="stage-node stage-3"
                onClick={() => selectStage(3)}
              >
                <img src="/img/stage/st3.png" alt="" />
                <span className="node-label">
                  後輩
                  <small>育成 / フィードバック</small>
                </span>
              </button>
              <button
                className="stage-node stage-4"
                onClick={() => selectStage(4)}
              >
                <img src="/img/stage/st4.png" alt="" />
                <span className="node-label">
                  クライアント
                  <small>期待調整 / 提案</small>
                </span>
              </button>
              <button
                className="stage-node stage-5"
                onClick={() => selectStage(5)}
              >
                <img src="/img/stage/st5.png" alt="" />
                <span className="node-label">
                  他部署
                  <small>巻き込み / 合意形成</small>
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ── MISSION ── */}
        <section
          id="screen-mission"
          className={isActive("mission")}
          aria-labelledby="mission-heading"
        >
          <div className="hud">
            <div className="hud-card trust">
              <div className="trust-head">
                <span>信頼ゲージ</span>
                <span ref={(el) => addTrustLabelRef(el, 0)}>
                  {clamp(trust, 0, 100)}%
                </span>
              </div>
              <div className="meter">
                <div
                  id="trust-fill"
                  ref={(el) => addTrustFillRef(el, 0)}
                  className="meter-fill"
                  style={{ width: `${clamp(trust, 0, 100)}%` }}
                />
              </div>
            </div>
            <div
              className="hud-card"
              ref={(el) => addComboLabelRef(el, 0)}
            >
              🔥 COMBO {combo}
            </div>
            <div
              className="hud-card"
              ref={(el) => addStarLabelRef(el, 0)}
            >
              ⭐ {score}
            </div>
          </div>

          <div className="mission-layout">
            <article className="mission-card">
              <div className="topbar" style={{ marginBottom: 12 }}>
                <button
                  className="back-btn"
                  onClick={() => go("stage")}
                  aria-label="ステージ選択へ戻る"
                >
                  ←
                </button>
                <div>
                  <h2
                    id="mission-heading"
                    ref={missionHeadingRef}
                    className="screen-title"
                  />
                  <p id="mission-sub" ref={missionSubRef} className="subnote" />
                </div>
              </div>
              <div
                id="mission-kicker"
                ref={missionKickerRef}
                className="mission-kicker"
              />
              <p id="scenario" ref={scenarioRef} className="scenario" />
              <h3 className="choice-title">💬 どう切り出す？</h3>
              <div id="choices" ref={choicesRef} className="choices" />
            </article>

            <aside className="npc-panel">
              <img
                id="npc-img"
                ref={npcImgRef}
                src="/img/1.png"
                alt="相手キャラクター"
              />
              <div id="npc-name" ref={npcNameRef} className="npc-name" />
              <span id="npc-tag" ref={npcTagRef} className="npc-tag" />
              <button
                className="btn blue full"
                style={{ marginTop: 14 }}
                onClick={openGuide}
              >
                攻略メモ 📖
              </button>
            </aside>
          </div>
        </section>

        {/* ── FEEDBACK ── */}
        <section
          id="screen-feedback"
          className={isActive("feedback")}
          aria-labelledby="feedback-heading"
        >
          <div className="hud">
            <div className="hud-card trust">
              <div className="trust-head">
                <span>信頼ゲージ</span>
                <span ref={(el) => addTrustLabelRef(el, 1)}>
                  {clamp(trust, 0, 100)}%
                </span>
              </div>
              <div className="meter">
                <div
                  id="trust-fill-2"
                  ref={(el) => addTrustFillRef(el, 1)}
                  className="meter-fill"
                  style={{ width: `${clamp(trust, 0, 100)}%` }}
                />
              </div>
            </div>
            <div
              className="hud-card"
              ref={(el) => addComboLabelRef(el, 1)}
            >
              🔥 COMBO {combo}
            </div>
            <div
              className="hud-card"
              ref={(el) => addStarLabelRef(el, 1)}
            >
              ⭐ {score}
            </div>
          </div>

          <div className="feedback-grid">
            <article id="result-card" ref={resultCardRef} className="result-card">
              <div id="grade" ref={gradeRef} className="grade">
                A
              </div>
              <h2
                id="feedback-heading"
                ref={feedbackHeadingRef}
                className="result-title"
              />
              <p
                id="feedback-message"
                ref={feedbackMessageRef}
                className="result-message"
              />
              <div id="npc-quote" ref={npcQuoteRef} className="quote-card" />
              <h3 className="choice-title">🎮 次の行動を選ぼう</h3>
              <div id="actions" ref={actionsRef} className="choices" />
            </article>
            <aside className="coach-panel">
              <img
                id="coach-img"
                ref={coachImgRef}
                src={charImages[character]}
                alt="あなたのキャラクター"
              />
              <div
                id="coach-bubble"
                ref={coachBubbleRef}
                className="coach-bubble"
              >
                選択の理由を見てみよう。
              </div>
            </aside>
          </div>
        </section>

        {/* ── LESSON ── */}
        <section
          id="screen-lesson"
          className={isActive("lesson")}
          aria-labelledby="lesson-heading"
        >
          <div className="window">
            <div className="window-bar" aria-hidden="true">
              <span className="dot red">×</span>
              <span className="dot yellow">−</span>
              <span className="dot green">□</span>
              <span className="bar-title">CLEAR REPORT</span>
            </div>
            <div className="window-body">
              <div className="topbar">
                <button
                  className="back-btn"
                  onClick={() => go("stage")}
                  aria-label="ステージ選択へ戻る"
                >
                  ←
                </button>
                <div>
                  <h2
                    id="lesson-heading"
                    className="screen-title"
                  >
                    ステージクリア！
                  </h2>
                  <p id="lesson-sub" ref={lessonSubRef} className="subnote" />
                </div>
                <div
                  className="hud-card"
                  ref={(el) => addStarLabelRef(el, 3)}
                >
                  ⭐ {score}
                </div>
              </div>
              <div
                id="lesson-grid"
                ref={lessonGridRef}
                className="lesson-grid"
              />
              <div className="actions" style={{ justifyContent: "center" }}>
                <button
                  className="btn primary"
                  onClick={() => go("stage")}
                >
                  次のステージへ ▶
                </button>
                <button className="btn" onClick={resetGame}>
                  最初から
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

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
            <button className="btn primary" onClick={() => closeGuide()}>
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
