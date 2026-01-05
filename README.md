# MoneyRoom

## 概要

MoneyRoom は、家庭向けのおこづかい管理アプリです。兄弟間の所持金の管理、入出金の記録、お金割り振り機能を備えています。

## 機能

- **ダッシュボード**: 兄弟全員の所持金合計と個人ページへのアクセス
- **個人画面**: 個人の入出金記録、残高確認、貯金目標設定
- **割り振り管理**: 兄弟間のお金の割り振り機能
- **リアルタイム更新**: Firestore を使用したリアルタイム同期
- **レスポンシブデザイン**: Tailwind CSS v4 を使用したモバイル対応

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
│   │   ├── allocation/    # 割り振り管理ページ
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

1. **ダッシュボード**: 総所持金と各メンバーの情報を確認
2. **個人画面**: 入出金の追加、履歴確認、貯金目標設定
3. **割り振り**: 兄弟間のお金の移動を実行

## デプロイ

GitHub リポジトリに push すると、Vercel で自動デプロイされます。

## 開発ルール

- `.cursorrules` に従ってコーディング
- 変更後は必ず git add / commit / push
- ドキュメント（docs/）を定期的に確認・更新

## ライセンス

ISC
