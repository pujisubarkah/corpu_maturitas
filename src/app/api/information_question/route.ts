import { NextResponse } from 'next/server';
import { db } from '@/src/lib/db';
import { instrumentQuestion } from '@/src/lib/schemas/instrument_question';

interface InstrumentQuestionInsert {
  dimensionId?: number;
  dimensionName?: string;
  indicatorId: number;
  indicatorQuestion: string;
  indicatorWeight?: number;
  dimensionWeight?: number;
  finalWeight?: number;
  indicatorDescription?: string;
}

// GET: return all instrument questions
export async function GET() {
  try {
    const data = await db.select().from(instrumentQuestion);
    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    console.error('GET /api/information_question error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Gagal mengambil data';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
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

    const insertData: InstrumentQuestionInsert = {
      dimensionId: dimensionId ? Number(dimensionId) : undefined,
      dimensionName,
      indicatorId: Number(indicatorId),
      indicatorQuestion,
      indicatorWeight: indicatorWeight ? Number(indicatorWeight) : undefined,
      dimensionWeight: dimensionWeight ? Number(dimensionWeight) : undefined,
      finalWeight: finalWeight ? Number(finalWeight) : undefined,
      indicatorDescription,
    };

    const [inserted] = await db.insert(instrumentQuestion).values(insertData).returning();

    return NextResponse.json({ success: true, data: inserted });
  } catch (err: unknown) {
    console.error('POST /api/information_question error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Gagal menambahkan data';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
