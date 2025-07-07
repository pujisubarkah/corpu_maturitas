"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { BarChart3, PieChart, Users } from 'lucide-react';

// Dummy data untuk charts
const genderData = [
  { label: 'Laki-laki', value: 65, color: 'bg-blue-500' },
  { label: 'Perempuan', value: 35, color: 'bg-pink-500' }
];

const institutionData = [
  { label: 'Kementerian', value: 28, color: 'bg-blue-600' },
  { label: 'BUMN', value: 24, color: 'bg-green-600' },
  { label: 'Perusahaan Swasta', value: 22, color: 'bg-purple-600' },
  { label: 'Lembaga Pendidikan', value: 15, color: 'bg-orange-600' },
  { label: 'Organisasi Non-Profit', value: 11, color: 'bg-red-600' }
];

const educationData = [
  { label: 'S3/Doktor', value: 12, color: 'bg-indigo-600' },
  { label: 'S2/Magister', value: 45, color: 'bg-blue-600' },
  { label: 'S1/Sarjana', value: 35, color: 'bg-green-600' },
  { label: 'Diploma', value: 6, color: 'bg-yellow-600' },
  { label: 'SMA/SMK', value: 2, color: 'bg-gray-600' }
];

const totalResponses = 1247;
const responseRate = 78;

export default function ChartSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Statistik Responden Survey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Data analitik dari {totalResponses.toLocaleString()} responden yang telah mengikuti 
            survey maturitas corporate university di Indonesia
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {totalResponses.toLocaleString()}
              </div>
              <p className="text-gray-600 font-medium">Total Responden</p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {responseRate}%
              </div>
              <p className="text-gray-600 font-medium">Response Rate</p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PieChart className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                156
              </div>
              <p className="text-gray-600 font-medium">Organisasi</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Gender Chart */}
          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <PieChart className="h-5 w-5 text-blue-600" />
                Berdasarkan Jenis Kelamin
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Donut Chart Visualization */}
              <div className="flex justify-center mb-6">
                <div className="relative w-40 h-40">
                  <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 35 * (genderData[0].value / 100)} ${2 * Math.PI * 35}`}
                      className="text-blue-500"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 35 * (genderData[1].value / 100)} ${2 * Math.PI * 35}`}
                      strokeDashoffset={`-${2 * Math.PI * 35 * (genderData[0].value / 100)}`}
                      className="text-pink-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">65%</div>
                      <div className="text-xs text-gray-600">Laki-laki</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {genderData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Institution Chart */}
          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Berdasarkan Instansi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {institutionData.map((item, index) => (
                  <div key={index} className="group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${item.color} transition-all duration-700 group-hover:scale-105`}
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Education Chart */}
          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Berdasarkan Pendidikan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Bar Chart Visualization */}
              <div className="mb-6 flex items-end justify-center space-x-3 h-32 bg-gray-50 rounded-lg p-4">
                {educationData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center group">
                    <div className="text-xs font-medium text-gray-600 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.value}%
                    </div>
                    <div
                      className={`w-6 ${item.color} rounded-t transition-all duration-700 hover:scale-110`}
                      style={{ height: `${item.value * 2}px`, minHeight: '8px' }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2 text-center leading-tight">
                      {item.label.split('/')[0]}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                {educationData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm hover:bg-gray-50 p-2 rounded transition-colors">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${item.color}`}></div>
                      <span className="font-medium text-gray-700">{item.label}</span>
                    </div>
                    <span className="font-bold text-gray-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          
          {/* Response by Regions */}
          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                Responden Berdasarkan Wilayah
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  { region: 'Jawa', value: 45, color: 'bg-orange-500' },
                  { region: 'Sumatra', value: 20, color: 'bg-orange-400' },
                  { region: 'Kalimantan', value: 15, color: 'bg-orange-600' },
                  { region: 'Sulawesi', value: 12, color: 'bg-orange-300' },
                  { region: 'Papua & Maluku', value: 5, color: 'bg-orange-700' },
                  { region: 'Nusa Tenggara', value: 3, color: 'bg-orange-200' }
                ].map((item, index) => (
                  <div key={index} className="group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">{item.region}</span>
                      <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${item.color} transition-all duration-700 group-hover:scale-105`}
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Response by Role */}
          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-teal-100">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-teal-600" />
                Responden Berdasarkan Jabatan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  { role: 'Manajer/Direktur', value: 35, color: 'bg-teal-600' },
                  { role: 'Staff Senior', value: 28, color: 'bg-teal-500' },
                  { role: 'HR Manager', value: 20, color: 'bg-teal-400' },
                  { role: 'Training Manager', value: 12, color: 'bg-teal-300' },
                  { role: 'Lainnya', value: 5, color: 'bg-teal-200' }
                ].map((item, index) => (
                  <div key={index} className="group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">{item.role}</span>
                      <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${item.color} transition-all duration-700 group-hover:scale-105`}
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Insights */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Key Insights dari Data Responden
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">65%</div>
              <p className="text-gray-700 text-sm">
                Responden laki-laki mendominasi survey, menunjukkan tingginya partisipasi 
                male professionals dalam pengembangan corporate university
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">52%</div>
              <p className="text-gray-700 text-sm">
                Kementerian dan BUMN menjadi kontributor terbesar, mencerminkan 
                komitmen sektor publik terhadap pengembangan SDM
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">80%</div>
              <p className="text-gray-700 text-sm">
                Responden berpendidikan S1 ke atas, menunjukkan awareness yang tinggi 
                tentang pentingnya corporate university
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">45%</div>
              <p className="text-gray-700 text-sm">
                Responden dari Pulau Jawa mendominasi, namun partisipasi dari 
                wilayah lain juga menunjukkan minat yang signifikan
              </p>
            </div>
          </div>
          
          {/* Action Call */}
          <div className="mt-8 text-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Ingin berkontribusi dalam pengembangan Corporate University di Indonesia?
            </h4>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/input-survey" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
              >
                Ikuti Survey Maturitas
              </a>
              <a 
                href="/results" 
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
              >
                Lihat Contoh Hasil
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
