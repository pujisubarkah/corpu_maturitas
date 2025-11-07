"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from "next/navigation";
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Lightbulb, HelpCircle, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

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

interface ExistingAnswer {
  kategori_id: number;
  kategori_nama: string;
  pertanyaan_id: number;
  pertanyaan_kode: string | null;
  pertanyaan: string | null;
  jawaban: string | number;
  tipe_jawaban: string | null;
  urutan: number | null;
}

interface SurveyData {
  id: number;
  instansi_id: number;
  nama_instansi: string;
  tahun: number;
  jawaban: ExistingAnswer[];
  is_verified: boolean;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

interface AnswerData {
  [key: string]: string | number | null;
}

export default function VerificationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const surveyId = params?.id as string;

  const [surveyData, setSurveyData] = useState<KategoriData[]>([]);
  const [opsiJawabanData, setOpsiJawabanData] = useState<OpsiJawabanData[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDescription, setShowDescription] = useState<Record<number, boolean>>({});
  const [buktiDukung, setBuktiDukung] = useState<Record<number, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [existingSurvey, setExistingSurvey] = useState<SurveyData | null>(null);

  useEffect(() => {
    if (surveyId) {
      fetchSurveyData();
      fetchOpsiJawabanData();
    }
  }, [surveyId]);

  useEffect(() => {
    if (surveyId && surveyData.length > 0) {
      const fetchExistingSurvey = async () => {
        try {
          const response = await fetch(`/api/answer?id=${surveyId}`);
          const data = await response.json();

          if (data.success && data.data) {
            setExistingSurvey({
              id: data.data.surveiId,
              instansi_id: data.data.userId,
              nama_instansi: data.data.fullName || 'Unknown',
              tahun: data.data.tahun,
              jawaban: [], // Will be populated from flattened p1-p41 data
              is_verified: false, // TODO: Add verification status
              verified_by: null,
              verified_at: null,
              created_at: data.data.createdAt,
              updated_at: data.data.updatedAt
            });

            // Convert flattened p1-p41 data to answers format
            const existingAnswers: Record<number, string> = {};

            // Map p1-p41 back to question IDs based on survey structure
            let questionIndex = 1;
            surveyData.forEach((kategoriData) => {
              kategoriData.pertanyaan.forEach((pertanyaan) => {
                const fieldName = `p${questionIndex}`;
                const answer = (data.data as AnswerData)[fieldName];
                if (answer !== undefined && answer !== null) {
                  existingAnswers[pertanyaan.id] = answer.toString();
                }
                questionIndex++;
              });
            });

            // Load bukti_dukung data
            const existingBuktiDukung: Record<number, string> = {};
            const buktiDukungMapping: Record<number, string> = {
              1: 'buktiDukungKompetensi',
              2: 'buktiDukungStruktur',
              3: 'buktiDukungManajemen',
              4: 'buktiDukungForum',
              5: 'buktiDukungSistem',
              6: 'buktiDukungStrategi',
              7: 'buktiDukungTeknologi',
              8: 'buktiDukungIntegrasi',
              9: 'buktiDukungEvaluasi'
            };

            surveyData.forEach((kategoriData) => {
              const buktiField = buktiDukungMapping[kategoriData.kategori.id];
              const buktiValue = (data.data as AnswerData)[buktiField];
              if (buktiValue && typeof buktiValue === 'string') {
                existingBuktiDukung[kategoriData.kategori.id] = buktiValue;
              }
            });

            setAnswers(existingAnswers);
            setBuktiDukung(existingBuktiDukung);
          }
        } catch (error) {
          console.error('Error fetching existing survey:', error);
          setError('Gagal memuat data survei');
        }
      };

      fetchExistingSurvey();
    }
  }, [surveyId, surveyData]);

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

