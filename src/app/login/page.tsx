"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { User, UserPlus, LogIn, EyeIcon, EyeOffIcon, KeyRound } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/src/components/ui/navigation-menu';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'user' && password === 'password') {
      setMessage('Login successful!');
    } else {
      setMessage('Invalid credentials.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-100 to-indigo-200">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center">
        <Image src="/logo-lan.png" alt="Logo LAN" width={64} height={64} className="mb-6" />
        <h1 className="text-2xl font-extrabold text-blue-900 mb-2 text-center drop-shadow">Login Pengguna</h1>
        <p className="text-sm text-gray-500 mb-6 text-center">Masukkan username dan password untuk masuk ke aplikasi survei maturitas.</p>
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <User className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="border rounded pl-10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-gray-50"
              required
            />
          </div>
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
          <Button
            type="submit"
            className="w-full text-base font-semibold py-2 rounded-lg shadow-sm bg-blue-600 hover:bg-blue-700 text-white"
          >
            <LogIn className="mr-2" />Masuk
          </Button>
          {message && (
            <div className="text-center text-sm mt-2 text-gray-600">{message}</div>
          )}
        </form>
      </div>
    </main>
  );
}