import { useDroppable } from '@dnd-kit/core'

export default function FolderItem({ folder, isSelected, onClick, onDelete, onRename }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `folder-${folder.id}`,
    data: { folderId: folder.id },
  })

  return (
    <div
      ref={setNodeRef}
      onClick={() => onClick(folder.id)}
      style={{
        ...styles.item,
        background: isSelected ? '#27272a' : isOver ? '#1e1b4b' : 'transparent',
        borderColor: isOver ? '#4338ca' : 'transparent',
      }}
    >
      <span style={styles.icon}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      </span>
      <span style={styles.name}>{folder.name}</span>
      <div style={styles.actions}>
        <button
          onClick={(e) => { e.stopPropagation(); onRename(folder) }}
          style={styles.actionBtn}
          title="Renombrar"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(folder) }}
          style={styles.actionBtn}
          title="Eliminar"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  )
}

const styles = {
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    cursor: 'pointer',
    border: '1px solid transparent',
    transition: 'background 0.15s ease, border-color 0.15s ease',
  },
  icon: {
    color: '#71717a',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  name: {
    fontSize: '0.8rem',
    color: '#d4d4d8',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1,
  },
  actions: {
    display: 'flex',
    gap: '0.25rem',
    opacity: 0.4,
    transition: 'opacity 0.15s ease',
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    color: '#71717a',
    cursor: 'pointer',
    padding: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '4px',
  },
}
