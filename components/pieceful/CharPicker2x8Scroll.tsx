"use client";

import { useEffect, useRef } from "react";
import {
  CHAR_PICKER_CHARS_PER_PANE,
  CHAR_PICKER_SCROLL_AXIS,
  CHAR_PICKER_VERTICAL_PANE_COUNT,
  type CharPickerScrollAxis,
} from "@/lib/charPickerConfig";
import { characters, charImages, type CharacterType } from "@/lib/characters";

function groupClass(cls: string) {
  return cls.replace("group-", "");
}

function CharTile({
  type,
  nick,
  cls,
  selected,
  onSelect,
}: {
  type: CharacterType;
  nick: string;
  cls: string;
  selected: CharacterType;
  onSelect: (type: CharacterType) => void;
}) {
  return (
    <button
      type="button"
      className={`pf-char-tile pf-char-tile--2x8 ${groupClass(cls)} ${
        selected === type ? "selected" : ""
      }`}
      aria-pressed={selected === type}
      aria-label={`${type} ${nick}`}
      onClick={() => onSelect(type)}
    >
      <span className="pf-char-tile-icon">
        <img src={charImages[type]} alt="" />
      </span>
    </button>
  );
}

type Props = {
  selected: CharacterType;
  onSelect: (type: CharacterType) => void;
  /** デザイン確認用: 初期表示で後半寄せ */
  initialScrollHalf?: boolean;
  /** 未指定時は charPickerConfig の軸を使用 */
  axis?: CharPickerScrollAxis;
};

export function CharPicker2x8Scroll({
  selected,
  onSelect,
  initialScrollHalf = false,
  axis = CHAR_PICKER_SCROLL_AXIS,
}: Props) {
  const isVertical = axis === "vertical";
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialScrollHalf) return;
    const el = scrollRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() => {
      if (isVertical) {
        const max = el.scrollHeight - el.clientHeight;
        el.scrollTop = max > 0 ? max * 0.48 : 0;
      } else {
        el.scrollLeft = el.scrollWidth * 0.48;
      }
    });
    return () => cancelAnimationFrame(id);
  }, [initialScrollHalf, isVertical]);

  const wrapClass = [
    "pf-type-scroll-2x8-wrap",
    isVertical ? "is-axis-vertical is-grid-2x2" : "is-axis-horizontal",
  ].join(" ");

  const scrollClass = isVertical ? "pf-type-scroll-2x8-v" : "pf-type-scroll-2x4";
  const regionLabel = isVertical
    ? "16タイプ · 縦にスライドして選択"
    : "16タイプ · 横にスライドして選択";

  return (
    <div className={wrapClass}>
      <div
        ref={scrollRef}
        className={scrollClass}
        role="region"
        aria-label={regionLabel}
      >
        {isVertical ? (
          <div className="pf-type-scroll-track-v">
            {Array.from({ length: CHAR_PICKER_VERTICAL_PANE_COUNT }, (_, pane) => (
              <div key={pane} className="pf-type-scroll-pane-v">
                {characters
                  .slice(
                    pane * CHAR_PICKER_CHARS_PER_PANE,
                    pane * CHAR_PICKER_CHARS_PER_PANE + CHAR_PICKER_CHARS_PER_PANE
                  )
                  .map(([type, nick, , cls]) => (
                    <CharTile
                      key={type}
                      type={type}
                      nick={nick}
                      cls={cls}
                      selected={selected}
                      onSelect={onSelect}
                    />
                  ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="pf-type-scroll-track">
            {Array.from({ length: 4 }, (_, col) => (
              <div key={col} className="pf-type-scroll-col">
                {characters.slice(col * 4, col * 4 + 4).map(([type, nick, , cls]) => (
                  <CharTile
                    key={type}
                    type={type}
                    nick={nick}
                    cls={cls}
                    selected={selected}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
