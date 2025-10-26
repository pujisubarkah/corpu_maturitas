import { pgTable, bigint, varchar, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  roleId: bigint('role_id', { mode: 'number' }),
  username: varchar('username', { length: 100 }).unique(),
  password: varchar('password', { length: 100 }),
  fullName: varchar('full_name', { length: 100 }),
  instansiId: integer('instansi_id'),
});
