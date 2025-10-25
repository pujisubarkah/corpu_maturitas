"use client"
import Image from 'next/image';
import Navbar from '../../components/sections/Navbar';
import Footer from '../../components/sections/Footer';
// Import LoginForm dari Navbar
import { LoginForm } from '../../components/sections/Navbar';

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-100 to-indigo-200 py-12 px-4">
        <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-0 flex flex-col md:flex-row items-stretch overflow-hidden">
          <div className="flex flex-col items-center justify-center bg-linear-to-br from-blue-200/60 via-white/80 to-indigo-200/60 p-10 md:p-12 w-full md:w-1/2 border-r border-blue-100">
            <Image src="/logo-lan.png" alt="Logo LAN" width={140} height={140} className="mb-6 h-32 w-32 object-contain drop-shadow-xl" />
            <Image src="/login.jpg" alt="Login Illustration" width={260} height={200} className="rounded-xl object-cover shadow-lg" />
          </div>
          <div className="flex flex-col justify-center items-center flex-1 p-8 md:p-12">
            <h2 className="text-3xl font-extrabold text-blue-900 mb-4 tracking-tight drop-shadow">Login Pengguna</h2>
            <div className="text-base text-gray-500 mb-8 text-center max-w-xs">Masukkan username dan password untuk masuk ke aplikasi survei maturitas.</div>
            {/* Gunakan LoginForm dari Navbar, onSuccess bisa redirect ke halaman utama atau dashboard */}
            <LoginForm onSuccess={() => { window.location.href = '/'; }} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}