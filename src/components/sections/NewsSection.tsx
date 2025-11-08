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

const videos = [
  {
    id: 1,
    title: "Koordinasi dan Inisiasi Penerapan Corporate University Instansi (22/5/2025)",
    videoId: "hLzACFSu6XA"
  },
  {
    id: 2,
    title: "LAN Corpu",
    videoId: "KeZfGKWzPlY"
  },
  {
    id: 3,
    title: "Corpu Talk Series #1: Mendesain Kebijakan Struktur Corpu Instansi",
    videoId: "EmqZfrBswTk"
  },
  {
    id: 4,
    title: "Corpu Talk Series #1: Mendesain Kebijakan Struktur Corpu Instansi",
    videoId: "1P0QS47vjTU"
  }
];

export default function NewsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Video Tutorial & Panduan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pelajari lebih dalam tentang survey maturitas corporate university melalui video tutorial
            yang komprehensif dan mudah dipahami
          </p>
        </div>

        <Carousel className="w-full">
          <CarouselContent className="-ml-4">
            {videos.map((video) => (
              <CarouselItem key={video.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.videoId}`}
                        title={video.title}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {video.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Video tutorial untuk memahami survey maturitas corporate university
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-12" />
          <CarouselNext className="-right-12" />
        </Carousel>
      </div>
    </section>
  );
}
