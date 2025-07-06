"use client"
import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { User, UserPlus, LogIn, EyeIcon, EyeOffIcon, KeyRound } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/src/components/ui/navigation-menu';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'user@example.com' && password === 'password') {
      setMessage('Login successful!');
    } else {
      setMessage('Invalid credentials.');
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="w-full bg-white shadow-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo-lan.png" alt="Logo LAN" className="h-15 w-auto" />
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <a href="/">Beranda</a>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <a href="/login">Register</a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-3xl h-[80vh]">
          {/* Left: Picture */}
          <div className="hidden md:flex items-center justify-center bg-white w-1/2 p-0">
            <img src="/login.jpg" alt="Login Illustration" className="h-full w-full object-cover" />
          </div>
          {/* Right: Login Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 p-10 w-full md:w-1/2 justify-center h-full min-w-[320px]"
          >
            <div className="mb-4 text-left">
              <h1 className="text-xl font-bold text-gray-600 leading-tight drop-shadow-sm mb-1">
                Selamat Datang di
              </h1>
              <h1
                className="text-3xl font-extrabold leading-tight mb-2"
                style={{ color: 'var(--corpu-primary)' }}
              >
                Survei Maturitas Corpu 2025
              </h1>
              <p className="text-sm text-gray-500">
                Masuk ke akun anda untuk melanjutkan
              </p>
            </div>
            {/* Email Input */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="h-4 w-4" />
              </span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="border rounded pl-10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-gray-50"
                required
              />
            </div>
            {/* Password Input */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <KeyRound className="h-4 w-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
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
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <EyeIcon className="h-4 w-4" aria-hidden="true" />
                )}
                <span className="sr-only">
                  {showPassword ? 'Hide password' : 'Show password'}
                </span>
              </Button>
            </div>
            {/* Login Button */}
            <Button
              type="submit"
              className="w-full text-base font-semibold py-2 rounded-lg shadow-sm"
              style={{ backgroundColor: 'var(--corpu-primary)', color: '#fff' }}
            >
              <LogIn className="mr-2" />Masuk
            </Button>
            {/* Divider */}
            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-xs text-gray-500">atau</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>
            {/* Register Link */}
            <div className="text-center text-sm mt-2 flex items-center justify-center gap-1">
              <span>Belum punya akun?</span>
              <UserPlus className="h-4 w-4 text-gray-500" />
              <a
                href="/register"
                className="hover:underline font-bold"
                style={{ color: 'var(--corpu-primary)' }}
              >
                Daftar disini
              </a>
            </div>
            {/* Message */}
            {message && (
              <div className="text-center text-sm mt-2 text-gray-600">{message}</div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}