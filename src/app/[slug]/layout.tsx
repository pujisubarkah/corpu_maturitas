import React from 'react'
import Sidebar from '@/src/components/Sidebar'

export const metadata = {
  title: 'User Area',
}

export default function SlugLayout({ children, params }: { children: React.ReactNode; params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar is fixed on md+; give main content left padding on md+ to avoid overlap */}
      <Sidebar />

      <div className="max-w-6xl mx-auto p-4 md:pl-[260px]">
        {/* Page content */}
        <main className="">
          {children}
        </main>
      </div>
    </div>
  )
}
