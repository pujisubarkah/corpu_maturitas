import { pgTable, serial, varchar } from 'drizzle-orm/pg-core'

export const instansiType = pgTable('instansi_type', {
  id: serial('id').primaryKey(),
  kat_instansi: varchar('kat_instansi'),
})