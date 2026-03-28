export default function Spinner({ size = 24, color = '#a1a1aa' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: 'spin 1s linear infinite' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="31.4 31.4"
        opacity="0.8"
      />
    </svg>
  )
}

export function LoadingState({ message = 'Cargando...' }) {
  return (
    <div style={styles.container}>
      <Spinner size={32} />
      <p style={styles.text}>{message}</p>
    </div>
  )
}

export function InlineSpinner({ size = 16, color = '#a1a1aa' }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      <Spinner size={size} color={color} />
    </span>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    padding: '4rem 0',
  },
  text: {
    color: '#71717a',
    fontSize: '0.875rem',
  },
}
