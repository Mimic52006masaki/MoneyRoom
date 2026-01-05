# MoneyRoom

## 概要

MoneyRoom は、家庭向けのおこづかい管理アプリです。兄弟間の所持金の管理、入出金の記録、お金割り振り機能を備えています。

## 機能

- **ダッシュボード**: ユーザー管理、総小遣い配分、個人ページへのアクセス
  - 新しい友だちの追加（グリッドレイアウト）
  - 総小遣い配分（カード風UI）
  - ユーザーカード（表示専用、詳細リンク付き）
- **個人画面**: 個人の入出金記録、残高確認・編集、貯金目標設定
  - お小遣い情報カード
  - お小遣いの出し入れ（グリッドフォーム）
  - お小遣いの記録リスト
- **総小遣い配分**: 各ユーザーに小遣いを一括配分する機能
- **リアルタイム更新**: Firestore を使用したリアルタイム同期
- **レスポンシブデザイン**: Tailwind CSS v4 を使用したモバイル対応、Noto Sans JPフォント統一

## 技術スタック

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Firebase Firestore
- **Deployment**: Vercel

## セットアップ

1. リポジトリをクローン:
   ```bash
   git clone https://github.com/Mimic52006masaki/MoneyRoom.git
   cd MoneyRoom
   ```

2. 依存関係をインストール:
   ```bash
   npm install
   ```

3. Firebase 設定:
   - Firebase プロジェクトを作成
   - Firestore を有効化
   - 認証を設定（必要に応じて）
   - `lib/firebase.ts` に Firebase 設定を入力

4. 開発サーバーを起動:
   ```bash
   npm run dev
   ```

5. ブラウザで `http://localhost:3000` にアクセス

## プロジェクト構造

```
MoneyRoom/
├── src/
│   ├── app/
│   │   ├── dashboard/     # ダッシュボードページ
│   │   ├── user/[id]/     # 個人画面
│   │   ├── layout.tsx     # ルートレイアウト
│   │   ├── page.tsx       # ホームページ（ダッシュボードへリダイレクト）
│   │   └── global.css     # グローバルスタイル
│   ├── contexts/
│   │   └── AppContext.tsx # 状態管理
│   ├── repositories/       # データアクセス層
│   │   ├── UserRepository.ts
│   │   ├── TransactionRepository.ts
│   │   └── AllocationRepository.ts
│   ├── types/             # 型定義
│   └── lib/               # ユーティリティ
├── docs/                  # ドキュメント
├── .cursorrules           # コーディングルール
├── todo.md                # TODOリスト
└── README.md
```

## 使用方法

1. **ダッシュボード**: ユーザー管理、総小遣い配分、各メンバーの情報確認
2. **個人画面**: 入出金の追加・編集、履歴確認、貯金目標設定、残高直接編集

## デプロイ

GitHub リポジトリに push すると、Vercel で自動デプロイされます。

## 開発ルール

- `.cursorrules` に従ってコーディング
- 変更後は必ず git add / commit / push
- ドキュメント（docs/）を定期的に確認・更新

## ライセンス

ISC
