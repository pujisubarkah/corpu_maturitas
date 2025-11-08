import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import { jawaban } from '../../../lib/schemas/jawaban'
import { eq, and } from 'drizzle-orm'

// GET endpoint untuk mendapatkan data jawaban
export async function GET(request: Request) {
    // Kategori mapping
    const categories = [
      { key: 'strukturAsn', questions: ['p7', 'p8', 'p9', 'p10'] },
      { key: 'manajemenPengetahuan', questions: ['p11', 'p12', 'p13', 'p14', 'p15'] },
      { key: 'forumPembelajaran', questions: ['p16', 'p17', 'p18', 'p19'] },
      { key: 'sistemPembelajaran', questions: ['p20', 'p21', 'p22', 'p23'] },
      { key: 'strategiPembelajaran', questions: ['p24', 'p25', 'p26', 'p27', 'p28'] },
      { key: 'teknologiPembelajaran', questions: ['p29', 'p30', 'p31', 'p32', 'p33'] },
      { key: 'integrasiSistem', questions: ['p34', 'p35', 'p36', 'p37'] },
      { key: 'evaluasiAsn', questions: ['p38', 'p39', 'p40', 'p41'] }
    ];
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const tahun = url.searchParams.get('tahun');

    let jawabanRecord;
    if (!userId || !tahun) {
      jawabanRecord = await db.select().from(jawaban);
    } else {
      jawabanRecord = await db.select()
        .from(jawaban)
        .where(and(
          eq(jawaban.user_id, parseInt(userId)),
          eq(jawaban.tahun, parseInt(tahun))
        ));
    }

    if (jawabanRecord.length === 0) {
      return NextResponse.json({ success: true, data: null });
    }

    // Helper untuk sum verification_answers
  function sumVerificationAnswers(verification_answers: Record<string, unknown>) {
      if (!verification_answers) return 0;
      return Object.values(verification_answers)
        .map(v => typeof v === 'string' ? Number(v) : v)
        .filter(v => typeof v === 'number' && !isNaN(v))
        .reduce((a, b) => (a as number) + (b as number), 0);
    }

    // Helper untuk sum per kategori
  function sumPerCategory(verification_answers: Record<string, unknown>) {
      if (!verification_answers) return {};
      const result: Record<string, number> = {};
      for (const cat of categories) {
        result[cat.key] = Number(cat.questions
          .map(q => {
            const v = verification_answers[q];
            return typeof v === 'string' ? Number(v) : v;
          })
          .filter(v => typeof v === 'number' && !isNaN(v))
          .reduce((a, b) => (a as number) + (b as number), 0));
      }
      return result;
    }

    // Map hasil agar hanya field yang dibutuhkan
    const mapped = jawabanRecord.map(j => ({
  id: j.id,
  user_id: j.user_id,
  tahun: j.tahun,
  is_verified: j.is_verified,
  verification_answers: j.verification_answers,
  total_verification: sumVerificationAnswers(j.verification_answers as Record<string, unknown>),
  kategori_verification: sumPerCategory(j.verification_answers as Record<string, unknown>)
    }));

    // Jika query tanpa filter, kembalikan array data
    if (!userId || !tahun) {
      return NextResponse.json({ success: true, data: mapped });
    }

    // Jika query dengan filter, kembalikan satu data
    return NextResponse.json({ success: true, data: mapped[0] });

  } catch (error) {
    console.error('GET jawaban error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
