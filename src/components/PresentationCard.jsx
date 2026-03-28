import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'

export default function PresentationCard({ presentation, onDelete }) {
  const [copied, setCopied] = useState(false)

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `presentation-${presentation.id}`,
    data: { presentationId: presentation.id },
  })

  const dragStyle = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : {}

  async function handleCopyUrl(e) {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/p/${presentation.slug}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleDelete(e) {
    e.preventDefault()
    e.stopPropagation()
    onDelete(presentation)
  }

  const formattedDate = presentation.created_at
    ? new Date(presentation.created_at).toLocaleDateString('es-AR')
    : ''

  return (
    <div
      ref={setNodeRef}
      style={{
        ...styles.card,
        ...dragStyle,
        opacity: isDragging ? 0.5 : 1,
      }}
      {...listeners}
      {...attributes}
    >
      {/* Action buttons */}
      <div style={styles.cardActions}>
        <button onClick={handleCopyUrl} style={styles.actionBtn} title="Copiar URL">
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          )}
        </button>
        <button onClick={handleDelete} style={styles.actionBtn} title="Eliminar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>

      <a href={`/p/${presentation.slug}`} style={styles.link} target="_blank" rel="noopener noreferrer">
        <div style={styles.cardTheme}>
          <span style={styles.slideCount}>{presentation.slides_count} slides</span>
        </div>
        <div style={styles.cardBody}>
          <h3 style={styles.cardTitle}>{presentation.title}</h3>
          <p style={styles.cardDescription}>{presentation.description}</p>
          <div style={styles.cardMeta}>
            <span style={styles.cardDate}>{formattedDate}</span>
            {presentation.theme && (
              <span style={styles.cardBadge}>{presentation.theme}</span>
            )}
          </div>
        </div>
      </a>
    </div>
  )
}

const styles = {
  card: {
    position: 'relative',
    background: '#18181b',
    border: '1px solid #27272a',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'transform 0.2s ease, border-color 0.2s ease',
    cursor: 'grab',
  },
  link: {
    display: 'block',
    textDecoration: 'none',
    color: 'inherit',
  },
  cardActions: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    display: 'flex',
    gap: '0.25rem',
    zIndex: 2,
  },
  actionBtn: {
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    border: 'none',
    color: '#d4d4d8',
    cursor: 'pointer',
    padding: '0.375rem',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '6px',
    transition: 'background 0.15s ease',
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
