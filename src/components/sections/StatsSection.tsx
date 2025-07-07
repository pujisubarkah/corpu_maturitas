"use client"
import React from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { TrendingUp, Users, Building, Award } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: "500+",
    label: "Organisasi Telah Berpartisipasi",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    icon: Building,
    value: "150+",
    label: "Corporate University Tersertifikasi",
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    icon: Award,
    value: "95%",
    label: "Tingkat Akurasi Assessment",
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    icon: TrendingUp,
    value: "85%",
    label: "Peningkatan Rata-rata Maturitas",
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  }
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Statistik & Pencapaian
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Data yang menunjukkan efektivitas platform survey maturitas 
            dalam membantu organisasi mengembangkan corporate university mereka
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className={`${stat.bgColor} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <stat.icon className={`h-10 w-10 ${stat.color}`} />
                </div>
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <p className="text-gray-600 font-medium">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
