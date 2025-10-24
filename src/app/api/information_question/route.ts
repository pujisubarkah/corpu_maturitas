import { NextResponse } from 'next/server';
import { db } from '@/src/lib/db';
import { instrumentQuestion } from '@/src/lib/schemas/instrument_question';

// GET: return all instrument questions
export async function GET() {
  try {
    const data = await db.select().from(instrumentQuestion);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('GET /api/information_question error:', err);
    return NextResponse.json({ success: false, message: err?.message ?? 'Gagal mengambil data' }, { status: 500 });
  }
}

// POST: insert new instrument question
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      dimensionId,
      dimensionName,
      indicatorId,
      indicatorQuestion,
      indicatorWeight,
      dimensionWeight,
      finalWeight,
      indicatorDescription,
    } = body;

    if (!indicatorId || !indicatorQuestion) {
      return NextResponse.json({ success: false, message: 'indicatorId dan indicatorQuestion wajib diisi' }, { status: 400 });
    }

    const [inserted] = await db.insert(instrumentQuestion).values({
      dimensionId,
      dimensionName,
      indicatorId,
      indicatorQuestion,
      indicatorWeight,
      dimensionWeight,
      finalWeight,
      indicatorDescription,
    } as any).returning();

    return NextResponse.json({ success: true, data: inserted });
  } catch (err: any) {
    console.error('POST /api/information_question error:', err);
    return NextResponse.json({ success: false, message: err?.message ?? 'Gagal menambahkan data' }, { status: 500 });
  }
}
