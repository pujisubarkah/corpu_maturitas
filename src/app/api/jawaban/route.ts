import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import { jawaban } from '../../../lib/schemas/jawaban'
import { eq, and } from 'drizzle-orm'

// Type definitions
interface JawabanInsert {
  instansi_id: number;
  tahun: number;
  jawaban: Record<string, unknown>;
}

// POST: Create new jawaban
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown

    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ success: false, message: 'Invalid body' }, { status: 400 })
    }

    const { instansi_id, tahun, jawaban: jawabanData } = body as Record<string, unknown>

    // Validation
    if (!instansi_id || typeof instansi_id !== 'number') {
      return NextResponse.json({ success: false, message: 'instansi_id wajib diisi dan harus berupa angka' }, { status: 400 })
    }

    if (!tahun || typeof tahun !== 'number') {
      return NextResponse.json({ success: false, message: 'tahun wajib diisi dan harus berupa angka' }, { status: 400 })
    }

    if (!jawabanData || typeof jawabanData !== 'object') {
      return NextResponse.json({ success: false, message: 'jawaban wajib diisi dan harus berupa object' }, { status: 400 })
    }

    // Check if jawaban already exists for this instansi_id and tahun
    const existing = await db
      .select()
      .from(jawaban)
      .where(and(eq(jawaban.instansi_id, instansi_id as number), eq(jawaban.tahun, tahun as number)))
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Jawaban untuk instansi dan tahun ini sudah ada. Gunakan PUT untuk update.'
      }, { status: 409 })
    }

    const values: JawabanInsert = {
      instansi_id: instansi_id as number,
      tahun: tahun as number,
      jawaban: jawabanData as Record<string, unknown>,
    }

    const [inserted] = await db.insert(jawaban).values(values).returning()
    return NextResponse.json({
      success: true,
      data: inserted,
      message: 'Jawaban berhasil disimpan'
    })
  } catch (error) {
    console.error('POST jawaban error:', error)
    return NextResponse.json({ success: false, message: 'Gagal menyimpan jawaban' }, { status: 500 })
  }
}