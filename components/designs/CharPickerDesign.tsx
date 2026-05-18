"use client";

import { useState } from "react";
import { charPickerScrollSubcopy } from "@/lib/charPickerConfig";
import {
  charGroupLabels,
  charImages,
  charNick,
  charactersForPage,
  quadrantSlots,
  type CharacterType,
} from "@/lib/characters";
import { CharPicker2x8Scroll } from "@/components/pieceful/CharPicker2x8Scroll";

type LayoutMode = "2x8" | "4x4";

export type CharPickerDesignProps = {
  layout: LayoutMode;
  page: number;
  totalPages: number;
  selected?: CharacterType;
  /** 2×8 横スクロールの初期位置（デザイン用: 後半を見せる） */
  scrollHalf?: boolean;
};

function groupClass(cls: string) {
  return cls.replace("group-", "");
}

export function CharPickerDesign({
  layout,
  page,
  totalPages,
  selected = "ESTP",
  scrollHalf = false,
}: CharPickerDesignProps) {
  const [picked, setPicked] = useState<CharacterType>(selected);
  const activeType = layout === "2x8" ? picked : selected;
  const pageChars = charactersForPage(layout, page);
  const groupLabel =
    layout === "4x4" ? charGroupLabels[page - 1] : `2×8 · ${charPickerScrollSubcopy()}`;

  return (
    <main className="app pf-app">
        <section className="screen active" aria-labelledby="type-heading">
          <div className="pf-screen pf-paper">
            <div className="pf-safe">
              <div
                className={`pf-type-layout pf-type-layout--picker${
                  layout === "2x8" ? " pf-type-layout--picker-2x8" : ""
                }`}
              >
                <div className="pf-topbar">
                  <button type="button" className="pf-back-btn" aria-label="戻る">
                    ←
                  </button>
                  <div>
                    <h2 id="type-heading" className="pf-screen-title">
                      キャラを選ぼう!
                    </h2>
                    <p className="pf-screen-sub">
                      {layout === "2x8"
                        ? charPickerScrollSubcopy()
                        : "4×4 象限（4ページ）"}
                    </p>
                  </div>
                  <span className="pf-mini-btn">ALL</span>
                </div>

                <div className="pf-design-badge" aria-hidden>
                  {layout.toUpperCase()} · {groupLabel}
                </div>

                <div
                  className={`pf-selected-type${layout === "2x8" ? " pf-selected-type--hero" : ""}`}
                >
                  <img src={charImages[activeType]} alt="" />
                  <div>
                    <h3>{activeType}</h3>
                    {layout === "2x8" ? (
                      <>
                        <p className="pf-selected-type-nick">{charNick[activeType]}</p>
                        <p className="pf-selected-type-note">
                          選ぶとステージ内容が少し変わります。迷ったらESTPで開始。
                        </p>
                      </>
                    ) : (
                      <p>
                        {charNick[activeType]}
                        <br />
                        デザイン確認用（導線未接続）
                      </p>
                    )}
                  </div>
                </div>

                {layout === "2x8" ? (
                  <CharPicker2x8Scroll
                    selected={activeType}
                    onSelect={setPicked}
                    initialScrollHalf={scrollHalf}
                  />
                ) : (
                  <div className="pf-type-grid-4x4-page">
                    {Array.from({ length: 16 }, (_, i) => {
                      const slotIndex = quadrantSlots(page).indexOf(i);
                      if (slotIndex === -1) {
                        return (
                          <div
                            key={`ghost-${i}`}
                            className="pf-char-tile pf-char-tile--ghost"
                            aria-hidden
                          />
                        );
                      }
                      const [type, nick, , cls] = pageChars[slotIndex]!;
                      return (
                        <button
                          key={type}
                          type="button"
                          className={`pf-char-tile ${groupClass(cls)} ${
                            selected === type ? "selected" : ""
                          }`}
                          aria-pressed={selected === type}
                          aria-label={`${type} ${nick}`}
                        >
                          <img src={charImages[type]} alt="" />
                        </button>
                      );
                    })}
                  </div>
                )}

                {layout !== "2x8" && (
                  <div className="pf-pager" aria-label={`${page} / ${totalPages}`}>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <span key={i} className={i + 1 === page ? "on" : undefined} />
                    ))}
                  </div>
                )}

                <button type="button" className="pf-big-btn">
                  このタイプで開始 ▶
                </button>
              </div>
            </div>
          </div>
        </section>
    </main>
  );
}
