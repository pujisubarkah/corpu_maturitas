"use client"
import React from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { 
  ClipboardList, 
  BarChart3, 
  FileText, 
  Users, 
  BookOpen, 
  TrendingUp,
  Award,
  Target,
  UserCheck
} from 'lucide-react';

const services = [
  {
    icon: UserCheck,
    title: "Profile Responden",
    description: "Lengkapi data personal untuk analisis survey yang lebih akurat",
    color: "bg-emerald-500",
    link: "/profile"
  },
  {
    icon: ClipboardList,
    title: "Survey Maturitas",
    description: "Isi survey untuk menilai tingkat kematangan corporate university",
    color: "bg-blue-500",
    link: "/input-survey"
  },
  {
    icon: BarChart3,
    title: "Analisis Hasil",
    description: "Dapatkan analisis mendalam tentang skor maturitas organisasi",
    color: "bg-green-500"
  },
  {
    icon: FileText,
    title: "Laporan Komprehensif",
    description: "Terima laporan detail dengan rekomendasi pengembangan",
    color: "bg-purple-500"
  },
  {
    icon: Users,
    title: "Benchmarking",
    description: "Bandingkan dengan organisasi lain dalam industri yang sama",
    color: "bg-orange-500"
  },
  {
    icon: BookOpen,
    title: "Best Practices",
    description: "Pelajari praktik terbaik dari corporate university terdepan",
    color: "bg-red-500"
  },
  {
    icon: TrendingUp,
    title: "Roadmap Pengembangan",
    description: "Dapatkan roadmap strategis untuk meningkatkan maturitas",
    color: "bg-indigo-500"
  },
  {
    icon: Award,
    title: "Sertifikasi",
    description: "Raih sertifikat kematangan corporate university",
    color: "bg-teal-500"
  },
  {
    icon: Target,
    title: "Action Plan",
    description: "Implementasi rencana aksi berdasarkan hasil survey",
    color: "bg-pink-500"
  }
];

export default function ServicesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Layanan Survey Maturitas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dapatkan insight mendalam tentang tingkat kematangan corporate university organisasi Anda
            melalui platform survey yang komprehensif dan terstruktur
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white"
              onClick={() => service.link && (window.location.href = service.link)}
            >
              <CardContent className="p-6 text-center">
                <div className={`${service.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
