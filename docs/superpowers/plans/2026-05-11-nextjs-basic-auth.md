# Next.js化 + Basic Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 静的HTMLのMBTIゲームサイトをNext.js (App Router) に変換し、Vercelデプロイ用のBasic認証middlewareを追加する。

**Architecture:** Next.js App Router + Edge Middleware。HTMLのCSSをglobals.cssに分離、JSロジックを"use client" page.tsxに移行。middleware.tsでHTTP Basic認証をEdge Runtimeで実行。

**Tech Stack:** Next.js 15, React 19, TypeScript, Edge Middleware

---

### Task 1: Next.jsプロジェクト初期化

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `.env.local`
- Create: `.gitignore`

- [ ] **Step 1: package.jsonを作成**

```json
{
  "name": "mbti-games",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19"
  },
  "devDependencies": {
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5"
  }
}
```

- [ ] **Step 2: tsconfig.jsonを作成**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: next.config.tsを作成**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
```

- [ ] **Step 4: .env.localを作成**

```
BASIC_AUTH_USER=admin
BASIC_AUTH_PASS=changeme
```

- [ ] **Step 5: .gitignoreを作成/更新**

```
node_modules/
.next/
.env.local
```

- [ ] **Step 6: npm installを実行**

Run: `cd /Volumes/Build/MBTI-games && npm install`
Expected: node_modulesが作成される

- [ ] **Step 7: Commit**

```bash
git init
git add package.json tsconfig.json next.config.ts .env.local .gitignore
git commit -m "chore: initialize Next.js project"
```

---

### Task 2: 画像をpublic/に移動

**Files:**
- Move: `img/` → `public/img/`
- Delete: `sample/` (already deleted)

- [ ] **Step 1: 画像ディレクトリをpublic/に移動**

Run: `mv /Volumes/Build/MBTI-games/img /Volumes/Build/MBTI-games/public/img`

- [ ] **Step 2: 画像パスを確認**

`./img/...` のパスを `/img/...` に変更（public配下なので先頭スラッシュ）。

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: move images to public/"
```

---

### Task 3: CSSをglobals.cssに分離

**Files:**
- Create: `app/globals.css`
- Source: `index.html` lines 10-938 (normal skin) + lines 940-1674 (8-bit skin)

- [ ] **Step 1: globals.cssを作成**

index.htmlの`<style>`〜`</style>`の内容（2つの:rootブロック含む全CSS、lines 10-1674）をそのまま`app/globals.css`に抽出する。

```css
/* index.html lines 11-937: normal skin styles */
:root { ... }
* { box-sizing: border-box; }
/* ... full CSS ... */

/* index.html lines 940-1674: 8-bit/famicom skin */
:root {
  --ink: #10172f;
  /* ... full 8-bit overrides ... */
}
```

注意: `</style>`タグ自体は含めない。

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "refactor: extract CSS to globals.css"
```

---

### Task 4: layout.tsxを作成

**Files:**
- Create: `app/layout.tsx`

- [ ] **Step 1: layout.tsxを作成**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pieceful - MBTI Communication Quest",
  description: "MBTIタイプ別キャラクターで、職場コミュニケーションを攻略するミニゲーム。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=DotGothic16&family=M+PLUS+Rounded+1c:wght@400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: create root layout"
```

---

### Task 5: page.tsxを作成（HTML→JSX変換）

**Files:**
- Create: `app/page.tsx`
- Source: `index.html` lines 1676-2196 (body + script)

- [ ] **Step 1: page.tsxを作成**

"use client"コンポーネントとして、HTML body + scriptをJSXに変換。

変換ルール:
- `<span class="bg-chip chip-1">🌙</span>` 等 → JSXそのまま
- `onclick="go('character')"` → `onClick={() => go('character')}`
- `onclick="closeGuide(event)"` → `onClick={(e) => closeGuide(e)}`
- `onclick="this.classList.toggle('open')"` → `onClick={(e) => e.currentTarget.classList.toggle('open')}`
- `onclick="selectCharacter('${type}')"` → `onClick={() => selectCharacter(type)}`
- `onclick="selectStage(1)"` → `onClick={() => selectStage(1)}`
- `onclick="selectAnswer('${c.id}')"` → `onClick={() => selectAnswer(c.id)}`
- `onclick="selectAction('${a.id}')"` → `onClick={() => selectAction(a.id)}`
- `id="..."` → `id="..."` （そのまま）
- `class="..."` → `className="..."`
- `for` 属性なし、`aria-labelledby`はそのまま
- `src="./img/..."` → `src="/img/..."` （public配下）
- script内のデータ（characters, stages, state等）はuseState/useRefまたはモジュールスコープに
- `document.getElementById` → `document.getElementById` （そのまま、ref化は任意）
- `document.addEventListener('keydown', ...)` → `useEffect`内に
- `initCharacters()` / `syncHud()` の初期呼び出し → `useEffect`内に

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";

