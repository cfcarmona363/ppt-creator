import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import FolderItem from './FolderItem'
import ConfirmModal from './ConfirmModal'
import { apiFetch } from '../hooks/useApi'

export default function FolderList({ folders, selectedFolderId, onSelectFolder, onFoldersChange }) {
  const [showNewInput, setShowNewInput] = useState(false)
  const [newName, setNewName] = useState('')
  const [renamingFolder, setRenamingFolder] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const [deletingFolder, setDeletingFolder] = useState(null)

  const { setNodeRef: rootRef, isOver: isOverRoot } = useDroppable({
    id: 'folder-root',
    data: { folderId: null },
  })

  async function handleCreate(e) {
    e.preventDefault()
    if (!newName.trim()) return
    try {
      await apiFetch('/api/folders', {
        method: 'POST',
        body: JSON.stringify({ name: newName.trim() }),
      })
      setNewName('')
      setShowNewInput(false)
      onFoldersChange()
    } catch (err) {
      console.error('Error creating folder:', err)
    }
  }

  async function handleRename(e) {
    e.preventDefault()
    if (!renameValue.trim() || !renamingFolder) return
    try {
      await apiFetch(`/api/folders/${renamingFolder.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: renameValue.trim() }),
      })
      setRenamingFolder(null)
      onFoldersChange()
    } catch (err) {
      console.error('Error renaming folder:', err)
    }
  }

  async function handleDelete() {
    if (!deletingFolder) return
    try {
      await apiFetch(`/api/folders/${deletingFolder.id}`, { method: 'DELETE' })
      setDeletingFolder(null)
      if (selectedFolderId === deletingFolder.id) {
        onSelectFolder(null)
      }
      onFoldersChange()
    } catch (err) {
      console.error('Error deleting folder:', err)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.sectionHeader}>
        <span style={styles.sectionTitle}>Carpetas</span>
        <button
          onClick={() => { setShowNewInput(true); setNewName('') }}
          style={styles.addBtn}
          title="Nueva carpeta"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* All presentations (root drop target) */}
      <div
        ref={rootRef}
        onClick={() => onSelectFolder(null)}
        style={{
          ...styles.allItem,
          background: selectedFolderId === null ? '#27272a' : isOverRoot ? '#1e1b4b' : 'transparent',
          borderColor: isOverRoot ? '#4338ca' : 'transparent',
        }}
      >
        <span style={styles.allIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </span>
        <span style={styles.allText}>Todas</span>
      </div>

      {/* New folder input */}
      {showNewInput && (
        <form onSubmit={handleCreate} style={styles.inputForm}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nombre de carpeta"
            style={styles.input}
            autoFocus
            onBlur={() => { if (!newName.trim()) setShowNewInput(false) }}
          />
        </form>
      )}

      {/* Rename input */}
      {renamingFolder && (
        <form onSubmit={handleRename} style={styles.inputForm}>
          <input
            type="text"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            placeholder="Nuevo nombre"
            style={styles.input}
            autoFocus
            onBlur={() => setRenamingFolder(null)}
          />
        </form>
      )}

      {/* Folder items */}
      {folders.map((folder) => (
        <FolderItem
          key={folder.id}
          folder={folder}
          isSelected={selectedFolderId === folder.id}
          onClick={onSelectFolder}
          onDelete={(f) => setDeletingFolder(f)}
          onRename={(f) => {
            setRenamingFolder(f)
            setRenameValue(f.name)
          }}
        />
      ))}

      {/* Delete confirmation modal */}
      {deletingFolder && (
        <ConfirmModal
          title="Eliminar carpeta"
          message={`¿Estás seguro de eliminar la carpeta "${deletingFolder.name}"? Las presentaciones dentro se moverán a la raíz.`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingFolder(null)}
        />
      )}
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.125rem',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 0.75rem',
    marginBottom: '0.25rem',
  },
  sectionTitle: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#52525b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  addBtn: {
    background: 'none',
    border: 'none',
    color: '#52525b',
    cursor: 'pointer',
    padding: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '4px',
  },
  allItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    cursor: 'pointer',
    border: '1px solid transparent',
    transition: 'background 0.15s ease, border-color 0.15s ease',
  },
  allIcon: {
    color: '#71717a',
    display: 'flex',
    alignItems: 'center',
  },
  allText: {
    fontSize: '0.8rem',
    color: '#d4d4d8',
  },
  inputForm: {
    padding: '0.25rem 0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.4rem 0.6rem',
    background: '#09090b',
    border: '1px solid #3f3f46',
    borderRadius: '6px',
    color: '#fafafa',
    fontSize: '0.8rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
}
