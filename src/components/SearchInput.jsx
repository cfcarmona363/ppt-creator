import { useState, useEffect, useRef } from 'react'

export default function SearchInput({ onSearch }) {
  const [value, setValue] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      onSearch(value)
    }, 300)
    return () => clearTimeout(timerRef.current)
  }, [value, onSearch])

  return (
    <div style={styles.wrapper}>
      <span style={styles.icon}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar presentaciones..."
        style={styles.input}
      />
    </div>
  )
}

const styles = {
  wrapper: {
    position: 'relative',
    marginBottom: '1rem',
  },
  icon: {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#52525b',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '0.6rem 0.75rem 0.6rem 2.25rem',
    background: '#09090b',
    border: '1px solid #3f3f46',
    borderRadius: '8px',
    color: '#fafafa',
    fontSize: '0.8rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
}
