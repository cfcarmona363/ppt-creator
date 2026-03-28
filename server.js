import express from 'express'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { query, initDb } from './db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json({ limit: '5mb' }))

// Auth middleware for mutation endpoints
function requireAuth(req, res, next) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'Authorization required' })

  const token = auth.replace('Bearer ', '')
  if (
    token === process.env.DASHBOARD_PASSWORD ||
    token === process.env.DEPLOY_SECRET
  ) {
    return next()
  }
  return res.status(403).json({ error: 'Invalid credentials' })
}

// Auth endpoint
app.post('/api/auth', (req, res) => {
  const { password } = req.body
  if (password === process.env.DASHBOARD_PASSWORD) {
    return res.json({ ok: true })
  }
  return res.status(401).json({ error: 'Invalid password' })
})

// ---- Presentations ----

// List presentations (with optional folder filter and search)
app.get('/api/presentations', async (req, res) => {
  try {
    const { folder_id, q } = req.query
    let text = 'SELECT id, slug, title, description, slides_count, theme, folder_id, created_at, updated_at FROM presentations'
    const conditions = ['deleted_at IS NULL']
    const params = []

    if (folder_id) {
      if (folder_id === 'root') {
        conditions.push('folder_id IS NULL')
      } else {
        params.push(folder_id)
        conditions.push(`folder_id = $${params.length}`)
      }
    }

    if (q) {
      params.push(`%${q}%`)
      conditions.push(`(title ILIKE $${params.length} OR description ILIKE $${params.length})`)
    }

    text += ' WHERE ' + conditions.join(' AND ')

    text += ' ORDER BY created_at DESC'

    const result = await query(text, params)
    res.json(result.rows)
  } catch (err) {
    console.error('Error fetching presentations:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create presentation
app.post('/api/presentations', requireAuth, async (req, res) => {
  try {
    const { slug, title, description, html_content, slides_count, theme, folder_id } = req.body

    if (!slug || !title || !html_content) {
      return res.status(400).json({ error: 'slug, title, and html_content are required' })
    }

    const result = await query(
      `INSERT INTO presentations (slug, title, description, html_content, slides_count, theme, folder_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (slug) DO UPDATE SET
         title = EXCLUDED.title,
         description = EXCLUDED.description,
         html_content = EXCLUDED.html_content,
         slides_count = EXCLUDED.slides_count,
         theme = EXCLUDED.theme,
         updated_at = now(),
         deleted_at = NULL
       RETURNING id, slug, title, description, slides_count, theme, folder_id, created_at, updated_at`,
      [slug, title, description || null, html_content, slides_count || 0, theme || null, folder_id || null]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Error creating presentation:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update presentation (move to folder)
app.patch('/api/presentations/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { folder_id } = req.body

    const result = await query(
      `UPDATE presentations SET folder_id = $1, updated_at = now()
       WHERE id = $2 AND deleted_at IS NULL
       RETURNING id, slug, title, description, slides_count, theme, folder_id, created_at, updated_at`,
      [folder_id || null, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Presentation not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Error updating presentation:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete presentation (soft delete)
app.delete('/api/presentations/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const result = await query(
      'UPDATE presentations SET deleted_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Presentation not found' })
    }
    res.json({ ok: true })
  } catch (err) {
    console.error('Error deleting presentation:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ---- Folders ----

// List folders
app.get('/api/folders', async (req, res) => {
  try {
    const result = await query('SELECT * FROM folders ORDER BY name ASC')
    res.json(result.rows)
  } catch (err) {
    console.error('Error fetching folders:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create folder
app.post('/api/folders', requireAuth, async (req, res) => {
  try {
    const { name } = req.body
    if (!name) return res.status(400).json({ error: 'name is required' })

    const result = await query(
      'INSERT INTO folders (name) VALUES ($1) RETURNING *',
      [name]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Error creating folder:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update folder (rename)
app.patch('/api/folders/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body
    if (!name) return res.status(400).json({ error: 'name is required' })

    const result = await query(
      'UPDATE folders SET name = $1, updated_at = now() WHERE id = $2 RETURNING *',
      [name, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Folder not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Error updating folder:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete folder
app.delete('/api/folders/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const result = await query('DELETE FROM folders WHERE id = $1 RETURNING id', [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Folder not found' })
    }
    res.json({ ok: true })
  } catch (err) {
    console.error('Error deleting folder:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ---- Serve presentations ----

app.get('/p/:id', async (req, res) => {
  const slug = req.params.id.replace(/[^a-zA-Z0-9_-]/g, '')
  try {
    const result = await query('SELECT html_content FROM presentations WHERE slug = $1 AND deleted_at IS NULL', [slug])
    if (result.rows.length > 0) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      return res.send(result.rows[0].html_content)
    }
  } catch (err) {
    console.error('Error serving presentation:', err)
  }

  // Fallback: try serving from file (for backward compatibility during migration)
  const filePath = path.join(__dirname, 'public', 'presentations', `${slug}.html`)
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath)
  }

  res.status(404).send('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>No encontrada</title><style>body{background:#09090b;color:#fafafa;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}div{text-align:center}h1{font-size:4rem;margin-bottom:1rem;opacity:0.3}p{color:#71717a}</style></head><body><div><h1>404</h1><p>Presentación no encontrada</p></div></body></html>')
})

// Serve built React app
app.use(express.static(path.join(__dirname, 'dist')))

// SPA fallback
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html')
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath)
  }
  res.status(404).send('Not found')
})

// Initialize database and start server
initDb()
  .then(() => {
    console.log('Database initialized successfully')
    app.listen(PORT, () => {
      console.log(`Presentation Hub running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err)
    if (process.env.DATABASE_URL) {
      // DB is configured but failed - this is a real error, exit
      process.exit(1)
    }
    // No DB configured (local dev) - start anyway
    app.listen(PORT, () => {
      console.log(`Presentation Hub running on port ${PORT} (without database)`)
    })
  })
