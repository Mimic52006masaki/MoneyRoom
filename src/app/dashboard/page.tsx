'use client'

import Link from 'next/link'
import { useApp } from '@/contexts/AppContext'

export default function Dashboard() {
  const { users, calculateTotalBalance } = useApp()

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">ダッシュボード</h1>
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-semibold">総所持金: ¥{calculateTotalBalance().toLocaleString()}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(user => (
          <div key={user.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-gray-600">残高: ¥{user.balance.toLocaleString()}</p>
            <p className="text-gray-600">貯金目標: ¥{user.savingsGoal.toLocaleString()}</p>
            <Link href={`/user/${user.id}`} className="text-blue-500 hover:underline">
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