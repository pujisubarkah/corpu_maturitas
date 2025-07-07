"use client"
import React from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

const news = [
  {
    id: 1,
    title: "Tren Corporate University di Era Digital 2025",
    excerpt: "Bagaimana transformasi digital mengubah landscape corporate university dan pembelajaran organisasi modern.",
    date: "2025-01-15",
    time: "10:00 WIB",
    image: "/api/placeholder/400/250",
    category: "Tren"
  },
  {
    id: 2,
    title: "Best Practice: Implementasi Learning Management System",
    excerpt: "Studi kasus sukses implementasi LMS di berbagai corporate university terkemuka di Indonesia.",
    date: "2025-01-14",
    time: "14:30 WIB",
    image: "/api/placeholder/400/250",
    category: "Best Practice"
  },
  {
    id: 3,
    title: "Framework Maturitas Corporate University Terbaru",
    excerpt: "Pembaruan framework assessment maturitas dengan fokus pada competency-based learning.",
    date: "2025-01-13",
    time: "09:15 WIB",
    image: "/api/placeholder/400/250",
    category: "Framework"
  },
  {
    id: 4,
    title: "Webinar: Strategi Pengembangan Talent Pipeline",
    excerpt: "Diskusi mendalam tentang strategi membangun talent pipeline melalui corporate university.",
    date: "2025-01-12",
    time: "16:45 WIB",
    image: "/api/placeholder/400/250",
    category: "Event"
  },
  {
    id: 5,
    title: "Survey: ROI Corporate University di Indonesia",
    excerpt: "Hasil penelitian tentang return of investment corporate university dalam meningkatkan produktivitas.",
    date: "2025-01-11",
    time: "11:20 WIB",
    image: "/api/placeholder/400/250",
    category: "Research"
  }
];

export default function NewsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Berita & Insight Terbaru
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dapatkan informasi terkini seputar corporate university, tren pembelajaran organisasi, 
            dan best practices pengembangan SDM di Indonesia
          </p>
        </div>
        
        <Carousel className="w-full">
          <CarouselContent className="-ml-4">
            {news.map((item) => (
              <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
                  <div className="relative overflow-hidden">
                    <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <span className="text-white text-sm font-medium px-3 py-1 bg-black/20 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(item.date).toLocaleDateString('id-ID')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{item.time}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {item.excerpt}
                    </p>
                    <Button variant="ghost" className="p-0 h-auto text-blue-600 hover:text-blue-700 font-medium">
                      Baca Selengkapnya
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-12" />
          <CarouselNext className="-right-12" />
        </Carousel>
        
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
            Lihat Semua Berita
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
