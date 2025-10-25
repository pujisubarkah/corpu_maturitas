import { pgTable, integer, varchar, text, timestamp } from 'drizzle-orm/pg-core'

export const kategori = pgTable('kategori_instrumen', {
	id: integer('id').primaryKey(),
	nama: varchar('nama', { length: 255 }),
	deskripsi: text('deskripsi'),
	created_at: timestamp('created_at', { mode: 'date' }).defaultNow(),
	updated_at: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})