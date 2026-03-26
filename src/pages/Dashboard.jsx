import { useState, useEffect } from 'react'
import PasswordGate from '../components/PasswordGate'

function PresentationCard({ presentation }) {
  return (
    <a href={`/p/${presentation.id}`} style={styles.card}>
      <div style={styles.cardTheme}>
        <span style={styles.slideCount}>{presentation.slides_count} slides</span>
      </div>
      <div style={styles.cardBody}>
        <h3 style={styles.cardTitle}>{presentation.title}</h3>
        <p style={styles.cardDescription}>{presentation.description}</p>
        <div style={styles.cardMeta}>
          <span style={styles.cardDate}>{presentation.created}</span>
          {presentation.theme && (
            <span style={styles.cardBadge}>{presentation.theme}</span>
          )}
        </div>
      </div>
    </a>
  )
}

function DashboardContent() {
  const [presentations, setPresentations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/presentations')
      .then((res) => res.json())
      .then((data) => {
        setPresentations(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setError('Error cargando presentaciones')
        setLoading(false)
      })
  }, [])

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.heading}>Presentation Hub</h1>
          <p style={styles.subheading}>
            {presentations.length} presentacion{presentations.length !== 1 ? 'es' : ''}
          </p>
        </div>
      </header>

      {loading && <p style={styles.status}>Cargando...</p>}
      {error && <p style={styles.statusError}>{error}</p>}

      {!loading && !error && presentations.length === 0 && (
        <div style={styles.empty}>
          <p style={styles.emptyText}>No hay presentaciones todavía</p>
          <p style={styles.emptyHint}>
            Pedile a Claude que te genere una presentación para empezar
          </p>
        </div>
      )}

      <div style={styles.grid}>
        {presentations.map((p) => (
          <PresentationCard key={p.id} presentation={p} />
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <PasswordGate>
      <DashboardContent />
    </PasswordGate>
  )
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2.5rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid #27272a',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 700,
    letterSpacing: '-0.025em',
  },
  subheading: {
    color: '#71717a',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
  },
  status: {
    color: '#a1a1aa',
    textAlign: 'center',
    padding: '4rem 0',
  },
  statusError: {
    color: '#ef4444',
    textAlign: 'center',
    padding: '4rem 0',
  },
  empty: {
    textAlign: 'center',
    padding: '4rem 0',
  },
  emptyText: {
    color: '#a1a1aa',
    fontSize: '1.125rem',
    marginBottom: '0.5rem',
  },
  emptyHint: {
    color: '#52525b',
    fontSize: '0.875rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.25rem',
  },
  card: {
    display: 'block',
    background: '#18181b',
    border: '1px solid #27272a',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'transform 0.2s ease, border-color 0.2s ease',
    cursor: 'pointer',
  },
  cardTheme: {
    height: '120px',
    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: '0.75rem',
  },
  slideCount: {
    background: 'rgba(0,0,0,0.5)',
    color: '#e0e7ff',
    fontSize: '0.75rem',
    padding: '0.25rem 0.5rem',
    borderRadius: '6px',
    backdropFilter: 'blur(4px)',
  },
  cardBody: {
    padding: '1.25rem',
  },
  cardTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: '#fafafa',
  },
  cardDescription: {
    color: '#a1a1aa',
    fontSize: '0.875rem',
    lineHeight: 1.5,
    marginBottom: '1rem',
  },
  cardMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDate: {
    color: '#52525b',
    fontSize: '0.75rem',
  },
  cardBadge: {
    background: '#27272a',
    color: '#a1a1aa',
    fontSize: '0.7rem',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
}
