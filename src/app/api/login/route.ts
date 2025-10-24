import { NextResponse } from 'next/server';
import { db } from '@/src/lib/db';
import { users } from '@/src/lib/schemas/user';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  if (!username || !password) {
    return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 });
  }
  try {
    const user = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (!user.length) {
      return NextResponse.json({ error: 'Username tidak ditemukan' }, { status: 401 });
    }
    if (user[0].password !== password) {
      return NextResponse.json({ error: 'Password salah' }, { status: 401 });
    }
    const { password: _, ...userData } = user[0];
    return NextResponse.json({ user: userData });
  } catch (err: any) {
    // Log the error to the server console for debugging
    console.error('API /api/login error:', err);
    const message = err?.message ?? 'Terjadi kesalahan server';
    // Return the actual error message during development to help diagnose the 500
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
