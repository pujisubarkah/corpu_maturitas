"use client"
import React from 'react';
import Link from 'next/link';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Clock
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo dan Deskripsi */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-20 h-20 rounded-lg flex items-center justify-center overflow-hidden bg-white p-2">
                <img
                  src="/logo-lan.png"
                  alt="Logo LAN"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold">Survey Maturitas CU</span>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Direktorat Sistem Pembelajaran Terintegrasi LAN menyediakan platform 
              terpercaya untuk mengukur tingkat kematangan corporate university dan 
              mengembangkan strategi pembelajaran organisasi yang efektif.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Layanan */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Survey & Assessment</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/input-survey" className="text-gray-300 hover:text-white transition-colors">
                  Survey Maturitas
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Analisis Hasil
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Laporan & Insights
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Benchmarking
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Sertifikasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Informasi */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Sumber Daya</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Framework Maturitas
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Best Practices
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Panduan Survey
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Whitepaper
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Hubungi Kami</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-blue-400 mt-1 shrink-0" />
                <div>
                  <p className="text-gray-300">Konsultasi</p>
                  <p className="text-white font-medium">+62 21 3868-201</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-400 mt-1 shrink-0" />
                <div>
                  <p className="text-gray-300">Email</p>
                  <p className="text-white font-medium">dspt@lan.go.id</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-400 mt-1 shrink-0" />
                <div>
                  <p className="text-gray-300">Jam Pelayanan</p>
                  <p className="text-white font-medium">08:00 - 16:00 WIB</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-1 shrink-0" />
                <div>
                  <p className="text-gray-300">Alamat</p>
                  <p className="text-white font-medium">
                    Gedung B Jl. Veteran No. 10<br />
                    Jakarta Pusat 10110
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2025 Direktorat Sistem Pembelajaran Terintegrasi LAN. Seluruh hak cipta dilindungi undang-undang.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Syarat Penggunaan
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
