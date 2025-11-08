import { pgTable, serial, integer, jsonb, timestamp, varchar, boolean } from 'drizzle-orm/pg-core'

export const jawaban = pgTable('jawaban', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id'),
  tahun: integer('tahun'),
  jawaban: jsonb('jawaban'),
  created_at: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'date' }).defaultNow(),
  is_verified: boolean('is_verified').default(false),
  verified_by: varchar('verified_by', { length: 100 }),
  verified_at: timestamp('verified_at', { mode: 'date' }),
  verification_answers: jsonb('verification_answers'),
  bukti_dukung: jsonb('bukti_dukung'),
})
