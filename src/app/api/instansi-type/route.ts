import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import { instansiType } from '../../../lib/schemas/instansi_type'
import { eq } from 'drizzle-orm'

// GET: Get instansi type by slug or get all types
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const slugParam = url.searchParams.get('slug')

    // If slug is provided, detect the type
    if (slugParam) {
      const slug = slugParam.toLowerCase()
      let detectedTypeId = 1 // Default
      let detectedBy = 'default'

      // Simple pattern matching for common instansi types
      if (slug.includes('kemen') || slug.includes('kementerian')) {
        detectedTypeId = 1 // Assuming ID 1 is for Kementerian
        detectedBy = 'kemen/kementerian'
      } else if (slug.includes('prov') || slug.includes('provinsi')) {
        detectedTypeId = 2 // Assuming ID 2 is for Provinsi
        detectedBy = 'prov/provinsi'
      } else if (slug.includes('kab') || slug.includes('kabupaten')) {
        detectedTypeId = 3 // Assuming ID 3 is for Kabupaten
        detectedBy = 'kab/kabupaten'
      } else if (slug.includes('kota')) {
        detectedTypeId = 4 // Assuming ID 4 is for Kota
        detectedBy = 'kota'
      }

      // Get the instansi type details
      const typeDetails = await db
        .select()
        .from(instansiType)
        .where(eq(instansiType.id, detectedTypeId))
        .limit(1)

      if (typeDetails.length === 0) {
        return NextResponse.json({
          success: false,
          message: 'Tipe instansi tidak ditemukan'
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: {
          slug: slugParam,
          instansi_type_id: detectedTypeId,
          instansi_type_name: typeDetails[0].kat_instansi,
          detected_by: detectedBy
        }
      })
    }

    // Return all instansi types
    const allTypes = await db.select().from(instansiType).orderBy(instansiType.kat_instansi)
    return NextResponse.json({
      success: true,
      data: allTypes
    })
  } catch (error) {
    console.error('GET instansi-type error:', error)
    return NextResponse.json({ success: false, message: 'Gagal mengambil data tipe instansi' }, { status: 500 })
  }
}

// POST: Create new instansi type
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown

    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ success: false, message: 'Invalid body' }, { status: 400 })
    }

    const { kat_instansi } = body as Record<string, unknown>

    // Validation
    if (!kat_instansi || typeof kat_instansi !== 'string') {
      return NextResponse.json({ success: false, message: 'kat_instansi wajib diisi dan harus berupa string' }, { status: 400 })
    }

    const values = {
      kat_instansi: kat_instansi as string,
    }

    const [inserted] = await db.insert(instansiType).values(values).returning()
    return NextResponse.json({
      success: true,
      data: inserted,
      message: 'Tipe instansi berhasil dibuat'
    })
  } catch (error) {
    console.error('POST instansi-type error:', error)
    return NextResponse.json({ success: false, message: 'Gagal membuat tipe instansi' }, { status: 500 })
  }
}

// PUT: Update existing instansi type by id
export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as unknown

    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ success: false, message: 'Invalid body' }, { status: 400 })
    }

    const { id, kat_instansi } = body as Record<string, unknown>

    if (!id || typeof id !== 'number') {
      return NextResponse.json({ success: false, message: 'id wajib diisi dan harus berupa angka' }, { status: 400 })
    }

    // Check if instansi type exists
    const existing = await db
      .select()
      .from(instansiType)
      .where(eq(instansiType.id, id as number))
      .limit(1)

    if (existing.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Tipe instansi tidak ditemukan'
      }, { status: 404 })
    }

    const updateData: Partial<{ kat_instansi: string }> = {}

    if (kat_instansi !== undefined) {
      if (typeof kat_instansi !== 'string') {
        return NextResponse.json({ success: false, message: 'kat_instansi harus berupa string' }, { status: 400 })
      }
      updateData.kat_instansi = kat_instansi as string
    }

    await db.update(instansiType).set(updateData).where(eq(instansiType.id, id as number))

    // Get updated record
    const [updated] = await db
      .select()
      .from(instansiType)
      .where(eq(instansiType.id, id as number))
      .limit(1)

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Tipe instansi berhasil diperbarui'
    })
  } catch (error) {
    console.error('PUT instansi-type error:', error)
    return NextResponse.json({ success: false, message: 'Gagal memperbarui tipe instansi' }, { status: 500 })
  }
}

// DELETE: Delete instansi type by id
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

    // Check if instansi type exists
    const existing = await db
      .select()
      .from(instansiType)
      .where(eq(instansiType.id, id))
      .limit(1)

    if (existing.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Tipe instansi tidak ditemukan'
      }, { status: 404 })
    }

    await db.delete(instansiType).where(eq(instansiType.id, id))

    return NextResponse.json({
      success: true,
      message: 'Tipe instansi berhasil dihapus'
    })
  } catch (error) {
    console.error('DELETE instansi-type error:', error)
    return NextResponse.json({ success: false, message: 'Gagal menghapus tipe instansi' }, { status: 500 })
  }
}