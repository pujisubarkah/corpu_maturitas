import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { profile } from '../../../../lib/schemas/profile';
import { eq } from 'drizzle-orm';

// GET /api/profile/[user_id]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = Number(id);
  if (Number.isNaN(userId)) {
    return NextResponse.json({ success: false, message: 'Invalid user_id' }, { status: 400 });
  }
  try {
    const rows = await db.select().from(profile).where(eq(profile.user_id, userId)).limit(1);
    return NextResponse.json({
      success: true,
      data: rows.length ? rows[0] : null
    });
  } catch (error) {
    console.error('GET /api/profile/[user_id] error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengambil data profile' }, { status: 500 });
  }
}
