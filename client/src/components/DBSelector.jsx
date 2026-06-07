import { useState } from 'react'

const DB_OPTIONS = [
  { value: 'mysql', label: 'MySQL', icon: '🐬' },
  { value: 'postgresql', label: 'PostgreSQL', icon: '🐘' },
  { value: 'sqlite', label: 'SQLite', icon: '🪶' },
  { value: 'mongodb', label: 'MongoDB', icon: '🍃' },
]

export default function DBSelector({ selected, onChange }) {
  return (
    <div style={styles.wrapper}>
      <span style={styles.label}>TARGET DATABASE</span>
      <div style={styles.options}>
        {DB_OPTIONS.map((db) => (
          <button
            key={db.value}
            onClick={() => onChange(db.value)}
            style={{
              ...styles.option,
              ...(selected === db.value ? styles.optionActive : {}),
            }}
          >
            <span style={styles.icon}>{db.icon}</span>
            <span>{db.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  label: {
    fontFamily: 'Space Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.15em',
    color: 'var(--text-muted)',
    fontWeight: '700',
  },
  options: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'var(--bg-input)',
    color: 'var(--text-secondary)',
    fontFamily: 'Syne, sans-serif',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
    outline: 'none',
  },
  optionActive: {
    border: '1px solid var(--accent)',
    background: 'rgba(91,91,214,0.12)',
    color: 'var(--text-primary)',
    boxShadow: '0 0 12px var(--accent-glow)',
  },
  icon: {
    fontSize: '15px',
  }
}