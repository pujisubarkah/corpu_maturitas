import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { kompetensiGenerikNasional, surveiCorpu } from "../../../lib/schemas/profile_surveys";
import { eq, and } from "drizzle-orm";

export async function GET(request) {
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

    // Then find the kompetensiGenerikNasional record
    const data = await db.select().from(kompetensiGenerikNasional).where(
      eq(kompetensiGenerikNasional.surveiId, surveiRecord[0].id)
    );
    return NextResponse.json({ data });
  } else {
    const data = await db.select().from(kompetensiGenerikNasional);
    return NextResponse.json({ data });
  }
}

export async function PUT(req) {
  const body = await req.json();
  const { surveiId, ...updateData } = body;

  // For backward compatibility, if id is provided, treat it as surveiId
  const idToUse = surveiId || body.id;
  const updated = await db.update(kompetensiGenerikNasional).set(updateData).where(eq(kompetensiGenerikNasional.surveiId, idToUse)).returning();
  return NextResponse.json(updated[0]);
}

export async function POST(req) {
  const body = await req.json();
  const { userId, tahun, ...data } = body;

  // First get or create the surveiCorpu record
  const surveiRecord = await db.select().from(surveiCorpu).where(and(
    eq(surveiCorpu.userId, userId),
    eq(surveiCorpu.tahun, tahun)
  ));

  let surveiId;
  if (surveiRecord.length > 0) {
    surveiId = surveiRecord[0].id;
  } else {
    const inserted = await db.insert(surveiCorpu).values({ userId, tahun }).returning();
    surveiId = inserted[0].id;
  }

  // Check if kompetensiGenerikNasional record exists
  const existing = await db.select().from(kompetensiGenerikNasional).where(
    eq(kompetensiGenerikNasional.surveiId, surveiId)
  );

  if (existing.length > 0) {
    // Update existing record
    const updated = await db.update(kompetensiGenerikNasional)
      .set(data)
      .where(eq(kompetensiGenerikNasional.surveiId, surveiId))
      .returning();
    return NextResponse.json(updated[0]);
  } else {
    // Insert new record
    const inserted = await db.insert(kompetensiGenerikNasional).values({ surveiId, ...data }).returning();
    return NextResponse.json(inserted[0]);
  }
}