import { pgTable, bigint, integer, varchar } from 'drizzle-orm/pg-core'

export const masterInstansiType = pgTable('instansi', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  instansi_id: bigint('instansi_id', { mode: 'number' }),
  nama_instansi: varchar('nama_instansi'),
  instansi_type_id: integer('instansi_type_id'),
})