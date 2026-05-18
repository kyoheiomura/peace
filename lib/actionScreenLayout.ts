/** どう振る舞う画面の縦レイアウト逆算用定数 */
export const ACTION_SCREEN_LAYOUT = {
  scenarioFontSize: 12,
  scenarioLineHeight: 1.45,
  scenarioParagraphGap: 8,
  layoutGap: 8,
  topbarFallback: 46,
  promptFallback: 28,
  kiridashiFallback: 56,
  scenarioHeadFallback: 14,
  scenarioPadding: 8,
  choiceRowMin: 52,
  choiceGap: 8,
  minScenarioLines: 3,
  maxScenarioLinesCollapsed: 4,
  /** 本文幅 ~300px 想定の1行あたり全角文字数目安 */
  charsPerLine: 34,
} as const;

export function scenarioLineHeightPx(): number {
  return (
    ACTION_SCREEN_LAYOUT.scenarioFontSize *
    ACTION_SCREEN_LAYOUT.scenarioLineHeight
  );
}

export type ActionLayoutMetrics = {
  scenarioClampPx: number;
  maxCollapsedLines: number;
  maxScenarioChars: number;
  reservedPx: number;
};

/**
 * 残り縦幅からシナリオ折りたたみ高さと最大文字数を逆算する。
 */
export function computeActionLayoutMetrics(
  layoutHeightPx: number,
  reservedExceptScenarioPx: number
): ActionLayoutMetrics {
  const lh = scenarioLineHeightPx();
  const choiceBlock =
    ACTION_SCREEN_LAYOUT.choiceRowMin * 4 +
    ACTION_SCREEN_LAYOUT.choiceGap * 3;
  const reserved =
    reservedExceptScenarioPx +
    ACTION_SCREEN_LAYOUT.scenarioHeadFallback +
    ACTION_SCREEN_LAYOUT.scenarioPadding;

  const maxCollapsedLines = ACTION_SCREEN_LAYOUT.maxScenarioLinesCollapsed;

  const scenarioClampPx =
    maxCollapsedLines * lh +
    (maxCollapsedLines > 1 ? ACTION_SCREEN_LAYOUT.scenarioParagraphGap : 0);

  return {
    scenarioClampPx,
    maxCollapsedLines,
    maxScenarioChars:
      maxCollapsedLines * ACTION_SCREEN_LAYOUT.charsPerLine,
    reservedPx: reserved + choiceBlock,
  };
}
