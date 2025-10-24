"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    nip: '',
    email: '',
    position: '',
    unit: '',
    instansiType: '',
    instansi: '',
    contact: '',
  })

  // when true, keep `instansi` in sync with `name` (user can uncheck to edit manually)
  const [useNameAsInstansi, setUseNameAsInstansi] = useState(true)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Nama lengkap wajib diisi'
    if (!formData.nip.trim()) newErrors.nip = 'NIP wajib diisi'
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }
    if (!formData.position.trim()) newErrors.position = 'Jabatan wajib diisi'
    if (!formData.unit.trim()) newErrors.unit = 'Unit Kerja wajib diisi'
    if (!formData.instansiType.trim()) newErrors.instansiType = 'Jenis Instansi wajib diisi'
    if (!formData.instansi.trim()) newErrors.instansi = 'Instansi wajib diisi'
    if (!formData.contact.trim()) {
      newErrors.contact = 'Nomor kontak wajib diisi'
    } else if (!/^[\+]?\d{10,15}$/.test(formData.contact)) {
      newErrors.contact = 'Format nomor kontak tidak valid'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // auto-sync instansi with name when enabled
      ...(field === 'name' && useNameAsInstansi ? { instansi: value } : {}),
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }

    // if user types into instansi, disable auto-sync
    if (field === 'instansi') setUseNameAsInstansi(false)
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
      <div className="min-h-screen bg-white flex items-center justify-center">
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
    <div className="min-h-screen bg-white">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap *</label>
                  <Input value={formData.name} onChange={e => handleInputChange('name', e.target.value)} placeholder="Masukkan nama lengkap" className={errors.name ? 'border-red-500' : ''} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                {/* NIP */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">NIP *</label>
                  <Input value={formData.nip} onChange={e => handleInputChange('nip', e.target.value)} placeholder="Masukkan NIP" className={errors.nip ? 'border-red-500' : ''} />
                  {errors.nip && <p className="text-red-500 text-xs mt-1">{errors.nip}</p>}
                </div>
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <Input type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} placeholder="contoh@email.com" className={errors.email ? 'border-red-500' : ''} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                {/* Jabatan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jabatan *</label>
                  <Input value={formData.position} onChange={e => handleInputChange('position', e.target.value)} placeholder="Jabatan" className={errors.position ? 'border-red-500' : ''} />
                  {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
                </div>
                {/* Unit Kerja */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit Kerja *</label>
                  <Input value={formData.unit} onChange={e => handleInputChange('unit', e.target.value)} placeholder="Unit Kerja" className={errors.unit ? 'border-red-500' : ''} />
                  {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit}</p>}
                </div>
                {/* Jenis Instansi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Instansi *</label>
                  <Input value={formData.instansiType} onChange={e => handleInputChange('instansiType', e.target.value)} placeholder="Kementerian, Lembaga, Pemda, dll" className={errors.instansiType ? 'border-red-500' : ''} />
                  {errors.instansiType && <p className="text-red-500 text-xs mt-1">{errors.instansiType}</p>}
                </div>
                {/* Checkbox to control auto-fill of Instansi */}
                <div className="flex items-center gap-2">
                  <input id="useNameAsInstansi" type="checkbox" checked={useNameAsInstansi} onChange={e => {
                    const checked = e.target.checked
                    setUseNameAsInstansi(checked)
                    if (checked) setFormData(prev => ({ ...prev, instansi: prev.name }))
                  }} className="h-4 w-4" />
                  <label htmlFor="useNameAsInstansi" className="text-sm text-gray-700">Gunakan Nama sebagai Instansi</label>
                </div>

                {/* Instansi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instansi *</label>
                  <Input value={formData.instansi} onChange={e => handleInputChange('instansi', e.target.value)} placeholder="Nama Instansi" className={errors.instansi ? 'border-red-500' : ''} disabled={useNameAsInstansi} />
                  {errors.instansi && <p className="text-red-500 text-xs mt-1">{errors.instansi}</p>}
                </div>
                {/* Nomor Kontak */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Kontak *</label>
                  <Input value={formData.contact} onChange={e => handleInputChange('contact', e.target.value)} placeholder="Nomor Kontak" className={errors.contact ? 'border-red-500' : ''} />
                  {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
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
