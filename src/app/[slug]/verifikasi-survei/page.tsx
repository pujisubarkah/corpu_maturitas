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

interface SurveyData {
  id: number;
  instansi_id: number;
  nama_instansi: string;
  tahun: number;
  jawaban: JawabanItem[];
  verification_answers: JawabanItem[] | null;
  is_verified: boolean;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
  self_assessment_score?: number;
  verification_score?: number | null;
}

export default function VerificationSurveyPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;
  const [surveys, setSurveys] = useState<SurveyData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSurveys = async () => {
    try {
      // Get all surveys from jawaban API
      const response = await fetch('/api/jawaban');
      const result = await response.json();
      if (result.success) {
        // Calculate scores for each survey
        const surveysWithScores = result.data.map((survey: Omit<SurveyData, 'self_assessment_score' | 'verification_score'>) => {
          // Calculate self assessment score from jawaban (kategori_id 2-9)
          let selfAssessmentScore = 0;
          if (survey.jawaban && Array.isArray(survey.jawaban)) {
            selfAssessmentScore = survey.jawaban
              .filter((item: JawabanItem) => item.kategori_id >= 2 && item.kategori_id <= 9)
              .reduce((sum: number, item: JawabanItem) => {
                const value = typeof item.jawaban === 'number' ? item.jawaban : 
                             typeof item.jawaban === 'string' ? parseFloat(item.jawaban) || 0 : 0;
                return sum + value;
              }, 0);
          }

          // Calculate verification score from verification_answers if available
          let verificationScore = null;
          if (survey.verification_answers && Array.isArray(survey.verification_answers)) {
            verificationScore = survey.verification_answers
              .filter((item: JawabanItem) => item.kategori_id >= 2 && item.kategori_id <= 9)
              .reduce((sum: number, item: JawabanItem) => {
                const value = typeof item.jawaban === 'number' ? item.jawaban : 
                             typeof item.jawaban === 'string' ? parseFloat(item.jawaban) || 0 : 0;
                return sum + value;
              }, 0);
          }

          return {
            ...survey,
            self_assessment_score: selfAssessmentScore,
            verification_score: verificationScore
          };
        });
        setSurveys(surveysWithScores);
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
    if (score >= 3501 && score <= 4000) return 'Advanced';
    return 'Unknown';
  };

  const handleVerification = (survey: SurveyData) => {
    // Navigate to verification detail page
    router.push(`/${slug}/verifikasi-detail/${survey.id}`);
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
                      {survey.nama_instansi || `Instansi ${survey.instansi_id}`}
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

        {/* Pagination - Removed as per new requirements */}
        {/* Modal components removed as verification now redirects to survey page */}
      </div>
    </main>
  );
}