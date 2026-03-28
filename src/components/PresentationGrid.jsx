import PresentationCard from './PresentationCard'

export default function PresentationGrid({ presentations, onDelete }) {
  if (presentations.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyText}>No hay presentaciones</p>
        <p style={styles.emptyHint}>
          Pedile a Claude que te genere una presentación para empezar
        </p>
      </div>
    )
  }

  return (
    <div style={styles.grid}>
      {presentations.map((p) => (
        <PresentationCard key={p.id} presentation={p} onDelete={onDelete} />
      ))}
    </div>
  )
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.25rem',
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
}
