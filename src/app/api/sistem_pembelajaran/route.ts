import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { sistemPembelajaran } from "../../../lib/schemas/profile_surveys";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const tahun = searchParams.get('tahun');

  if (userId && tahun) {
    const data = await db.select().from(sistemPembelajaran).where(and(
      eq(sistemPembelajaran.userId, parseInt(userId)),
      eq(sistemPembelajaran.tahun, parseInt(tahun))
    ));
    return NextResponse.json({ data });
  } else {
    const data = await db.select().from(sistemPembelajaran);
    return NextResponse.json({ data });
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...updateData } = body;
  const updated = await db.update(sistemPembelajaran).set(updateData).where(eq(sistemPembelajaran.id, id)).returning();
  return NextResponse.json(updated[0]);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, tahun, ...data } = body;

  // Check if record exists
  const existing = await db.select().from(sistemPembelajaran).where(and(
    eq(sistemPembelajaran.userId, userId),
    eq(sistemPembelajaran.tahun, tahun)
  ));

  if (existing.length > 0) {
    // Update existing record
    const updated = await db.update(sistemPembelajaran)
      .set(data)
      .where(and(
        eq(sistemPembelajaran.userId, userId),
        eq(sistemPembelajaran.tahun, tahun)
      ))
      .returning();
    return NextResponse.json(updated[0]);
  } else {
    // Insert new record
    const inserted = await db.insert(sistemPembelajaran).values({ userId, tahun, ...data }).returning();
    return NextResponse.json(inserted[0]);
  }
}