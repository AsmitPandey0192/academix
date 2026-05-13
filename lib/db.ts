import { Pool } from 'pg'

declare global {
  // eslint-disable-next-line no-var
  var __academix_pool: Pool | undefined
}

export function getPool() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set')
  }
  if (!globalThis.__academix_pool) {
    globalThis.__academix_pool = new Pool({
      connectionString: url,
      ssl: url.includes('sslmode=require') ? { rejectUnauthorized: false } : undefined,
    })
  }
  return globalThis.__academix_pool
}

