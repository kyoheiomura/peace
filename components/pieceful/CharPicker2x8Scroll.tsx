"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { characters, charImages, type CharacterType } from "@/lib/characters";

const SWIPE_COACH_KEY = "pieceful:charPickerSwipeHintSeen" as const;
const SCROLL_DISMISS_PX = 10;

function groupClass(cls: string) {
  return cls.replace("group-", "");
}

type Props = {
  selected: CharacterType;
  onSelect: (type: CharacterType) => void;
  /** デザイン確認用: 初期表示で右寄せ */
  initialScrollHalf?: boolean;
  /** 初回スワイプ案内（本番は true） */
  enableSwipeCoach?: boolean;
};

export function CharPicker2x8Scroll({
  selected,
  onSelect,
  initialScrollHalf = false,
  enableSwipeCoach = true,
}: Props) {
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
      el.scrollLeft = el.scrollWidth * 0.48;
      setScrollPane(1);
      setScrollAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 10);
    });
    return () => cancelAnimationFrame(id);
  }, [initialScrollHalf]);

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
    setScrollPane(el.scrollLeft > el.clientWidth * 0.2 ? 1 : 0);
    setScrollAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 10);
    if (showSwipeCoach && el.scrollLeft > SCROLL_DISMISS_PX) {
      dismissSwipeCoach();
    }
  };

  const hintDone = scrollPane === 1 || scrollAtEnd;

  return (
    <>
      <div
        className={`pf-type-scroll-2x4-wrap${showSwipeCoach ? " is-coach-active" : ""}`}
      >
        <div
          ref={scrollRef}
          className="pf-type-scroll-2x4"
          role="region"
          aria-label="16タイプ · 横にスライドして選択"
          data-at-end={scrollAtEnd || undefined}
          onScroll={onScroll}
        >
          <div className="pf-type-scroll-track">
            {Array.from({ length: 4 }, (_, col) => (
              <div key={col} className="pf-type-scroll-col">
                {characters.slice(col * 4, col * 4 + 4).map(([type, nick, , cls]) => (
                  <button
                    key={type}
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
                ))}
              </div>
            ))}
          </div>
        </div>
        {showSwipeCoach && (
          <div className="pf-type-scroll-coach" role="status" aria-live="polite">
            <span className="pf-type-scroll-coach-dim" aria-hidden />
            <p className="pf-type-scroll-coach-text">
              横にスライドできる
              <span className="pf-type-scroll-coach-arrow" aria-hidden>
                →
              </span>
            </p>
          </div>
        )}
        <span className="pf-type-scroll-edge" aria-hidden />
        <span
          className={`pf-type-scroll-hint${hintDone || showSwipeCoach ? " is-done" : ""}`}
          aria-hidden
        >
          →
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
