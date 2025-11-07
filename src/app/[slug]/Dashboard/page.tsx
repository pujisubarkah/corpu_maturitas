"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SummaryCard } from "../../../components/SummaryCard";
import { Building2, Users, TrendingUp, FileText } from "lucide-react";

interface DashboardData {
  jumlahInstansi: number;
  jumlahPIC: number;
  nilaiRataRata: number;
  jumlahPengajuan: number;
}

export default function UserDashboard() {
  const params = useParams();
  const slug = params?.slug;
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard-summary');
        const result = await response.json();
        if (result.success) {
          setDashboardData(result.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow p-8 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-lg text-gray-700">
            Selamat datang, <span className="font-semibold text-blue-700">{slug}</span>!
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Jumlah Instansi"
            value={loading ? "..." : dashboardData?.jumlahInstansi || 0}
            icon={Building2}
            description="Total instansi terdaftar"
          />
          <SummaryCard
            title="Jumlah PIC"
            value={loading ? "..." : dashboardData?.jumlahPIC || 0}
            icon={Users}
            description="Total person in charge"
          />
          <SummaryCard
            title="Nilai Rata-rata"
            value={loading ? "..." : dashboardData?.nilaiRataRata || 0}
            icon={TrendingUp}
            description="Rata-rata skor survey"
          />
          <SummaryCard
            title="Jumlah Pengajuan"
            value={loading ? "..." : dashboardData?.jumlahPengajuan || 0}
            icon={FileText}
            description="Total pengajuan survey"
          />
        </div>
      </div>
    </main>
  );
}
