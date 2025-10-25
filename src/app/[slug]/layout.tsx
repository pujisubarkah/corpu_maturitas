import React from 'react'
import Sidebar from '@/src/components/Sidebar'
import Header from '@/src/components/Header'

export const metadata = {
  title: 'User Area',
}

export default function SlugLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header di paling atas */}
      <Header />

      {/* Sidebar mulai di bawah header */}
      <Sidebar />

      {/* Konten utama di bawah header & di kanan sidebar */}
      <main className="pt-16 md:pl-[260px] p-4">
        {children}
      </main>
    </div>
  )
}
