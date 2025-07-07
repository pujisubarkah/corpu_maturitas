"use client"
import React from 'react';
import Navbar from '@/src/components/sections/Navbar';
import HeroSection from '@/src/components/sections/HeroSection';
import ServicesSection from '@/src/components/sections/ServicesSection';
import StatsSection from '@/src/components/sections/StatsSection';
import ChartSection from '@/src/components/sections/ChartSection';
import NewsSection from '@/src/components/sections/NewsSection';
import Footer from '@/src/components/sections/Footer';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <StatsSection />
        <ChartSection />
        <NewsSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}