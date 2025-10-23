"use client"
import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import Navbar from '@/src/components/sections/Navbar';
import Footer from '@/src/components/sections/Footer';
import { ChevronLeft, ChevronRight, Save, Send } from 'lucide-react';

// Dummy survey questions
const surveyQuestions = [
  {
    id: 1,
    category: "Komitmen Pimpinan",
    question: "Apakah pimpinan instansi Bapak/Ibu memiliki komitmen terhadap penerapan sistem pembelajaran terintegrasi (Corporate University) yang didukung dengan arah kebijakan dan strategi Pengembangan Kapasitas?",
    options: [
      "Sudah menerapkan Corporate University dengan sangat baik",
      "Sudah menerapkan namun masih perlu perbaikan",
      "Sedang dalam proses penerapan",
      "Belum menerapkan namun sudah ada rencana",
      "Belum menerapkan dan belum ada rencana"
    ]
  },
  {
    id: 2,
    category: "Struktur Organisasi",
    question: "Bagaimana struktur organisasi Corporate University di instansi Bapak/Ibu?",
    options: [
      "Sudah memiliki struktur organisasi yang jelas dan berfungsi optimal",
      "Sudah memiliki struktur namun masih perlu penyempurnaan",
      "Sedang dalam proses pembentukan struktur organisasi",
      "Belum memiliki struktur namun sudah direncanakan",
      "Belum memiliki struktur organisasi sama sekali"
    ]
  },
  {
    id: 3,
    category: "Kurikulum & Program",
    question: "Sejauh mana pengembangan kurikulum dan program pembelajaran di Corporate University instansi Anda?",
    options: [
      "Kurikulum sangat komprehensif dan selalu diperbaharui",
      "Kurikulum sudah baik namun perlu pembaharuan berkala",
      "Kurikulum sedang dalam tahap pengembangan",
      "Belum memiliki kurikulum namun sudah ada rancangan",
      "Belum memiliki kurikulum dan rancangan"
    ]
  },
  {
    id: 4,
    category: "Teknologi & Platform",
    question: "Bagaimana kondisi teknologi dan platform pembelajaran digital di Corporate University Anda?",
    options: [
      "Platform digital sangat canggih dan terintegrasi penuh",
      "Platform digital sudah baik namun perlu upgrade",
      "Sedang mengembangkan platform digital",
      "Belum memiliki platform namun sudah direncanakan",
      "Belum memiliki platform digital sama sekali"
    ]
  },
  {
    id: 5,
    category: "SDM & Fasilitator",
    question: "Bagaimana kualitas dan kuantitas SDM pengajar/fasilitator di Corporate University instansi Anda?",
    options: [
      "SDM sangat berkualitas dan jumlahnya mencukupi",
      "SDM sudah baik namun perlu peningkatan kompetensi",
      "Sedang dalam proses perekrutan dan pengembangan SDM",
      "Belum memiliki SDM yang memadai namun sudah direncanakan",
      "Belum memiliki SDM yang memadai dan belum ada rencana"
    ]
  },
  {
    id: 6,
    category: "Evaluasi & Monitoring",
    question: "Sejauh mana sistem evaluasi dan monitoring efektivitas pembelajaran di Corporate University Anda?",
    options: [
      "Sistem evaluasi sangat komprehensif dan berkelanjutan",
      "Sistem evaluasi sudah ada namun perlu penyempurnaan",
      "Sedang mengembangkan sistem evaluasi",
      "Belum memiliki sistem evaluasi namun sudah direncanakan",
      "Belum memiliki sistem evaluasi sama sekali"
    ]
  },
  {
    id: 7,
    category: "Kolaborasi & Kemitraan",
    question: "Bagaimana kolaborasi Corporate University Anda dengan institusi eksternal (universitas, perusahaan lain, dll)?",
    options: [
      "Kolaborasi sangat ekstensif dengan banyak institusi",
      "Kolaborasi sudah berjalan namun masih terbatas",
      "Sedang dalam proses membangun kolaborasi",
      "Belum memiliki kolaborasi namun sudah direncanakan",
      "Belum memiliki kolaborasi sama sekali"
    ]
  },
  {
    id: 8,
    category: "Budget & Investasi",
    question: "Bagaimana alokasi budget dan investasi untuk pengembangan Corporate University di instansi Anda?",
    options: [
      "Budget sangat memadai dan dialokasikan secara optimal",
      "Budget sudah ada namun masih perlu peningkatan",
      "Budget terbatas namun dikelola dengan baik",
      "Budget sangat terbatas dan sulit untuk pengembangan",
      "Tidak ada alokasi budget khusus untuk Corporate University"
    ]
  }
];

