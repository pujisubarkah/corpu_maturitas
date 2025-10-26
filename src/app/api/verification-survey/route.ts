import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import { jawaban } from '../../../lib/schemas/jawaban'
import { masterInstansiType as instansi } from '../../../lib/schemas/instansi'
import { eq, sql } from 'drizzle-orm'

// GET: Get surveys that need verification
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const status = url.searchParams.get('status') || 'pending' // pending, verified, rejected

    const validPage = Math.max(1, page)
    const validLimit = Math.max(1, Math.min(100, limit))
    const offset = (validPage - 1) * validLimit

    // Get surveys with profile and instansi info
    let whereCondition

    if (status === 'pending') {
      whereCondition = eq(jawaban.is_verified, false)
    } else if (status === 'verified') {
      whereCondition = eq(jawaban.is_verified, true)
    } else {
      // For rejected, we might need a separate field or handle differently
      whereCondition = eq(jawaban.is_verified, false) // For now, treat as pending
    }

    const surveys = await db
      .select({
        id: jawaban.id,
        instansi_id: jawaban.instansi_id,
        tahun: jawaban.tahun,
        is_verified: jawaban.is_verified,
        jawaban: jawaban.jawaban,
        verification_answers: jawaban.verification_answers,
        verified_by: jawaban.verified_by,
        verified_at: jawaban.verified_at,
        created_at: jawaban.created_at,
        updated_at: jawaban.updated_at,
        profile_name: sql<string>`NULL`, // Placeholder - will be filled from user data if needed
        profile_email: sql<string>`NULL`, // Placeholder - will be filled from user data if needed
        instansi_name: instansi.nama_instansi,
        // Calculate self assessment score from jawaban JSON
        self_assessment_score: sql<number>`AVG((jsonb_array_elements(${jawaban.jawaban})->>'jawaban')::numeric)`,
        // Calculate verification score from verification_answers JSON if exists
        verification_score: sql<number>`CASE WHEN ${jawaban.verification_answers} IS NOT NULL THEN AVG((jsonb_array_elements(${jawaban.verification_answers})->>'jawaban')::numeric) ELSE NULL END`
      })
      .from(jawaban)
      .leftJoin(instansi, eq(jawaban.instansi_id, instansi.id))
      .where(whereCondition)
      .orderBy(jawaban.created_at)
      .limit(validLimit)
      .offset(offset)

    // Get total count
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(jawaban)
      .where(whereCondition)

    const totalCount = totalCountResult[0]?.count || 0
    const totalPages = Math.ceil(totalCount / validLimit)

    return NextResponse.json({
      success: true,
      data: surveys,
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
    console.error('GET verification surveys error:', error)
    return NextResponse.json({ success: false, message: 'Gagal mengambil data survei verifikasi' }, { status: 500 })
  }
}

// PUT: Update survey verification status and score
export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as unknown

    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ success: false, message: 'Invalid body' }, { status: 400 })
    }

    const { id, status, verified_by, verification_answers } = body as Record<string, unknown>

    if (!id || typeof id !== 'number') {
      return NextResponse.json({ success: false, message: 'id wajib diisi dan harus berupa angka' }, { status: 400 })
    }

    if (!status || typeof status !== 'string') {
      return NextResponse.json({ success: false, message: 'status wajib diisi' }, { status: 400 })
    }

    if (!['verified', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ success: false, message: 'status harus berupa: verified, rejected, atau pending' }, { status: 400 })
    }

    const updateData: {
      is_verified: boolean;
      verified_by?: string;
      verified_at: Date | null;
      updated_at: Date;
      verification_answers?: Record<string, unknown> | null;
    } = {
      is_verified: status === 'verified',
      verified_by: verified_by as string,
      verified_at: status === 'verified' ? new Date() : null,
      updated_at: new Date()
    }

    // If verification_answers provided, we need to store it somewhere
    // For now, we'll assume it's stored in the existing jawaban JSON structure
    // or we need to add a new column. Let's check if we need to add verification_answers column
    if (verification_answers !== undefined && verification_answers !== null) {
      // For now, we'll store verification_answers in a separate field if it exists
      // If not, we might need to modify the jawaban JSON structure
      updateData.verification_answers = verification_answers as Record<string, unknown>
    }

    // Update survey status
    await db
      .update(jawaban)
      .set(updateData)
      .where(eq(jawaban.id, id as number))

    return NextResponse.json({
      success: true,
      message: `Survei berhasil ${status === 'verified' ? 'diverifikasi' : status === 'rejected' ? 'ditolak' : 'ditandai pending'}`
    })
  } catch (error) {
    console.error('PUT verification survey error:', error)
    return NextResponse.json({ success: false, message: 'Gagal memperbarui status survei' }, { status: 500 })
  }
}