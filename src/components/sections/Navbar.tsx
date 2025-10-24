"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { Menu, X, User, Lock, Eye, EyeOff } from 'lucide-react';

// Komponen LoginForm sederhana
function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setMessage('Login berhasil!');
        setTimeout(() => {
          setMessage('');
          onSuccess();
            // store user locally so other pages (dashboard/sidebar) can read it
            try {
              localStorage.setItem('currentUser', JSON.stringify(data.user));
            } catch (e) {
              console.warn('Failed to store user in localStorage', e);
            }
            // Redirect to dynamic route using the user's full name as slug
            const fullName = data.user.fullName ?? data.user.full_name ?? username;
            const slugify = (s: string) =>
              encodeURIComponent(
                s
                  .toString()
                  .toLowerCase()
                  .trim()
                  .replace(/[^a-z0-9\s-]/g, '')
                  .replace(/\s+/g, '-')
                  .replace(/-+/g, '-')
              );
            const slug = slugify(fullName);
            window.location.href = `/${slug}`;
        }, 800);
      } else {
        setMessage(data.error || 'Username atau password salah.');
      }
    } catch (err) {
      setMessage('Terjadi kesalahan server.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <User className="h-4 w-4" />
        </span>
        <input
          type="text"
          aria-label="Username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border rounded pl-10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-gray-50"
          required
        />
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Lock className="h-4 w-4" />
        </span>
        <input
          type={showPassword ? 'text' : 'password'}
          aria-label="Password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded pl-10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-gray-50"
          required
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword((prev) => !prev)}
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </div>
      <Button
        type="submit"
        className="w-full text-base font-semibold py-2 rounded-lg shadow-sm bg-blue-600 hover:bg-blue-700 text-white"
      >
        Masuk
      </Button>
      {message && (
        <div className="text-center text-sm mt-2 text-gray-600">{message}</div>
      )}
    </form>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

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
            <Button
              variant="ghost"
              className="text-lg font-bold text-gray-800 hover:text-blue-800 hover:bg-blue-50 px-5 py-3 rounded-xl transition-colors duration-200 drop-shadow-sm tracking-wide"
              onClick={() => setShowLogin(true)}
            >
              Masuk
            </Button>
          </div>

          {/* Modal Login */}
          {showLogin && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-blue-100/60 via-white/80 to-indigo-200/60 backdrop-blur-md transition-all duration-300">
              <div className="bg-white/90 border border-blue-300 rounded-3xl shadow-2xl p-0 w-full max-w-4xl relative scale-100 animate-[fadeIn_0.3s_ease] overflow-hidden">
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 transition-colors"
                  onClick={() => setShowLogin(false)}
                  aria-label="Tutup"
                  style={{ zIndex: 10 }}
                >
                  <X className="h-7 w-7" />
                </button>
                <div className="flex flex-col md:flex-row items-stretch gap-0">
                  <div className="flex flex-col items-center justify-center bg-linear-to-br from-blue-200/60 via-white/80 to-indigo-200/60 p-10 md:p-12 w-full md:w-1/2 border-r border-blue-100">
                    <Image
                      src="/logo-lan.png"
                      alt="Logo LAN"
                      width={140}
                      height={140}
                      className="mb-6 h-32 w-32 object-contain drop-shadow-xl"
                    />
                    <Image
                      src="/login.jpg"
                      alt="Login Illustration"
                      width={260}
                      height={200}
                      className="rounded-xl object-cover shadow-lg"
                    />
                  </div>
                  <div className="flex flex-col justify-center items-center flex-1 p-8 md:p-12">
                    <h2 className="text-3xl font-extrabold text-blue-900 mb-4 tracking-tight drop-shadow">Login Pengguna</h2>
                    <div className="text-base text-gray-500 mb-8 text-center max-w-xs">Masukkan username dan password untuk masuk ke aplikasi survei maturitas.</div>
                    <LoginForm onSuccess={() => setShowLogin(false)} />
                  </div>
                </div>
              </div>
            </div>
          )}

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
              <Button
                variant="ghost"
                className="justify-start px-4"
                onClick={() => {
                  setShowLogin(true);
                  setIsOpen(false);
                }}
              >
                Masuk
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