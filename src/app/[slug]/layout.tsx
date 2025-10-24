import React from 'react'
import Sidebar from '@/src/components/Sidebar'

export const metadata = {
  title: 'User Area',
}

export default function SlugLayout({ children, params }: { children: React.ReactNode; params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-[260px,1fr] gap-6">
        {/* Persistent sidebar for all /[slug] routes */}
        <Sidebar />

        {/* Page content */}
        <main className="">
          {children}
        </main>
      </div>
    </div>
  )
}
