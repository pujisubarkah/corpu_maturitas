"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from "next/navigation";
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Lightbulb, HelpCircle, CheckCircle, AlertCircle } from 'lucide-react';

interface Pertanyaan {
  id: number;
  kode: string;
  pertanyaan: string;
  deskripsi: string;
  tipe_jawaban: string;
  urutan: number;
  is_required: boolean;
}

interface Kategori {
  id: number;
  nama: string;
  deskripsi: string;
}

interface KategoriData {
  kategori: Kategori;
  pertanyaan: Pertanyaan[];
}

interface ApiResponse {
  success: boolean;
  data: KategoriData[];
}

export default function SurveiPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [surveyData, setSurveyData] = useState<KategoriData[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDescription, setShowDescription] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchSurveyData();
  }, []);

  const fetchSurveyData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pertanyaan_kompetensi');
      const data: ApiResponse = await response.json();

      if (data.success) {
        setSurveyData(data.data);
      } else {
        setError('Gagal memuat data survei');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memuat data');
      console.error('Error fetching survey data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const toggleDescription = (questionId: number) => {
    setShowDescription(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    const requiredQuestions = surveyData.flatMap(kategoriData =>
      kategoriData.pertanyaan.filter(q => q.is_required)
    );

    const missingAnswers = requiredQuestions.filter(q => !answers[q.id]?.trim());

    if (missingAnswers.length > 0) {
      setError(`Mohon lengkapi ${missingAnswers.length} pertanyaan yang wajib diisi`);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Here you would submit the answers to your API
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert('Jawaban survei berhasil disimpan!');
      // You could redirect to a thank you page or results page here

    } catch (err) {
      setError('Terjadi kesalahan saat menyimpan jawaban');
      console.error('Error submitting survey:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat pertanyaan survei...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchSurveyData} variant="outline">
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Survei Maturitas Corporate University
          </h1>
          <p className="text-lg text-gray-600">
            Selamat datang, <span className="font-semibold text-blue-600">{slug}</span>
          </p>
          <p className="text-gray-500 mt-2">
            Silakan lengkapi survei berikut dengan jujur dan akurat
          </p>
        </div>

        {/* Survey Form */}
        <div className="space-y-8">
          {surveyData.map((kategoriData) => (
            <Card key={kategoriData.kategori.id} className="shadow-lg">
              <CardHeader className="bg-blue-50 border-b">
                <CardTitle className="text-xl text-blue-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-700">
                      {kategoriData.kategori.id}
                    </span>
                  </div>
                  {kategoriData.kategori.nama}
                </CardTitle>
                <p className="text-blue-700 mt-2">
                  {kategoriData.kategori.deskripsi}
                </p>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-6">
                  {kategoriData.pertanyaan
                    .sort((a, b) => a.urutan - b.urutan)
                    .map((pertanyaan) => (
                    <div key={pertanyaan.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {pertanyaan.urutan}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {pertanyaan.kode}: {pertanyaan.pertanyaan}
                            </h3>
                            <button
                              onClick={() => toggleDescription(pertanyaan.id)}
                              className="text-yellow-500 hover:text-yellow-600 transition-colors"
                              title="Klik untuk melihat deskripsi"
                            >
                              <Lightbulb className="w-5 h-5" />
                            </button>
                            {pertanyaan.is_required && (
                              <span className="text-red-500 text-sm">*</span>
                            )}
                          </div>

                          {/* Description Tooltip */}
                          {showDescription[pertanyaan.id] && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                              <div className="flex items-start gap-2">
                                <HelpCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-yellow-800">
                                  {pertanyaan.deskripsi}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Answer Input */}
                          <div className="mt-3">
                            {pertanyaan.tipe_jawaban === 'angka' ? (
                              <Input
                                type="number"
                                placeholder="Masukkan angka..."
                                value={answers[pertanyaan.id] || ''}
                                onChange={(e) => handleAnswerChange(pertanyaan.id, e.target.value)}
                                className="w-full"
                                min="0"
                              />
                            ) : (
                              <Input
                                type="text"
                                placeholder="Masukkan jawaban Anda..."
                                value={answers[pertanyaan.id] || ''}
                                onChange={(e) => handleAnswerChange(pertanyaan.id, e.target.value)}
                                className="w-full"
                              />
                            )}
                          </div>

                          {pertanyaan.is_required && (
                            <p className="text-xs text-red-600 mt-1">
                              * Pertanyaan wajib diisi
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 py-3 text-lg"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Kirim Jawaban Survei
              </>
            )}
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Total Pertanyaan: {surveyData.reduce((total, kategori) => total + kategori.pertanyaan.length, 0)} |
          Terisi: {Object.keys(answers).filter(key => answers[Number(key)]?.trim()).length}
        </div>
      </div>
    </div>
  );
}
