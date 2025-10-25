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

interface OpsiJawaban {
  id: number;
  pertanyaan_id: number;
  label: string;
  nilai: string;
  urutan: number;
  is_active: boolean | null;
}

interface OpsiJawabanData {
  pertanyaan: {
    id: number;
    kode: string | null;
    pertanyaan: string | null;
  };
  opsi_jawaban: OpsiJawaban[];
}

interface OpsiJawabanApiResponse {
  success: boolean;
  data: OpsiJawabanData[];
}

export default function SurveiPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [surveyData, setSurveyData] = useState<KategoriData[]>([]);
  const [opsiJawabanData, setOpsiJawabanData] = useState<OpsiJawabanData[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDescription, setShowDescription] = useState<Record<number, boolean>>({});
  const [currentStep, setCurrentStep] = useState(1); // Start from kategori ID 1

  useEffect(() => {
    fetchSurveyData();
    fetchOpsiJawabanData();
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

  const fetchOpsiJawabanData = async () => {
    try {
      const response = await fetch('/api/opsi_jawaban');
      const data: OpsiJawabanApiResponse = await response.json();

      if (data.success) {
        setOpsiJawabanData(data.data);
      } else {
        console.warn('Gagal memuat data opsi jawaban');
      }
    } catch (err) {
      console.error('Error fetching opsi jawaban data:', err);
    }
  };

  const validateCurrentStep = () => {
    if (surveyData.length === 0) return true;

    const currentKategoriData = surveyData.find(k => k.kategori.id === currentStep);
    if (!currentKategoriData) return true;

    const requiredQuestions = currentKategoriData.pertanyaan.filter(q => q.is_required);
    const missingAnswers = requiredQuestions.filter(q => !answers[q.id]?.trim());

    return missingAnswers.length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      setError(`Mohon lengkapi semua pertanyaan wajib di kategori ini sebelum lanjut ke langkah berikutnya`);
      return;
    }

    setError(null);
    const nextStep = currentStep + 1;
    const nextKategoriExists = surveyData.some(k => k.kategori.id === nextStep);

    if (nextKategoriExists) {
      setCurrentStep(nextStep);
    }
  };

  const handlePrevious = () => {
    setError(null);
    const prevStep = currentStep - 1;
    if (prevStep >= 1) {
      setCurrentStep(prevStep);
    }
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleStepClick = (stepId: number) => {
    // Only allow navigation to completed steps or current step
    if (stepId <= currentStep) {
      setError(null);
      setCurrentStep(stepId);
    }
  };

  const getOpsiJawabanForPertanyaan = (pertanyaanId: number): OpsiJawaban[] => {
    const opsiData = opsiJawabanData.find(data => data.pertanyaan.id === pertanyaanId);
    return opsiData ? opsiData.opsi_jawaban.sort((a, b) => a.urutan - b.urutan) : [];
  };

  const toggleDescription = (questionId: number) => {
    setShowDescription(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleSubmit = async () => {
    // Validate all required fields across all categories
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

      // Use slug as instansi identifier - convert to number or use hash
      let instansiId = 1; // Default fallback

      if (slug) {
        // Simple hash function to convert slug to number
        let hash = 0;
        for (let i = 0; i < slug.length; i++) {
          const char = slug.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; // Convert to 32-bit integer
        }
        instansiId = Math.abs(hash) % 10000 + 1; // Keep it reasonable (1-10000)
      }

      // Prepare answers data
      const surveyAnswers: Record<string, {
        kategori_id: number;
        kategori_nama: string;
        pertanyaan_id: number;
        pertanyaan_kode: string | null;
        pertanyaan: string | null;
        jawaban: string | number;
        tipe_jawaban: string | null;
        urutan: number | null;
      }> = {};
      surveyData.forEach((kategoriData) => {
        kategoriData.pertanyaan.forEach((pertanyaan) => {
          const answer = answers[pertanyaan.id];
          if (answer !== undefined && answer !== '') {
            surveyAnswers[`kategori_${kategoriData.kategori.id}_pertanyaan_${pertanyaan.id}`] = {
              kategori_id: kategoriData.kategori.id,
              kategori_nama: kategoriData.kategori.nama,
              pertanyaan_id: pertanyaan.id,
              pertanyaan_kode: pertanyaan.kode,
              pertanyaan: pertanyaan.pertanyaan,
              jawaban: pertanyaan.tipe_jawaban === 'angka' ? Number(answer) : answer,
              tipe_jawaban: pertanyaan.tipe_jawaban,
              urutan: pertanyaan.urutan
            };
          }
        });
      });

      // Submit to API
      const response = await fetch('/api/jawaban', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instansi_id: instansiId,
          tahun: new Date().getFullYear(),
          jawaban: surveyAnswers
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        alert('Terima kasih! Jawaban survei Anda telah berhasil disimpan.');
        // You could redirect to a thank you page here
        // router.push('/thank-you');
      } else {
        throw new Error(result.message || 'Gagal menyimpan jawaban');
      }

    } catch (err) {
      console.error('Error submitting survey:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan jawaban');
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
            Yuk isi survei ini! Jawaban Anda sangat berharga untuk kami.
          </p>
        </div>

        {/* Step Indicator */}
        {surveyData.length > 0 && (
          <div className="mb-8">
            <div className="relative flex justify-center items-center">
              {/* Connecting Line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 -translate-y-1/2"></div>

              {/* Step Bullets */}
              <div className="relative flex justify-center gap-8">
                {surveyData
                  .sort((a, b) => a.kategori.id - b.kategori.id)
                  .map((kategoriData) => (
                  <div
                    key={kategoriData.kategori.id}
                    onClick={() => handleStepClick(kategoriData.kategori.id)}
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                      kategoriData.kategori.id === currentStep
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg cursor-default'
                        : kategoriData.kategori.id < currentStep
                        ? 'bg-green-600 text-white border-green-600 cursor-pointer hover:bg-green-700 hover:border-green-700'
                        : 'bg-gray-300 text-gray-600 border-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {kategoriData.kategori.id}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Survey Form */}
        {surveyData.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader className="bg-blue-50 border-b">
              <CardTitle className="text-xl text-blue-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-700">
                    {currentStep}
                  </span>
                </div>
                {surveyData.find(k => k.kategori.id === currentStep)?.kategori.nama}
              </CardTitle>
              <p className="text-blue-700 mt-2">
                {surveyData.find(k => k.kategori.id === currentStep)?.kategori.deskripsi}
              </p>
            </CardHeader>

            <CardContent className="p-6">
              <div className="space-y-6">
                {surveyData.find(k => k.kategori.id === currentStep)?.pertanyaan
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
                          {currentStep === 1 ? (
                            // Kategori 1: Input text
                            pertanyaan.tipe_jawaban === 'angka' ? (
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
                            )
                          ) : (
                            // Kategori 2-9: Radio buttons dengan opsi jawaban
                            <div className="space-y-3">
                              {getOpsiJawabanForPertanyaan(pertanyaan.id).map((opsi) => (
                                <label
                                  key={opsi.id}
                                  className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                  <input
                                    type="radio"
                                    name={`question-${pertanyaan.id}`}
                                    value={opsi.nilai}
                                    checked={answers[pertanyaan.id] === opsi.nilai}
                                    onChange={(e) => handleAnswerChange(pertanyaan.id, e.target.value)}
                                    className="mt-1 text-blue-600 focus:ring-blue-500"
                                  />
                                  <div className="flex-1">
                                    <span className="text-sm text-gray-900">{opsi.label}</span>
                                  </div>
                                </label>
                              ))}
                            </div>
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
        )}

        {/* Navigation Buttons */}
        {surveyData.length > 0 && (
          <div className="mt-8 flex justify-between items-center">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              variant="outline"
              className="px-6 py-2"
            >
              ← Sebelumnya
            </Button>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Langkah {currentStep} dari {Math.max(...surveyData.map(k => k.kategori.id))}
              </span>
            </div>

            {currentStep === Math.max(...surveyData.map(k => k.kategori.id)) ? (
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Kirim Jawaban
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="px-6 py-2"
              >
                Selanjutnya →
              </Button>
            )}
          </div>
        )}

        {/* Progress Indicator */}
        {surveyData.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">
                Langkah {currentStep} dari {Math.max(...surveyData.map(k => k.kategori.id))}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((currentStep / Math.max(...surveyData.map(k => k.kategori.id))) * 100)}% selesai
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / Math.max(...surveyData.map(k => k.kategori.id))) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
