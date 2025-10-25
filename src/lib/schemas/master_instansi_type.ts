import { pgTable, integer, bigint, varchar, timestamp } from 'drizzle-orm/pg-core'

export const masterInstansiType = pgTable('master_instansi_type', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  instansi_id: bigint('instansi_id', { mode: 'number' }),
  nama_instansi: varchar('nama_instansi'),
  instansi_type_id: integer('instansi_type_id'),
  created_at: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})