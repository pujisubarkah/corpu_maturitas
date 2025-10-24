import { pgTable, bigint, varchar, real } from 'drizzle-orm/pg-core';

export const instrumentQuestion = pgTable('instrument_question', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  dimensionId: bigint('dimension_id', { mode: 'number' }),
  dimensionName: varchar('dimension_name', { length: 100 }),
  indicatorId: bigint('indicator_id', { mode: 'number' }),
  indicatorQuestion: varchar('indicator_question', { length: 500 }),
  indicatorWeight: real('indicator_weight'),
  dimensionWeight: real('dimension_weight'),
  finalWeight: real('final_weight'),
  indicatorDescription: varchar('indicator_description', { length: 500 }),
});
