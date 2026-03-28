import SearchInput from './SearchInput'
import FolderList from './FolderList'

export default function Sidebar({
  folders,
  selectedFolderId,
  onSelectFolder,
  onSearch,
  onFoldersChange,
}) {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <h2 style={styles.title}>Presentation Hub</h2>
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
  title: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#fafafa',
    letterSpacing: '-0.025em',
  },
}
