import SearchInput from './SearchInput'
import FolderList from './FolderList'

export default function Sidebar({
  folders,
  selectedFolderId,
  onSelectFolder,
  onSearch,
  onFoldersChange,
  onRefresh,
}) {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={styles.titleRow}>
          <h2 style={styles.title}>Presentation Hub</h2>
          <button onClick={onRefresh} style={styles.refreshBtn} title="Actualizar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
        </div>
      </div>
      <SearchInput onSearch={onSearch} />
      <FolderList
        folders={folders}
        selectedFolderId={selectedFolderId}
        onSelectFolder={onSelectFolder}
        onFoldersChange={onFoldersChange}
      />
    </aside>
  )
}

const styles = {
  sidebar: {
    width: '280px',
    minWidth: '280px',
    borderRight: '1px solid #27272a',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    overflowY: 'auto',
    height: '100vh',
    boxSizing: 'border-box',
  },
  logo: {
    marginBottom: '0.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #27272a',
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#fafafa',
    letterSpacing: '-0.025em',
  },
  refreshBtn: {
    background: 'none',
    border: 'none',
    color: '#52525b',
    cursor: 'pointer',
    padding: '0.35rem',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '6px',
    transition: 'color 0.15s ease',
  },
}
