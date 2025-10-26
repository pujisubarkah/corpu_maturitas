import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import { masterInstansiType as instansi } from '../../../lib/schemas/instansi'
import { profile } from '../../../lib/schemas/profile'
import { jawabanDetail } from '../../../lib/schemas/jawaban_detail'
import { count, sql } from 'drizzle-orm'

// GET: Get dashboard summary data
export async function GET() {
  try {
    // Jumlah Instansi
    const jumlahInstansi = await db
      .select({ count: count() })
      .from(instansi)
      .then(result => result[0]?.count || 0)

    // Jumlah PIC (dari tabel profile)
    const jumlahPIC = await db
      .select({ count: count() })
      .from(profile)
      .then(result => result[0]?.count || 0)

    // Nilai Rata-rata (dari tabel jawaban_detail, mengambil rata-rata skor)
    const nilaiRataRata = await db
      .select({
        avg: sql<number>`AVG(CAST(${jawabanDetail.jawaban} AS DECIMAL))`
      })
      .from(jawabanDetail)
      .then(result => {
        const avgValue = result[0]?.avg
        return avgValue ? Math.round(avgValue * 100) / 100 : 0
      })

    // Jumlah Pengajuan (dari tabel jawaban_detail, distinct jawaban_id)
    const jumlahPengajuan = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${jawabanDetail.jawaban_id})` })
      .from(jawabanDetail)
      .then(result => result[0]?.count || 0)

    return NextResponse.json({
      success: true,
      data: {
        jumlahInstansi,
        jumlahPIC,
        nilaiRataRata,
        jumlahPengajuan
      }
    })
  } catch (error) {
    console.error('GET dashboard summary error:', error)
    return NextResponse.json({ success: false, message: 'Gagal mengambil data dashboard' }, { status: 500 })
  }
}