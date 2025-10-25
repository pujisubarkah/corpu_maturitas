import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import { opsiJawaban } from '../../../lib/schemas/opsi_jawaban'
import { pertanyaanKompetensi } from '../../../lib/schemas/pertanyaan_kompetensi'
import { eq } from 'drizzle-orm'

// Type definitions
interface OpsiJawabanData {
  id: number;
  pertanyaan_id: number | null;
  label: string | null;
  nilai: string | null;
  urutan: number | null;
  is_active: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
}

interface PertanyaanData {
  id: number;
  kode: string | null;
  pertanyaan: string | null;
}

interface GroupedData {
  pertanyaan: PertanyaanData;
  opsi_jawaban: OpsiJawabanData[];
}

interface RawDataItem {
  id: number;
  pertanyaan_id: number | null;
  label: string | null;
  nilai: string | null;
  urutan: number | null;
  is_active: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
  pertanyaan_kode: string | null;
  pertanyaan_text: string | null;
}

interface InsertData {
  pertanyaan_id: number;
  label: string;
  nilai?: string;
  urutan?: number;
  is_active?: boolean;
}

interface UpdateData {
  pertanyaan_id?: number;
  label?: string;
  nilai?: string;
  urutan?: number;
  is_active?: boolean;
}

// Helper function to group data
function groupOpsiJawabanData(rawData: RawDataItem[]): GroupedData[] {
  return rawData.reduce((acc: GroupedData[], item) => {
    const existingPertanyaan = acc.find(p => p.pertanyaan.id === item.pertanyaan_id)

    const opsiItem = {
      id: item.id,
      pertanyaan_id: item.pertanyaan_id,
      label: item.label,
      nilai: item.nilai,
      urutan: item.urutan,
      is_active: item.is_active,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }

    if (existingPertanyaan) {
      existingPertanyaan.opsi_jawaban.push(opsiItem)
    } else {
      acc.push({
        pertanyaan: {
          id: item.pertanyaan_id || 0,
          kode: item.pertanyaan_kode,
          pertanyaan: item.pertanyaan_text,
        },
        opsi_jawaban: [opsiItem]
      })
    }

    return acc
  }, [])
}

// GET: list all grouped by pertanyaan or get by id (query ?id=)
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const idParam = url.searchParams.get('id')
    const pertanyaanIdParam = url.searchParams.get('pertanyaan_id')

    if (idParam) {
      const id = Number(idParam)
      if (Number.isNaN(id)) {
        return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 })
      }
      const rows = await db.select().from(opsiJawaban).where(eq(opsiJawaban.id, id)).limit(1)
      return NextResponse.json({ success: true, data: rows.length ? rows[0] : null })
    }

    // Filter by pertanyaan_id if provided
    if (pertanyaanIdParam) {
      const pertanyaanId = Number(pertanyaanIdParam)
      if (!Number.isNaN(pertanyaanId)) {
        const rawData = await db
          .select({
            // Opsi Jawaban fields
            id: opsiJawaban.id,
            pertanyaan_id: opsiJawaban.pertanyaan_id,
            label: opsiJawaban.label,
            nilai: opsiJawaban.nilai,
            urutan: opsiJawaban.urutan,
            is_active: opsiJawaban.is_active,
            created_at: opsiJawaban.created_at,
            updated_at: opsiJawaban.updated_at,
            // Pertanyaan fields
            pertanyaan_kode: pertanyaanKompetensi.kode,
            pertanyaan_text: pertanyaanKompetensi.pertanyaan,
          })
          .from(opsiJawaban)
          .leftJoin(pertanyaanKompetensi, eq(opsiJawaban.pertanyaan_id, pertanyaanKompetensi.id))
          .where(eq(opsiJawaban.pertanyaan_id, pertanyaanId))

        // Group by pertanyaan
        const groupedData = groupOpsiJawabanData(rawData)

        return NextResponse.json({ success: true, data: groupedData })
      }
    }

    // Get all opsi jawaban with pertanyaan join
    const rawData = await db
      .select({
        // Opsi Jawaban fields
        id: opsiJawaban.id,
        pertanyaan_id: opsiJawaban.pertanyaan_id,
        label: opsiJawaban.label,
        nilai: opsiJawaban.nilai,
        urutan: opsiJawaban.urutan,
        is_active: opsiJawaban.is_active,
        created_at: opsiJawaban.created_at,
        updated_at: opsiJawaban.updated_at,
        // Pertanyaan fields
        pertanyaan_kode: pertanyaanKompetensi.kode,
        pertanyaan_text: pertanyaanKompetensi.pertanyaan,
      })
      .from(opsiJawaban)
      .leftJoin(pertanyaanKompetensi, eq(opsiJawaban.pertanyaan_id, pertanyaanKompetensi.id))

    // Group by pertanyaan
    const groupedData = groupOpsiJawabanData(rawData)

    return NextResponse.json({ success: true, data: groupedData })
  } catch (error) {
    console.error('GET opsi_jawaban error:', error)
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
      pertanyaan_id,
      label,
      nilai,
      urutan,
      is_active,
    } = body as Record<string, unknown>

    if (!pertanyaan_id || typeof pertanyaan_id !== 'number' && !Number(pertanyaan_id)) {
      return NextResponse.json({ success: false, message: 'Field pertanyaan_id wajib diisi' }, { status: 400 })
    }

    if (!label || typeof label !== 'string') {
      return NextResponse.json({ success: false, message: 'Field label wajib diisi' }, { status: 400 })
    }

    const values = {
      pertanyaan_id: typeof pertanyaan_id === 'number' ? pertanyaan_id : Number(pertanyaan_id),
      label: String(label),
      nilai: typeof nilai === 'string' ? nilai : undefined,
      urutan: typeof urutan === 'number' ? urutan : urutan ? Number(urutan) : undefined,
      is_active: typeof is_active === 'boolean' ? is_active : is_active ? Boolean(is_active) : true,
    }

    const [inserted] = await db.insert(opsiJawaban).values(values as InsertData).returning()
    return NextResponse.json({ success: true, data: inserted })
  } catch (error) {
    console.error('POST opsi_jawaban error:', error)
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
    if (body.pertanyaan_id) updateData.pertanyaan_id = typeof body.pertanyaan_id === 'number' ? body.pertanyaan_id : Number(body.pertanyaan_id)
    if (body.label) updateData.label = body.label
    if (body.nilai) updateData.nilai = body.nilai
    if (body.urutan) updateData.urutan = typeof body.urutan === 'number' ? body.urutan : Number(body.urutan)
    if (typeof body.is_active === 'boolean') updateData.is_active = body.is_active

    await db.update(opsiJawaban).set(updateData as UpdateData).where(eq(opsiJawaban.id, idNum))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PUT opsi_jawaban error:', error)
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

    await db.delete(opsiJawaban).where(eq(opsiJawaban.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE opsi_jawaban error:', error)
    return NextResponse.json({ success: false, message: 'Gagal menghapus data' }, { status: 500 })
  }
}