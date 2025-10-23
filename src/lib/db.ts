import { Pool } from 'pg'
// Drizzle client for Postgres (node-postgres)
// Uses DATABASE_URL from environment. Ensure you set it in .env.local
import { drizzle } from 'drizzle-orm/node-postgres'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export const db = drizzle(pool)

export default db

// Example usage:
// import { sql } from 'drizzle-orm'
// await db.select().from(...)
