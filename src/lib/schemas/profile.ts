import { pgTable, bigint, integer, varchar, timestamp } from 'drizzle-orm/pg-core'

export const profile = pgTable('profile', {
	id: bigint('id', { mode: 'number' }).notNull().primaryKey(),
	user_id: bigint('user_id', { mode: 'number' }),
	nip: varchar('nip', { length: 128 }),
	email: varchar('email', { length: 255 }),
	position: varchar('position', { length: 255 }),
	unit: varchar('unit', { length: 255 }),
	instansi_type_id: integer('instansi_type_id'),
	instansi: varchar('instansi', { length: 255 }),
	contact: varchar('contact', { length: 64 }),
	created_at: timestamp('created_at', { mode: 'date' }).defaultNow(),
	updated_at: timestamp('updated_at', { mode: 'date' }).defaultNow(),
	nama_lengkap: varchar('nama_lengkap', { length: 255 }),
})

