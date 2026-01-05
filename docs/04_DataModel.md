# データ設計（簡易）

## コレクション一覧（Firebase想定）

### Users
- id: string
- name: string
- balance: number
- savingsGoal: number
- role: string ※仮定（"child" / "manager"）
- createdAt: timestamp

### Transactions
- id: string
- userId: string
- type: string ("income" / "expense")
- amount: number
- item: string
- category: string
- createdAt: timestamp

### Allocations
- id: string
- fromUserId: string
- toUserId: string
- amount: number
- createdAt: timestamp

## リレーション
- Users 1 --- * Transactions
- Users 1 --- * Allocations (fromUserId / toUserId)
