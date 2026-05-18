import Link from "next/link";
import { PhoneFrame } from "@/components/PhoneFrame";

const previews = [
  {
    layout: "2×8",
    folder: "2x8",
    pages: [
      {
        href: "/designs/char-picker/2x8/page-1",
        embed: "/designs/char-picker/embed/2x8/page-1",
        label: "初期表示（左寄せ · 16体）",
      },
      {
        href: "/designs/char-picker/2x8/page-2",
        embed: "/designs/char-picker/embed/2x8/page-2",
        label: "スライド後（右寄せ）",
      },
    ],
  },
  {
    layout: "4×4",
    folder: "4x4",
    pages: [
      {
        href: "/designs/char-picker/4x4/page-1",
        embed: "/designs/char-picker/embed/4x4/page-1",
        label: "ページ 1 · Analyst",
      },
      {
        href: "/designs/char-picker/4x4/page-2",
        embed: "/designs/char-picker/embed/4x4/page-2",
        label: "ページ 2 · Sentinel",
      },
      {
        href: "/designs/char-picker/4x4/page-3",
        embed: "/designs/char-picker/embed/4x4/page-3",
        label: "ページ 3 · Diplomat",
      },
      {
        href: "/designs/char-picker/4x4/page-4",
        embed: "/designs/char-picker/embed/4x4/page-4",
        label: "ページ 4 · Explorer",
      },
    ],
  },
] as const;

export default function CharPickerDesignIndex() {
  return (
    <main className="design-gallery">
      <header className="design-gallery-header">
        <p className="design-gallery-eyebrow">DESIGN PREVIEW</p>
        <h1>キャラ選択レイアウト</h1>
        <p>
          本番ゲームとは導線未接続。各ページを開いてスマホ枠内の見え方を確認できます。
          2×8 は 2×4 表示＋縦スライドで16体（`lib/charPickerConfig.ts` で横にも切替可）。現行本番は 2×8 縦。
        </p>
        <p>
          <Link href="/designs/flow">全体導線マップ →</Link>
          {" · "}
          <Link href="/game">本番ゲームへ →</Link>
        </p>
      </header>

      {previews.map((group) => (
        <section key={group.folder} className="design-gallery-section">
          <h2>{group.layout} レイアウト</h2>
          <ul className="design-gallery-links">
            {group.pages.map((page) => (
              <li key={page.href}>
                <Link href={page.href}>{page.label}</Link>
              </li>
            ))}
          </ul>
          <div className="design-gallery-frames">
            {group.pages.map((page) => (
              <figure key={page.href}>
                <figcaption>
                  <Link href={page.href}>{page.label}</Link>
                </figcaption>
                <PhoneFrame src={page.embed} />
              </figure>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
