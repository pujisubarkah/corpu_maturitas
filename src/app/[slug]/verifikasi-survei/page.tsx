"use client";
import { Gauge, TrendingUp, TrendingDown, Award, Rocket } from 'lucide-react';
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from 'swr';
import { useVerifikasi } from '../chart-by-category/useSWRFetcher';

// SWR fetcher function
const fetcher = (url: string) => fetch(url).then(res => res.json());


// (ApiSurveyData interface removed, not used)

interface SurveyData {
  id: number;
  user_id: number;
  nama_instansi: string;
  tahun: number;
  is_verified: boolean;
  verification_answers?: Record<string, string | number>;
  total_verification: number | null;
  kategori_verification?: Record<string, number>;
  self_assessment_score?: number;
  maturitas?: string;
  created_at?: string;
  updated_at?: string;
}

export default function VerificationSurveyPage() {
  const [summaryMaturitas, setSummaryMaturitas] = useState<{
    Initial: number;
    'Intermediate (Low)': number;
    'Intermediate (High)': number;
    Mature: number;
    Advanced: number;
  } | null>(null);

  useEffect(() => {
    // Fetch summary_maturitas on mount
    fetch('/api/summary_maturitas')
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data) {
          setSummaryMaturitas(result.data);
        }
      });
  }, []);
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;
  const [surveys, setSurveys] = useState<SurveyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [filterTahun, setFilterTahun] = useState<string>('');
  const [filterMaturitas, setFilterMaturitas] = useState<string>('');

  // Use SWR for data fetching
  const summaryKey = filterTahun ? `/api/summary_kategori?limit=1000&tahun=${filterTahun}` : '/api/summary_kategori?limit=1000';
  const { data: summaryData } = useSWR(summaryKey, fetcher, { revalidateOnFocus: false });
  const { data: verifData } = useVerifikasi();

  // Process data when both APIs have loaded
  useEffect(() => {
    if (summaryData && verifData) {
      setLoading(true); // Set loading while processing
      let surveysWithScores: SurveyData[] = [];
      if (summaryData.success && Array.isArray(summaryData.data)) {
        surveysWithScores = summaryData.data.map((survey: Record<string, unknown>) => {
          const summary = survey.summary as { totalScore?: number } | undefined;
          const score = summary?.totalScore || 0;
          return {
            id: survey.surveiId,
            user_id: survey.userId,
            nama_instansi: survey.fullName,
            tahun: survey.tahun,
            created_at: survey.createdAt || '',
            updated_at: survey.updatedAt || '',
            self_assessment_score: score,
            maturitas: getMaturityLevel(score)
          };
        });
        // Filter by tingkat maturitas if selected
        if (filterMaturitas) {
          surveysWithScores = surveysWithScores.filter((s: SurveyData) => s.maturitas === filterMaturitas);
        }
      }

      // Create verifikasi map
      const verifMap = new Map<string, Record<string, unknown>>();
      if (verifData.success && Array.isArray(verifData.data)) {
        verifData.data.forEach((v: Record<string, unknown>) => {
          if (typeof v.user_id === 'number' && typeof v.tahun === 'number') {
            verifMap.set(`${v.user_id}_${v.tahun}`, v);
          }
        });
      }

      // Merge verifikasi data with surveys
      const merged = surveysWithScores.map((s: SurveyData) => {
        const verif = verifMap.get(`${s.user_id}_${s.tahun}`) as Record<string, unknown> | undefined;
        return {
          ...s,
          is_verified: verif?.is_verified as boolean || false,
          total_verification: verif?.total_verification as number ?? null
        };
      });

      setSurveys(merged);
      setCurrentPage(1);
      setLoading(false);
    }
  }, [summaryData, verifData, filterMaturitas]);

  const getMaturityLevel = (score: number): string => {
    if (score >= 0 && score <= 1000) return 'Initial';
    if (score >= 1001 && score <= 2000) return 'Intermediate (Low)';
    if (score >= 2001 && score <= 3000) return 'Intermediate (High)';
    if (score >= 3001 && score <= 3500) return 'Mature';
    if (score >= 3501) return 'Advanced';
    return 'Unknown';
  };

  const handleVerification = (survey: SurveyData) => {
    // Navigate to verification detail page
    router.push(`/${slug}/verifikasi-detail/${survey.id}`);
  };

  // Pagination calculations
  const totalPages = Math.ceil(surveys.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSurveys = surveys.slice(startIndex, endIndex);

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

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow p-8">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow p-8 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verifikasi Survei
          </h1>
          <p className="text-lg text-gray-700">
            Halaman verifikasi survei untuk <span className="font-semibold text-blue-700">{slug}</span>
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-8">
          {/* Summary Cards: Jumlah Instansi per Tingkat Maturitas */}
          {summaryMaturitas && (
            <div className="mb-8 flex flex-wrap gap-6 justify-center">
              {[
                {
                  label: 'Initial',
                  gradient: 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400',
                  text: 'text-gray-700',
                  border: 'border-gray-300',
                  icon: <Gauge className="h-10 w-10 mb-2" />
                },
                {
                  label: 'Intermediate (Low)',
                  gradient: 'bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-400',
                  text: 'text-yellow-800',
                  border: 'border-yellow-300',
                  icon: <TrendingDown className="h-10 w-10 mb-2" />
                },
                {
                  label: 'Intermediate (High)',
                  gradient: 'bg-gradient-to-br from-orange-100 via-orange-300 to-orange-400',
                  text: 'text-orange-800',
                  border: 'border-orange-300',
                  icon: <TrendingUp className="h-10 w-10 mb-2" />
                },
                {
                  label: 'Mature',
                  gradient: 'bg-gradient-to-br from-blue-100 via-blue-300 to-blue-400',
                  text: 'text-blue-800',
                  border: 'border-blue-300',
                  icon: <Award className="h-10 w-10 mb-2" />
                },
                {
                  label: 'Advanced',
                  gradient: 'bg-gradient-to-br from-green-100 via-green-300 to-green-400',
                  text: 'text-green-800',
                  border: 'border-green-300',
                  icon: <Rocket className="h-10 w-10 mb-2" />
                }
              ].map(item => (
                <div
                  key={item.label}
                  className={`flex flex-col items-center justify-center px-8 py-6 rounded-2xl border shadow-lg ${item.gradient} ${item.text} ${item.border} transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-1`}
                  style={{ minWidth: 170 }}
                >
                  {item.icon}
                  <span className="text-2xl font-extrabold tracking-tight mb-1 drop-shadow-lg">{summaryMaturitas[item.label as keyof typeof summaryMaturitas]}</span>
                  <span className="text-sm font-semibold uppercase tracking-wide opacity-80 drop-shadow">{item.label}</span>
                </div>
              ))}
            </div>
          )}
          {/* Filter Controls */}
          <div className="mb-6 flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
              <input
                type="text"
                value={filterTahun}
                onChange={e => setFilterTahun(e.target.value)}
                placeholder="Contoh: 2025"
                className="border rounded px-3 py-2 text-sm"
                style={{ minWidth: 100 }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat Maturitas</label>
              <select
                value={filterMaturitas}
                onChange={e => setFilterMaturitas(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
                style={{ minWidth: 180 }}
              >
                <option value="">Semua Tingkat</option>
                <option value="Initial">Initial</option>
                <option value="Intermediate (Low)">Intermediate (Low)</option>
                <option value="Intermediate (High)">Intermediate (High)</option>
                <option value="Mature">Mature</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <button
              onClick={() => {/* No-op, filters update automatically */}}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            >
              Filter
            </button>
            <button
              onClick={() => { setFilterTahun(''); setFilterMaturitas(''); }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded shadow hover:bg-gray-300"
            >
              Reset
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Instansi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verifikasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nilai Self Assessment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nilai Verifikasi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentSurveys.map((survey) => (
                  <tr key={survey.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {survey.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {survey.nama_instansi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {survey.is_verified ? (
                        <span className="text-green-600 bg-green-50 px-3 py-1 rounded-md text-xs font-medium cursor-not-allowed">
                          ✓ Sudah Terverifikasi
                        </span>
                      ) : (
                        <button
                          onClick={() => handleVerification(survey)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md text-xs font-medium"
                        >
                          Verifikasi
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="text-center">
                        <div className="font-medium">{survey.self_assessment_score || 0}</div>
                        <div className="mt-1 flex justify-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold
                              ${survey.maturitas === 'Initial' ? 'bg-gray-200 text-gray-700' : ''}
                              ${survey.maturitas === 'Intermediate (Low)' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${survey.maturitas === 'Intermediate (High)' ? 'bg-orange-100 text-orange-800' : ''}
                              ${survey.maturitas === 'Mature' ? 'bg-blue-100 text-blue-800' : ''}
                              ${survey.maturitas === 'Advanced' ? 'bg-green-100 text-green-800' : ''}
                            `}
                          >
                            {survey.maturitas}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="text-center">
                        <div className="font-medium">
                          {survey.total_verification !== null ? survey.total_verification : '-'}
                        </div>
                        {survey.total_verification !== null && (
                          <div className="mt-1 flex justify-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold
                                ${getMaturityLevel(survey.total_verification) === 'Initial' ? 'bg-gray-200 text-gray-700' : ''}
                                ${getMaturityLevel(survey.total_verification) === 'Intermediate (Low)' ? 'bg-yellow-100 text-yellow-800' : ''}
                                ${getMaturityLevel(survey.total_verification) === 'Intermediate (High)' ? 'bg-orange-100 text-orange-800' : ''}
                                ${getMaturityLevel(survey.total_verification) === 'Mature' ? 'bg-blue-100 text-blue-800' : ''}
                                ${getMaturityLevel(survey.total_verification) === 'Advanced' ? 'bg-green-100 text-green-800' : ''}
                              `}
                            >
                              {getMaturityLevel(survey.total_verification)}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {surveys.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Tidak ada data survei
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {surveys.length > 0 && totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-xl shadow">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(endIndex, surveys.length)}</span> of{' '}
                  <span className="font-medium">{surveys.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Modal components removed as verification now redirects to survey page */}
      </div>
    </main>
  );
}