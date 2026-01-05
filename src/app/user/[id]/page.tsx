'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { useApp } from '@/contexts/AppContext'

export default function UserPage() {
  const { id } = useParams()
  const { users, transactions, addTransaction, updateTransaction, deleteTransaction, updateUser } = useApp()
  const user = users.find(u => u.id === id)
  const userTransactions = transactions.filter(t => t.userId === id)

  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [item, setItem] = useState('')
  const [savingsGoal, setSavingsGoal] = useState('')
  const [balance, setBalance] = useState('')

  if (!user) return <div>お友だちが見つかりません</div>

  const handleAddTransaction = async () => {
    if (!amount || !item) return
    await addTransaction({
      userId: user.id,
      type,
      amount: parseInt(amount),
      item
    })
    setAmount('')
    setItem('')
  }

  const handleUpdateSavingsGoal = async () => {
    if (!savingsGoal) return
    await updateUser(user.id, { savingsGoal: parseInt(savingsGoal) })
    setSavingsGoal('')
  }

  const handleUpdateBalance = async () => {
    if (balance === '') return
    await updateUser(user.id, { balance: parseInt(balance) })
    setBalance('')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mb-4">
        <Link href="/dashboard" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          ← お小遣い管理に戻る
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">{user.name}のお小遣い帳</h1>
      <div className="bg-white p-4 rounded shadow mb-4">
        <p className="text-xl">今のお小遣い: ¥{user.balance.toLocaleString()}</p>
        <p className="text-lg">貯めたい金額: ¥{user.savingsGoal.toLocaleString()}</p>
        <div className="mt-4 space-y-2">
          <div>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="お小遣いを変える"
              className="border p-2 mr-2"
            />
            <button onClick={handleUpdateBalance} className="bg-blue-500 text-white px-4 py-2 rounded">
              変える
            </button>
          </div>
          <div>
            <input
              type="number"
              value={savingsGoal}
              onChange={(e) => setSavingsGoal(e.target.value)}
              placeholder="貯めたい金額を変える"
              className="border p-2 mr-2"
            />
            <button onClick={handleUpdateSavingsGoal} className="bg-green-500 text-white px-4 py-2 rounded">
              変える
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-semibold mb-2">お小遣いの出し入れ</h2>
        <select value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')} className="border p-2 mr-2">
          <option value="expense">買った</option>
          <option value="income">もらった</option>
        </select>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="いくら"
          className="border p-2 mr-2"
        />
        <input
          type="text"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          placeholder="なにに"
          className="border p-2 mr-2"
        />

        <button onClick={handleAddTransaction} className="bg-blue-500 text-white px-4 py-2 rounded">
          書く
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">お小遣いの記録</h2>
        <ul>
          {userTransactions.map(transaction => (
            <li key={transaction.id} className="border-b py-2 flex justify-between">
              <div>
                <span className={transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}>
                  {transaction.type === 'income' ? '+' : '-'}¥{transaction.amount}
                </span>
                <span className="ml-2">{transaction.item}</span>
                <span className="ml-2 text-gray-500">{transaction.createdAt?.toLocaleDateString()}</span>
              </div>
              <button onClick={() => deleteTransaction(transaction.id)} className="text-red-500">
                削除
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}