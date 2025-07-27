# ドキュメント作成プラン（src配下）

このドキュメントは、`src`ディレクトリ配下の各ディレクトリ・主要ファイルについて、今後作成すべきドキュメントの概要・観点をまとめたものです。

---

## 1. ディレクトリ・ファイル一覧

- @types/global
- @x-electron/compose, filer
- app
- components
  - base-finger-board, base-finger-board-mini, bend-graph-mini, overlay, slide-liner-mini, style-icon
- conduct
- editor
- features
  - base, finger-board-labo, layout-console, layout-control, layout-control-bottom, layout-labo, layout-timeline, layout-title, syntax-error
- fonts
- hooks
- interfaces
- repository
- sample-syntax.ts
- settings.ts
- store
  - cur-location-view, cur-play-view, file-state, status-of-settings
- synth
- theme
- utils
- vite-env.d.ts
- worker-brancher
- workers
- main.tsx
- index.css

---

## 2. ドキュメント化観点例

- 機能概要
- 主要な型・関数・クラスの説明
- ディレクトリ/ファイル間の関係
- 典型的な利用例
- 注意点・設計意図

---

## 3. 各ディレクトリ・主要ファイルごとのドキュメント案

### @types/global
- グローバル型定義の役割と拡張方法

### @x-electron/compose, filer
- Electron連携部分の構成と役割

### app
- アプリケーションエントリポイントの構成

### components
- UIコンポーネント群の概要
- 各サブディレクトリ（例: base-finger-board, bend-graph-mini等）の用途・props・利用例

### conduct
- 状態管理やストアとの連携部分の説明

### editor
- エディタ機能の全体像
- 各補完・装飾・制御ファイルの役割

### features
- 機能単位のUI/ロジック群の説明
- 各サブディレクトリ（例: layout-console, layout-timeline等）の役割

### fonts
- フォントファイルの用途

### hooks
- カスタムフックの一覧と用途

### interfaces
- インターフェース定義の設計方針

### repository
- リポジトリ層の役割

### sample-syntax.ts
- サンプル構文データの説明

### settings.ts
- 設定ファイルの用途

### store
- 状態管理の全体像
- 各sliceの役割

### synth
- シンセサイザー関連のロジック

### theme
- テーマ切り替え・スタイル管理

### utils
- 汎用ユーティリティ関数

### vite-env.d.ts
- Vite用型定義の説明

### worker-brancher, workers
- ワーカー処理の構成と役割

### main.tsx, index.css
- アプリケーションのエントリポイント・グローバルスタイル

---

## 4. 主要機能ピックアップと個別シーケンス図作成プラン

以下の主要機能ごとに、親となるサービス（機能）を中心としたシーケンス図を作成する：

- エディタ編集・保存フロー
- シンタックスハイライト・補完フロー
- 再生（MIDI生成・サウンド再生）フロー
- 設定・テーマ切り替えフロー
- 状態永続化・ロードフロー
- Workerによる非同期コンパイル・エラー処理フロー

各機能ごとに、
- 関連サービス・ファイルのやりとり
- 主要なデータの流れ
- 重要な分岐や非同期処理
- 特徴的な設計意図
などをシーケンス図で可視化する。

---

## 5. 今後のドキュメント作成方針

- まずは各ディレクトリ・主要ファイルごとに上記観点で1ファイルずつMarkdownドキュメントを作成
- その後、利用例やFAQ、設計意図などを充実させていく
- コード変更時は必ず該当ドキュメントも更新

---

（このプランは自動生成されました。必要に応じて加筆修正してください） 