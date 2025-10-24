"use client";
import { useParams } from "next/navigation";

export default function SurveiPage() {
  const params = useParams();
  const slug = params?.slug;

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">Halaman Survei Dummy</h1>
        <p className="text-lg text-gray-700 mb-6">
          Survei untuk pengguna: <span className="font-semibold text-blue-700">{slug}</span>
        </p>
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-blue-800 mb-2">Pertanyaan Dummy 1</p>
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="Jawaban Anda..." />
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-blue-800 mb-2">Pertanyaan Dummy 2</p>
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="Jawaban Anda..." />
          </div>
          <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg mt-6 hover:bg-blue-700 transition">Kirim Jawaban Dummy</button>
        </div>
      </div>
    </main>
  );
}
