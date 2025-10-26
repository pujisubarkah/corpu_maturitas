import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import { profile } from '../../../lib/schemas/profile'
import { eq, or, like } from 'drizzle-orm'

// Type definitions
interface ProfileInsert {
  id: number;
  user_id?: number;
  nip?: string;
  email?: string;
  position?: string;
  unit?: string;
  instansi_type_id?: number;
  instansi?: string;
  contact?: string;
  nama_lengkap?: string;
}

interface ProfileUpdate {
  user_id?: number;
  nip?: string;
  email?: string;
  position?: string;
  unit?: string;
  instansi_type_id?: number;
  instansi?: string;
  contact?: string;
  nama_lengkap?: string;
}

// GET: Get profile by id, user_id, or search by various fields
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const idParam = url.searchParams.get('id')
    const userIdParam = url.searchParams.get('user_id')
    const nipParam = url.searchParams.get('nip')
    const emailParam = url.searchParams.get('email')
    const searchParam = url.searchParams.get('search')

    // Get by id
    if (idParam) {
      const id = Number(idParam)
      if (Number.isNaN(id)) {
        return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 })
      }
      const rows = await db.select().from(profile).where(eq(profile.id, id)).limit(1)
      return NextResponse.json({
        success: true,
        data: rows.length ? rows[0] : null
      })
    }

    // Get by user_id
    if (userIdParam) {
      const userId = Number(userIdParam)
      if (Number.isNaN(userId)) {
        return NextResponse.json({ success: false, message: 'Invalid user_id' }, { status: 400 })
      }
      const rows = await db.select().from(profile).where(eq(profile.user_id, userId)).limit(1)
      return NextResponse.json({
        success: true,
        data: rows.length ? rows[0] : null
      })
    }

    // Get by nip
    if (nipParam) {
      const rows = await db.select().from(profile).where(eq(profile.nip, nipParam)).limit(1)
      return NextResponse.json({
        success: true,
        data: rows.length ? rows[0] : null
      })
    }

    // Get by email
    if (emailParam) {
      const rows = await db.select().from(profile).where(eq(profile.email, emailParam)).limit(1)
      return NextResponse.json({
        success: true,
        data: rows.length ? rows[0] : null
      })
    }

    // Search by name, nip, email, or instansi
    if (searchParam) {
      const searchTerm = `%${searchParam}%`
      const rows = await db
        .select()
        .from(profile)
        .where(
          or(
            like(profile.nama_lengkap, searchTerm),
            like(profile.nip, searchTerm),
            like(profile.email, searchTerm),
            like(profile.instansi, searchTerm)
          )
        )
        .orderBy(profile.nama_lengkap)
        .limit(50)

      return NextResponse.json({
        success: true,
        data: rows
      })
    }

    // Get all profiles (with pagination)
    const page = Number(url.searchParams.get('page')) || 1
    const limit = Number(url.searchParams.get('limit')) || 50
    const offset = (page - 1) * limit

    const rows = await db
      .select()
      .from(profile)
      .orderBy(profile.nama_lengkap)
      .limit(limit)
      .offset(offset)

    return NextResponse.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        offset
      }
    })
  } catch (error) {
    console.error('GET profile error:', error)
    return NextResponse.json({ success: false, message: 'Gagal mengambil data profile' }, { status: 500 })
  }
}

// POST: Create new profile
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown

    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ success: false, message: 'Invalid body' }, { status: 400 })
    }

    const { id, user_id, nip, email, position, unit, instansi_type_id, instansi, contact, nama_lengkap } = body as Record<string, unknown>

    // Validation
    if (!id || typeof id !== 'number') {
      return NextResponse.json({ success: false, message: 'id wajib diisi dan harus berupa angka' }, { status: 400 })
    }

    // Check if profile already exists
    const existing = await db
      .select()
      .from(profile)
      .where(eq(profile.id, id as number))
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Profile dengan ID ini sudah ada. Gunakan PUT untuk update.'
      }, { status: 409 })
    }

    const values: ProfileInsert = {
      id: id as number,
    }

    if (user_id !== undefined) {
      if (typeof user_id !== 'number') {
        return NextResponse.json({ success: false, message: 'user_id harus berupa angka' }, { status: 400 })
      }
      values.user_id = user_id as number
    }

    if (nip !== undefined) {
      if (typeof nip !== 'string') {
        return NextResponse.json({ success: false, message: 'nip harus berupa string' }, { status: 400 })
      }
      values.nip = nip as string
    }

    if (email !== undefined) {
      if (typeof email !== 'string') {
        return NextResponse.json({ success: false, message: 'email harus berupa string' }, { status: 400 })
      }
      values.email = email as string
    }

    if (position !== undefined) {
      if (typeof position !== 'string') {
        return NextResponse.json({ success: false, message: 'position harus berupa string' }, { status: 400 })
      }
      values.position = position as string
    }

    if (unit !== undefined) {
      if (typeof unit !== 'string') {
        return NextResponse.json({ success: false, message: 'unit harus berupa string' }, { status: 400 })
      }
      values.unit = unit as string
    }

    if (instansi_type_id !== undefined) {
      if (typeof instansi_type_id !== 'number') {
        return NextResponse.json({ success: false, message: 'instansi_type_id harus berupa angka' }, { status: 400 })
      }
      values.instansi_type_id = instansi_type_id as number
    }

    if (instansi !== undefined) {
      if (typeof instansi !== 'string') {
        return NextResponse.json({ success: false, message: 'instansi harus berupa string' }, { status: 400 })
      }
      values.instansi = instansi as string
    }

    if (contact !== undefined) {
      if (typeof contact !== 'string') {
        return NextResponse.json({ success: false, message: 'contact harus berupa string' }, { status: 400 })
      }
      values.contact = contact as string
    }

    if (nama_lengkap !== undefined) {
      if (typeof nama_lengkap !== 'string') {
        return NextResponse.json({ success: false, message: 'nama_lengkap harus berupa string' }, { status: 400 })
      }
      values.nama_lengkap = nama_lengkap as string
    }

    const [inserted] = await db.insert(profile).values(values).returning()
    return NextResponse.json({
      success: true,
      data: inserted,
      message: 'Profile berhasil dibuat'
    })
  } catch (error) {
    console.error('POST profile error:', error)
    return NextResponse.json({ success: false, message: 'Gagal membuat profile' }, { status: 500 })
  }
}

