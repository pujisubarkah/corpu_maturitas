"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from '@/src/components/Header';

export default function UserDashboard() {
  const params = useParams();
  const slug = params?.slug;

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
        <Header />
        <p className="text-lg text-gray-700 mb-6">
          Selamat datang, <span className="font-semibold text-blue-700">{slug}</span>!
        </p>
        <div className="space-y-4">
          <Link href="/profile" className="block px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">Lihat Profil</Link>
          <Link href="/input-survey" className="block px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">Mulai Survey Maturitas</Link>
          <Link href="/results" className="block px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">Lihat Hasil Survey</Link>
        </div>
      </div>
    </main>
  );
}
