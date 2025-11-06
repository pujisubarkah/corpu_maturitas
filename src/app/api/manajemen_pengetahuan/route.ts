import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { manajemenPengetahuan } from "../../../lib/schemas/profile_surveys";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const tahun = searchParams.get('tahun');

  if (userId && tahun) {
    const data = await db.select().from(manajemenPengetahuan).where(and(
      eq(manajemenPengetahuan.userId, parseInt(userId)),
      eq(manajemenPengetahuan.tahun, parseInt(tahun))
    ));
    return NextResponse.json({ data });
  } else {
    const data = await db.select().from(manajemenPengetahuan);
    return NextResponse.json({ data });
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...updateData } = body;
  const updated = await db.update(manajemenPengetahuan).set(updateData).where(eq(manajemenPengetahuan.id, id)).returning();
  return NextResponse.json(updated[0]);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, tahun, ...data } = body;

  // Check if record exists
  const existing = await db.select().from(manajemenPengetahuan).where(and(
    eq(manajemenPengetahuan.userId, userId),
    eq(manajemenPengetahuan.tahun, tahun)
  ));

  if (existing.length > 0) {
    // Update existing record
    const updated = await db.update(manajemenPengetahuan)
      .set(data)
      .where(and(
        eq(manajemenPengetahuan.userId, userId),
        eq(manajemenPengetahuan.tahun, tahun)
      ))
      .returning();
    return NextResponse.json(updated[0]);
  } else {
    // Insert new record
    const inserted = await db.insert(manajemenPengetahuan).values({ userId, tahun, ...data }).returning();
    return NextResponse.json(inserted[0]);
  }
}