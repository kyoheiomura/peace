export const characters = [
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

export type CharacterType = (typeof characters)[number][0];

export const charImages = Object.fromEntries(
  characters.map((c, i) => [c[0], `/img/${i + 1}.png`])
) as Record<CharacterType, string>;

export const charNick = Object.fromEntries(
  characters.map((c) => [c[0], c[1]])
) as Record<CharacterType, string>;

export const charGroupLabels = [
  "Analyst（分析家）",
  "Sentinel（番人）",
  "Diplomat（外交官）",
  "Explorer（探検家）",
] as const;

export function charactersForPage(
  layout: "2x8" | "4x4",
  page: number
): (typeof characters)[number][] {
  if (layout === "2x8") {
    const start = (page - 1) * 8;
    return characters.slice(start, start + 8);
  }
  const start = (page - 1) * 4;
  return characters.slice(start, start + 4);
}

/** 4x4 グリッド上の配置（ページごとに左上・右上・左下・右下の象限） */
export function quadrantSlots(page: number): number[] {
  const col = (page - 1) % 2;
  const row = Math.floor((page - 1) / 2);
  const base = row * 8 + col * 2;
  return [base, base + 1, base + 4, base + 5];
}
