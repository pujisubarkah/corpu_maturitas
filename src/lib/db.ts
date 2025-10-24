import { Pool } from 'pg'
// Drizzle client for Postgres (node-postgres)
// Uses DATABASE_URL from environment. Ensure you set it in .env.local
import { drizzle } from 'drizzle-orm/node-postgres'

if (!process.env.DATABASE_URL) {
	console.error('Missing DATABASE_URL environment variable. Set DATABASE_URL in .env.local');
	throw new Error('Missing DATABASE_URL environment variable');
}

// Try to parse and log the hostname (masked) to help debug DNS/host issues like ENOTFOUND
try {
	const parsed = new URL(process.env.DATABASE_URL as string);
	console.log('Connecting to database host:', parsed.hostname);
} catch (e: any) {
	console.error('Invalid DATABASE_URL format:', e?.message ?? e);
	throw e;
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export const db = drizzle(pool)

export default db

// Example usage:
// import { sql } from 'drizzle-orm'
// await db.select().from(...)
