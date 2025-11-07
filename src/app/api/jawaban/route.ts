import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import { jawaban } from '../../../lib/schemas/jawaban'
import { eq, and } from 'drizzle-orm'

export async function simpanJawaban(data: {
  instansiId: number;
  tahun: number;
  jawaban?: Record<string, string | number>;
  bukti_dukung?: Record<string, string>;
  verification_answers?: Record<string, string | number>;
  is_verified?: boolean;
  verified_by?: string;
  isVerification?: boolean;
}) {
  try {
    if (data.isVerification) {
      // This is a verification update - update verification_answers and verification status
      const result = await db.update(jawaban)
        .set({
          verification_answers: data.verification_answers,
          is_verified: data.is_verified || false,
          verified_by: data.verified_by || null,
          verified_at: data.is_verified ? new Date() : null,
          updated_at: new Date()
        })
        .where(and(
          eq(jawaban.instansi_id, data.instansiId),
          eq(jawaban.tahun, data.tahun)
        ))
        .returning({ id: jawaban.id });

      if (result.length === 0) {
        return { success: false, error: 'Data jawaban tidak ditemukan untuk diverifikasi' };
      }

      return {
        success: true,
        jawabanId: result[0].id,
        message: 'Verifikasi jawaban berhasil disimpan'
      };
    } else {
      // This is initial user submission - insert or update jawaban
      const result = await db.insert(jawaban)
        .values({
          instansi_id: data.instansiId,
          tahun: data.tahun,
          jawaban: data.jawaban,
          bukti_dukung: data.bukti_dukung || null,
          verification_answers: null, // Clear any previous verification answers
          is_verified: false, // Reset verification status for new submission
          verified_by: null,
          verified_at: null,
          updated_at: new Date()
        })
        .onConflictDoUpdate({
          target: [jawaban.instansi_id, jawaban.tahun],
          set: {
            jawaban: data.jawaban,
            bukti_dukung: data.bukti_dukung || null,
            verification_answers: null, // Clear verification answers on new submission
            is_verified: false, // Reset verification status
            verified_by: null,
            verified_at: null,
            updated_at: new Date()
          }
        })
        .returning({ id: jawaban.id });

      return {
        success: true,
        jawabanId: result[0].id,
        message: 'Jawaban berhasil disimpan'
      };
    }

  } catch (error) {
    console.error('Error saving jawaban:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// POST endpoint untuk API
export async function POST(request: Request) {
  try {
    const data = await request.json();

    const result = await simpanJawaban(data);

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