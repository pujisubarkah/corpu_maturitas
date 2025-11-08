"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

interface Instansi {
  id: number;
  nama_instansi: string;
  kat_instansi: string;
}

export default function InstansiPage() {
  const [instansiList, setInstansiList] = useState<Instansi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
