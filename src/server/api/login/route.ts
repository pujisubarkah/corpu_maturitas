import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/src/lib/db';
import { users } from '@/src/lib/schemas/user';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password wajib diisi' });
  }

  try {
    const user = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (!user.length) {
      return res.status(401).json({ error: 'Username tidak ditemukan' });
    }
    // Simple password check (plain text, sebaiknya gunakan hash di produksi)
    if (user[0].password !== password) {
      return res.status(401).json({ error: 'Password salah' });
    }
    // Return user data (tanpa password)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userData } = user[0];
    return res.status(200).json({ user: userData });
  } catch {
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}