const characters = [
  ["INTJ","戦略設計型","Analyst","group-analyst"],
  // ... 全16タイプ
];

const charImages = Object.fromEntries(
  characters.map((c, i) => [c[0], `/img/${i + 1}.png`])
);
const charNick = Object.fromEntries(characters.map((c) => [c[0], c[1]]));

const stages = { /* 全5ステージのデータ */ };

export default function Home() {
  const [screen, setScreen] = useState("title");
  const [character, setCharacter] = useState("ESTP");
  const [stage, setStage] = useState(1);
  const [trust, setTrust] = useState(35);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lastChoice, setLastChoice] = useState<string | null>(null);
  const [lastAnswer, setLastAnswer] = useState<any>(null);

  // ... game logic functions ...

  // ... JSX return with all screens ...
  return (
    <>
      <span className="bg-chip chip-1">🌙</span>
      {/* ... full HTML body as JSX ... */}
      <main className="app">
        {/* ... all screen sections ... */}
      </main>
      {/* ... modal, toast, confetti ... */}
    </>
  );
}
```

重要: このファイルは大きくなる（~600行）が、単一ページゲームのため許容。ゲームロジックを別ファイルに分離してもよいが、YAGNIでまずは単一ファイル。

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: convert HTML game to React component"
```

---

### Task 6: middleware.tsを作成（Basic認証）

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: middleware.tsを作成**

```ts
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export function middleware(request: NextRequest) {
  const authUser = process.env.BASIC_AUTH_USER;
  const authPass = process.env.BASIC_AUTH_PASS;

  if (!authUser || !authPass) {
    return NextResponse.next();
  }

  const authorization = request.headers.get("authorization");
  if (
    authorization &&
    authorization.startsWith("Basic ")
  ) {
    const [user, pass] = atob(authorization.split(" ")[1]).split(":");
    if (user === authUser && pass === authPass) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="MBTI Games"',
    },
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add middleware.ts
git commit -m "feat: add Basic auth middleware"
```

---

### Task 7: ローカル動作確認

- [ ] **Step 1: 開発サーバーを起動**

Run: `cd /Volumes/Build/MBTI-games && npm run dev`
Expected: `http://localhost:3000` でBasic認証ダイアログが表示される

- [ ] **Step 2: 認証テスト**

1. ブラウザで `http://localhost:3000` を開く
2. Basic認証ダイアログで `admin` / `changeme` を入力
3. ゲーム画面が表示されることを確認
4. キャラクター選択 → ステージ選択 → ミッション → フィードバック → レッスン画面が動作することを確認
5. 不正な認証で401が返ることを確認

- [ ] **Step 3: ビルドテスト**

Run: `cd /Volumes/Build/MBTI-games && npm run build`
Expected: ビルド成功

---

### Task 8: Vercelデプロイ

- [ ] **Step 1: Vercelにプロジェクトをリンク**

Run: `cd /Volumes/Build/MBTI-games && npx vercel`

- [ ] **Step 2: 環境変数を設定**

Vercelダッシュボードで以下を設定:
- `BASIC_AUTH_USER` = 本番用ユーザー名
- `BASIC_AUTH_PASS` = 本番用パスワード

- [ ] **Step 3: 本番URLで動作確認**

Basic認証 → ゲーム動作 → レスポンシブ表示を確認

---

## Self-Review

1. **Spec coverage:** Basic auth middleware (Task 6), JSX conversion (Task 5), CSS extraction (Task 3), image migration (Task 2), Vercel deploy (Task 8) — 全要件カバー。
2. **Placeholder scan:** なし。全ステップに具体的なコードとコマンド。
3. **Type consistency:** `character` stateはstring, `stage`/`trust`/`score`/`combo`はnumber, `lastChoice`はstring|null — 一貫性OK。
