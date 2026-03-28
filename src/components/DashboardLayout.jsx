import { useState, useEffect, useCallback } from 'react'
import { DndContext, DragOverlay, pointerWithin } from '@dnd-kit/core'
import Sidebar from './Sidebar'
import PresentationGrid from './PresentationGrid'
import ConfirmModal from './ConfirmModal'
import { LoadingState } from './Spinner'
import { apiFetch } from '../hooks/useApi'

export default function DashboardLayout() {
  const [presentations, setPresentations] = useState([])
  const [folders, setFolders] = useState([])
  const [selectedFolderId, setSelectedFolderId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingPresentation, setDeletingPresentation] = useState(null)
  const [activeDragId, setActiveDragId] = useState(null)

  const fetchPresentations = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (selectedFolderId) params.set('folder_id', selectedFolderId)
      if (searchQuery) params.set('q', searchQuery)

      const qs = params.toString()
      const url = `/api/presentations${qs ? `?${qs}` : ''}`
      const data = await fetch(url).then((r) => r.json())
      setPresentations(Array.isArray(data) ? data : [])
      setError('')
    } catch {
      setError('Error cargando presentaciones')
    } finally {
      setLoading(false)
    }
  }, [selectedFolderId, searchQuery])

  const fetchFolders = useCallback(async () => {
    try {
      const data = await fetch('/api/folders').then((r) => r.json())
      setFolders(Array.isArray(data) ? data : [])
    } catch {
      // silently ignore
    }
  }, [])

  useEffect(() => {
    fetchPresentations()
  }, [fetchPresentations])

  useEffect(() => {
    fetchFolders()
  }, [fetchFolders])

  const handleSearch = useCallback((q) => {
    setSearchQuery(q)
    setLoading(true)
  }, [])

  async function handleDeletePresentation() {
    if (!deletingPresentation) return
    try {
      await apiFetch(`/api/presentations/${deletingPresentation.id}`, {
        method: 'DELETE',
      })
      setPresentations((prev) => prev.filter((p) => p.id !== deletingPresentation.id))
      setDeletingPresentation(null)
    } catch (err) {
      console.error('Error deleting presentation:', err)
    }
  }

  function handleDragStart(event) {
    setActiveDragId(event.active.id)
  }

  async function handleDragEnd(event) {
    setActiveDragId(null)
    const { active, over } = event
    if (!over) return

    const presentationId = active.data?.current?.presentationId
    const targetFolderId = over.data?.current?.folderId ?? null

    if (!presentationId) return

    // Find the presentation's current folder
    const presentation = presentations.find((p) => p.id === presentationId)
    if (!presentation) return

    const currentFolderId = presentation.folder_id || null
    if (currentFolderId === targetFolderId) return

    try {
      await apiFetch(`/api/presentations/${presentationId}`, {
        method: 'PATCH',
        body: JSON.stringify({ folder_id: targetFolderId }),
      })
      fetchPresentations()
    } catch (err) {
      console.error('Error moving presentation:', err)
    }
  }

  const activePres = activeDragId
    ? presentations.find((p) => `presentation-${p.id}` === activeDragId)
    : null

  const folderName = selectedFolderId
    ? folders.find((f) => f.id === selectedFolderId)?.name || 'Carpeta'
    : 'Todas las presentaciones'

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div style={styles.layout}>
        <Sidebar
          folders={folders}
          selectedFolderId={selectedFolderId}
          onSelectFolder={setSelectedFolderId}
          onSearch={handleSearch}
          onFoldersChange={fetchFolders}
        />

        <main style={styles.main}>
          <header style={styles.header}>
            <div>
              <h1 style={styles.heading}>{folderName}</h1>
              <p style={styles.subheading}>
                {presentations.length} presentacion{presentations.length !== 1 ? 'es' : ''}
              </p>
            </div>
          </header>

          {loading && <LoadingState message="Cargando presentaciones..." />}
          {error && <p style={styles.statusError}>{error}</p>}

          {!loading && !error && (
            <PresentationGrid
              presentations={presentations}
              onDelete={(p) => setDeletingPresentation(p)}
            />
          )}
        </main>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activePres && (
          <div style={styles.dragPreview}>
            <span style={styles.dragTitle}>{activePres.title}</span>
          </div>
        )}
      </DragOverlay>

      {/* Delete confirmation */}
      {deletingPresentation && (
        <ConfirmModal
          title="Eliminar presentación"
          message={`¿Estás seguro de eliminar "${deletingPresentation.title}"? Esta acción no se puede deshacer.`}
          onConfirm={handleDeletePresentation}
          onCancel={() => setDeletingPresentation(null)}
        />
      )}
    </DndContext>
  )
}

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
  },
  main: {
    flex: 1,
    padding: '2rem 2rem',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #27272a',
  },
  heading: {
    fontSize: '1.75rem',
    fontWeight: 700,
    letterSpacing: '-0.025em',
    color: '#fafafa',
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
  dragPreview: {
    background: '#27272a',
    border: '1px solid #3f3f46',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    maxWidth: '250px',
  },
  dragTitle: {
    color: '#fafafa',
    fontSize: '0.875rem',
    fontWeight: 500,
  },
}
