'use client'

import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { Mail, ChevronDown, LogOut, Key } from 'lucide-react'

function initials(name?: string) {
  if (!name) return 'U'
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function Header() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug ?? ''
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [userName, setUserName] = useState<string | null>(null)
  const [unitKerja, setUnitKerja] = useState<string>('MAKARTI Dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const unreadCount = 0

  useEffect(() => {
    try {
      const raw = localStorage.getItem('currentUser')
      if (raw) {
        const u = JSON.parse(raw)
        setUserName(u?.fullName ?? u?.full_name ?? u?.username ?? null)
        setUnitKerja(u?.unit_kerja ?? 'MAKARTI Dashboard')
      }
    } catch {
      // ignore
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    router.push('/login')
  }

  const handleChangePassword = () => {
    router.push(`/${slug}/ganti_password`)
  }

  return (
    <header className="w-full h-16 bg-white border-b shadow-sm px-6 flex items-center justify-between fixed top-0 z-20">
      {/* Kiri: Logo dan Judul */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-linear-to-br from-blue-100 to-indigo-100 shadow-sm">
          <Image
            src="/logo-lan.png"
            alt="Logo"
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-800">{unitKerja}</h1>
          <p className="text-xs text-gray-500">{slug ? `Pengguna: ${slug}` : 'Overview'}</p>
        </div>
      </div>

      {/* Kanan: Notification, dan Profil */}
      <div className="flex items-center gap-4">
        {/* Notifikasi */}
        <button className="relative p-2 hover:bg-gray-100 rounded-full transition-all">
          <Mail className={`w-5 h-5 ${unreadCount > 0 ? 'text-blue-600' : 'text-gray-600'}`} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Profil Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded-lg transition-all"
          >
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center font-semibold text-blue-700">
              {initials(userName ?? undefined)}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs text-gray-500">Masuk sebagai</div>
              <div className="text-sm font-medium text-gray-900">{userName ?? 'Guest'}</div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-50 py-2 animate-fadeIn">
              <button
                onClick={handleChangePassword}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Key className="w-4 h-4" /> Ganti Password
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
