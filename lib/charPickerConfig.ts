/**
 * 2×8 キャラ選択グリッドのスクロール方向。
 * - `vertical` … 2列×2行表示 + 縦スライド（現在の本番）
 * - `horizontal` … 2列相当 + 横スライド（いつでも復旧可）
 */
export type CharPickerScrollAxis = "vertical" | "horizontal";

export const CHAR_PICKER_SCROLL_AXIS: CharPickerScrollAxis = "vertical";

/** 縦スライド: 1画面に見える行数（2×2 の「2」） */
export const CHAR_PICKER_VERTICAL_VISIBLE_ROWS = 2;

/** 縦スライド: ページ数（16体 ÷ 4体/ページ） */
export const CHAR_PICKER_VERTICAL_PANE_COUNT = 4;

/** 縦スライド: 1ページあたりの体数（2列×2行） */
export const CHAR_PICKER_CHARS_PER_PANE = 4;

export function charPickerScrollSubcopy(axis: CharPickerScrollAxis = CHAR_PICKER_SCROLL_AXIS) {
  return axis === "vertical"
    ? "2×2表示 · 縦スライドで16タイプ"
    : "2×4表示 · 横スライドで16タイプ";
}