export default function InputSurveyPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileChecked, setProfileChecked] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      alert('Survey berhasil dikirim! Terima kasih atas partisipasi Anda.');
      setIsSubmitting(false);
      // Redirect to results page
      window.location.href = '/results';
    }, 2000);
  };

  // Validate profile completeness using same required fields as profile form
  const isProfileComplete = (profile: Record<string, string> | null) => {
    if (!profile) return false;
    const required = ['name','email','position','department','company','phone','location','education','experience','age'];
    for (const key of required) {
      if (!profile[key] || (typeof profile[key] === 'string' && profile[key].trim() === '')) return false;
    }
    // basic email check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) return false;
    // age numeric range
    const age = Number(profile.age);
    if (isNaN(age) || age < 18 || age > 70) return false;
    return true;
  }

  // Check localStorage for userProfile on client
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('userProfile');
      if (!raw) {
        setProfileComplete(false);
        setProfileChecked(true);
        return;
      }
      const parsed = JSON.parse(raw);
      const ok = isProfileComplete(parsed);
      setProfileComplete(ok);
    } catch {
      setProfileComplete(false);
    } finally {
      setProfileChecked(true);
    }
  }, []);

  const progress = ((currentQuestion + 1) / surveyQuestions.length) * 100;
  const currentQ = surveyQuestions[currentQuestion];

  // Render body depending on profile status
  const renderBody = () => {
    if (!profileChecked) {
      return (
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center py-28">Memeriksa profil...</div>
        </div>
      )
    }

    if (!profileComplete) {
      return (
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="py-16">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Lengkapi Profil Terlebih Dahulu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Untuk dapat mengisi survey, mohon lengkapi data profil Anda terlebih dahulu. Data ini membantu kami memberikan hasil yang lebih akurat dan personal.</p>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => window.location.href = '/'}>Kembali</Button>
                  <Button onClick={() => window.location.href = '/profile'} className="bg-blue-600 hover:bg-blue-700">Isi Profil</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    // Profile is complete -> show survey
    return (
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Survey Maturitas Corporate University
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Bantu kami memahami tingkat kematangan Corporate University di organisasi Anda 
            melalui serangkaian pertanyaan komprehensif berikut ini.
          </p>
        </div>

        {/* Profile Reminder */}
        <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-xl">👤</span>
              </div>
              <div>
                <h3 className="font-semibold text-yellow-800">
                  Lengkapi Profile Anda
                </h3>
                <p className="text-sm text-yellow-700">
                  Untuk hasil survey yang lebih akurat, silakan lengkapi profile Anda terlebih dahulu.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/profile'}
              className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
            >
              Isi Profile
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Pertanyaan {currentQuestion + 1} dari {surveyQuestions.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progress)}% selesai
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader className="bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-xl">
              <div className="text-sm font-normal text-blue-100 mb-2">
                {currentQ.category}
              </div>
              {currentQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-4">
              {currentQ.options.map((option, index) => (
                <label 
                  key={index} 
                  className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all group"
                >
                  <input
                    type="radio"
                    name={`question-${currentQ.id}`}
                    value={option}
                    checked={answers[currentQ.id] === option}
                    onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 group-hover:text-gray-900 leading-relaxed">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => alert('Progress disimpan!')}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Simpan Progress
            </Button>

            {currentQuestion === surveyQuestions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={!answers[currentQ.id] || isSubmitting}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Mengirim...' : 'Kirim Survey'}
              </Button>
            ) : (
              <Button
                onClick={nextQuestion}
                disabled={!answers[currentQ.id]}
                className="flex items-center gap-2"
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Survey Info */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Informasi Survey
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <strong>Waktu Pengisian:</strong> ± 15-20 menit
            </div>
            <div>
              <strong>Total Pertanyaan:</strong> {surveyQuestions.length} pertanyaan
            </div>
            <div>
              <strong>Kategori:</strong> 8 aspek maturitas
            </div>
            <div>
              <strong>Hasil:</strong> Laporan komprehensif dalam 3 hari kerja
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>💡 Tips:</strong> Pastikan Anda telah mengisi{' '}
              <button 
                onClick={() => window.location.href = '/profile'}
                className="text-blue-600 underline hover:text-blue-800"
              >
                profile lengkap
              </button>
              {' '}untuk mendapatkan hasil analisis yang lebih personal dan akurat.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-1 py-8">
        {renderBody()}
      </main>

      <Footer />
    </div>
  );
}
