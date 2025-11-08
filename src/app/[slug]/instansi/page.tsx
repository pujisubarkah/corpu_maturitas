"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

interface Instansi {
  id: number;
  nama_instansi: string;
  kat_instansi: string;
}

interface KompetensiData {
  nama?: string;
  tahun?: string;
  skor?: string;
  // Add other fields as needed
}

export default function InstansiPage() {
  const [instansiList, setInstansiList] = useState<Instansi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Kompetensi generik nasional profile data
  const [kompetensiData, setKompetensiData] = useState<KompetensiData | null>(null);
  const [kompetensiLoading, setKompetensiLoading] = useState(false);
  const [kompetensiError, setKompetensiError] = useState<string | null>(null);
  // Dummy currentUser and tahun, replace with actual logic if available
  const currentUser = null;
  const tahun = new Date().getFullYear().toString();

  useEffect(() => {
    let userId: string | number | undefined = undefined;
    let tahunVal: string = tahun;
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const userIdParam = searchParams.get('userId');
      const tahunParam = searchParams.get('tahun');
      if (userIdParam) userId = userIdParam;
      if (tahunParam) tahunVal = tahunParam;
    }
    if (userId && tahunVal) {
      setKompetensiLoading(true);
      setKompetensiError(null);
      fetch(`/api/kompetensi_generik_nasional?userId=${userId}&tahun=${tahunVal}`)
        .then(res => res.json())
        .then(result => {
          if (result.data && result.data.length > 0) {
            setKompetensiData(result.data[0]);
          } else {
            setKompetensiData(null);
          }
        })
        .catch((error) => {
          console.error('Error fetching kompetensi data:', error);
          setKompetensiError('Gagal memuat data kompetensi');
          setKompetensiData(null);
        })
        .finally(() => setKompetensiLoading(false));
    }
  }, [currentUser, tahun]);

  useEffect(() => {
    const fetchInstansi = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/instansi-type");
        const result = await response.json();
        if (result.success && result.data) {
          setInstansiList(result.data);
        } else {
          setError("Gagal memuat data instansi");
        }
      } catch {
        setError("Terjadi kesalahan saat memuat data");
      } finally {
        setLoading(false);
      }
    };
    fetchInstansi();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-600">Memuat data instansi...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Instansi</h1>
          <p className="text-lg text-gray-600">Informasi profil instansi yang terdaftar</p>
        </div>
        {/* Kompetensi Generik Nasional Profile Section */}
        <div className="mt-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Profil Kompetensi Generik Nasional</h2>
          {kompetensiLoading ? (
            <div className="text-gray-500">Memuat data kompetensi...</div>
          ) : kompetensiError ? (
            <div className="text-red-500">{kompetensiError}</div>
          ) : kompetensiData ? (
            <div className="bg-gray-50 p-4 rounded shadow">
              <div className="mb-2"><span className="font-semibold">Nama:</span> {kompetensiData.nama || '-'}</div>
              <div className="mb-2"><span className="font-semibold">Tahun:</span> {kompetensiData.tahun || '-'}</div>
              <div className="mb-2"><span className="font-semibold">Skor:</span> {kompetensiData.skor || '-'}</div>
              {/* Tambahkan field lain sesuai kebutuhan */}
            </div>
          ) : (
            <div className="text-gray-500">Data kompetensi tidak ditemukan.</div>
          )}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Instansi</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Instansi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {instansiList.map((instansi) => (
                  <tr key={instansi.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{instansi.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 font-semibold">{instansi.nama_instansi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{instansi.kat_instansi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
