import { useState } from 'react'

export default function SchemaInput({ value = '', onChange }) {
  const [open, setOpen] = useState(false)
  const hasSchema = value.trim().length > 0
  const badgeStyle = {
    ...styles.badge,
    background: hasSchema ? 'rgba(0,214,143,0.15)' : styles.badge.background,
    color: hasSchema ? 'var(--accent-green)' : styles.badge.color,
    border: hasSchema ? '1px solid rgba(0,214,143,0.4)' : styles.badge.border,
  }

  return (
    <div style={styles.wrapper}>
      <button type="button" onClick={() => setOpen(!open)} style={styles.toggleBtn}>
        <span style={styles.icon}>🗂️</span>
        <span>SCHEMA</span>
        <span style={badgeStyle}>
          {hasSchema ? '✓ Loaded' : 'Optional'}
        </span>
        <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '12px' }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={styles.panel}>
          <p style={styles.hint}>
            Paste your <strong>CREATE TABLE</strong> statements. The AI will use your real table and column names.
            Your schema is never stored — session only.
          </p>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`CREATE TABLE users (\n  id INT PRIMARY KEY,\n  name VARCHAR(100),\n  email VARCHAR(100),\n  created_at DATETIME\n);\n\nCREATE TABLE orders (\n  id INT PRIMARY KEY,\n  user_id INT,\n  amount DECIMAL(10,2),\n  status VARCHAR(20)\n);`}
            style={styles.textarea}
            rows={10}
          />
          {hasSchema && (
            <button type="button" onClick={() => onChange('')} style={styles.clearBtn}>
              ✕ Clear Schema
            </button>
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  toggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    background: 'var(--bg-input)',
    border: 'none',
    color: 'var(--text-secondary)',
    fontFamily: 'Space Mono, monospace',
    fontSize: '11px',
    letterSpacing: '0.12em',
    fontWeight: '700',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
  },
  icon: { fontSize: '14px' },
  badge: {
    fontSize: '10px',
    padding: '2px 8px',
    borderRadius: '4px',
    background: 'rgba(91,91,214,0.1)',
    color: 'var(--text-muted)',
    border: '1px solid var(--border)',
    fontWeight: '700',
  },
  panel: {
    padding: '16px',
    background: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  hint: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '12px',
    color: 'var(--text-muted)',
    lineHeight: '1.6',
  },
  textarea: {
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '12px 14px',
    color: 'var(--accent-green)',
    fontFamily: 'Space Mono, monospace',
    fontSize: '12px',
    lineHeight: '1.7',
    resize: 'vertical',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  clearBtn: {
    alignSelf: 'flex-end',
    padding: '5px 12px',
    borderRadius: '6px',
    border: '1px solid rgba(255,77,109,0.3)',
    background: 'transparent',
    color: 'var(--accent-red)',
    fontFamily: 'Space Mono, monospace',
    fontSize: '11px',
    cursor: 'pointer',
  }
}