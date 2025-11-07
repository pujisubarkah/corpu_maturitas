import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { forumPembelajaran, surveiCorpu } from "../../../lib/schemas/profile_surveys";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const tahun = searchParams.get('tahun');

  if (userId && tahun) {
    // First find the surveiCorpu record
    const surveiRecord = await db.select().from(surveiCorpu).where(and(
      eq(surveiCorpu.userId, parseInt(userId)),
      eq(surveiCorpu.tahun, parseInt(tahun))
    ));

    if (surveiRecord.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // Then find the forumPembelajaran record
    const data = await db.select().from(forumPembelajaran).where(
      eq(forumPembelajaran.surveiId, surveiRecord[0].id)
    );
    return NextResponse.json({ data });
  } else {
    const data = await db.select().from(forumPembelajaran);
    return NextResponse.json({ data });
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { surveiId, ...updateData } = body;

  if (!surveiId) {
    return NextResponse.json({ error: 'surveiId is required' }, { status: 400 });
  }

  const updated = await db.update(forumPembelajaran).set(updateData).where(eq(forumPembelajaran.surveiId, surveiId)).returning();

  if (updated.length === 0) {
    return NextResponse.json({ error: 'Record not found' }, { status: 404 });
  }

  return NextResponse.json(updated[0]);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, tahun, ...data } = body;

  // First get or create the surveiCorpu record
  const surveiRecord = await db.select().from(surveiCorpu).where(and(
    eq(surveiCorpu.userId, userId),
    eq(surveiCorpu.tahun, tahun)
  ));

  let surveiId: number;
  if (surveiRecord.length > 0) {
    surveiId = surveiRecord[0].id;
  } else {
    const inserted = await db.insert(surveiCorpu).values({ userId, tahun }).returning();
    surveiId = inserted[0].id;
  }

  // Check if forumPembelajaran record exists
  const existing = await db.select().from(forumPembelajaran).where(
    eq(forumPembelajaran.surveiId, surveiId)
  );

  if (existing.length > 0) {
    // Update existing record
    const updated = await db.update(forumPembelajaran)
      .set(data)
      .where(eq(forumPembelajaran.surveiId, surveiId))
      .returning();
    return NextResponse.json(updated[0]);
  } else {
    // Insert new record
    const inserted = await db.insert(forumPembelajaran).values({ surveiId, ...data }).returning();
    return NextResponse.json(inserted[0]);
  }
}