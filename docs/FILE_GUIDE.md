# MyBudget ファイルガイド

このドキュメントでは、MyBudget プロジェクト内の主要なファイルとその役割、利用方法を説明します。Next.js 14 の App Router 構成に基づく家計簿アプリで、すべての UI はクライアントコンポーネントとして構築されています。

## ルート構成

| パス | 説明 | 利用方法 |
| ---- | ---- | -------- |
| `package.json` | プロジェクトの npm 依存関係とスクリプトを定義します。Next.js 14、TypeScript、ESLint を含みます。 | `npm install` で依存関係を取得し、`npm run dev` で開発サーバーを起動します。 |
| `tsconfig.json` | TypeScript のコンパイル設定です。`strict` モードを有効化し、`paths` でエイリアスを設定していません。 | TypeScript のオプションを調整したい場合に編集します。 |
| `next.config.js` | Next.js の基本設定です。ここでは実験的な App Router 設定を有効にしています。 | Next.js 固有の設定を変更する場合に編集します。 |
| `README.md` | プロジェクトのセットアップと基本的な使用方法をまとめたドキュメントです。 | プロジェクトの概要を確認したい場合に参照します。 |
| `types.ts` | アプリ全体で共有する型 (`BudgetEntry`, `EntryType`) を定義します。 | 各コンポーネントで家計簿レコードを扱う際にインポートして利用します。 |

## `app/` ディレクトリ

App Router 用のエントリーポイントやグローバルスタイルを保持します。

| パス | 説明 | 利用方法 |
| ---- | ---- | -------- |
| `app/layout.tsx` | アプリ全体のレイアウトを定義し、グローバルスタイルとメタデータ (`metadata`, `viewport`) を設定します。 | ページ共通のメタ情報やレイアウト、フォント読み込みを変更する際に編集します。 |
| `app/globals.css` | 全体のスタイルシートです。テーマカラー、レイアウト、コンポーネントのスタイル、レスポンシブ対応を含みます。 | カラーパレットや共通コンポーネントのスタイルを調整したい場合に編集します。 |
| `app/page.tsx` | Home ページのコンテナコンポーネントです。localStorage に保存された家計簿データの読み込み・保存、フィルタリング、集計ロジックを持ち、各 UI コンポーネントを組み合わせて描画します。 | 新しいフィルターや集計ロジックを追加する際に編集します。 |

## `components/` ディレクトリ

UI コンポーネント群。すべて `"use client"` 指定のクライアントコンポーネントです。

### `EntryForm.tsx`

- **役割**: 収支の入力フォームを提供します。カテゴリ、日付、金額、タイプ（収入/支出）、メモを入力できます。
- **主な props**:
  - `onSubmit(data: EntryFormData)` — フォーム送信時に呼び出されるコールバック。
  - `categories: string[]` — セレクトボックスに表示するカテゴリ候補。
- **利用方法**: `app/page.tsx` で状態を管理しながら利用します。送信時のバリデーションとクリア処理を内部で行います。

### `EntryList.tsx`

- **役割**: 収支エントリの一覧をテーブル形式で表示します。
- **主な props**:
  - `entries: BudgetEntry[]` — 表示するレコード。
  - `onDelete(id: string)` — 削除ボタン押下時のコールバック。
- **利用方法**: フィルタ後のエントリを渡すと、日付、カテゴリ、金額、タイプ、メモを表示し、削除操作を提供します。

### `FilterBar.tsx`

- **役割**: 月、カテゴリ、タイプ、検索キーワードによるフィルター UI を提供します。
- **主な props**:
  - `filters` — 現在のフィルタリング状態。
  - `onChange(partial: Partial<FilterState>)` — フィルター変更時に呼び出されるコールバック。
  - `categories: string[]` — カテゴリ選択肢。
- **利用方法**: 親コンポーネントでフィルター状態を管理し、変更イベントで `filters` を更新します。

### `BudgetSummary.tsx`

- **役割**: 合計収入、合計支出、残高、平均収支、件数をカード表示します。
- **主な props**:
  - `totalIncome`, `totalExpense`, `balance`, `averageIncomePerDay`, `averageExpensePerDay`, `entryCount`。
- **利用方法**: フィルタ済みデータから計算した指標を渡して表示します。スタイルは `app/globals.css` に依存します。

### `CategoryBreakdown.tsx`

- **役割**: カテゴリごとの収入・支出内訳を可視化します。
- **主な props**:
  - `categoryStats: { category: string; income: number; expense: number; }[]`。
- **利用方法**: `app/page.tsx` で集計したカテゴリ別統計値を渡すと、棒グラフ風の UI で可視化します。

## 型定義

### `types.ts`

```ts
export type EntryType = "income" | "expense";

export interface BudgetEntry {
  id: string;
  date: string;
  category: string;
  type: EntryType;
  amount: number;
  description: string;
}
```

`BudgetEntry` 型はアプリ全体のデータモデルであり、localStorage に保存されるデータ形式とも一致します。各コンポーネントはこの型を参照してデータ整合性を保ちます。

## 実行と開発フロー

1. 依存関係をインストール: `npm install`
2. 開発サーバーを起動: `npm run dev`
3. ブラウザで `http://localhost:3000` を開き、家計簿アプリを利用します。
4. 変更を行った場合は、`npm run lint` でリンティングできます。

## データの永続化

- すべての家計簿データはブラウザの `localStorage` (`mybudget.entries.v1`) に保存されます。
- データ構造は `BudgetEntry[]` です。ローカルで JSON を編集することで事前データを投入することも可能です。

## カスタマイズのヒント

- **カテゴリの初期値**: `app/page.tsx` 内の `DEFAULT_CATEGORIES` を編集します。
- **スタイル**: 全体テーマは `app/globals.css` に集約されているため、ダークモードや配色調整もここで行います。
- **追加機能**: 新しい集計やグラフを追加したい場合は、`components` 配下に新しいコンポーネントを作成し、`app/page.tsx` で組み込むと管理しやすくなります。

