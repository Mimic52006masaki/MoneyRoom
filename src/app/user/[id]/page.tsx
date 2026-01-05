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
      <div className="mb-6">
        <Link href="/dashboard" className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 shadow-sm inline-flex items-center gap-1">
          
          お小遣い管理に戻る
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        
        {user.name}のお小遣い帳
      </h1>

      {/* お小遣い情報 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">今のお小遣い</div>
            <div className="text-3xl font-bold">{user.balance.toLocaleString()} <span className="text-sm text-gray-500">円</span></div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">貯めたい金額</div>
            <div className="text-3xl font-bold">{user.savingsGoal.toLocaleString()} <span className="text-sm text-gray-500">円</span></div>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="お小遣いを変える"
              className="flex-1 rounded-md border-gray-300 bg-white p-2 focus:border-primary focus:ring-primary"
            />
            <button onClick={handleUpdateBalance} className="bg-emerald-500 text-white font-medium px-6 py-2 rounded-md shadow-sm hover:bg-emerald-600">
              変える
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="number"
              value={savingsGoal}
              onChange={(e) => setSavingsGoal(e.target.value)}
              placeholder="貯めたい金額を変える"
              className="flex-1 rounded-md border-gray-300 bg-white p-2 focus:border-primary focus:ring-primary"
            />
            <button onClick={handleUpdateSavingsGoal} className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 rounded-md shadow-sm">
              変える
            </button>
          </div>
        </div>
      </div>

      {/* お小遣いの出し入れ */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          
          お小遣いの出し入れ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-2">
            <select value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')} className="w-full rounded-md border-gray-300 bg-white p-2 focus:border-primary focus:ring-primary">
              <option value="expense">買った</option>
              <option value="income">もらった</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="いくら"
              className="w-full rounded-md border-gray-300 bg-white p-2 focus:border-primary focus:ring-primary"
            />
          </div>
          <div className="md:col-span-5">
            <input
              type="text"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="なにに"
              className="w-full rounded-md border-gray-300 bg-white p-2 focus:border-primary focus:ring-primary"
            />
          </div>
          <div className="md:col-span-2">
            <button onClick={handleAddTransaction} className="w-full bg-emerald-500 text-white font-medium py-2 rounded-md shadow-sm hover:bg-emerald-600">
              書く
            </button>
          </div>
        </div>
      </div>

      {/* お小遣いの記録 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          
          お小遣いの記録
        </h2>
        <ul className="space-y-2">
          {userTransactions.map(transaction => (
            <li key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-100">
              <div className="flex items-center gap-3">
                <span className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'income' ? '+' : '-'}¥{transaction.amount}
                </span>
                <span className="text-gray-900">{transaction.item}</span>
                <span className="text-sm text-gray-500">{transaction.createdAt?.toLocaleDateString()}</span>
              </div>
              <button onClick={() => deleteTransaction(transaction.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                削除
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}