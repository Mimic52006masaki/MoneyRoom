# データ設計（簡易）

## コレクション一覧（Firebase Firestore）

### Users
- id: string (Firestore ドキュメント ID)
- name: string (ユーザー名)
- balance: number (所持金残高)
- savingsGoal: number (貯金目標金額)
- role: 'child' | 'manager' (ロール、MVP では使用せず)
- createdAt: Date (作成日時)

### Transactions
- id: string (Firestore ドキュメント ID)
- userId: string (ユーザー ID)
- type: 'income' | 'expense' (入金/支出)
- amount: number (金額)
- item: string (項目名)
- category: string (カテゴリー)
- createdAt: Date (作成日時)

### Allocations
- id: string (Firestore ドキュメント ID)
- fromUserId: string (送り元ユーザー ID)
- toUserId: string (送り先ユーザー ID)
- amount: number (割り振り金額)
- createdAt: Date (作成日時)

## リレーション
- Users 1 --- * Transactions (1人のユーザーが複数の取引を持つ)
- Users 1 --- * Allocations (fromUserId / toUserId として割り振りに関与)

## 型定義 (TypeScript)

```typescript
interface User {
  id: string
  name: string
  balance: number
  savingsGoal: number
  role: 'child' | 'manager'
  createdAt?: Date
}

interface Transaction {
  id: string
  userId: string
  type: 'income' | 'expense'
  amount: number
  item: string
  category: string
  createdAt?: Date
}

interface Allocation {
  id: string
  fromUserId: string
  toUserId: string
  amount: number
  createdAt?: Date
}
```

## ビジネスロジック
- **残高計算**: Transaction の追加/削除時に自動更新
- **割り振り**: Allocation 作成時に送り元/送り先の残高を更新
- **リアルタイム同期**: Firestore の onSnapshot を使用
