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

  async function handleCopyUrl() {
    const url = `${window.location.origin}/p/${presentation.slug}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
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

  function handleOpen() {
    window.open(`/p/${presentation.slug}`, '_blank')
  }

  function handleDelete() {
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
    >
      {/* Header with action buttons - NOT draggable */}
      <div style={styles.cardHeader}>
        <span style={styles.slideCount}>{presentation.slides_count} slides</span>
        <div style={styles.cardActions}>
          <button onClick={handleOpen} style={styles.actionBtn} title="Abrir presentación">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </button>
          <button onClick={handleCopyUrl} style={styles.actionBtn} title={copied ? 'Copiado!' : 'Copiar link'}>
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
          <button onClick={handleDelete} style={styles.actionBtnDanger} title="Eliminar presentación">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Body - draggable zone */}
      <div style={styles.dragZone} {...listeners} {...attributes}>
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
      </div>
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
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0.75rem',
    background: '#111113',
    borderBottom: '1px solid #27272a',
  },
  slideCount: {
    color: '#71717a',
    fontSize: '0.75rem',
  },
  cardActions: {
    display: 'flex',
    gap: '0.25rem',
  },
  actionBtn: {
    background: 'none',
    border: '1px solid transparent',
    color: '#71717a',
    cursor: 'pointer',
    padding: '0.35rem',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '6px',
    transition: 'color 0.15s ease, background 0.15s ease',
  },
  actionBtnDanger: {
    background: 'none',
    border: '1px solid transparent',
    color: '#71717a',
    cursor: 'pointer',
    padding: '0.35rem',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '6px',
    transition: 'color 0.15s ease, background 0.15s ease',
  },
  dragZone: {
    cursor: 'grab',
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
