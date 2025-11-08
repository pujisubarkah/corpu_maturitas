"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface SurveyData {
  surveiId: number;
  userId: number;
  tahun: number;
  fullName: string;
  categories: Array<{
    category: string;
    score: number;
  }>;
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface ChartData {
  name: string;
  score: number;
  maturityLevel: string;
  userId: number;
  tahun: number;
}

export default function ChartSelfAssessmentPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMaturityLevels, setSelectedMaturityLevels] = useState<string[]>([]);
  const itemsPerPage = 20;
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Get unique maturity levels
  const maturityLevels = Array.from(new Set(chartData.map(item => item.maturityLevel))).sort();

  // Filter data based on selected maturity levels (only for current page data)
  const filteredData = selectedMaturityLevels.length === 0 
    ? chartData 
    : chartData.filter(item => selectedMaturityLevels.includes(item.maturityLevel));
  const currentData = filteredData;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleMaturityLevelFilter = (level: string, checked: boolean) => {
    setSelectedMaturityLevels(prev => {
      const newSelection = checked 
        ? [...prev, level]
        : prev.filter(l => l !== level);
      return newSelection;
    });
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSelectAll = () => {
    setSelectedMaturityLevels(maturityLevels);
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSelectedMaturityLevels([]);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/summary_kategori?page=${currentPage}&limit=${itemsPerPage}`);
        const result: ApiResponse = await response.json();

        if (result.success && result.data) {
          // Use the summary_kategori API data which provides consistent category-based scoring
          const processedData: ChartData[] = result.data
            .filter((survey: SurveyData) => {
              // Only include surveys with valid fullName
              return survey.fullName && survey.fullName.trim() !== '' && !survey.fullName.startsWith('User ');
            })
            .map((survey: SurveyData) => {
              // Use the totalScore from summary_kategori API for consistency
              const selfAssessmentScore = survey.summary.totalScore;

              // Determine maturity level using the same logic as chart-by-category
              let maturityLevel = 'Unknown';
              if (selfAssessmentScore >= 0 && selfAssessmentScore <= 1000) maturityLevel = 'Initial';
              else if (selfAssessmentScore >= 1001 && selfAssessmentScore <= 2000) maturityLevel = 'Intermediate (Low)';
              else if (selfAssessmentScore >= 2001 && selfAssessmentScore <= 3000) maturityLevel = 'Intermediate (High)';
              else if (selfAssessmentScore >= 3001 && selfAssessmentScore <= 3500) maturityLevel = 'Mature';
              else if (selfAssessmentScore >= 3501) maturityLevel = 'Advanced';

              // Pass userId and tahun for profile link
              return {
                name: survey.fullName,
                score: selfAssessmentScore,
                maturityLevel,
                userId: survey.userId,
                tahun: survey.tahun
              };
            });

          setChartData(processedData);
          setTotalPages(result.pagination?.totalPages || 1);
          setTotalCount(result.pagination?.total || processedData.length);
        } else {
          setError('Gagal memuat data survei');
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

  // Prepare data for maturity level distribution pie chart (only current page)
  const maturityDistribution = currentData.reduce((acc, item) => {
    acc[item.maturityLevel] = (acc[item.maturityLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(maturityDistribution).map(([level, count]) => ({
    name: level,
    value: count
  }));

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
            Grafik berdasarkan Nilai Self Assessment
          </h1>
          <p className="text-lg text-gray-600">
            Visualisasi nilai self assessment dari survei maturitas corporate university
          </p>
        </div>

        {/* Filter Section */}
        {maturityLevels.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Filter berdasarkan Tingkat Kematangan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleSelectAll}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Pilih Semua
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Hapus Semua
                  </button>
                </div>
                <div className="flex flex-wrap gap-4">
                  {maturityLevels.map((level) => (
                    <label key={level} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedMaturityLevels.includes(level)}
                        onChange={(e) => handleMaturityLevelFilter(level, e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        level === 'Initial' ? 'bg-red-100 text-red-800' :
                        level === 'Intermediate (Low)' ? 'bg-yellow-100 text-yellow-800' :
                        level === 'Intermediate (High)' ? 'bg-blue-100 text-blue-800' :
                        level === 'Mature' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {level}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              {selectedMaturityLevels.length > 0 && (
                <div className="mt-4 text-sm text-gray-600">
                  Menampilkan {filteredData.length} dari {chartData.length} total data
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Summary Stats (current page only) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">
                {currentData.length}
              </div>
              <p className="text-sm text-gray-600">Total Survei (halaman ini)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {currentData.length > 0 ? Math.round(currentData.reduce((sum, item) => sum + item.score, 0) / currentData.length) : 0}
              </div>
              <p className="text-sm text-gray-600">Rata-rata Skor (halaman ini)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600">
                {currentData.length > 0 ? Math.max(...currentData.map(item => item.score)) : 0}
              </div>
              <p className="text-sm text-gray-600">Skor Tertinggi (halaman ini)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-orange-600">
                {currentData.length > 0 ? Math.min(...currentData.map(item => item.score)) : 0}
              </div>
              <p className="text-sm text-gray-600">Skor Terendah (halaman ini)</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart (current page only) */}
          <Card>
            <CardHeader>
              <CardTitle>Nilai Self Assessment per Instansi (halaman ini)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [value, 'Skor']}
                    labelFormatter={(label) => `Instansi: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="score" fill="#3b82f6" name="Nilai Self Assessment" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart (current page only) */}
          <Card>
            <CardHeader>
              <CardTitle>Distribusi Tingkat Kematangan (halaman ini)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props) => `${props.name}: ${((props.percent as number) * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Data Nilai Self Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Instansi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tingkat Kematangan
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {/* Make instansi name clickable, link to /[slug]/instansi page using Next.js Link */}
                        <Link
                          href={`/${slug}/instansi`}
                          className="text-blue-600 underline hover:text-blue-800"
                          title="Lihat daftar instansi"
                        >
                          {item.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.score}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-700">
                  <span>
                    Menampilkan {(currentPage - 1) * itemsPerPage + 1} sampai {Math.min(currentPage * itemsPerPage, totalCount)} dari {totalCount} hasil
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sebelumnya
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    if (pageNum > totalPages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 text-sm font-medium rounded-md ${
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
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}