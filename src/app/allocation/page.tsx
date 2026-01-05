'use client'

import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'

export default function AllocationPage() {
  const { users, allocations, allocateMoney } = useApp()
  const [fromUserId, setFromUserId] = useState('')
  const [toUserId, setToUserId] = useState('')
  const [amount, setAmount] = useState('')

  const handleAllocate = async () => {
    if (!fromUserId || !toUserId || !amount) return
    try {
      await allocateMoney(fromUserId, toUserId, parseInt(amount))
      setAmount('')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'エラーが発生しました')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">割り振り管理</h1>
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-semibold mb-2">割り振り実行</h2>
        <select value={fromUserId} onChange={(e) => setFromUserId(e.target.value)} className="border p-2 mr-2">
          <option value="">送り元を選択</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
        <select value={toUserId} onChange={(e) => setToUserId(e.target.value)} className="border p-2 mr-2">
          <option value="">送り先を選択</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="金額"
          className="border p-2 mr-2"
        />
        <button onClick={handleAllocate} className="bg-blue-500 text-white px-4 py-2 rounded">
          割り振り
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">割り振り履歴</h2>
        <ul>
          {allocations.map(allocation => {
            const fromUser = users.find(u => u.id === allocation.fromUserId)
            const toUser = users.find(u => u.id === allocation.toUserId)
            return (
              <li key={allocation.id} className="border-b py-2">
                {fromUser?.name} → {toUser?.name}: ¥{allocation.amount}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}