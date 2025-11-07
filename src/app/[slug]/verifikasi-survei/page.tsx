"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface JawabanItem {
  urutan: number;
  jawaban: number | string;
  pertanyaan: string;
  kategori_id: number;
  tipe_jawaban: string;
  kategori_nama: string;
  pertanyaan_id: number;
  pertanyaan_kode: string;
}

interface ApiSurveyData {
  surveiId: number;
  userId: number;
  tahun: number;
  fullName: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: string | number | null;
}

interface SurveyData {
  id: number;
  instansi_id: number;
  nama_instansi: string;
  tahun: number;
  created_at: string;
  updated_at: string;
  self_assessment_score?: number;
  verification_score?: number | null;
  is_verified: boolean;
  verified_by: string | null;
  verified_at: string | null;
  jawaban: JawabanItem[]; // Keep for compatibility
  verification_answers: JawabanItem[] | null;
}

export default function VerificationSurveyPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;
  const [surveys, setSurveys] = useState<SurveyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchSurveys = async () => {
    try {
      // Get all surveys from answer API
      const response = await fetch('/api/answer');
      const result = await response.json();
      if (result.success) {
        // Calculate scores for each survey from flattened p1-p41 data
        const surveysWithScores = result.data.map((survey: ApiSurveyData) => {
          // Calculate self assessment score from p1-p41 (all questions)
          let selfAssessmentScore = 0;
          // Sum all p1-p41 values (only numeric ones)
          for (let i = 1; i <= 41; i++) {
            const value = survey[`p${i}`];
            if (typeof value === 'number' && !isNaN(value)) {
              selfAssessmentScore += value;
            }
          }

          return {
            id: survey.surveiId,
            instansi_id: survey.userId,
            nama_instansi: survey.fullName,
            tahun: survey.tahun,
            created_at: survey.createdAt,
            updated_at: survey.updatedAt,
            self_assessment_score: selfAssessmentScore,
            // These fields might not be available in the new API, set defaults
            is_verified: false,
            verified_by: null,
            verified_at: null,
            verification_score: null,
            jawaban: [], // Keep empty for compatibility
            verification_answers: null
          };
        });
        setSurveys(surveysWithScores);
        setCurrentPage(1); // Reset to first page when new data is loaded
      }
    } catch (error) {
      console.error('Error fetching surveys:', error);
    }
  };

  useEffect(() => {
    fetchSurveys().finally(() => setLoading(false));
  }, []);

  // Refresh data when component mounts (useful after verification)
  useEffect(() => {
    const handleFocus = () => {
      fetchSurveys();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

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
                    Tanggal Kirim
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(survey.created_at).toLocaleDateString('id-ID')}
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
                        <div className="text-xs text-gray-400 mt-1">
                          {getMaturityLevel(survey.self_assessment_score || 0)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="text-center">
                        <div className="font-medium">
                          {survey.verification_score !== null ? survey.verification_score : '-'}
                        </div>
                        {survey.verification_score !== null && (
                          <div className="text-xs text-gray-400 mt-1">
                            {getMaturityLevel(survey.verification_score!)}
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