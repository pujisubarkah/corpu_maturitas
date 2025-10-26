import { pgTable, serial, integer, text, timestamp } from 'drizzle-orm/pg-core'
import { jawaban } from './jawaban'

export const jawabanDetail = pgTable('jawaban_detail', {
  id: serial('id').primaryKey(),
  jawaban_id: integer('jawaban_id').references(() => jawaban.id),
  pertanyaan_id: integer('pertanyaan_id'),
  jawaban: text('jawaban'),
  created_at: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})
