import { pgTable, serial, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { kategori } from './kategori'
import { opsiJawaban } from './opsi_jawaban'

export const pertanyaanKompetensi = pgTable('pertanyaan_kompetensi', {
	id: serial('id').primaryKey(),
	kode: varchar('kode', { length: 50 }),
	pertanyaan: text('pertanyaan'),
	deskripsi: text('deskripsi'),
	kategori_id: integer('kategori_id').references(() => kategori.id),
	tipe_jawaban: varchar('tipe_jawaban', { length: 50 }),
	urutan: integer('urutan'),
	is_required: boolean('is_required').default(true),
	created_at: timestamp('created_at', { mode: 'date' }).defaultNow(),
	updated_at: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})

// Relations
export const pertanyaanKompetensiRelations = relations(pertanyaanKompetensi, ({ one, many }) => ({
	kategori: one(kategori, {
		fields: [pertanyaanKompetensi.kategori_id],
		references: [kategori.id],
	}),
	opsiJawaban: many(opsiJawaban),
}))

export const kategoriRelations = relations(kategori, ({ many }) => ({
	pertanyaanKompetensi: many(pertanyaanKompetensi),
}))