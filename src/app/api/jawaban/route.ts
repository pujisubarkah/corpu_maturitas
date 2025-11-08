import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import { jawaban } from '../../../lib/schemas/jawaban'
import { eq, and } from 'drizzle-orm'
import { simpanJawabanVerifikasi } from '../../../lib/survey-utils'

// POST endpoint untuk API
export async function POST(request: Request) {
  try {
    const data = await request.json();

    const result = await simpanJawabanVerifikasi(data);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error('POST jawaban error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET endpoint untuk mendapatkan data jawaban
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const instansiId = url.searchParams.get('instansiId');
    const tahun = url.searchParams.get('tahun');

    if (!instansiId || !tahun) {
      return NextResponse.json({
        success: false,
        error: 'instansiId dan tahun diperlukan'
      }, { status: 400 });
    }

    // Cari jawaban berdasarkan instansi_id dan tahun
    const jawabanRecord = await db.select()
      .from(jawaban)
      .where(and(
        eq(jawaban.instansi_id, parseInt(instansiId)),
        eq(jawaban.tahun, parseInt(tahun))
      ));

    if (jawabanRecord.length === 0) {
      return NextResponse.json({ success: true, data: null });
    }

    const result = jawabanRecord[0];

    return NextResponse.json({ success: true, data: result });

  } catch (error) {
    console.error('GET jawaban error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}