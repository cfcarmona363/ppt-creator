import express from 'express'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// Auth endpoint
app.post('/api/auth', (req, res) => {
  const { password } = req.body
  if (password === process.env.DASHBOARD_PASSWORD) {
    return res.json({ ok: true })
  }
  return res.status(401).json({ error: 'Invalid password' })
})

// Presentations manifest
app.get('/api/presentations', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'presentations', 'index.json')
  try {
    const data = JSON.parse(fs.readFileSync(indexPath, 'utf-8'))
    res.json(data)
  } catch {
    res.json([])
  }
})

// Serve raw HTML presentations (BEFORE static middleware)
app.get('/p/:id', (req, res) => {
  const id = req.params.id.replace(/[^a-zA-Z0-9_-]/g, '')
  const filePath = path.join(__dirname, 'public', 'presentations', `${id}.html`)
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

app.listen(PORT, () => {
  console.log(`Presentation Hub running on port ${PORT}`)
})
