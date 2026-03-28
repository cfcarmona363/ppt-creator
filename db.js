import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

export function query(text, params) {
  return pool.query(text, params)
}

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS folders (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name       TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS presentations (
      id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug         TEXT NOT NULL UNIQUE,
      title        TEXT NOT NULL,
      description  TEXT,
      html_content TEXT NOT NULL,
      slides_count INTEGER DEFAULT 0,
      theme        TEXT,
      folder_id    UUID REFERENCES folders(id) ON DELETE SET NULL,
      created_at   TIMESTAMPTZ DEFAULT now(),
      updated_at   TIMESTAMPTZ DEFAULT now()
    )
  `)

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_presentations_slug ON presentations(slug)
  `)
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_presentations_folder ON presentations(folder_id)
  `)
}

export default pool
