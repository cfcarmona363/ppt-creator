import { useState } from 'react'

export default function PasswordGate({ children }) {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem('dashboard_auth') === 'true'
  )
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      if (res.ok) {
        sessionStorage.setItem('dashboard_auth', 'true')
        setAuthenticated(true)
      } else {
        setError('Password incorrecto')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (authenticated) return children

  return (
    <div style={styles.overlay}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.icon}>🔒</div>
        <h2 style={styles.title}>Presentation Hub</h2>
        <p style={styles.subtitle}>Ingresá el password para acceder al dashboard</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={styles.input}
          autoFocus
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Verificando...' : 'Acceder'}
        </button>
      </form>
    </div>
  )
}

const styles = {
  overlay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '1rem',
  },
  card: {
    background: '#18181b',
    border: '1px solid #27272a',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  icon: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    color: '#fafafa',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#a1a1aa',
    marginBottom: '1.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    background: '#09090b',
    border: '1px solid #3f3f46',
    borderRadius: '8px',
    color: '#fafafa',
    fontSize: '1rem',
    outline: 'none',
    marginBottom: '1rem',
  },
  error: {
    color: '#ef4444',
    fontSize: '0.875rem',
    marginBottom: '1rem',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    background: '#fafafa',
    color: '#09090b',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
}
