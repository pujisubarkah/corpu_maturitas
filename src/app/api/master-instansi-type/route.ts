import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import { masterInstansiType } from '../../../lib/schemas/instansi'
import { eq } from 'drizzle-orm'

// GET: Get all master instansi types
export async function GET() {
  try {
    const allTypes = await db.select().from(masterInstansiType).orderBy(masterInstansiType.nama_instansi)
    return NextResponse.json({
      success: true,
      data: allTypes
    })
  } catch (error) {
    console.error('GET master-instansi-type error:', error)
    return NextResponse.json({ success: false, message: 'Gagal mengambil data master tipe instansi' }, { status: 500 })
  }
}

// POST: Create new master instansi type
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown

    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ success: false, message: 'Invalid body' }, { status: 400 })
    }

    const { instansi_id, nama_instansi, instansi_type_id } = body as Record<string, unknown>

    // Validation
    if (nama_instansi !== undefined && typeof nama_instansi !== 'string') {
      return NextResponse.json({ success: false, message: 'nama_instansi harus berupa string' }, { status: 400 })
    }

    if (instansi_id !== undefined && typeof instansi_id !== 'number') {
      return NextResponse.json({ success: false, message: 'instansi_id harus berupa angka' }, { status: 400 })
    }

    if (instansi_type_id !== undefined && typeof instansi_type_id !== 'number') {
      return NextResponse.json({ success: false, message: 'instansi_type_id harus berupa angka' }, { status: 400 })
    }

    const values: {
      id: number
      instansi_id?: number
      nama_instansi?: string
      instansi_type_id?: number
    } = {
      id: Date.now(), // Generate ID using timestamp
    }

    if (instansi_id !== undefined) values.instansi_id = instansi_id as number
    if (nama_instansi !== undefined) values.nama_instansi = nama_instansi as string
    if (instansi_type_id !== undefined) values.instansi_type_id = instansi_type_id as number

    const [inserted] = await db.insert(masterInstansiType).values(values).returning()
    return NextResponse.json({
      success: true,
      data: inserted,
      message: 'Master instansi berhasil dibuat'
    })
  } catch (error) {
    console.error('POST master-instansi-type error:', error)
    return NextResponse.json({ success: false, message: 'Gagal membuat master instansi' }, { status: 500 })
  }
}

// PUT: Update existing master instansi type by id
export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as unknown

    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ success: false, message: 'Invalid body' }, { status: 400 })
    }

    const { id, instansi_id, nama_instansi, instansi_type_id } = body as Record<string, unknown>

    if (!id || typeof id !== 'number') {
      return NextResponse.json({ success: false, message: 'id wajib diisi dan harus berupa angka' }, { status: 400 })
    }

    // Check if master instansi type exists
    const existing = await db
      .select()
      .from(masterInstansiType)
      .where(eq(masterInstansiType.id, id as number))
      .limit(1)

    if (existing.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Master instansi tidak ditemukan'
      }, { status: 404 })
    }

    const updateData: Partial<{
      instansi_id: number
      nama_instansi: string
      instansi_type_id: number
    }> = {}

    if (instansi_id !== undefined) {
      if (typeof instansi_id !== 'number') {
        return NextResponse.json({ success: false, message: 'instansi_id harus berupa angka' }, { status: 400 })
      }
      updateData.instansi_id = instansi_id as number
    }

    if (nama_instansi !== undefined) {
      if (typeof nama_instansi !== 'string') {
        return NextResponse.json({ success: false, message: 'nama_instansi harus berupa string' }, { status: 400 })
      }
      updateData.nama_instansi = nama_instansi as string
    }

    if (instansi_type_id !== undefined) {
      if (typeof instansi_type_id !== 'number') {
        return NextResponse.json({ success: false, message: 'instansi_type_id harus berupa angka' }, { status: 400 })
      }
      updateData.instansi_type_id = instansi_type_id as number
    }

    await db.update(masterInstansiType).set(updateData).where(eq(masterInstansiType.id, id as number))

    // Get updated record
    const [updated] = await db
      .select()
      .from(masterInstansiType)
      .where(eq(masterInstansiType.id, id as number))
      .limit(1)

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Master instansi berhasil diperbarui'
    })
  } catch (error) {
    console.error('PUT master-instansi-type error:', error)
    return NextResponse.json({ success: false, message: 'Gagal memperbarui master instansi' }, { status: 500 })
  }
}

// DELETE: Delete master instansi type by id
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

    // Check if master instansi type exists
    const existing = await db
      .select()
      .from(masterInstansiType)
      .where(eq(masterInstansiType.id, id))
      .limit(1)

    if (existing.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Master tipe instansi tidak ditemukan'
      }, { status: 404 })
    }

    await db.delete(masterInstansiType).where(eq(masterInstansiType.id, id))

    return NextResponse.json({
      success: true,
      message: 'Master tipe instansi berhasil dihapus'
    })
  } catch (error) {
    console.error('DELETE master-instansi-type error:', error)
    return NextResponse.json({ success: false, message: 'Gagal menghapus master tipe instansi' }, { status: 500 })
  }
}