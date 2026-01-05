'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'

export default function Dashboard() {
  const { users, addUser, addTransaction, updateUser, deleteUser } = useApp()
  const [newUserName, setNewUserName] = useState('')
  const [newUserBalance, setNewUserBalance] = useState('')
  const [totalAllowance, setTotalAllowance] = useState('')

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

  const handleDistributeAllowance = async () => {
    const total = parseInt(totalAllowance) || 0
    const sumAllocations = users.reduce((sum, user) => sum + (user.allowance ?? 0), 0)
    if (sumAllocations > total) {
      alert('割り振り合計が総小遣い金額を超えています')
      return
    }

    for (const user of users) {
      const amount = user.allowance ?? 0
      if (amount > 0) {
        await addTransaction({
          userId: user.id,
          type: 'income',
          amount,
          item: '小遣い配分'
        })
      }
    }
    setTotalAllowance('')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">お小遣い管理</h1>

      {/* 新規ユーザー追加 */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">新しい友だちを追加</h2>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="名前"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <input
            type="number"
            placeholder="初めのお小遣い"
            value={newUserBalance}
            onChange={(e) => setNewUserBalance(e.target.value)}
            className="border p-2 rounded w-32"
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

      {/* 総小遣い配分 */}
      <div className="mb-6 bg-yellow-100 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">みんなのお小遣いを分ける</h2>

        {/* 総小遣い入力とボタンを同じ行 */}
        <div className="flex flex-col md:flex-row items-center gap-2 mb-4">
          <input
            type="number"
            placeholder="全部でいくら？"
            value={totalAllowance}
            onChange={(e) => setTotalAllowance(e.target.value)}
            className="border p-2 rounded w-48"
            min="0"
          />
          <button
            onClick={handleDistributeAllowance}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            分ける
          </button>
        </div>

        {/* 各ユーザー割り振り */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-2">
              <span className="w-32">{user.name}</span>
              <input
                type="number"
                placeholder="いくら分ける？"
                value={user.allowance ?? 0}
                onChange={async (e) => {
                  const value = parseInt(e.target.value) || 0
                  await updateUser(user.id, { allowance: value })
                }}
                className="border p-2 rounded w-24"
                min="0"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ユーザーカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(user => (
          <div key={user.id} className="bg-white p-4 rounded shadow relative">
            <label className="block font-semibold mb-1">名前</label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => updateUser(user.id, { name: e.target.value })}
              className="border-b w-full mb-2 text-lg"
            />

            <label className="block font-semibold mb-1">今のお小遣い</label>
            <input
              type="number"
              value={user.balance}
              onChange={(e) => updateUser(user.id, { balance: parseInt(e.target.value) || 0 })}
              className="border-b w-full mb-2 text-gray-600"
            />

            <label className="block font-semibold mb-1">貯めたい金額</label>
            <input
              type="number"
              value={user.savingsGoal}
              onChange={(e) => updateUser(user.id, { savingsGoal: parseInt(e.target.value) || 0 })}
              className="border-b w-full mb-2 text-gray-600"
            />

            <button
              onClick={() => deleteUser(user.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              削除
            </button>
            <Link href={`/user/${user.id}`} className="text-blue-500 hover:underline block mt-2">
              もっと詳しく見る
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}