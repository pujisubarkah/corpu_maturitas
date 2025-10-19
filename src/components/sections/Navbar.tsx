"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/src/components/ui/navigation-menu';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold">CU</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-gray-900">Survey Maturitas</div>
              <div className="text-xs text-gray-500">Corpu Instansi</div>
            </div>
          </Link>
        </div>

        {/* Center: Links */}
        <div className="hidden lg:flex lg:items-center lg:justify-center lg:gap-6 flex-1">
          <Link href="/" className="text-gray-700 hover:text-blue-600 hover:underline decoration-blue-300 decoration-2 underline-offset-4">Beranda</Link>
          <Link href="/input-survey" className="text-gray-700 hover:text-blue-600 hover:underline decoration-blue-300 decoration-2 underline-offset-4">Survey</Link>
          <Link href="/profile" className="text-gray-700 hover:text-blue-600 hover:underline decoration-blue-300 decoration-2 underline-offset-4">Profile</Link>
          <Link href="/tentang" className="text-gray-700 hover:text-blue-600 hover:underline decoration-blue-300 decoration-2 underline-offset-4">Tentang</Link>
          <Link href="/berita" className="text-gray-700 hover:text-blue-600 hover:underline decoration-blue-300 decoration-2 underline-offset-4">Resources</Link>
          <Link href="/kontak" className="text-gray-700 hover:text-blue-600 hover:underline decoration-blue-300 decoration-2 underline-offset-4">Kontak</Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Daftar</Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-200 ease-in-out overflow-hidden ${isOpen ? 'max-h-[800px] py-3' : 'max-h-0'}`}
      >
        <div className="container mx-auto px-2">
          <div className="flex flex-col gap-2">
            {['Beranda','Survey','Profile','Tentang','Resources','Kontak'].map((label) => {
              const href = label === 'Beranda' ? '/' : `/${label.toLowerCase()}`
              return (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {label}
                </Link>
              )
            })}

            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login" onClick={() => setIsOpen(false)}>Masuk</Link>
              </Button>
              <Button asChild>
                <Link href="/daftar" onClick={() => setIsOpen(false)}>Daftar</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
