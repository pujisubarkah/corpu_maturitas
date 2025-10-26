import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import { users } from '../../../lib/schemas/user'
import { sql } from 'drizzle-orm'

// GET: Get all users with pagination
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')

    // Validate pagination parameters
    const validPage = Math.max(1, page)
    const validLimit = Math.max(1, Math.min(100, limit)) // Max 100 per page

    const offset = (validPage - 1) * validLimit

    // Get total count
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)

    const totalCount = totalCountResult[0]?.count || 0
    const totalPages = Math.ceil(totalCount / validLimit)

    // Get paginated users
    const paginatedUsers = await db
      .select()
      .from(users)
      .orderBy(users.id)
      .limit(validLimit)
      .offset(offset)

    return NextResponse.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        currentPage: validPage,
        totalPages,
        totalCount,
        limit: validLimit,
        hasNextPage: validPage < totalPages,
        hasPrevPage: validPage > 1
      }
    })
  } catch (error) {
    console.error('GET users error:', error)
    return NextResponse.json({ success: false, message: 'Gagal mengambil data users' }, { status: 500 })
  }
}

// POST: Create new user
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown

    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ success: false, message: 'Invalid body' }, { status: 400 })
    }

    const { roleId, username, password, fullName } = body as Record<string, unknown>

    // Validation
    if (!roleId || typeof roleId !== 'number') {
      return NextResponse.json({ success: false, message: 'roleId wajib diisi dan harus berupa angka' }, { status: 400 })
    }

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ success: false, message: 'username wajib diisi dan harus berupa string' }, { status: 400 })
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ success: false, message: 'password wajib diisi dan harus berupa string' }, { status: 400 })
    }

    if (!fullName || typeof fullName !== 'string') {
      return NextResponse.json({ success: false, message: 'fullName wajib diisi dan harus berupa string' }, { status: 400 })
    }

    const values = {
      id: Date.now(), // Generate ID based on timestamp
      roleId: roleId as number,
      username: username as string,
      password: password as string,
      fullName: fullName as string,
    }

    const [inserted] = await db.insert(users).values(values).returning()
    return NextResponse.json({
      success: true,
      data: inserted,
      message: 'User berhasil dibuat'
    })
  } catch (error) {
    console.error('POST users error:', error)
    return NextResponse.json({ success: false, message: 'Gagal membuat user' }, { status: 500 })
  }
}