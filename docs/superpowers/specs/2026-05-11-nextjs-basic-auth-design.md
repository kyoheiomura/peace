# Next.js化 + Basic Auth Middleware 設計

## 目的

静的HTMLのMBTIゲームサイトをNext.js (App Router) に変換し、Vercelデプロイ前にBasic認証を追加する。

## プロジェクト構成

```
/Volumes/Build/MBTI-games/
├── app/
│   ├── layout.tsx      — ルートレイアウト (html lang="ja", meta, fonts)
│   ├── page.tsx        — MBTIゲームUI ("use client")
│   └── globals.css     — 全スタイル
├── middleware.ts       — Basic認証 (Edge Runtime)
├── public/
│   └── img/            — 画像ファイル
├── package.json
├── tsconfig.json
├── next.config.ts
└── .env.local          — BASIC_AUTH_USER, BASIC_AUTH_PASS (gitignore)
```

## Middleware (middleware.ts)

- Edge Runtimeで動作
- `Authorization: Basic <base64>` ヘッダーを検証
- 環境変数 `BASIC_AUTH_USER` / `BASIC_AUTH_PASS` で認証情報を管理
- 認証失敗: `401` + `WWW-Authenticate: Basic realm="MBTI Games"` レスポンス
- マッチャー: 全ルート (`/`) を保護

## HTML → JSX変換ルール

1. `<style>` ブロックの内容を `globals.css` に抽出
2. `<script>` 内のJSロジックを `"use client"` コンポーネントに移動
3. `onclick` 等のインラインイベント → React `onClick` ハンドラ
4. 画像パス `/img/...` はそのまま（public配下）
5. `<html>`, `<head>`, `<body>` → `layout.tsx` に分割
6. Google Fonts → `next/font/google` または `<link>` のまま

## デプロイ

- Vercelプロジェクト設定で環境変数を追加:
  - `BASIC_AUTH_USER`
  - `BASIC_AUTH_PASS`
- `.env.local` はローカル開発用、Vercelではダッシュボードで設定
- `vercel.json` は不要（Next.js標準対応）

## 制約

- `sample.html` は削除済み
- 認証スコープ: サイト全体（将来ページ追加時もmiddlewareが保護）
