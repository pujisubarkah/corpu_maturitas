import { NextResponse } from 'next/server'
import { db } from '../../../../lib/db'
import { masterInstansiType } from '../../../../lib/schemas/instansi'
import { instansiType } from '../../../../lib/schemas/instansi_type'
import { eq } from 'drizzle-orm'

// GET: Get instansi details by instansi_id
export async function GET(
  request: Request,
  { params }: { params: Promise<{ instansi_id: string }> }
) {
  try {
    const resolvedParams = await params
    const instansiIdParam = resolvedParams.instansi_id

    if (!instansiIdParam) {
      return NextResponse.json({
        success: false,
        message: 'instansi_id parameter is required'
      }, { status: 400 })
    }

    const instansiId = parseInt(instansiIdParam, 10)
    if (isNaN(instansiId)) {
      return NextResponse.json({
        success: false,
        message: 'instansi_id must be a valid number'
      }, { status: 400 })
    }

    // Find instansi by instansi_id with joined instansi type
    const instansiData = await db
      .select({
        nama_instansi: masterInstansiType.nama_instansi,
        kat_instansi: instansiType.kat_instansi
      })
      .from(masterInstansiType)
      .leftJoin(instansiType, eq(masterInstansiType.instansi_type_id, instansiType.id))
      .where(eq(masterInstansiType.instansi_id, instansiId))
      .limit(1)

    if (instansiData.length === 0) {
      return NextResponse.json({
        success: false,
        message: `Instansi dengan instansi_id ${instansiId} tidak ditemukan`
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: instansiData[0]
    })
  } catch (error) {
    console.error('GET master-instansi-type/[instansi_id] error:', error)
    return NextResponse.json({
      success: false,
      message: 'Gagal mengambil data instansi'
    }, { status: 500 })
  }
}