"use client"
import React from 'react';
import { Button } from '@/src/components/ui/button';
import { ArrowRight, BookOpen, TrendingUp, Target } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Survey Maturitas 
              <span className="text-yellow-300"> Corporate University</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Ukur tingkat kematangan corporate university organisasi Anda dan temukan peluang 
              pengembangan pembelajaran yang berkelanjutan untuk mencapai keunggulan kompetitif.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/profile">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                  Lengkapi Profile
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/input-survey">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-700">
                  Mulai Survey
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
              <h3 className="text-xl font-semibold mb-2">Pembelajaran</h3>
              <p className="text-blue-100">Evaluasi program pembelajaran organisasi</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
              <h3 className="text-xl font-semibold mb-2">Pengembangan</h3>
              <p className="text-blue-100">Tingkatkan kapabilitas SDM</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center col-span-2">
              <Target className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
              <h3 className="text-xl font-semibold mb-2">Maturitas Organisasi</h3>
              <p className="text-blue-100">Ukur tingkat kematangan corporate university</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
