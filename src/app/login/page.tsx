"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import Navbar from '../../components/sections/Navbar';
import Footer from '../../components/sections/Footer';
import { Button } from '@/src/components/ui/button';
import { User, Lock, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (res.ok && data.user) {
        setMessageType('success');
        setMessage('Login berhasil! Mengalihkan ke dashboard...');

        // Store user data
        try {
          localStorage.setItem('currentUser', JSON.stringify(data.user));
        } catch (e) {
          console.warn('Failed to store user in localStorage', e);
        }

        // Redirect after success animation
        setTimeout(() => {
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
        }, 2000);
      } else {
        setMessageType('error');
        setMessage(data.error || 'Username atau password salah.');
      }
    } catch {
      setMessageType('error');
      setMessage('Terjadi kesalahan server. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
        <div className="w-full max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Selamat Datang Kembali
            </h1>
            <p className="text-lg text-gray-600">
              Masuk ke akun Anda untuk melanjutkan survei maturitas
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Left Side - Illustration */}
              <div className="bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 p-12 flex flex-col justify-center items-center text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 w-20 h-20 border border-white rounded-full"></div>
                  <div className="absolute top-32 right-16 w-12 h-12 bg-white rounded-lg rotate-45"></div>
                  <div className="absolute bottom-20 left-20 w-16 h-16 border-2 border-white rounded-full"></div>
                  <div className="absolute bottom-32 right-10 w-8 h-8 bg-white rounded-full"></div>
                </div>

                <div className="relative z-10 text-center">
                  <div className="mb-8">
                    <Image
                      src="/logo-lan.png"
                      alt="Logo LAN"
                      width={120}
                      height={120}
                      className="mx-auto mb-6 drop-shadow-lg"
                    />
                  </div>

                  <h2 className="text-2xl font-bold mb-4">Survey Maturitas</h2>
                  <p className="text-blue-100 mb-8 leading-relaxed">
                    Platform terdepan untuk mengukur dan meningkatkan
                    kematangan Corporate University di Indonesia
                  </p>
                </div>
              </div>

              {/* Right Side - Login Form */}
              <div className="p-12 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Masuk ke Akun</h3>
                  <p className="text-gray-600 mb-8">
                    Masukkan kredensial Anda untuk melanjutkan
                  </p>

                  {/* Message Display */}
                  {message && (
                    <div className={`mb-6 p-4 rounded-lg border flex items-center gap-3 transition-all duration-300 ${
                      messageType === 'success'
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                      {messageType === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 shrink-0" />
                      )}
                      <span className="text-sm font-medium">{message}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username Field */}
                    <div className="space-y-2">
                      <label htmlFor="username" className="text-sm font-medium text-gray-700">
                        Username
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
                          placeholder="Masukkan username Anda"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
                          placeholder="Masukkan password Anda"
                          required
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 text-lg font-semibold bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Masuk...</span>
                        </div>
                      ) : (
                        'Masuk ke Akun'
                      )}
                    </Button>
                  </form>

                  {/* Additional Links */}
                  <div className="mt-8 text-center space-y-2">
                    <p className="text-sm text-gray-600">
                      Belum memiliki akun? Hubungi admin untuk mendapatkan akses.
                    </p>
                    <p className="text-sm text-gray-600">
                      Lupa password? Hubungi admin untuk reset password.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}