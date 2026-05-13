# Goal: MBTI Communication Quest — UX完成・ゲーム成立

## Original Request
「自発的にゲームが成立するようにとステージの移動やユーザビリティを考えた設計でゲーム完成まで自動で動かして。たとえば、戻るがトップまで戻らずにステージ選択まで戻るほうが最適、自分のMBTIは基本的にほとんど変えないので、そこで、目立たないくらいの位置で変更、ステージの位置なども調整したりして、完成まで頑張って」

## Interpreted Outcome
MBTI Communication Quest (Pieceful) を「自己完結した完成品ゲーム」に仕上げる。プレイヤーが迷わず最後まで遊び切れるUX、不要な往復を省くナビゲーション、MBTI変更は目立たない配置、CSV由来のMBTI別シナリオ統合まで含めた完成度。

## Input Shape
specific — 要件は明確（ナビゲーション改善、MBTI選択UI調整、CSV統合、ポリッシュ）

## Current State Analysis
- **Screens**: title → character → stage → mission → feedback → lesson
- **Back button issues**:
  - character画面の戻る → `title`に戻る（→ `stage`に変更すべき）
  - mission画面の戻る → `stage`（OK）
  - feedback画面の戻る → `stage`（OK）
  - lesson画面の戻る → `stage`（OK）
  - lesson「次のステージへ」→ `stage`（OK）
  - lesson「最初から」→ `resetGame()`で`title`に戻る（→ `stage`に変更検討）
- **MBTI selection**: character画面は独立した大きな画面。一度選んだらほぼ変えないので、stage画面内に小さく配置すべき
- **CSV data**: 80レコード（16MBTI×5相手）がreport.htmlには統合済みだが、page.tsxには未統合
- **Stage data**: 現在5ステージすべて共通データ（MBTI別シナリオなし）
- **CSS**: 1664行、2テーマ（original + 8-bit Famicom）

## Constraints
- Single page.tsx file（1430行）
- Next.js App Router
- CSV data（80レコード）の統合が必要
- CSS globals.css は既存テーマ維持

## Likely Misfire
- ナビゲーションだけ直してCSV統合を忘れる
- MBTI選択を小さくしすぎて見つけられなくなる
- ゲームフローを壊す（スコア・コンボ・信頼度のリセットタイミング）

## Completion Proof
- すべての画面で戻るボタンが期待通り動作する
- MBTI変更がstage画面から目立たない位置で可能
- CSVデータのMBTI別シナリオがゲーム内で反映される
- 最初から最後までゲームが自己完結して成立する
- ブラウザで全画面の動作確認が通る
