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
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          
          新しい友だちを追加
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-7">
            <label className="sr-only">名前</label>
            <input
              type="text"
              placeholder="名前"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="w-full rounded-md border-gray-500 bg-white text-gray-900 p-2 focus:border-primary focus:ring-primary"
            />
          </div>
          <div className="md:col-span-3">
            <label className="sr-only">初めのお小遣い</label>
            <input
              type="number"
              placeholder="初めのお小遣い"
              value={newUserBalance}
              onChange={(e) => setNewUserBalance(e.target.value)}
              className="w-full rounded-md border-gray-400 bg-white text-gray-900 p-2 focus:border-primary focus:ring-primary"
              min="0"
            />
          </div>
          <div className="md:col-span-2">
            <button
              onClick={handleAddUser}
              className="w-full bg-emerald-500 text-white font-medium py-2.5 rounded-md shadow-sm hover:bg-emerald-600 flex justify-center items-center gap-1"
            >
              追加
            </button>
          </div>
        </div>
      </div>

      {/* 総小遣い配分 */}
      <div className="mb-6 bg-yellow-50 rounded-lg border border-yellow-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold flex items-center gap-2">
            
            みんなのお小遣いを分ける
          </h2>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="number"
              placeholder="全部でいくら？"
              value={totalAllowance}
              onChange={(e) => setTotalAllowance(e.target.value)}
              className="flex-1 md:w-48 rounded-md border-yellow-200 bg-white p-2 focus:border-yellow-500 focus:ring-yellow-500"
              min="0"
            />
            <button
              onClick={handleDistributeAllowance}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-6 py-2 rounded-md shadow-sm"
            >
              分ける
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {users.map(user => (
            <div key={user.id} className="flex items-center gap-3 bg-white/50 p-3 rounded-md border border-yellow-100">
              <label className="text-sm font-medium min-w-[4rem]">{user.name}</label>
              <input
                type="number"
                value={user.allowance ?? 0}
                onChange={async (e) => {
                  const value = parseInt(e.target.value) || 0
                  await updateUser(user.id, { allowance: value })
                }}
                className="w-full rounded border-gray-300 bg-white text-right p-1 focus:border-yellow-500 focus:ring-yellow-500 text-sm h-9"
                min="0"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ユーザーカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-5 border-b flex justify-between items-start">
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">名前</span>
                <h3 className="text-xl font-bold mt-1">{user.name}</h3>
              </div>
              <button
                onClick={() => deleteUser(user.id)}
                className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
              >
                削除
              </button>
            </div>
            <div className="p-5 space-y-4 flex-1">
              <div>
                <div className="text-xs text-gray-500 mb-1">今のお小遣い</div>
                <div className="text-2xl font-bold">{user.balance} <span className="text-sm text-gray-500">円</span></div>
              </div>
              <div className="w-full bg-gray-200 h-px"></div>
              <div>
                <div className="text-xs text-gray-500 mb-1">貯めたい金額</div>
                <div className="text-2xl font-bold">{user.savingsGoal} <span className="text-sm text-gray-500">円</span></div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 border-t">
              <Link href={`/user/${user.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                もっと詳しく見る
                
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}