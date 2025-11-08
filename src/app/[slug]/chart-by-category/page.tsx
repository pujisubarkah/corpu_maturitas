"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

interface UserData {
  id: number;
  fullName: string;
}

interface CategoryData {
  category: string;
  score: number;
}

interface SurveyData {
  surveiId: number;
  userId: number;
  tahun: number;
  fullName: string;
  categories: CategoryData[];
  summary: {
    totalScore: number;
  };
}

interface ApiResponse {
  success: boolean;
  data: SurveyData[];
  pagination?: {
    totalPages: number;
    total: number;
  };
}

interface UserApiResponse {
  success: boolean;
  data: UserData[];
}

// Add missing InstitutionCategoryData interface
interface InstitutionCategoryData {
  name: string;
  strukturAsn: number;
  manajemenPengetahuan: number;
  forumPembelajaran: number;
  sistemPembelajaran: number;
  strategiPembelajaran: number;
  teknologiPembelajaran: number;
  integrasiSistem: number;
  evaluasiAsn: number;
  totalScore: number;
  maturityLevel: string;
  verifikasiKategori?: {
    strukturAsn?: number;
    manajemenPengetahuan?: number;
    forumPembelajaran?: number;
    sistemPembelajaran?: number;
    strategiPembelajaran?: number;
    teknologiPembelajaran?: number;
    integrasiSistem?: number;
    evaluasiAsn?: number;
  };
}


