import { pgTable, bigint as pgBigInt, varchar, real } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Schema: instrument_question
export const instrumentQuestion = pgTable('instrument_question', {
  id: pgBigInt('id', { mode: 'number' })
    .primaryKey()
    .notNull()
    .default(sql`generated always as identity`), // auto increment

  dimensionId: pgBigInt('dimension_id', { mode: 'number' }),
  dimensionName: varchar('dimension_name', { length: 255 }),

  indicatorId: pgBigInt('indicator_id', { mode: 'number' }),
  indicatorQuestion: varchar('indicator_question', { length: 500 }),

  indicatorWeight: real('indicator_weight'),
  dimensionWeight: real('dimension_weight'),
  finalWeight: real('final_weight'),

  indicatorDescription: varchar('indicator_description', { length: 500 }),
});
