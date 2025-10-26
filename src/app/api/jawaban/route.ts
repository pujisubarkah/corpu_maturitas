import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import { jawaban } from '../../../lib/schemas/jawaban'
import { masterInstansiType } from '../../../lib/schemas/instansi'
import { eq, and } from 'drizzle-orm'

// Type definitions
interface JawabanItem {
  kategori_id: number;
  kategori_nama: string;
  pertanyaan_id: number;
  pertanyaan_kode: string | null;
  pertanyaan: string | null;
  jawaban: string | number;
  tipe_jawaban: string | null;
  urutan: number | null;
}

interface JawabanInsert {
  instansi_id: number;
  tahun: number;
  jawaban: JawabanItem[];
}

interface JawabanUpdate {
  instansi_id?: number;
  tahun?: number;
  jawaban?: JawabanItem[];
}

// GET: Get jawaban by id, or by instansi_id and tahun, or get all
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const idParam = url.searchParams.get('id')
    const instansiIdParam = url.searchParams.get('instansi_id')
    const tahunParam = url.searchParams.get('tahun')

    // Get by id
    if (idParam) {
      const id = Number(idParam)
      if (Number.isNaN(id)) {
        return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 })
      }
      const rows = await db
        .select({
          id: jawaban.id,
          instansi_id: jawaban.instansi_id,
          nama_instansi: masterInstansiType.nama_instansi,
          tahun: jawaban.tahun,
          jawaban: jawaban.jawaban,
          verification_answers: jawaban.verification_answers,
          is_verified: jawaban.is_verified,
          verified_by: jawaban.verified_by,
          verified_at: jawaban.verified_at,
          created_at: jawaban.created_at,
          updated_at: jawaban.updated_at
        })
        .from(jawaban)
        .leftJoin(masterInstansiType, eq(jawaban.instansi_id, masterInstansiType.instansi_id))
        .where(eq(jawaban.id, id))
        .limit(1)
      return NextResponse.json({
        success: true,
        data: rows.length ? rows[0] : null
      })
    }

    // Get by instansi_id and tahun
    if (instansiIdParam && tahunParam) {
      const instansiId = Number(instansiIdParam)
      const tahun = Number(tahunParam)

      if (Number.isNaN(instansiId) || Number.isNaN(tahun)) {
        return NextResponse.json({ success: false, message: 'Invalid instansi_id or tahun' }, { status: 400 })
      }

      const rows = await db
        .select({
          id: jawaban.id,
          instansi_id: jawaban.instansi_id,
          nama_instansi: masterInstansiType.nama_instansi,
          tahun: jawaban.tahun,
          jawaban: jawaban.jawaban,
          verification_answers: jawaban.verification_answers,
          is_verified: jawaban.is_verified,
          verified_by: jawaban.verified_by,
          verified_at: jawaban.verified_at,
          created_at: jawaban.created_at,
          updated_at: jawaban.updated_at
        })
        .from(jawaban)
        .leftJoin(masterInstansiType, eq(jawaban.instansi_id, masterInstansiType.instansi_id))
        .where(and(eq(jawaban.instansi_id, instansiId), eq(jawaban.tahun, tahun)))
        .limit(1)

      return NextResponse.json({
        success: true,
        data: rows.length ? rows[0] : null
      })
    }

    // Get all jawaban
    const rows = await db
      .select({
        id: jawaban.id,
        instansi_id: jawaban.instansi_id,
        nama_instansi: masterInstansiType.nama_instansi,
        tahun: jawaban.tahun,
        jawaban: jawaban.jawaban,
        verification_answers: jawaban.verification_answers,
        is_verified: jawaban.is_verified,
        verified_by: jawaban.verified_by,
        verified_at: jawaban.verified_at,
        created_at: jawaban.created_at,
        updated_at: jawaban.updated_at
      })
      .from(jawaban)
      .leftJoin(masterInstansiType, eq(jawaban.instansi_id, masterInstansiType.instansi_id))
      .orderBy(jawaban.created_at)
    return NextResponse.json({
      success: true,
      data: rows
    })
  } catch (error) {
    console.error('GET jawaban error:', error)
    return NextResponse.json({ success: false, message: 'Gagal mengambil data jawaban' }, { status: 500 })
  }
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

    if (!jawabanData || !Array.isArray(jawabanData)) {
      return NextResponse.json({ success: false, message: 'jawaban wajib diisi dan harus berupa array' }, { status: 400 })
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
      jawaban: jawabanData as JawabanItem[],
    }

    const [inserted] = await db.insert(jawaban).values(values).returning()
    
    // Get inserted record with nama_instansi
    const [result] = await db
      .select({
        id: jawaban.id,
        instansi_id: jawaban.instansi_id,
        nama_instansi: masterInstansiType.nama_instansi,
        tahun: jawaban.tahun,
        jawaban: jawaban.jawaban,
        verification_answers: jawaban.verification_answers,
        is_verified: jawaban.is_verified,
        verified_by: jawaban.verified_by,
        verified_at: jawaban.verified_at,
        created_at: jawaban.created_at,
        updated_at: jawaban.updated_at
      })
      .from(jawaban)
      .leftJoin(masterInstansiType, eq(jawaban.instansi_id, masterInstansiType.instansi_id))
      .where(eq(jawaban.id, inserted.id))
      .limit(1)
    
    return NextResponse.json({
      success: true,
      data: result,
      message: 'Jawaban berhasil disimpan'
    })
  } catch (error) {
    console.error('POST jawaban error:', error)
    return NextResponse.json({ success: false, message: 'Gagal menyimpan jawaban' }, { status: 500 })
  }
}

