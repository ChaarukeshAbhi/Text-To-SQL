import { useState } from 'react'

export default function SQLOutput({ sql, dbType }) {
  const [copied, setCopied] = useState(false)

  if (!sql) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(sql).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.dot} />
          <span style={styles.label}>GENERATED QUERY</span>
          <span style={styles.badge}>{dbType.toUpperCase()}</span>
        </div>
        <button onClick={handleCopy} style={styles.copyBtn}>
          {copied ? '✅ Copied!' : '📋 Copy'}
        </button>
      </div>
      <pre style={styles.codeBlock}>
        <code style={styles.code}>{sql}</code>
      </pre>
    </div>
  )
}

const styles = {
  wrapper: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    overflow: 'hidden',
    animation: 'fadeIn 0.35s ease',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 18px',
    borderBottom: '1px solid var(--border)',
    background: 'rgba(91,91,214,0.05)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--accent-green)',
    boxShadow: '0 0 8px var(--accent-green-glow)',
  },
  label: {
    fontFamily: 'Space Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.15em',
    color: 'var(--text-muted)',
    fontWeight: '700',
  },
  badge: {
    fontFamily: 'Space Mono, monospace',
    fontSize: '10px',
    padding: '2px 8px',
    borderRadius: '4px',
    background: 'rgba(91,91,214,0.15)',
    color: 'var(--accent)',
    border: '1px solid rgba(91,91,214,0.3)',
    fontWeight: '700',
  },
  copyBtn: {
    fontFamily: 'Space Mono, monospace',
    fontSize: '11px',
    padding: '5px 12px',
    borderRadius: '6px',
    border: '1px solid var(--border)',
    background: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    letterSpacing: '0.02em',
  },
  codeBlock: {
    padding: '20px 20px',
    overflowX: 'auto',
    margin: 0,
  },
  code: {
    fontFamily: 'Space Mono, monospace',
    fontSize: '13px',
    lineHeight: '1.8',
    color: 'var(--accent-green)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  }
}