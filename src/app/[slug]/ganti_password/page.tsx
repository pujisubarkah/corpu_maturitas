"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Eye, EyeOff, Key, CheckCircle, AlertCircle } from 'lucide-react';

export default function ChangePasswordPage() {
  const router = useParams();
  const slug = router?.slug as string;
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear message when user starts typing
    if (message) setMessage('');
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    if (!formData.currentPassword.trim()) {
      setMessage('Password saat ini harus diisi');
      setMessageType('error');
      return false;
    }

    if (!formData.newPassword.trim()) {
      setMessage('Password baru harus diisi');
      setMessageType('error');
      return false;
    }

    if (formData.newPassword.length < 6) {
      setMessage('Password baru minimal 6 karakter');
      setMessageType('error');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('Password baru dan konfirmasi password tidak cocok');
      setMessageType('error');
      return false;
    }

    if (formData.currentPassword === formData.newPassword) {
      setMessage('Password baru tidak boleh sama dengan password saat ini');
      setMessageType('error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Get current user from localStorage
      const currentUserData = localStorage.getItem('currentUser');
      if (!currentUserData) {
        setMessage('Sesi login telah berakhir. Silakan login kembali.');
        setMessageType('error');
        setIsLoading(false);
        return;
      }

      const currentUser = JSON.parse(currentUserData);

      // Verify current password by attempting login
      const verifyResponse = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          password: formData.currentPassword
        })
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        setMessage(errorData.error || 'Password saat ini salah');
        setMessageType('error');
        setIsLoading(false);
        return;
      }

      // TODO: Implement actual password change API
      // For now, simulate success
      setTimeout(() => {
        setIsSuccess(true);
        setMessage('Password berhasil diubah! Anda akan diarahkan ke dashboard dalam 3 detik...');
        setMessageType('success');
        setIsLoading(false);

        // Redirect to dashboard after success
        setTimeout(() => {
          window.location.href = `/${slug}/Dashboard`;
        }, 3000);
      }, 1500);

    } catch (error) {
      console.error('Change password error:', error);
      setMessage('Terjadi kesalahan saat mengubah password. Silakan coba lagi.');
      setMessageType('error');
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Berhasil Diubah!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="animate-pulse text-sm text-gray-500">
              Mengarahkan ke dashboard...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ganti Password</h1>
        <p className="text-gray-600">
          Ubah password akun Anda untuk keamanan yang lebih baik
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Key className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Form Ganti Password</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Pastikan password baru Anda kuat dan unik
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Password Saat Ini <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Masukkan password saat ini"
                  className="pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Password Baru <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Minimal 6 karakter"
                  className="pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Password harus minimal 6 karakter dan berbeda dari password saat ini
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Konfirmasi Password Baru <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Ulangi password baru"
                  className="pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-lg flex items-center gap-3 ${
                messageType === 'error'
                  ? 'bg-red-50 border border-red-200 text-red-700'
                  : 'bg-green-50 border border-green-200 text-green-700'
              }`}>
                {messageType === 'error' ? (
                  <AlertCircle className="w-5 h-5 shrink-0" />
                ) : (
                  <CheckCircle className="w-5 h-5 shrink-0" />
                )}
                <p className="text-sm">{message}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
                disabled={isLoading}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Menyimpan...' : 'Ganti Password'}
              </Button>
            </div>
          </form>

          {/* Security Tips */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Tips Keamanan Password:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Gunakan kombinasi huruf besar, kecil, angka, dan simbol</li>
              <li>• Minimal 8 karakter untuk keamanan optimal</li>
              <li>• Jangan gunakan informasi pribadi yang mudah ditebak</li>
              <li>• Ganti password secara berkala</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}