'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'

export default function Dashboard() {
  const { users, calculateTotalBalance, addUser } = useApp()
  const [newUserName, setNewUserName] = useState('')
  const [newUserBalance, setNewUserBalance] = useState('')

  const handleAddUser = async () => {
    if (!newUserName.trim() || parseInt(newUserBalance) < 0) return
    await addUser({
      name: newUserName.trim(),
      balance: parseInt(newUserBalance) || 0,
      savingsGoal: 0,
      role: 'child',
    })
    setNewUserName('')
    setNewUserBalance('')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">ダッシュボード</h1>
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-semibold">総所持金: ¥{calculateTotalBalance().toLocaleString()}</h2>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">新しいアカウント追加</h3>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="ユーザー名"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="初期残高"
            value={newUserBalance}
            onChange={(e) => setNewUserBalance(e.target.value)}
            className="border p-2 rounded w-24"
            min="0"
          />
          <button
            onClick={handleAddUser}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            追加
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(user => (
          <div key={user.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-gray-600">残高: ¥{user.balance.toLocaleString()}</p>
            <p className="text-gray-600">貯金目標: ¥{user.savingsGoal.toLocaleString()}</p>
            <Link href={`/user/${user.id}`} className="text-blue-500 hover:underline block mt-2">
              個人画面へ
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Link href="/allocation" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          割り振り管理
        </Link>
      </div>
    </div>
  )
}