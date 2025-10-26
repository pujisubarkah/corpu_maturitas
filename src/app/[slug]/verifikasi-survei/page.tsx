"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SurveyAnswer {
  pertanyaan: string;
  jawaban: number | string;
}

interface VerificationAnswer {
  pertanyaan: string;
  jawaban: string;
}

interface Survey {
  id: number;
  instansi_id: number;
  tahun: number;
  is_verified: boolean;
  jawaban: SurveyAnswer[];
  verification_answers?: SurveyAnswer[];
  verification_score?: number | null;
  self_assessment_score: number | null;
  created_at: string;
  updated_at: string;
  profile_name: string | null;
  profile_email: string | null;
  instansi_name: string | null;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function VerificationSurveyPage() {
  const params = useParams();
  const slug = params?.slug;
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [verificationAnswers, setVerificationAnswers] = useState<VerificationAnswer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSurveys = async (page: number = 1) => {
    try {
      const response = await fetch(`/api/verification-survey?page=${page}&limit=10&status=pending`);
      const result = await response.json();
      if (result.success) {
        setSurveys(result.data);
        setPagination(result.pagination);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching surveys:', error);
    }
  };

  useEffect(() => {
    fetchSurveys().finally(() => setLoading(false));
  }, []);

  const handleAction = (survey: Survey) => {
    setSelectedSurvey(survey);
    setVerificationAnswers((survey.verification_answers || survey.jawaban || []).map(item => ({
      pertanyaan: item.pertanyaan,
      jawaban: String(item.jawaban)
    })));
    setIsModalOpen(true);
  };

  const handleViewDetail = (survey: Survey) => {
    setSelectedSurvey(survey);
    setIsDetailModalOpen(true);
  };

  const handleSubmitAction = async () => {
    if (!selectedSurvey) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/verification-survey', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedSurvey.id,
          status: 'verified',
          verified_by: 'admin', // In real app, get from session
          verification_answers: verificationAnswers,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsModalOpen(false);
        setSelectedSurvey(null);
        setVerificationAnswers([]);
        await fetchSurveys(currentPage); // Refresh current page
        alert(`Survei berhasil diverifikasi`);
      } else {
        alert(`Gagal memproses survei: ${result.message}`);
      }
    } catch (error) {
      console.error('Error processing survey:', error);
      alert('Terjadi kesalahan saat memproses survei');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (isVerified: boolean) => {
    return isVerified
      ? <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Terverifikasi</span>
      : <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Menunggu</span>;
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
                {surveys.map((survey) => (
                  <tr key={survey.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {survey.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {survey.instansi_name || `Instansi ${survey.instansi_id}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(survey.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetail(survey)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md text-xs font-medium"
                      >
                        Lihat Detail
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {survey.self_assessment_score ? survey.self_assessment_score.toFixed(2) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {survey.verification_score ? survey.verification_score.toFixed(2) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {surveys.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Tidak ada survei yang perlu diverifikasi
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-b-xl">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => fetchSurveys(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => fetchSurveys(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {Math.min((currentPage - 1) * pagination.limit + 1, pagination.totalCount)}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * pagination.limit, pagination.totalCount)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{pagination.totalCount}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => fetchSurveys(currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    ‹
                  </button>

                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => fetchSurveys(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pageNum === currentPage
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => fetchSurveys(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    ›
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Detail Survei */}
      {isDetailModalOpen && selectedSurvey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Detail Survei</h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <strong>Instansi:</strong> {selectedSurvey.instansi_name || `Instansi ${selectedSurvey.instansi_id}`}
                </div>
                <div>
                  <strong>PIC:</strong> {selectedSurvey.profile_name || 'N/A'}
                </div>
                <div>
                  <strong>Tahun:</strong> {selectedSurvey.tahun}
                </div>
                <div>
                  <strong>Tanggal Kirim:</strong> {new Date(selectedSurvey.created_at).toLocaleDateString('id-ID')}
                </div>
                <div>
                  <strong>Nilai Self Assessment:</strong> {selectedSurvey.self_assessment_score ? selectedSurvey.self_assessment_score.toFixed(2) : '-'}
                </div>
                <div>
                  <strong>Status:</strong> {getStatusBadge(selectedSurvey.is_verified)}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Jawaban Survei</h3>
              <div className="space-y-4">
                {Array.isArray(selectedSurvey.jawaban) && selectedSurvey.jawaban.map((item: SurveyAnswer, index: number) => {
                  const verificationAnswer = selectedSurvey.verification_answers?.[index];
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <strong>Pertanyaan:</strong>
                          <p className="mt-1">{item.pertanyaan || 'N/A'}</p>
                        </div>
                        <div>
                          <strong>Jawaban Self Assessment:</strong>
                          <p className="mt-1 font-medium">{item.jawaban || 'N/A'}</p>
                        </div>
                        <div>
                          <strong>Jawaban Verifikator:</strong>
                          <p className="mt-1 font-medium text-green-600">
                            {verificationAnswer?.jawaban || 'Belum diverifikasi'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleAction(selectedSurvey);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Verifikasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Verifikasi/Tolak */}
      {isModalOpen && selectedSurvey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Verifikasi Survei
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Instansi:</strong> {selectedSurvey.instansi_name || `Instansi ${selectedSurvey.instansi_id}`}
                </div>
                <div>
                  <strong>PIC:</strong> {selectedSurvey.profile_name || 'N/A'}
                </div>
                <div>
                  <strong>Tahun:</strong> {selectedSurvey.tahun}
                </div>
                <div>
                  <strong>Nilai Self Assessment:</strong> {selectedSurvey.self_assessment_score ? selectedSurvey.self_assessment_score.toFixed(2) : '-'}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Edit Jawaban Per Item</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {Array.isArray(selectedSurvey.jawaban) && selectedSurvey.jawaban.map((item: SurveyAnswer, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="mb-3">
                      <strong>Pertanyaan:</strong>
                      <p className="mt-1 text-sm">{item.pertanyaan || 'N/A'}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Jawaban Self Assessment
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.jawaban || ''}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Jawaban Verifikator *
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={verificationAnswers[index]?.jawaban || ''}
                          onChange={(e) => {
                            const newAnswers = [...verificationAnswers];
                            newAnswers[index] = {
                              ...newAnswers[index],
                              pertanyaan: item.pertanyaan,
                              jawaban: e.target.value
                            };
                            setVerificationAnswers(newAnswers);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Masukkan nilai (0-100)"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                onClick={handleSubmitAction}
                className={`px-4 py-2 text-white rounded-md font-medium bg-green-600 hover:bg-green-700 disabled:opacity-50`}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Menyimpan...'
                  : 'Verifikasi'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}