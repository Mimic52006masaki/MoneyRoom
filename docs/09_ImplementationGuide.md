# 実装ガイド（Implementation Guide）

---

## 1. 実装方針

- 採用アーキテクチャ：React + Firestore（MVVMに近い設計）
- 状態管理の方針：React Context or Zustand（※仮定）
- データ永続化の方針：Firestoreをリアルタイムで更新
- 画面遷移の管理方法：React Router

---

## 2. 実装順序（推奨）

1. データモデル実装（Firestore構造作成）
2. データ永続化層（Repository）
3. ビジネスロジック層（割り振り計算、残高計算）
4. ViewModel（個人画面・ダッシュボード）
5. View（UI）
6. 画面遷移の接続
7. エラーハンドリング・調整

---

## 3. 画面別 実装ガイド

### 3.1 ダッシュボード

#### 実装対象
- View：`src/app/dashboard/page.tsx`
- ViewModel：`useApp` Context

#### 主な処理
- `useApp` から users を取得
- `calculateTotalBalance()` で総所持金計算
- 各ユーザーカードに個人画面への Link

#### 注意点
- Tailwind CSS でレスポンシブグリッドレイアウト
- Firestore のリアルタイム更新で自動反映

---

### 3.2 個人画面

#### 実装対象
- View：`src/app/user/[id]/page.tsx`
- ViewModel：`useApp` Context

#### 主な処理
- `useParams` でユーザー ID 取得
- `addTransaction` で取引追加
- `updateUser` で貯金目標更新
- `deleteTransaction` で取引削除

#### 注意点
- 取引追加時に残高自動更新
- 貯金目標は個人画面に統合

---

### 3.3 割り振り管理画面

#### 実装対象
- View：`src/app/allocation/page.tsx`
- ViewModel：`useApp` Context

#### 主な処理
- `allocateMoney` で割り振り実行
- 残高チェックとエラーハンドリング

#### 注意点
- 割り振り時に送り元/送り先の残高更新

---

### 3.4 データ永続化層

#### Repository パターン
- `repositories/UserRepository.ts`
- `repositories/TransactionRepository.ts`
- `repositories/AllocationRepository.ts`

#### 主な機能
- Firestore CRUD 操作
- リアルタイムリスナー (`subscribeToAll`, `subscribeToUser`)

---

### 3.5 状態管理

#### AppContext
- `contexts/AppContext.tsx`
- 全画面で `useApp` フック使用

#### 主な処理
- 取引追加時の残高更新
- 割り振り実行
- ビジネスロジック統合

---

## 4. データ更新フロー

- 個人画面 → Transactions Repository → Users Repositoryで残高更新
- 割り振り画面 → Allocations Repository → Users Repositoryで残高更新

---

## 5. エラーハンドリング方針

- 入力エラー：
  - 金額が負数、未入力の場合はアラート表示
- データ不整合：
  - 残高がマイナスになる場合は割り振り・入力を拒否
- 想定外ケース：
  - Firestoreエラー時にリトライ

---

## 6. MVPでは省略する実装

- ユーザー認証
- 外部サービス連携
- アニメーション・バッジ演出

---

## 7. 実装完了の判定基準

- ダッシュボード・個人画面・割り振り画面が動作する
- 所持金の自動計算が正確
- 支出・入金の追加・削除・編集が可能
- 貯金目標設定・達成度表示が正確
