import { pgTable, integer, varchar } from 'drizzle-orm/pg-core'

export const masterInstansiType = pgTable('instansi', {
  id: integer('id').primaryKey(),
  instansi_id: integer('instansi_id'),
  nama_instansi: varchar('nama_instansi'),
  instansi_type_id: integer('instansi_type_id'),
})