import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pg from 'pg'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const { Pool } = pg
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

async function migrate() {
  const indexPath = path.join(__dirname, '..', 'public', 'presentations', 'index.json')

  if (!fs.existsSync(indexPath)) {
    console.log('No index.json found, nothing to migrate.')
    process.exit(0)
  }

  const manifest = JSON.parse(fs.readFileSync(indexPath, 'utf-8'))
  console.log(`Found ${manifest.length} presentations to migrate.`)

  let migrated = 0
  let skipped = 0

  for (const entry of manifest) {
    const htmlPath = path.join(__dirname, '..', 'public', 'presentations', `${entry.id}.html`)

    if (!fs.existsSync(htmlPath)) {
      console.log(`  Skipping "${entry.id}" - HTML file not found`)
      skipped++
      continue
    }

    const htmlContent = fs.readFileSync(htmlPath, 'utf-8')

    try {
      await pool.query(
        `INSERT INTO presentations (slug, title, description, html_content, slides_count, theme, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (slug) DO NOTHING`,
        [
          entry.id,
          entry.title,
          entry.description || null,
          htmlContent,
          entry.slides_count || 0,
          entry.theme || null,
          entry.created ? new Date(entry.created) : new Date(),
        ]
      )
      console.log(`  Migrated: "${entry.title}" (${entry.id})`)
      migrated++
    } catch (err) {
      console.error(`  Error migrating "${entry.id}":`, err.message)
      skipped++
    }
  }

  console.log(`\nMigration complete: ${migrated} migrated, ${skipped} skipped.`)
  await pool.end()
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
