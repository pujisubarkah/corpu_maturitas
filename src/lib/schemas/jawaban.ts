import { pgTable, serial, integer, jsonb, timestamp } from 'drizzle-orm/pg-core'

export const jawaban = pgTable('jawaban', {
	id: serial('id').primaryKey(),
	instansi_id: integer('instansi_id'),
	tahun: integer('tahun'),
	jawaban: jsonb('jawaban'),
	created_at: timestamp('created_at', { mode: 'date' }).defaultNow(),
	updated_at: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})