"use client";
import React, { useState, useEffect, useCallback } from 'react';
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
  const [buktiDukung, setBuktiDukung] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDescription, setShowDescription] = useState<Record<number, boolean>>({});
  const [currentStep, setCurrentStep] = useState(1); // Start from kategori ID 1
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchSurveyData();
    fetchOpsiJawabanData();
  }, []);

  const loadExistingAnswers = useCallback(async () => {
    try {
      // Check if user is logged in
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        setIsEditMode(false);
        return; // Not logged in, no existing answers to load
      }

      const user = JSON.parse(currentUser);
      if (!user.id) {
        setIsEditMode(false);
        return; // No user id
      }

      const userId = user.id;

      // Get unique endpoints and create field mapping
      const endpoints: string[] = [];
      const fieldToQuestionMap: Record<string, Record<string, number>> = {};

      surveyData.forEach(kategoriData => {
        const step = kategoriData.kategori.id!;
        let endpoint = '/api/kompetensi_generik_nasional';
        let fieldOffset = 1;
        if (step === 2) {
          endpoint = '/api/struktur_asn_corpu';
          fieldOffset = 7;
        } else if (step === 3) {
          endpoint = '/api/manajemen_pengetahuan';
          fieldOffset = 11;
        } else if (step === 4) {
          endpoint = '/api/forum_pembelajaran';
          fieldOffset = 16;
        } else if (step === 5) {
          endpoint = '/api/sistem_pembelajaran';
          fieldOffset = 20;
        } else if (step === 6) {
          endpoint = '/api/strategi_pembelajaran';
          fieldOffset = 24;
        } else if (step === 7) {
          endpoint = '/api/teknologi_pembelajaran';
          fieldOffset = 29;
        } else if (step === 8) {
          endpoint = '/api/integrasi_sistem';
          fieldOffset = 34;
        } else if (step === 9) {
          endpoint = '/api/evaluasi_asn_corpu';
          fieldOffset = 38;
        }

        if (!endpoints.includes(endpoint)) {
          endpoints.push(endpoint);
        }

        kategoriData.pertanyaan.forEach((pertanyaan, index) => {
          const fieldName = `p${fieldOffset + index}`;
          if (!fieldToQuestionMap[endpoint]) {
            fieldToQuestionMap[endpoint] = {};
          }
          fieldToQuestionMap[endpoint][fieldName] = pertanyaan.id;
        });
      });

      // Fetch data from all endpoints
      const fetchPromises = endpoints.map(endpoint =>
        fetch(`${endpoint}?userId=${userId}&tahun=${selectedYear}`)
          .then(res => res.json())
          .catch(err => {
            console.error(`Error fetching from ${endpoint}:`, err);
            return { data: [] }; // Return empty array on error
          })
      );

      const results = await Promise.all(fetchPromises);

      // Parse existing answers
      const existingAnswers: Record<number, string> = {};
      const existingBuktiDukung: Record<number, string> = {};

      results.forEach((result, index) => {
        const endpoint = endpoints[index];
        if (result.data && Array.isArray(result.data)) {
          result.data.forEach((record: Record<string, unknown>) => {
            // Map fields like p1, p2, vp1, vp2, etc. to answers using fieldToQuestionMap
            Object.keys(record).forEach(field => {
              if (field.startsWith('p') && fieldToQuestionMap[endpoint]?.[field]) {
                const questionId = fieldToQuestionMap[endpoint][field];
                existingAnswers[questionId] = record[field]?.toString() || '';
              }
            });

            // Handle bukti_dukung - map to kategori based on endpoint
            if (record.buktiDukung && typeof record.buktiDukung === 'string') {
              let kategoriId = null;
              if (endpoint === '/api/kompetensi_generik_nasional') kategoriId = 1;
              else if (endpoint === '/api/struktur_asn_corpu') kategoriId = 2;
              else if (endpoint === '/api/manajemen_pengetahuan') kategoriId = 3;
              else if (endpoint === '/api/forum_pembelajaran') kategoriId = 4;
              else if (endpoint === '/api/sistem_pembelajaran') kategoriId = 5;
              else if (endpoint === '/api/strategi_pembelajaran') kategoriId = 6;
              else if (endpoint === '/api/teknologi_pembelajaran') kategoriId = 7;
              else if (endpoint === '/api/integrasi_sistem') kategoriId = 8;
              else if (endpoint === '/api/evaluasi_asn_corpu') kategoriId = 9;

              if (kategoriId) {
                existingBuktiDukung[kategoriId] = record.buktiDukung;
              }
            }
          });
        }
      });

      setAnswers(existingAnswers);
      setBuktiDukung(existingBuktiDukung);

      // Check if any answers were loaded
      const hasAnswers = Object.keys(existingAnswers).length > 0;
      setIsEditMode(hasAnswers);

      console.log('Loaded existing answers for year', selectedYear, ':', existingAnswers);
    } catch (_error) {
      console.error('Error loading existing answers:', _error);
      setIsEditMode(false);
      // Don't show error to user, just continue with empty form
    }
  }, [selectedYear, surveyData]);

  useEffect(() => {
    // Load existing answers when survey data is loaded or year changes
    if (surveyData.length > 0) {
      loadExistingAnswers();
    }
  }, [surveyData, selectedYear, loadExistingAnswers]);

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

  const handleNext = async () => {
    if (!validateCurrentStep()) {
      setError(`Mohon lengkapi semua pertanyaan wajib di kategori ini sebelum lanjut ke langkah berikutnya`);
      return;
    }

    // Submit current step data before moving to next step
    try {
      setSubmitting(true);
      setError(null);

      // Check if user is logged in
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        alert('Anda harus login terlebih dahulu untuk mengirim survei.');
        window.location.href = '/login';
        return;
      }

      // Get userId from localStorage
      let userId: number;
      try {
        const user = JSON.parse(currentUser);
        if (user.id && typeof user.id === 'number') {
          userId = user.id;
        } else {
          alert('Data user tidak valid. Silakan login kembali.');
          window.location.href = '/login';
          return;
        }
      } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
        alert('Terjadi kesalahan pada data login. Silakan login kembali.');
        window.location.href = '/login';
        return;
      }

      // Group answers for current step only
      const groupedAnswers: Record<string, Record<string, string | number>> = {};

      const currentKategoriData = surveyData.find(k => k.kategori.id === currentStep);
      if (currentKategoriData) {
        // Special handling for different steps
        let endpoint = '/api/kompetensi_generik_nasional';
        let fieldOffset = 1; // Starting field number for mapping
        if (currentStep === 2) {
          endpoint = '/api/struktur_asn_corpu';
          fieldOffset = 7;
        } else if (currentStep === 3) {
          endpoint = '/api/manajemen_pengetahuan';
          fieldOffset = 11;
        } else if (currentStep === 4) {
          endpoint = '/api/forum_pembelajaran';
          fieldOffset = 16;
        } else if (currentStep === 5) {
          endpoint = '/api/sistem_pembelajaran';
          fieldOffset = 20;
        } else if (currentStep === 6) {
          endpoint = '/api/strategi_pembelajaran';
          fieldOffset = 24;
        } else if (currentStep === 7) {
          endpoint = '/api/teknologi_pembelajaran';
          fieldOffset = 29;
        } else if (currentStep === 8) {
          endpoint = '/api/integrasi_sistem';
          fieldOffset = 34;
        } else if (currentStep === 9) {
          endpoint = '/api/evaluasi_asn_corpu';
          fieldOffset = 38;
        }

        currentKategoriData.pertanyaan.forEach((pertanyaan, index) => {
          const answer = answers[pertanyaan.id];
          if (answer !== undefined && answer !== '') {
            if (!groupedAnswers[endpoint]) {
              groupedAnswers[endpoint] = { userId, tahun: selectedYear };
            }
            // Map fields based on step using fieldOffset
            groupedAnswers[endpoint][`p${fieldOffset + index}`] = pertanyaan.tipe_jawaban === 'angka' ? Number(answer) : answer;
          }
        });

        // Add bukti_dukung for current step
        const bukti = buktiDukung[currentStep];
        if (bukti && bukti.trim() !== '') {
          if (groupedAnswers[endpoint]) {
            groupedAnswers[endpoint].buktiDukung = bukti;
          }
        }

        // Submit current step data
        if (Object.keys(groupedAnswers).length > 0) {
          const submitPromises = Object.entries(groupedAnswers).map(async ([endpoint, data]) => {
            // Check if data already exists for this user and year
            const checkResponse = await fetch(`${endpoint}?userId=${userId}&tahun=${selectedYear}`);
            const checkData = await checkResponse.json();
            const existingRecords = checkData.data || [];

            let method = 'POST';
            let submitData = data;
            let existingId = null;

            if (existingRecords.length > 0) {
              // Update existing record
              method = 'PUT';
              existingId = existingRecords[0].id;
              submitData = { id: existingId, ...data };
            }

            const response = await fetch(endpoint, {
              method: method,
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(submitData)
            });

            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`HTTP ${response.status} for ${endpoint}: ${errorText}`);
            }

            return response.json();
          });

          await Promise.all(submitPromises);
        }
      }

      // Move to next step
      setError(null);
      const nextStep = currentStep + 1;
      const nextKategoriExists = surveyData.some(k => k.kategori.id === nextStep);

      if (nextKategoriExists) {
        setCurrentStep(nextStep);
      }

    } catch (err) {
      console.error('Error submitting current step:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan jawaban');
    } finally {
      setSubmitting(false);
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

  const handleBuktiDukungChange = (kategoriId: number, value: string) => {
    setBuktiDukung(prev => ({
      ...prev,
      [kategoriId]: value
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

      // Check if user is logged in
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        alert('Anda harus login terlebih dahulu untuk mengirim survei.');
        window.location.href = '/login';
        return;
      }

      // Get userId from localStorage
      let userId: number;
      try {
        const user = JSON.parse(currentUser);
        if (user.id && typeof user.id === 'number') {
          userId = user.id;
        } else {
          alert('Data user tidak valid. Silakan login kembali.');
          window.location.href = '/login';
          return;
        }
      } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
        alert('Terjadi kesalahan pada data login. Silakan login kembali.');
        window.location.href = '/login';
        return;
      }

      // Submit final step data (current step is the last one)
      const currentKategoriData = surveyData.find(k => k.kategori.id === currentStep);
      if (currentKategoriData) {
        const groupedAnswers: Record<string, Record<string, string | number>> = {};

        // Determine endpoint and field offset for final step
        let endpoint = '/api/kompetensi_generik_nasional';
        let fieldOffset = 1;
        if (currentStep === 2) {
          endpoint = '/api/struktur_asn_corpu';
          fieldOffset = 7;
        } else if (currentStep === 3) {
          endpoint = '/api/manajemen_pengetahuan';
          fieldOffset = 11;
        } else if (currentStep === 4) {
          endpoint = '/api/forum_pembelajaran';
          fieldOffset = 16;
        } else if (currentStep === 5) {
          endpoint = '/api/sistem_pembelajaran';
          fieldOffset = 20;
        } else if (currentStep === 6) {
          endpoint = '/api/strategi_pembelajaran';
          fieldOffset = 24;
        } else if (currentStep === 7) {
          endpoint = '/api/teknologi_pembelajaran';
          fieldOffset = 29;
        } else if (currentStep === 8) {
          endpoint = '/api/integrasi_sistem';
          fieldOffset = 34;
        } else if (currentStep === 9) {
          endpoint = '/api/evaluasi_asn_corpu';
          fieldOffset = 38;
        }

        currentKategoriData.pertanyaan.forEach((pertanyaan, index) => {
          const answer = answers[pertanyaan.id];
          if (answer !== undefined && answer !== '' && pertanyaan.kode) {
            if (!groupedAnswers[endpoint]) {
              groupedAnswers[endpoint] = { userId, tahun: selectedYear };
            }
            groupedAnswers[endpoint][`p${fieldOffset + index}`] = pertanyaan.tipe_jawaban === 'angka' ? Number(answer) : answer;
          }
        });

        // Add bukti_dukung for final step
        const bukti = buktiDukung[currentStep];
        if (bukti && bukti.trim() !== '') {
          if (groupedAnswers[endpoint]) {
            groupedAnswers[endpoint].buktiDukung = bukti;
          }
        }

        // Submit final step data
        if (Object.keys(groupedAnswers).length > 0) {
          const submitPromises = Object.entries(groupedAnswers).map(async ([endpoint, data]) => {
            // Check if data already exists for this user and year
            const checkResponse = await fetch(`${endpoint}?userId=${userId}&tahun=${selectedYear}`);
            const checkData = await checkResponse.json();
            const existingRecords = checkData.data || [];

            let method = 'POST';
            let submitData = data;
            let existingId = null;

            if (existingRecords.length > 0) {
              // Update existing record
              method = 'PUT';
              existingId = existingRecords[0].id;
              submitData = { id: existingId, ...data };
            }

            const response = await fetch(endpoint, {
              method: method,
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(submitData)
            });

            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`HTTP ${response.status} for ${endpoint}: ${errorText}`);
            }

            return response.json();
          });

          await Promise.all(submitPromises);
        }
      }

      alert('Terima kasih! Jawaban survei Anda telah berhasil disimpan/diperbarui.');
      // Reload existing answers to reflect changes
      loadExistingAnswers();

    } catch (_error) {
      console.error('Error submitting survey:', _error);
      setError(_error instanceof Error ? _error.message : 'Terjadi kesalahan saat menyimpan jawaban');
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

          {/* Year Selector */}
          <div className="mt-4 flex items-center gap-4">
            <label htmlFor="year-select" className="text-sm font-medium text-gray-700">
              Periode Survei:
            </label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
            </select>
          </div>

          <p className="text-gray-500 mt-2">
            {isEditMode
              ? 'Anda dapat mengedit jawaban survei yang sudah disimpan sebelumnya.'
              : 'Yuk isi survei ini! Jawaban Anda sangat berharga untuk kami.'
            }
          </p>
          {isEditMode && (
            <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              <CheckCircle className="w-4 h-4 mr-2" />
              Mode Edit - Data survei tahun {selectedYear} sudah tersimpan
            </div>
          )}
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
                                className={`w-full ${isEditMode && answers[pertanyaan.id] ? 'border-blue-500 bg-blue-50' : ''}`}
                                min="0"
                              />
                            ) : (
                              <Input
                                type="text"
                                placeholder="Masukkan jawaban Anda..."
                                value={answers[pertanyaan.id] || ''}
                                onChange={(e) => handleAnswerChange(pertanyaan.id, e.target.value)}
                                className={`w-full ${isEditMode && answers[pertanyaan.id] ? 'border-blue-500 bg-blue-50' : ''}`}
                              />
                            )
                          ) : (
                            // Kategori 2-9: Radio buttons dengan opsi jawaban
                            <div className="space-y-3">
                              {getOpsiJawabanForPertanyaan(pertanyaan.id).map((opsi) => (
                                <label
                                  key={opsi.id}
                                  className={`flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                                    isEditMode && answers[pertanyaan.id] === opsi.nilai
                                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                                      : ''
                                  }`}
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
                                    <span className={`text-sm text-gray-900 ${
                                      isEditMode && answers[pertanyaan.id] === opsi.nilai
                                        ? 'font-medium text-blue-900'
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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Bukti Dukung
                  </h3>
                  <p className="text-sm text-blue-700 mb-4">
                    Silakan berikan bukti dukung atau penjelasan tambahan untuk kategori {surveyData.find(k => k.kategori.id === currentStep)?.kategori.nama}.
                    Ini akan membantu kami memahami implementasi yang telah dilakukan.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Link Bukti Dukung
                      </label>
                      <Input
                        type="url"
                        value={buktiDukung[currentStep] || ''}
                        onChange={(e) => handleBuktiDukungChange(currentStep, e.target.value)}
                        placeholder="https://contoh-link-bukti-dukung.com"
                        className={`w-full ${isEditMode && buktiDukung[currentStep] ? 'border-blue-500 bg-blue-50 text-blue-600' : ''}`}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Masukkan link ke dokumen, laporan, atau bukti dukung lainnya
                      </p>
                    </div>
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
                className="px-6 py-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isEditMode ? 'Memperbarui...' : 'Menyimpan...'}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {isEditMode ? 'Update Jawaban' : 'Kirim Jawaban'}
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
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
                    Selanjutnya →
                  </>
                )}
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