export default function ChartByCategoryPage() {
  const [institutionData, setInstitutionData] = useState<InstitutionCategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMaturityLevels, setSelectedMaturityLevels] = useState<string[]>([
    'Initial', 'Intermediate (Low)', 'Intermediate (High)', 'Mature', 'Advanced'
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalInstitutions, setTotalInstitutions] = useState(0);
  const itemsPerPage = 20; // Show 20 institutions per page

  // Filter data based on selected maturity levels
  const filteredInstitutionData = institutionData.filter((institution: InstitutionCategoryData) =>
    selectedMaturityLevels.includes(institution.maturityLevel)
  );

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        setLoading(true);
        // Fetch survey data from summary_kategori API with pagination
        const surveyResponse = await fetch(`/api/summary_kategori?page=${currentPage}&limit=${itemsPerPage}`);
        const surveyResult: ApiResponse = await surveyResponse.json();
        // Fetch user data to get fullName mapping (get all users)
        const userResponse = await fetch('/api/user?limit=1000');
        const userResult: UserApiResponse = await userResponse.json();
        // Fetch verification data
        const verifResponse = await fetch('/api/verifikasi');
        const verifResult = await verifResponse.json();

        const verifMap: Record<string, unknown> = {};
        if (verifResult.success && Array.isArray(verifResult.data)) {
          verifResult.data.forEach((v: Record<string, unknown>) => {
            if (typeof v.user_id === 'number' && typeof v.tahun === 'number' && v.kategori_verification) {
              verifMap[`${v.user_id}_${v.tahun}`] = v.kategori_verification;
            }
          });
        }

        if (surveyResult.success && surveyResult.data && userResult.success && userResult.data) {
          // Create userId to fullName mapping (only for users with fullName)
          const userMap = new Map<number, string>();
          userResult.data.forEach((user: UserData) => {
            if (user.fullName && user.fullName.trim() !== '') {
              userMap.set(Number(user.id), user.fullName);
            }
          });

          // Process data for each institution (only include those with fullName)
          const institutionCategoryData = surveyResult.data
            .filter((survey: SurveyData) => userMap.has(Number(survey.userId)))
            .map((survey: SurveyData): InstitutionCategoryData => {
              // Create category score mapping from API response
              const categoryScores: { [key: string]: number } = {};
              survey.categories.forEach((cat: CategoryData) => {
                // Map category names to our internal keys
                const keyMap: { [key: string]: string } = {
                  'Struktur ASN Corpu': 'strukturAsn',
                  'Manajemen Pengetahuan': 'manajemenPengetahuan',
                  'Forum Pembelajaran': 'forumPembelajaran',
                  'Sistem Pembelajaran': 'sistemPembelajaran',
                  'Strategi Pembelajaran': 'strategiPembelajaran',
                  'Teknologi Pembelajaran': 'teknologiPembelajaran',
                  'Integrasi Sistem': 'integrasiSistem',
                  'Evaluasi ASN Corpu': 'evaluasiAsn'
                };
                const internalKey = keyMap[cat.category];
                if (internalKey) {
                  categoryScores[internalKey] = cat.score;
                }
              });

              // Calculate total score from category scores
              const totalScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0);

              // Determine maturity level based on total score
              let maturityLevel = 'Unknown';
              if (totalScore >= 0 && totalScore <= 1000) maturityLevel = 'Initial';
              else if (totalScore >= 1001 && totalScore <= 2000) maturityLevel = 'Intermediate (Low)';
              else if (totalScore >= 2001 && totalScore <= 3000) maturityLevel = 'Intermediate (High)';
              else if (totalScore >= 3001 && totalScore <= 3500) maturityLevel = 'Mature';
              else if (totalScore >= 3501) maturityLevel = 'Advanced';

              // Tambahkan data verifikasi kategori
              const verifKategori = verifMap[`${survey.userId}_${survey.tahun}`] || {};

              return {
                name: userMap.get(Number(survey.userId)) || `User ${survey.userId}`,
                strukturAsn: categoryScores.strukturAsn || 0,
                manajemenPengetahuan: categoryScores.manajemenPengetahuan || 0,
                forumPembelajaran: categoryScores.forumPembelajaran || 0,
                sistemPembelajaran: categoryScores.sistemPembelajaran || 0,
                strategiPembelajaran: categoryScores.strategiPembelajaran || 0,
                teknologiPembelajaran: categoryScores.teknologiPembelajaran || 0,
                integrasiSistem: categoryScores.integrasiSistem || 0,
                evaluasiAsn: categoryScores.evaluasiAsn || 0,
                totalScore,
                maturityLevel,
                verifikasiKategori: verifKategori
              };
            });

          setInstitutionData(institutionCategoryData);
          setTotalPages(surveyResult.pagination?.totalPages || 1);
          setTotalInstitutions(surveyResult.pagination?.total || institutionCategoryData.length);
        } else {
          setError('Gagal memuat data survei atau data user');
        }
      } catch (err) {
        console.error('Error fetching survey data:', err);
        setError('Terjadi kesalahan saat memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyData();
  }, [currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data chart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Grafik Berdasarkan Item
          </h1>
          <p className="text-lg text-gray-600">
            Visualisasi skor per kategori untuk setiap instansi menggunakan radar chart
          </p>
        </div>

        {/* Maturity Level Filter */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filter Berdasarkan Tingkat Kematangan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {['Initial', 'Intermediate (Low)', 'Intermediate (High)', 'Mature', 'Advanced'].map((level) => (
                <label key={level} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedMaturityLevels.includes(level)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMaturityLevels([...selectedMaturityLevels, level]);
                      } else {
                        setSelectedMaturityLevels(selectedMaturityLevels.filter(l => l !== level));
                      }
                      setCurrentPage(1); // Reset to first page when filter changes
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{level}</span>
                </label>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setSelectedMaturityLevels(['Initial', 'Intermediate (Low)', 'Intermediate (High)', 'Mature', 'Advanced']);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
              >
                Pilih Semua
              </button>
              <button
                onClick={() => {
                  setSelectedMaturityLevels([]);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100"
              >
                Hapus Semua
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">
                {totalInstitutions}
              </div>
              <p className="text-sm text-gray-600">Total Instansi</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {filteredInstitutionData.length > 0 ? Math.round(filteredInstitutionData.reduce((sum: number, item: InstitutionCategoryData) => sum + item.totalScore, 0) / filteredInstitutionData.length) : 0}
              </div>
              <p className="text-sm text-gray-600">Rata-rata Total Skor (Halaman Ini)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600">
                {filteredInstitutionData.length > 0 ? Math.max(...filteredInstitutionData.map((item: InstitutionCategoryData) => item.totalScore)) : 0}
              </div>
              <p className="text-sm text-gray-600">Skor Tertinggi (Halaman Ini)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-orange-600">
                {filteredInstitutionData.length > 0 ? Math.min(...filteredInstitutionData.map((item: InstitutionCategoryData) => item.totalScore)) : 0}
              </div>
              <p className="text-sm text-gray-600">Skor Terendah (Halaman Ini)</p>
            </CardContent>
          </Card>
        </div>

        {/* Radar Charts for Each Institution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredInstitutionData.map((institution: InstitutionCategoryData, index: number) => {
            // Prepare data for radar chart
            const radarData = [
              { category: 'Struktur ASN', fullName: 'Struktur ASN Corpu', score: institution.strukturAsn, verifikasi: institution.verifikasiKategori?.strukturAsn || 0 },
              { category: 'Manajemen Pengetahuan', fullName: 'Manajemen Pengetahuan', score: institution.manajemenPengetahuan, verifikasi: institution.verifikasiKategori?.manajemenPengetahuan || 0 },
              { category: 'Forum Pembelajaran', fullName: 'Forum Pembelajaran', score: institution.forumPembelajaran, verifikasi: institution.verifikasiKategori?.forumPembelajaran || 0 },
              { category: 'Sistem Pembelajaran', fullName: 'Sistem Pembelajaran', score: institution.sistemPembelajaran, verifikasi: institution.verifikasiKategori?.sistemPembelajaran || 0 },
              { category: 'Strategi Pembelajaran', fullName: 'Strategi Pembelajaran', score: institution.strategiPembelajaran, verifikasi: institution.verifikasiKategori?.strategiPembelajaran || 0 },
              { category: 'Teknologi Pembelajaran', fullName: 'Teknologi Pembelajaran', score: institution.teknologiPembelajaran, verifikasi: institution.verifikasiKategori?.teknologiPembelajaran || 0 },
              { category: 'Integrasi Sistem', fullName: 'Integrasi Sistem', score: institution.integrasiSistem, verifikasi: institution.verifikasiKategori?.integrasiSistem || 0 },
              { category: 'Evaluasi ASN', fullName: 'Evaluasi ASN Corpu', score: institution.evaluasiAsn, verifikasi: institution.verifikasiKategori?.evaluasiAsn || 0 }
            ];

            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{institution.name}</CardTitle>
                  <div className="text-sm text-gray-600">
                    Total Skor: {institution.totalScore} | Tingkat: {institution.maturityLevel}
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis
                        dataKey="category"
                        tick={{ fontSize: 10 }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 'dataMax']}
                        tick={{ fontSize: 8 }}
                      />
                      <Radar
                        name="Self Assessment"
                        dataKey="score"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Radar
                        name="Verifikasi"
                        dataKey="verifikasi"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                      <Tooltip
                        formatter={(value: number, name: string) => [value, name]}
                        labelFormatter={(label: string, payload: readonly { payload?: { fullName?: string } }[]) => {
                          return payload && payload.length > 0 && payload[0]?.payload?.fullName
                            ? payload[0].payload.fullName
                            : label;
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 mb-8">
            <div className="text-sm text-gray-700">
              Menampilkan {((currentPage - 1) * itemsPerPage) + 1} sampai {Math.min(currentPage * itemsPerPage, totalInstitutions)} dari {totalInstitutions} instansi
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNum > totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === pageNum
                        ? 'text-blue-600 bg-blue-50 border border-blue-500'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Data Table */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Data Skor per Kategori per Instansi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Instansi
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Struktur ASN
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Manajemen Pengetahuan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Forum Pembelajaran
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sistem Pembelajaran
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Strategi Pembelajaran
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teknologi Pembelajaran
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Integrasi Sistem
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Evaluasi ASN
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Skor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tingkat Kematangan
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInstitutionData.map((item: InstitutionCategoryData, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.strukturAsn}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.manajemenPengetahuan}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.forumPembelajaran}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.sistemPembelajaran}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.strategiPembelajaran}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.teknologiPembelajaran}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.integrasiSistem}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.evaluasiAsn}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {item.totalScore}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.maturityLevel === 'Initial' ? 'bg-red-100 text-red-800' :
                          item.maturityLevel === 'Intermediate (Low)' ? 'bg-yellow-100 text-yellow-800' :
                          item.maturityLevel === 'Intermediate (High)' ? 'bg-blue-100 text-blue-800' :
                          item.maturityLevel === 'Mature' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {item.maturityLevel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}