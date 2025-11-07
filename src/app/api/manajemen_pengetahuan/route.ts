import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { manajemenPengetahuan, surveiCorpu } from "../../../lib/schemas/profile_surveys";
import { eq, and } from "drizzle-orm";

// Utility function to convert BigInt values to numbers
function convertBigIntToNumber(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'bigint') return Number(obj);
  if (Array.isArray(obj)) return obj.map(convertBigIntToNumber);
  if (typeof obj === 'object') {
    const converted: Record<string, unknown> = {};
    for (const key in obj as Record<string, unknown>) {
      converted[key] = convertBigIntToNumber((obj as Record<string, unknown>)[key]);
    }
    return converted;
  }
  return obj;
}

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

    // Then find the manajemenPengetahuan record
    const data = await db.select().from(manajemenPengetahuan).where(
      eq(manajemenPengetahuan.surveiId, surveiRecord[0].id)
    );
    return NextResponse.json({ data });
  } else {
    const data = await db.select().from(manajemenPengetahuan);
    return NextResponse.json({ data });
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { surveiId, ...updateData } = body;

  if (!surveiId) {
    return NextResponse.json({ error: 'surveiId is required' }, { status: 400 });
  }

  const updated = await db.update(manajemenPengetahuan).set(updateData).where(eq(manajemenPengetahuan.surveiId, surveiId)).returning();

  if (updated.length === 0) {
    return NextResponse.json({ error: 'Record not found' }, { status: 404 });
  }

  // Convert BigInt values to numbers for JSON serialization
  const result = convertBigIntToNumber(updated[0]);

  return NextResponse.json(result);
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

  // Check if manajemenPengetahuan record exists
  const existing = await db.select().from(manajemenPengetahuan).where(
    eq(manajemenPengetahuan.surveiId, surveiId)
  );

  if (existing.length > 0) {
    // Update existing record
    const updated = await db.update(manajemenPengetahuan)
      .set(data)
      .where(eq(manajemenPengetahuan.surveiId, surveiId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    // Convert BigInt values to numbers for JSON serialization
    const result = convertBigIntToNumber(updated[0]);

    return NextResponse.json(result);
  } else {
    // Insert new record
    const inserted = await db.insert(manajemenPengetahuan).values({ surveiId, ...data }).returning();

    // Convert BigInt values to numbers for JSON serialization
    const result = convertBigIntToNumber(inserted[0]);

    return NextResponse.json(result);
  }
}