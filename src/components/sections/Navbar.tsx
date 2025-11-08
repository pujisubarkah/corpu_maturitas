"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { Menu, X } from 'lucide-react';export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Panduan', href: '/panduan' },
    { label: 'Maturitas', href: '/maturitas' },
    { label: 'Tentang', href: '/tentang' },
  ];

  const mobileNavItems = [...navItems, { label: 'Resources', href: '/resources' }];

  return (
    <nav className="w-full bg-white shadow-sm px-4 sm:px-6 py-3 sticky top-0 z-50 border-b border-gray-100 font-poppins">
      <div className="container mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 sm:gap-4 group">
          <Image
            src="/logo-lan.png"
            alt="Logo LAN"
            width={120}
            height={120}
            className="h-16 w-16 sm:h-20 sm:w-20 object-contain transition-transform group-hover:scale-110"
            priority
          />
          <div className="hidden sm:block">
            <div className="text-xl sm:text-2xl font-extrabold text-blue-900 tracking-tight leading-tight font-poppins drop-shadow-md">
              Survey Maturitas
            </div>
            <div className="text-sm sm:text-base font-bold text-gray-800 font-poppins drop-shadow-sm mt-1">
              Corpu Instansi
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center flex-1 gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-lg font-bold text-gray-800 hover:text-blue-800 hover:bg-blue-50 px-5 py-3 rounded-xl transition-colors duration-200 drop-shadow-sm tracking-wide"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center">
            <Link
              href="/login"
              className="text-lg font-bold text-gray-800 hover:text-blue-800 hover:bg-blue-50 px-5 py-3 rounded-xl transition-colors duration-200 drop-shadow-sm tracking-wide"
            >
              Masuk
            </Link>
          </div>

          {/* Modal Login */}
          {/* Modal dihapus, tombol Masuk sekarang link ke /login */}

          {/* Mobile Menu Toggle */}
          <button
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[400px] py-4 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-1">
            {mobileNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="px-6 py-4 text-xl font-bold text-gray-800 rounded-xl hover:bg-blue-50 transition-colors drop-shadow-sm tracking-wide"
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-3 mt-3 border-t border-gray-100 flex flex-col gap-2">
              <Button variant="ghost" className="justify-start px-4" asChild>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  Masuk
                </Link>
              </Button>
              <Button className="w-full" asChild>
                <Link href="/daftar" onClick={() => setIsOpen(false)}>
                  Daftar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}