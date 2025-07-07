"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import Navbar from '@/src/components/sections/Navbar';
import Footer from '@/src/components/sections/Footer';
import { Download, Share, BarChart3, Target, TrendingUp, Award } from 'lucide-react';
import Link from 'next/link';

export default function ResultsPage() {
  // Dummy results data
  const overallScore = 72;
  const maturityLevel = "Berkembang";
  
  const categoryScores = [
    { category: "Komitmen Pimpinan", score: 85, level: "Optimal" },
    { category: "Struktur Organisasi", score: 70, level: "Berkembang" },
    { category: "Kurikulum & Program", score: 65, level: "Berkembang" },
    { category: "Teknologi & Platform", score: 60, level: "Dasar" },
    { category: "SDM & Fasilitator", score: 75, level: "Berkembang" },
    { category: "Evaluasi & Monitoring", score: 80, level: "Baik" },
    { category: "Kolaborasi & Kemitraan", score: 70, level: "Berkembang" },
    { category: "Budget & Investasi", score: 71, level: "Berkembang" }
  ];

  const recommendations = [
    {
      priority: "Tinggi",
      area: "Teknologi & Platform",
      action: "Investasi dalam Learning Management System yang terintegrasi",
      impact: "Meningkatkan efisiensi pembelajaran dan tracking progress"
    },
    {
      priority: "Sedang",
      area: "Kurikulum & Program",
      action: "Pengembangan kurikulum berbasis kompetensi",
      impact: "Pembelajaran lebih relevan dengan kebutuhan organisasi"
    },
    {
      priority: "Sedang",
      area: "Kolaborasi & Kemitraan",
      action: "Membangun kerjasama dengan universitas terkemuka",
      impact: "Akses ke knowledge dan best practices terbaru"
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Hasil Survey Maturitas Corporate University
            </h1>
            <p className="text-lg text-gray-600">
              Berikut adalah analisis komprehensif tingkat kematangan Corporate University organisasi Anda
            </p>
          </div>

          {/* Overall Score */}
          <Card className="mb-8 shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <CardTitle className="text-center">
                <div className="flex items-center justify-center gap-4">
                  <Award className="w-8 h-8" />
                  Skor Maturitas Keseluruhan
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center">
                <div className="relative w-40 h-40 mx-auto mb-6">
                  <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallScore / 100)}`}
                      className="text-blue-600"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">{overallScore}</div>
                      <div className="text-sm text-gray-600">dari 100</div>
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-2">{maturityLevel}</div>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Corporate University Anda berada pada tingkat maturitas &ldquo;{maturityLevel}&rdquo;. 
                  Masih ada beberapa area yang dapat ditingkatkan untuk mencapai level optimal.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Category Scores */}
          <Card className="mb-8 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                Skor per Kategori
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {categoryScores.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{item.category}</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${getScoreColor(item.score)}`}>
                          {item.score}
                        </span>
                        <span className="text-sm text-gray-500">({item.level})</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getScoreBg(item.score)}`}
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="mb-8 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-6 h-6" />
                Rekomendasi Pengembangan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {recommendations.map((rec, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          rec.priority === 'Tinggi' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          Prioritas {rec.priority}
                        </span>
                        <h4 className="font-semibold text-gray-900 mt-2">{rec.area}</h4>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">
                      <strong>Aksi:</strong> {rec.action}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <strong>Dampak:</strong> {rec.impact}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4" />
              Download Laporan PDF
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Share className="w-4 h-4" />
              Bagikan Hasil
            </Button>
            <Link href="/input-survey">
              <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                <TrendingUp className="w-4 h-4" />
                Survey Ulang
              </Button>
            </Link>
          </div>

          {/* Next Steps */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-800">Langkah Selanjutnya</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">1</span>
                  </div>
                  <h4 className="font-semibold mb-2">Konsultasi Expert</h4>
                  <p className="text-sm text-gray-600">
                    Diskusikan hasil dengan konsultan Corporate University kami
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <h4 className="font-semibold mb-2">Roadmap Development</h4>
                  <p className="text-sm text-gray-600">
                    Buat roadmap pengembangan berdasarkan hasil assessment
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <h4 className="font-semibold mb-2">Implementation</h4>
                  <p className="text-sm text-gray-600">
                    Implementasi dengan dukungan tim ahli kami
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
