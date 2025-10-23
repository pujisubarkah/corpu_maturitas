"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Survey', href: '/input-survey' },
    { label: 'Profile', href: '/profile' },
    { label: 'Tentang', href: '/tentang' },
    { label: 'Kontak', href: '/kontak' },
  ];

  const mobileNavItems = [...navItems, { label: 'Resources', href: '/resources' }];

  return (
  <nav className="w-full bg-white shadow-sm px-4 sm:px-6 py-3 sticky top-0 z-50 border-b border-gray-100 font-poppins">
      <div className="container mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 sm:gap-4 group">
          <div className="h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center overflow-hidden rounded-md bg-gray-50">
            <img
              src="/logo-lan.png"
              alt="Logo LAN"
              className="w-full h-full object-contain transition-transform group-hover:scale-105"
            />
          </div>
          <div className="hidden sm:block">
            <div className="text-xl sm:text-2xl font-bold text-blue-800 tracking-tight leading-tight font-poppins">
              Survey Maturitas
            </div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5 font-poppins">
              Corpu Instansi
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center flex-1 gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-md transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center">
            <Button variant="ghost" asChild size="sm">
              <Link href="/login">Masuk</Link>
            </Button>
          </div>

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
                className="px-4 py-3 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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