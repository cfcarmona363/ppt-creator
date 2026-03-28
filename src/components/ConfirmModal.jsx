export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.message}>{message}</p>
        <div style={styles.actions}>
          <button onClick={onCancel} style={styles.cancelBtn}>
            Cancelar
          </button>
          <button onClick={onConfirm} style={styles.confirmBtn}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#18181b',
    border: '1px solid #27272a',
    borderRadius: '12px',
    padding: '2rem',
    maxWidth: '400px',
    width: '90%',
  },
  title: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: '#fafafa',
    marginBottom: '0.75rem',
  },
  message: {
    fontSize: '0.875rem',
    color: '#a1a1aa',
    lineHeight: 1.5,
    marginBottom: '1.5rem',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    padding: '0.5rem 1rem',
    background: '#27272a',
    color: '#fafafa',
    border: '1px solid #3f3f46',
    borderRadius: '8px',
    fontSize: '0.875rem',
    cursor: 'pointer',
  },
  confirmBtn: {
    padding: '0.5rem 1rem',
    background: '#dc2626',
    color: '#fafafa',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
}