// PUT: Update existing profile by id
export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as unknown

    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ success: false, message: 'Invalid body' }, { status: 400 })
    }

    const { id, user_id, nip, email, position, unit, instansi_type_id, instansi, contact, nama_lengkap } = body as Record<string, unknown>

    if (!id || typeof id !== 'number') {
      return NextResponse.json({ success: false, message: 'id wajib diisi dan harus berupa angka' }, { status: 400 })
    }

    // Check if profile exists
    const existing = await db
      .select()
      .from(profile)
      .where(eq(profile.id, id as number))
      .limit(1)

    if (existing.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Profile tidak ditemukan'
      }, { status: 404 })
    }

    const updateData: ProfileUpdate = {}

    if (user_id !== undefined) {
      if (typeof user_id !== 'number') {
        return NextResponse.json({ success: false, message: 'user_id harus berupa angka' }, { status: 400 })
      }
      updateData.user_id = user_id as number
    }

    if (nip !== undefined) {
      if (typeof nip !== 'string') {
        return NextResponse.json({ success: false, message: 'nip harus berupa string' }, { status: 400 })
      }
      updateData.nip = nip as string
    }

    if (email !== undefined) {
      if (typeof email !== 'string') {
        return NextResponse.json({ success: false, message: 'email harus berupa string' }, { status: 400 })
      }
      updateData.email = email as string
    }

    if (position !== undefined) {
      if (typeof position !== 'string') {
        return NextResponse.json({ success: false, message: 'position harus berupa string' }, { status: 400 })
      }
      updateData.position = position as string
    }

    if (unit !== undefined) {
      if (typeof unit !== 'string') {
        return NextResponse.json({ success: false, message: 'unit harus berupa string' }, { status: 400 })
      }
      updateData.unit = unit as string
    }

    if (instansi_type_id !== undefined) {
      if (typeof instansi_type_id !== 'number') {
        return NextResponse.json({ success: false, message: 'instansi_type_id harus berupa angka' }, { status: 400 })
      }
      updateData.instansi_type_id = instansi_type_id as number
    }

    if (instansi !== undefined) {
      if (typeof instansi !== 'string') {
        return NextResponse.json({ success: false, message: 'instansi harus berupa string' }, { status: 400 })
      }
      updateData.instansi = instansi as string
    }

    if (contact !== undefined) {
      if (typeof contact !== 'string') {
        return NextResponse.json({ success: false, message: 'contact harus berupa string' }, { status: 400 })
      }
      updateData.contact = contact as string
    }

    if (nama_lengkap !== undefined) {
      if (typeof nama_lengkap !== 'string') {
        return NextResponse.json({ success: false, message: 'nama_lengkap harus berupa string' }, { status: 400 })
      }
      updateData.nama_lengkap = nama_lengkap as string
    }

    await db.update(profile).set(updateData).where(eq(profile.id, id as number))

    // Get updated record
    const [updated] = await db
      .select()
      .from(profile)
      .where(eq(profile.id, id as number))
      .limit(1)

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Profile berhasil diperbarui'
    })
  } catch (error) {
    console.error('PUT profile error:', error)
    return NextResponse.json({ success: false, message: 'Gagal memperbarui profile' }, { status: 500 })
  }
}

// DELETE: Delete profile by id
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

    // Check if profile exists
    const existing = await db
      .select()
      .from(profile)
      .where(eq(profile.id, id))
      .limit(1)

    if (existing.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Profile tidak ditemukan'
      }, { status: 404 })
    }

    await db.delete(profile).where(eq(profile.id, id))

    return NextResponse.json({
      success: true,
      message: 'Profile berhasil dihapus'
    })
  } catch (error) {
    console.error('DELETE profile error:', error)
    return NextResponse.json({ success: false, message: 'Gagal menghapus profile' }, { status: 500 })
  }
}