import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { surveiCorpu } from "../../../lib/schemas/profile_surveys";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const tahun = searchParams.get('tahun');

  if (userId && tahun) {
    const data = await db.select().from(surveiCorpu).where(and(
      eq(surveiCorpu.userId, parseInt(userId)),
      eq(surveiCorpu.tahun, parseInt(tahun))
    ));
    return NextResponse.json({ data });
  } else {
    const data = await db.select().from(surveiCorpu);
    return NextResponse.json({ data });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, tahun } = body;

  // Check if record exists
  const existing = await db.select().from(surveiCorpu).where(and(
    eq(surveiCorpu.userId, userId),
    eq(surveiCorpu.tahun, tahun)
  ));

  if (existing.length > 0) {
    return NextResponse.json(existing[0]);
  } else {
    // Insert new record
    const inserted = await db.insert(surveiCorpu).values({ userId, tahun }).returning();
    return NextResponse.json(inserted[0]);
  }
}