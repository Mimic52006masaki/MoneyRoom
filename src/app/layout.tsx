import type { Metadata } from 'next'
import './global.css'
import { AppProvider } from '@/contexts/AppContext'

export const metadata: Metadata = {
  title: 'MoneyRoom',
  description: '家庭用おこづかい管理アプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}