export interface User {
  id: string
  name: string
  balance: number
  savingsGoal: number
  role: 'child' | 'manager'
  createdAt?: Date
  allowance?: number
}

export interface Transaction {
  id: string
  userId: string
  type: 'income' | 'expense'
  amount: number
  item: string
  createdAt?: Date
}

export interface Allocation {
  id: string
  fromUserId: string
  toUserId: string
  amount: number
  createdAt?: Date
}