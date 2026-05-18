/**
 * 2×8 キャラ選択グリッドのスクロール方向。
 * - `vertical` … 2列×4行表示 + 縦スライド（現在の本番）
 * - `horizontal` … 2列相当 + 横スライド（以前の本番・いつでも復旧可）
 */
export type CharPickerScrollAxis = "vertical" | "horizontal";

export const CHAR_PICKER_SCROLL_AXIS: CharPickerScrollAxis = "vertical";

export function charPickerScrollSubcopy(axis: CharPickerScrollAxis = CHAR_PICKER_SCROLL_AXIS) {
  return axis === "vertical"
    ? "2×4表示 · 縦スライドで16タイプ"
    : "2×4表示 · 横スライドで16タイプ";
}
