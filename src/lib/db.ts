import { Pool, QueryResult, QueryResultRow } from 'pg';

declare global { var _pgPool: Pool | undefined; }

const ssl = process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false as const } : undefined;

const pool = global._pgPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl,
  max: 10,
});

if (!global._pgPool) global._pgPool = pool;

type QueryParams = ReadonlyArray<unknown> | undefined;

export const db = {
  query<T extends QueryResultRow = QueryResultRow>(text: string, params?: QueryParams) {
    if (params && params.length) return pool.query<T>({ text, values: params as never[] });
    return pool.query<T>(text);
  },
};
export type { QueryResult, QueryResultRow };