// PUT: Update existing jawaban by id
export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as unknown

    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ success: false, message: 'Invalid body' }, { status: 400 })
    }

    const { id, instansi_id, tahun, jawaban: jawabanData } = body as Record<string, unknown>

    if (!id || typeof id !== 'number') {
      return NextResponse.json({ success: false, message: 'id wajib diisi dan harus berupa angka' }, { status: 400 })
    }

    // Check if jawaban exists
    const existing = await db
      .select()
      .from(jawaban)
      .where(eq(jawaban.id, id as number))
      .limit(1)

    if (existing.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Jawaban tidak ditemukan'
      }, { status: 404 })
    }

    const updateData: JawabanUpdate = {}

    if (instansi_id !== undefined) {
      if (typeof instansi_id !== 'number') {
        return NextResponse.json({ success: false, message: 'instansi_id harus berupa angka' }, { status: 400 })
      }
      updateData.instansi_id = instansi_id as number
    }

    if (tahun !== undefined) {
      if (typeof tahun !== 'number') {
        return NextResponse.json({ success: false, message: 'tahun harus berupa angka' }, { status: 400 })
      }
      updateData.tahun = tahun as number
    }

    if (jawabanData !== undefined) {
      if (!Array.isArray(jawabanData)) {
        return NextResponse.json({ success: false, message: 'jawaban harus berupa array' }, { status: 400 })
      }
      updateData.jawaban = jawabanData as JawabanItem[]
    }

    await db.update(jawaban).set(updateData).where(eq(jawaban.id, id as number))

    // Get updated record
    const [updated] = await db
      .select({
        id: jawaban.id,
        instansi_id: jawaban.instansi_id,
        nama_instansi: masterInstansiType.nama_instansi,
        tahun: jawaban.tahun,
        jawaban: jawaban.jawaban,
        verification_answers: jawaban.verification_answers,
        is_verified: jawaban.is_verified,
        verified_by: jawaban.verified_by,
        verified_at: jawaban.verified_at,
        created_at: jawaban.created_at,
        updated_at: jawaban.updated_at
      })
      .from(jawaban)
      .leftJoin(masterInstansiType, eq(jawaban.instansi_id, masterInstansiType.instansi_id))
      .where(eq(jawaban.id, id as number))
      .limit(1)

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Jawaban berhasil diperbarui'
    })
  } catch (error) {
    console.error('PUT jawaban error:', error)
    return NextResponse.json({ success: false, message: 'Gagal memperbarui jawaban' }, { status: 500 })
  }
}

// DELETE: Delete jawaban by id
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const idParam = url.searchParams.get('id')

    let id: number | undefined

    if (idParam) {
      id = Number(idParam)
    } else {
      const body = (await request.json()) as unknown
      if (typeof body === 'object' && body !== null) {
        const { id: bodyId } = body as Record<string, unknown>
        if (typeof bodyId === 'number') {
          id = bodyId
        } else if (bodyId) {
          id = Number(bodyId)
        }
      }
    }

    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ success: false, message: 'id wajib diisi dan harus berupa angka' }, { status: 400 })
    }

    // Check if jawaban exists
    const existing = await db
      .select()
      .from(jawaban)
      .where(eq(jawaban.id, id))
      .limit(1)

    if (existing.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Jawaban tidak ditemukan'
      }, { status: 404 })
    }

    await db.delete(jawaban).where(eq(jawaban.id, id))

    return NextResponse.json({
      success: true,
      message: 'Jawaban berhasil dihapus'
    })
  } catch (error) {
    console.error('DELETE jawaban error:', error)
    return NextResponse.json({ success: false, message: 'Gagal menghapus jawaban' }, { status: 500 })
  }
}