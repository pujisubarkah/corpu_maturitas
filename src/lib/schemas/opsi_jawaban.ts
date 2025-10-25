import { pgTable, serial, integer, text, boolean, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { pertanyaanKompetensi } from './pertanyaan_kompetensi'

export const opsiJawaban = pgTable('opsi_jawaban', {
	id: serial('id').primaryKey(),
	pertanyaan_id: integer('pertanyaan_id').references(() => pertanyaanKompetensi.id),
	label: text('label'),
	nilai: text('nilai'),
	urutan: integer('urutan'),
	is_active: boolean('is_active').default(true),
	created_at: timestamp('created_at', { mode: 'date' }).defaultNow(),
	updated_at: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})

// Relations
export const opsiJawabanRelations = relations(opsiJawaban, ({ one }) => ({
	pertanyaanKompetensi: one(pertanyaanKompetensi, {
		fields: [opsiJawaban.pertanyaan_id],
		references: [pertanyaanKompetensi.id],
	}),
}))

// Add relation to pertanyaanKompetensi from opsiJawaban side
export const pertanyaanKompetensiOpsiRelations = relations(pertanyaanKompetensi, ({ many }) => ({
	opsiJawaban: many(opsiJawaban),
}))