  // Add this function to handle answer changes
  const handleAnswerChange = (pertanyaanId: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [pertanyaanId]: value
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

      // Convert answers to flattened p1-p41 format for verification_answers
      const verificationAnswers: Record<string, string | number> = {};
      surveyData.forEach((kategoriData) => {
        kategoriData.pertanyaan.forEach((pertanyaan) => {
          const answer = answers[pertanyaan.id];
          if (answer !== undefined && answer !== '') {
            // Map question to p1-p41 based on category and question order
            let fieldName = '';
            if (kategoriData.kategori.id === 1) {
              // Kompetensi Generik Nasional: p1-p6
              fieldName = `p${pertanyaan.urutan}`;
            } else if (kategoriData.kategori.id === 2) {
              // Struktur ASN Corpu: p7-p10
              fieldName = `p${6 + pertanyaan.urutan}`;
            } else if (kategoriData.kategori.id === 3) {
              // Manajemen Pengetahuan: p11-p15
              fieldName = `p${10 + pertanyaan.urutan}`;
            } else if (kategoriData.kategori.id === 4) {
              // Forum Pembelajaran: p16-p19
              fieldName = `p${15 + pertanyaan.urutan}`;
            } else if (kategoriData.kategori.id === 5) {
              // Sistem Pembelajaran: p20-p23
              fieldName = `p${19 + pertanyaan.urutan}`;
            } else if (kategoriData.kategori.id === 6) {
              // Strategi Pembelajaran: p24-p28
              fieldName = `p${23 + pertanyaan.urutan}`;
            } else if (kategoriData.kategori.id === 7) {
              // Teknologi Pembelajaran: p29-p33
              fieldName = `p${28 + pertanyaan.urutan}`;
            } else if (kategoriData.kategori.id === 8) {
              // Integrasi Sistem: p34-p37
              fieldName = `p${33 + pertanyaan.urutan}`;
            } else if (kategoriData.kategori.id === 9) {
              // Evaluasi ASN Corpu: p38-p41
              fieldName = `p${37 + pertanyaan.urutan}`;
            }

            if (fieldName) {
              verificationAnswers[fieldName] = pertanyaan.tipe_jawaban === 'angka' ? Number(answer) : answer;
            }
          }
        });
      });

      // Submit verification to /api/jawaban
      const response = await fetch('/api/jawaban', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instansiId: existingSurvey?.instansi_id,
          tahun: existingSurvey?.tahun,
          verification_answers: verificationAnswers,
          is_verified: true,
          verified_by: 'admin', // TODO: Get from session/auth
          isVerification: true
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        alert('Survei telah berhasil diverifikasi dan jawaban telah disimpan.');
        // Redirect back to verification list
        router.push(`/${slug}/verifikasi-survei`);
      } else {
        throw new Error(result.message || 'Gagal memverifikasi survei');
      }

    } catch (err) {
      console.error('Error submitting verification:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memverifikasi survei');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push(`/${slug}/verifikasi-survei`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data verifikasi survei...</p>
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
            <Button onClick={handleBack} variant="outline">
              Kembali
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
          <div className="flex items-center gap-4 mb-4">
            <Button onClick={handleBack} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verifikasi Survei
          </h1>
          <p className="text-lg text-gray-600">
            Verifikasi survei untuk: <span className="font-semibold text-blue-600">{existingSurvey?.nama_instansi}</span>
          </p>
          <p className="text-gray-500 mt-2">
            Tahun: {existingSurvey?.tahun} | ID Survey: {existingSurvey?.id}
          </p>

          <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
            <AlertCircle className="w-4 h-4 mr-2" />
            Mode Verifikasi - Anda dapat mengedit jawaban survei
          </div>
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
                        ? 'bg-orange-600 text-white border-orange-600 shadow-lg cursor-default'
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
            <CardHeader className="bg-orange-50 border-b">
              <CardTitle className="text-xl text-orange-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-orange-700">
                    {currentStep}
                  </span>
                </div>
                {surveyData.find(k => k.kategori.id === currentStep)?.kategori.nama}
              </CardTitle>
              <p className="text-orange-700 mt-2">
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
                      <div className="shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {pertanyaan.urutan}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {pertanyaan.kode}: {pertanyaan.pertanyaan}
                          </h3>
                          {pertanyaan.deskripsi && pertanyaan.deskripsi.trim() !== '' && (
                            <button
                              onClick={() => toggleDescription(pertanyaan.id)}
                              className="text-yellow-500 hover:text-yellow-600 transition-colors"
                              title="Klik untuk melihat deskripsi"
                            >
                              <Lightbulb className="w-5 h-5" />
                            </button>
                          )}
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
                                className={`w-full ${answers[pertanyaan.id] ? 'border-orange-500 bg-orange-50' : ''}`}
                                min="0"
                              />
                            ) : (
                              <Input
                                type="text"
                                placeholder="Masukkan jawaban Anda..."
                                value={answers[pertanyaan.id] || ''}
                                onChange={(e) => handleAnswerChange(pertanyaan.id, e.target.value)}
                                className={`w-full ${answers[pertanyaan.id] ? 'border-orange-500 bg-orange-50' : ''}`}
                              />
                            )
                          ) : (
                            // Kategori 2-9: Radio buttons dengan opsi jawaban
                            <div className="space-y-3">
                              {getOpsiJawabanForPertanyaan(pertanyaan.id).map((opsi) => (
                                <label
                                  key={opsi.id}
                                  className={`flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                                    answers[pertanyaan.id] === opsi.nilai
                                      ? 'border-orange-500 bg-orange-50 shadow-sm'
                                      : ''
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`question-${pertanyaan.id}`}
                                    value={opsi.nilai}
                                    checked={answers[pertanyaan.id] === opsi.nilai}
                                    onChange={(e) => handleAnswerChange(pertanyaan.id, e.target.value)}
                                    className="mt-1 text-orange-600 focus:ring-orange-500"
                                  />
                                  <div className="flex-1">
                                    <span className={`text-sm text-gray-900 ${
                                      answers[pertanyaan.id] === opsi.nilai
                                        ? 'font-medium text-orange-900'
                                        : ''
                                    }`}>
                                      {opsi.label}
                                    </span>
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

              {/* Bukti Dukung Section */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-orange-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Bukti Dukung
                  </h3>
                  <p className="text-sm text-orange-700 mb-4">
                    Bukti dukung atau penjelasan tambahan untuk kategori {surveyData.find(k => k.kategori.id === currentStep)?.kategori.nama}.
                    Ini akan membantu memverifikasi implementasi yang telah dilakukan.
                  </p>
                  <div className="space-y-4">
                    {buktiDukung[currentStep] && buktiDukung[currentStep].trim() !== '' ? (
                      <div>
                        <Button
                          onClick={() => window.open(buktiDukung[currentStep], '_blank')}
                          variant="outline"
                          className="w-full bg-white hover:bg-gray-50 border-orange-300 text-orange-700 hover:text-orange-800"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Lihat File Bukti Dukung
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">
                          Klik untuk membuka link bukti dukung di tab baru
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500">
                          Tidak ada bukti dukung untuk kategori ini
                        </p>
                      </div>
                    )}
                  </div>
                </div>
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
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Memverifikasi Survei...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verifikasi & Simpan
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
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / Math.max(...surveyData.map(k => k.kategori.id))) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}