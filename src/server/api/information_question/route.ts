import { NextResponse } from "next/server";
// Update the path below to the correct location of your db connection file
import { db } from "../../../lib/db"; // pastikan path ini sesuai dengan file koneksi drizzle-mu
// Update the path below to the correct location of your instrumentQuestion schema file
// Update the path below to the correct location of your instrumentQuestion schema file
import { instrumentQuestion } from "../../../lib/schemas/instrument_question";
import { eq } from "drizzle-orm";

// =========================
// GET: Ambil semua data
// =========================
export async function GET() {
  try {
    const data = await db.select().from(instrumentQuestion);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET instrument_question error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}

// =========================
// POST: Tambah data baru
// =========================
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

    // Validasi sederhana
    if (!indicatorId || !indicatorQuestion) {
      return NextResponse.json(
        { success: false, message: "indicatorId dan indicatorQuestion wajib diisi" },
        { status: 400 }
      );
    }

    const [inserted] = await db
      .insert(instrumentQuestion)
      .values({
        dimensionId,
        dimensionName,
        indicatorId,
        indicatorQuestion,
        indicatorWeight,
        dimensionWeight,
        finalWeight,
        indicatorDescription,
      })
      .returning();

    return NextResponse.json({ success: true, data: inserted });
  } catch (error) {
    console.error("POST instrument_question error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menambahkan data" },
      { status: 500 }
    );
  }
}
