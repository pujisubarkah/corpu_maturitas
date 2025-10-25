import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import { pertanyaanKompetensi } from '../../../lib/schemas/pertanyaan_kompetensi'
import { eq } from 'drizzle-orm'

// Type definitions
interface InsertData {
  kode?: string;
  pertanyaan: string;
  deskripsi?: string;
  kategori_id?: number;
  tipe_jawaban?: string;
  urutan?: number;
  is_required?: boolean;
}

interface UpdateData {
  kode?: string;
  pertanyaan?: string;
  deskripsi?: string;
  kategori_id?: number;
  tipe_jawaban?: string;
  urutan?: number;
  is_required?: boolean;
}

// GET: list all or get by id (query ?id=)
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const idParam = url.searchParams.get('id')

    if (idParam) {
      const id = Number(idParam)
      if (Number.isNaN(id)) {
        return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 })
      }
      const rows = await db.select().from(pertanyaanKompetensi).where(eq(pertanyaanKompetensi.id, id)).limit(1)
      return NextResponse.json({ success: true, data: rows.length ? rows[0] : null })
    }

    const data = await db.select().from(pertanyaanKompetensi)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('GET pertanyaan_kompetensi error:', error)
    return NextResponse.json({ success: false, message: 'Gagal mengambil data' }, { status: 500 })
  }
}

// POST: create new
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown

    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ success: false, message: 'Invalid body' }, { status: 400 })
    }

    const {
      kode,
      pertanyaan,
      deskripsi,
      kategori_id,
      tipe_jawaban,
      urutan,
      is_required,
    } = body as Record<string, unknown>

    if (!pertanyaan || typeof pertanyaan !== 'string') {
      return NextResponse.json({ success: false, message: 'Field pertanyaan wajib diisi' }, { status: 400 })
    }

    const values = {
      kode: typeof kode === 'string' ? kode : undefined,
      pertanyaan: String(pertanyaan),
      deskripsi: typeof deskripsi === 'string' ? deskripsi : undefined,
      kategori_id: typeof kategori_id === 'number' ? kategori_id : kategori_id ? Number(kategori_id) : undefined,
      tipe_jawaban: typeof tipe_jawaban === 'string' ? tipe_jawaban : undefined,
      urutan: typeof urutan === 'number' ? urutan : urutan ? Number(urutan) : undefined,
      is_required: typeof is_required === 'boolean' ? is_required : is_required ? Boolean(is_required) : true,
    }

    const [inserted] = await db.insert(pertanyaanKompetensi).values(values as InsertData).returning()
    return NextResponse.json({ success: true, data: inserted })
  } catch (error) {
    console.error('POST pertanyaan_kompetensi error:', error)
    return NextResponse.json({ success: false, message: 'Gagal menambahkan data' }, { status: 500 })
  }
}

// PUT: update existing by id (body must include id)
export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>
    const id = body.id ?? body['Id']
    const idNum = typeof id === 'number' ? id : id ? Number(id) : NaN
    if (Number.isNaN(idNum)) {
      return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (body.kode) updateData.kode = body.kode
    if (body.pertanyaan) updateData.pertanyaan = body.pertanyaan
    if (body.deskripsi) updateData.deskripsi = body.deskripsi
    if (body.kategori_id) updateData.kategori_id = typeof body.kategori_id === 'number' ? body.kategori_id : Number(body.kategori_id)
    if (body.tipe_jawaban) updateData.tipe_jawaban = body.tipe_jawaban
    if (body.urutan) updateData.urutan = typeof body.urutan === 'number' ? body.urutan : Number(body.urutan)
    if (typeof body.is_required === 'boolean') updateData.is_required = body.is_required

    await db.update(pertanyaanKompetensi).set(updateData as UpdateData).where(eq(pertanyaanKompetensi.id, idNum))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PUT pertanyaan_kompetensi error:', error)
    return NextResponse.json({ success: false, message: 'Gagal memperbarui data' }, { status: 500 })
  }
}

// DELETE: delete by id in body or query param
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const idParam = url.searchParams.get('id')
    let id: number | undefined
    if (idParam) id = Number(idParam)
    else {
      const body = (await request.json()) as Record<string, unknown>
      const idBody = body?.id
      if (typeof idBody === 'number') id = idBody
      else if (idBody) id = Number(idBody)
    }

    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 })
    }

    await db.delete(pertanyaanKompetensi).where(eq(pertanyaanKompetensi.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE pertanyaan_kompetensi error:', error)
    return NextResponse.json({ success: false, message: 'Gagal menghapus data' }, { status: 500 })
  }
}
