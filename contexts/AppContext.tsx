'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Transaction, Allocation } from '@/types'
import { UserRepository } from '@/repositories/UserRepository'
import { TransactionRepository } from '@/repositories/TransactionRepository'
import { AllocationRepository } from '@/repositories/AllocationRepository'

interface AppContextType {
  users: User[]
  transactions: Transaction[]
  allocations: Allocation[]
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  addAllocation: (allocation: Omit<Allocation, 'id'>) => Promise<void>
  updateUser: (id: string, updates: Partial<User>) => Promise<void>
  // ビジネスロジック
  calculateTotalBalance: () => number
  allocateMoney: (fromUserId: string, toUserId: string, amount: number) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [allocations, setAllocations] = useState<Allocation[]>([])

  const userRepo = new UserRepository()
  const transactionRepo = new TransactionRepository()
  const allocationRepo = new AllocationRepository()

  useEffect(() => {
    const unsubscribeUsers = userRepo.subscribeToAll(setUsers)
    const unsubscribeTransactions = transactionRepo.subscribeToAll(setTransactions)
    const unsubscribeAllocations = allocationRepo.subscribeToAll(setAllocations)

    return () => {
      unsubscribeUsers()
      unsubscribeTransactions()
      unsubscribeAllocations()
    }
  }, [])

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    await transactionRepo.create(transaction)
    // 残高更新
    const user = users.find(u => u.id === transaction.userId)
    if (user) {
      const balanceChange = transaction.type === 'income' ? transaction.amount : -transaction.amount
      await userRepo.update(user.id, { balance: user.balance + balanceChange })
    }
  }

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    const oldTransaction = transactions.find(t => t.id === id)
    await transactionRepo.update(id, updates)
    if (oldTransaction && updates.amount !== undefined) {
      const user = users.find(u => u.id === oldTransaction.userId)
      if (user) {
        const oldChange = oldTransaction.type === 'income' ? oldTransaction.amount : -oldTransaction.amount
        const newChange = oldTransaction.type === 'income' ? updates.amount : -updates.amount
        await userRepo.update(user.id, { balance: user.balance - oldChange + newChange })
      }
    }
  }

  const deleteTransaction = async (id: string) => {
    const transaction = transactions.find(t => t.id === id)
    if (transaction) {
      await transactionRepo.delete(id)
      const user = users.find(u => u.id === transaction.userId)
      if (user) {
        const balanceChange = transaction.type === 'income' ? -transaction.amount : transaction.amount
        await userRepo.update(user.id, { balance: user.balance + balanceChange })
      }
    }
  }

  const addAllocation = async (allocation: Omit<Allocation, 'id'>) => {
    await allocationRepo.create(allocation)
    // 残高更新
    const fromUser = users.find(u => u.id === allocation.fromUserId)
    const toUser = users.find(u => u.id === allocation.toUserId)
    if (fromUser && toUser) {
      await userRepo.update(fromUser.id, { balance: fromUser.balance - allocation.amount })
      await userRepo.update(toUser.id, { balance: toUser.balance + allocation.amount })
    }
  }

  const updateUser = async (id: string, updates: Partial<User>) => {
    await userRepo.update(id, updates)
  }

  const calculateTotalBalance = () => {
    return users.reduce((total, user) => total + user.balance, 0)
  }

  const allocateMoney = async (fromUserId: string, toUserId: string, amount: number) => {
    const fromUser = users.find(u => u.id === fromUserId)
    if (fromUser && fromUser.balance >= amount) {
      await addAllocation({ fromUserId, toUserId, amount })
    } else {
      throw new Error('残高不足')
    }
  }

  return (
    <AppContext.Provider value={{
      users,
      transactions,
      allocations,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addAllocation,
      updateUser,
      calculateTotalBalance,
      allocateMoney,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}