"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    company: '',
    phone: '',
    location: '',
    education: '',
    experience: '',
    age: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Jabatan wajib diisi'
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Departemen wajib diisi'
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Perusahaan/Instansi wajib diisi'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor telepon wajib diisi'
    } else if (!/^[\+]?[0-9\-\s]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Format nomor telepon tidak valid'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Lokasi wajib diisi'
    }

    if (!formData.education.trim()) {
      newErrors.education = 'Pendidikan terakhir wajib diisi'
    }

    if (!formData.experience.trim()) {
      newErrors.experience = 'Pengalaman kerja wajib diisi'
    }

    if (!formData.age.trim()) {
      newErrors.age = 'Usia wajib diisi'
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 18 || Number(formData.age) > 70) {
      newErrors.age = 'Usia harus berupa angka antara 18-70 tahun'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Store in localStorage for now
      localStorage.setItem('userProfile', JSON.stringify(formData))
      
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Terjadi kesalahan saat menyimpan data. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profil Berhasil Disimpan!</h2>
            <p className="text-gray-600 mb-6">
              Data profil Anda telah berhasil disimpan. Sekarang Anda dapat mengikuti survey maturitas.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.href = '/input-survey'} 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Mulai Survey
              </Button>
              <Button 
                onClick={() => window.location.href = '/'} 
                variant="outline" 
                className="w-full"
              >
                Kembali ke Beranda
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Lengkapi Profil Anda</h1>
            <p className="text-gray-600 mt-2">
              Mohon isi data profil berikut untuk melanjutkan ke survey maturitas Corporate University
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Informasi Personal</CardTitle>
            <p className="text-sm text-gray-600">
              Semua field bertanda (*) wajib diisi. Data ini akan digunakan untuk analisis hasil survey.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama Lengkap */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                    placeholder="contoh@email.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Jabatan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jabatan *
                  </label>
                  <Input
                    value={formData.position}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('position', e.target.value)}
                    placeholder="Manager, Staff, Direktur, dll"
                    className={errors.position ? 'border-red-500' : ''}
                  />
                  {errors.position && (
                    <p className="text-red-500 text-xs mt-1">{errors.position}</p>
                  )}
                </div>

                {/* Departemen */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departemen *
                  </label>
                  <Input
                    value={formData.department}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('department', e.target.value)}
                    placeholder="HR, IT, Finance, Operations, dll"
                    className={errors.department ? 'border-red-500' : ''}
                  />
                  {errors.department && (
                    <p className="text-red-500 text-xs mt-1">{errors.department}</p>
                  )}
                </div>

                {/* Perusahaan/Instansi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Perusahaan/Instansi *
                  </label>
                  <Input
                    value={formData.company}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('company', e.target.value)}
                    placeholder="Nama perusahaan atau instansi"
                    className={errors.company ? 'border-red-500' : ''}
                  />
                  {errors.company && (
                    <p className="text-red-500 text-xs mt-1">{errors.company}</p>
                  )}
                </div>

                {/* Nomor Telepon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon *
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value)}
                    placeholder="+62 812 3456 7890"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Lokasi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lokasi Kerja *
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('location', e.target.value)}
                    placeholder="Jakarta, Surabaya, Bandung, dll"
                    className={errors.location ? 'border-red-500' : ''}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                  )}
                </div>

                {/* Pendidikan Terakhir */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pendidikan Terakhir *
                  </label>
                  <select
                    value={formData.education}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('education', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.education ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Pilih pendidikan terakhir</option>
                    <option value="SMA/SMK">SMA/SMK</option>
                    <option value="D3">Diploma 3 (D3)</option>
                    <option value="S1">Sarjana (S1)</option>
                    <option value="S2">Magister (S2)</option>
                    <option value="S3">Doktor (S3)</option>
                  </select>
                  {errors.education && (
                    <p className="text-red-500 text-xs mt-1">{errors.education}</p>
                  )}
                </div>

                {/* Pengalaman Kerja */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pengalaman Kerja *
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('experience', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.experience ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Pilih pengalaman kerja</option>
                    <option value="< 1 tahun">Kurang dari 1 tahun</option>
                    <option value="1-3 tahun">1-3 tahun</option>
                    <option value="4-6 tahun">4-6 tahun</option>
                    <option value="7-10 tahun">7-10 tahun</option>
                    <option value="> 10 tahun">Lebih dari 10 tahun</option>
                  </select>
                  {errors.experience && (
                    <p className="text-red-500 text-xs mt-1">{errors.experience}</p>
                  )}
                </div>

                {/* Usia */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usia *
                  </label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('age', e.target.value)}
                    placeholder="25"
                    min="18"
                    max="70"
                    className={errors.age ? 'border-red-500' : ''}
                  />
                  {errors.age && (
                    <p className="text-red-500 text-xs mt-1">{errors.age}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t">
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.location.href = '/'}
                  >
                    Kembali
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Menyimpan...
                      </div>
                    ) : (
                      'Simpan & Lanjutkan'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Box */}
        <div className="mt-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className="text-blue-600 mr-3 mt-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Informasi Privasi</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Data yang Anda masukkan akan digunakan untuk keperluan analisis survey dan akan dijaga kerahasiaannya sesuai dengan kebijakan privasi perusahaan.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
