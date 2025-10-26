"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

export default function ProfilePage() {
  const params = useParams()
  const slug = params?.slug as string

  const [formData, setFormData] = useState({
    name: '',
    nip: '',
    email: '',
    position: '',
    unit: '',
    contact: '',
    instansi: '',
    instansiKategori: '',
  })

  const [currentUser, setCurrentUser] = useState<{
    id: number;
    username: string;
    fullName?: string;
    full_name?: string;
    instansiId?: number;
  } | null>(null)
  const [instansiKategoriOptions, setInstansiKategoriOptions] = useState<Array<{id: number, kat_instansi: string}>>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Load current user from localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem('currentUser')
      if (userData) {
        const user = JSON.parse(userData)
        setCurrentUser(user)
      }
    } catch (error) {
      console.warn('Failed to load current user from localStorage:', error)
    }
  }, [])

  // Set instansi automatically when currentUser is loaded
  useEffect(() => {
    const loadInstansiData = async () => {
      if (currentUser?.instansiId) {
        try {
          // Fetch instansi data from API
          const response = await fetch(`/api/master-instansi-type/${currentUser.instansiId}`)
          const result = await response.json()

          if (result.success && result.data) {
            const { nama_instansi, kat_instansi } = result.data

            // Update form data with instansi name
            setFormData(prev => ({
              ...prev,
              instansi: nama_instansi
            }))

            // Find and set kategori instansi ID based on kat_instansi
            const kategoriOption = instansiKategoriOptions.find(
              option => option.kat_instansi === kat_instansi
            )
            if (kategoriOption) {
              setFormData(prev => ({
                ...prev,
                instansiKategori: kategoriOption.id.toString()
              }))
            }
          }
        } catch (error) {
          console.warn('Failed to load instansi data:', error)
          // Fallback: just set instansiId as string if available
          if (currentUser?.instansiId) {
            setFormData(prev => ({
              ...prev,
              instansi: currentUser.instansiId ? currentUser.instansiId.toString() : ''
            }))
          }
        }
      }
    }

    if (currentUser?.instansiId && instansiKategoriOptions.length > 0) {
      loadInstansiData()
    }
  }, [currentUser, instansiKategoriOptions])

  // Load instansi kategori options
  useEffect(() => {
    const loadInstansiKategori = async () => {
      try {
        const response = await fetch('/api/instansi-type')
        const result = await response.json()
        
        if (result.success) {
          setInstansiKategoriOptions(result.data)
        }
      } catch (error) {
        console.warn('Failed to load instansi kategori:', error)
      }
    }
    
    loadInstansiKategori()
  }, [])

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
      // Generate a unique ID for the profile (using timestamp for demo)
      const profileId = Date.now()
      
      // Prepare data for API
      const profileData = {
        id: profileId,
        nama_lengkap: formData.name,
        nip: formData.nip,
        email: formData.email,
        position: formData.position,
        unit: formData.unit,
        contact: formData.contact,
        instansi: formData.instansi, // Send instansi name, not ID
        ...(formData.instansiKategori && { instansi_type_id: parseInt(formData.instansiKategori) }),
        user_id: currentUser?.id || null,
        // Optional: user_id can be added when authentication is implemented
        // user_id: currentUserId,
      }

      // Call the profile API
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Gagal menyimpan profile')
      }

      const result = await response.json()

      if (result.success) {
        // Store profile data in localStorage for session management
        localStorage.setItem('userProfile', JSON.stringify({
          ...formData,
          id: profileId
        }))
        
        setIsSubmitted(true)
      } else {
        throw new Error(result.message || 'Gagal menyimpan profile')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      alert(`Terjadi kesalahan saat menyimpan data: ${error instanceof Error ? error.message : 'Unknown error'}. Silakan coba lagi.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if user is logged in
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Diperlukan</h2>
            <p className="text-gray-600 mb-6">
              Anda perlu login terlebih dahulu untuk mengisi profil.
            </p>
            <Button 
              onClick={() => window.location.href = '/login'} 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Login Sekarang
            </Button>
          </CardContent>
        </Card>
      </div>
    )
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
                onClick={() => window.location.href = `/${slug}/survei`} 
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
                {/* Nomor Kontak */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Kontak *</label>
                  <Input value={formData.contact} onChange={e => handleInputChange('contact', e.target.value)} placeholder="Nomor Kontak" className={errors.contact ? 'border-red-500' : ''} />
                  {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
                </div>
              </div>

              {/* Instansi - Full width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instansi</label>
                <Input
                  value={formData.instansi}
                  readOnly
                  className="bg-gray-50 cursor-not-allowed"
                  placeholder="Instansi akan terdeteksi otomatis dari data login"
                />
              </div>

              {/* Kategori Instansi - Full width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Instansi</label>
                <Input
                  value={instansiKategoriOptions.find(opt => opt.id.toString() === formData.instansiKategori)?.kat_instansi || ''}
                  readOnly
                  className="bg-gray-50 cursor-not-allowed"
                  placeholder="Kategori instansi akan terdeteksi otomatis dari data login"
                />
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
