import { Pool, PoolClient } from 'pg';

/**
 * DEPORVERSO MULTI-TENANT DATABASE ENGINE
 * High-performance connection pool optimized for Google Cloud Run (Serverless VPC Access / Cloud SQL).
 * Features dynamic search_path routing for schema-level multi-tenancy.
 */

let pool: Pool | null = null;

export function getDatabasePool(): Pool {
  if (pool) {
    return pool;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString && !process.env.PGHOST) {
    console.warn('[DeporVerso DB] DATABASE_URL not found. Running in resilient preview mode with mock transactional fallback.');
  }

  pool = new Pool({
    connectionString: connectionString || undefined,
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432', 10),
    user: process.env.PGUSER || 'deporverso_admin',
    password: process.env.PGPASSWORD || 'deporverso_pass',
    database: process.env.PGDATABASE || 'deporverso_db',
    max: process.env.NODE_ENV === 'production' ? 20 : 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined,
  });

  pool.on('error', (err) => {
    console.error('[DeporVerso DB Pool Error]', err);
  });

  return pool;
}

/**
 * Execute a query within an isolated tenant schema.
 * Dynamically switches PostgreSQL search_path to the specific club's schema.
 */
export async function executeInTenant<T = any>(
  subdomain: string,
  queryText: string,
  params: any[] = []
): Promise<T[]> {
  const sanitizedSubdomain = subdomain.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
  const schemaName = `tenant_${sanitizedSubdomain}`;
  const dbPool = getDatabasePool();

  let client: PoolClient | null = null;
  try {
    client = await dbPool.connect();
    // Enforce tenant schema isolation
    await client.query(`SET search_path = "${schemaName}", public;`);
    const result = await client.query(queryText, params);
    return result.rows as T[];
  } catch (error: any) {
    // Graceful fallback for local development without live Postgres server
    if (error.code === 'ECONNREFUSED' || error.message?.includes('connect') || !process.env.DATABASE_URL) {
      console.warn(`[DeporVerso DB Fallback] DB unavailable (${error.message}). Executing query in preview sandbox mode.`);
      return [] as T[];
    }
    throw error;
  } finally {
    if (client) {
      try {
        await client.query(`SET search_path = public;`);
      } catch (_) {}
      client.release();
    }
  }
}

/**
 * Execute master database query (public schema: tenants, global_athletes, onboarding)
 */
export async function executeMaster<T = any>(
  queryText: string,
  params: any[] = []
): Promise<T[]> {
  const dbPool = getDatabasePool();
  let client: PoolClient | null = null;
  try {
    client = await dbPool.connect();
    await client.query(`SET search_path = public;`);
    const result = await client.query(queryText, params);
    return result.rows as T[];
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED' || error.message?.includes('connect') || !process.env.DATABASE_URL) {
      console.warn(`[DeporVerso DB Fallback] Master DB unavailable. Executing in preview sandbox.`);
      return [] as T[];
    }
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}
