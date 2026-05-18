"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CHAR_PICKER_SCROLL_AXIS,
  type CharPickerScrollAxis,
} from "@/lib/charPickerConfig";
import { characters, charImages, type CharacterType } from "@/lib/characters";

const SWIPE_COACH_KEY = "pieceful:charPickerSwipeHintSeen" as const;
const SCROLL_DISMISS_PX = 10;

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
  /** 初回スワイプ案内（本番は true） */
  enableSwipeCoach?: boolean;
  /** 未指定時は charPickerConfig の軸を使用 */
  axis?: CharPickerScrollAxis;
};

export function CharPicker2x8Scroll({
  selected,
  onSelect,
  initialScrollHalf = false,
  enableSwipeCoach = true,
  axis = CHAR_PICKER_SCROLL_AXIS,
}: Props) {
  const isVertical = axis === "vertical";
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPane, setScrollPane] = useState(0);
  const [scrollAtEnd, setScrollAtEnd] = useState(false);
  const [showSwipeCoach, setShowSwipeCoach] = useState(false);

  const dismissSwipeCoach = useCallback(() => {
    setShowSwipeCoach(false);
    try {
      localStorage.setItem(SWIPE_COACH_KEY, "true");
    } catch {
      /* private mode 等 */
    }
  }, []);

  useEffect(() => {
    if (!initialScrollHalf) return;
    const el = scrollRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() => {
      if (isVertical) {
        el.scrollTop = el.scrollHeight * 0.48;
      } else {
        el.scrollLeft = el.scrollWidth * 0.48;
      }
      setScrollPane(1);
      if (isVertical) {
        setScrollAtEnd(el.scrollTop + el.clientHeight >= el.scrollHeight - 10);
      } else {
        setScrollAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 10);
      }
    });
    return () => cancelAnimationFrame(id);
  }, [initialScrollHalf, isVertical]);

  useEffect(() => {
    if (initialScrollHalf || !enableSwipeCoach) return;
    try {
      if (localStorage.getItem(SWIPE_COACH_KEY) !== "true") {
        setShowSwipeCoach(true);
      }
    } catch {
      setShowSwipeCoach(true);
    }
  }, [initialScrollHalf, enableSwipeCoach]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (isVertical) {
      setScrollPane(el.scrollTop > el.clientHeight * 0.2 ? 1 : 0);
      setScrollAtEnd(el.scrollTop + el.clientHeight >= el.scrollHeight - 10);
      if (showSwipeCoach && el.scrollTop > SCROLL_DISMISS_PX) {
        dismissSwipeCoach();
      }
    } else {
      setScrollPane(el.scrollLeft > el.clientWidth * 0.2 ? 1 : 0);
      setScrollAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 10);
      if (showSwipeCoach && el.scrollLeft > SCROLL_DISMISS_PX) {
        dismissSwipeCoach();
      }
    }
  };

  const hintDone = scrollPane === 1 || scrollAtEnd;
  const wrapClass = [
    "pf-type-scroll-2x8-wrap",
    isVertical ? "is-axis-vertical" : "is-axis-horizontal",
    showSwipeCoach ? "is-coach-active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const scrollClass = isVertical ? "pf-type-scroll-2x8-v" : "pf-type-scroll-2x4";
  const regionLabel = isVertical
    ? "16タイプ · 縦にスライドして選択"
    : "16タイプ · 横にスライドして選択";

  return (
    <>
      <div className={wrapClass}>
        <div
          ref={scrollRef}
          className={scrollClass}
          role="region"
          aria-label={regionLabel}
          data-at-end={scrollAtEnd || undefined}
          onScroll={onScroll}
        >
          {isVertical ? (
            <div className="pf-type-scroll-track-v">
              {[0, 1].map((pane) => (
                <div key={pane} className="pf-type-scroll-pane-v">
                  {characters.slice(pane * 8, pane * 8 + 8).map(([type, nick, , cls]) => (
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
        {showSwipeCoach && (
          <div className="pf-type-scroll-coach" role="status" aria-live="polite">
            <span className="pf-type-scroll-coach-dim" aria-hidden />
            <p className="pf-type-scroll-coach-text">
              {isVertical ? "縦にスライドできる" : "横にスライドできる"}
              <span className="pf-type-scroll-coach-arrow" aria-hidden>
                {isVertical ? "↓" : "→"}
              </span>
            </p>
          </div>
        )}
        <span className="pf-type-scroll-edge" aria-hidden />
        <span
          className={`pf-type-scroll-hint${hintDone || showSwipeCoach ? " is-done" : ""}`}
          aria-hidden
        >
          {isVertical ? "↓" : "→"}
        </span>
      </div>
      <div className="pf-pager" aria-label="スクロール位置">
        {[0, 1].map((i) => (
          <span key={i} className={scrollPane === i ? "on" : undefined} />
        ))}
      </div>
    </>
  );
}
