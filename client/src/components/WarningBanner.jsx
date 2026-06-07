export default function WarningBanner({ warnings }) {
  if (!warnings || warnings.length === 0) return null

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <span style={styles.icon}>⚠️</span>
        <span style={styles.title}>SECURITY WARNING</span>
      </div>
      {warnings.map((warning, i) => (
        <p key={i} style={styles.text}>
          {warning.split('**').map((part, j) =>
            j % 2 === 1
              ? <strong key={j} style={styles.bold}>{part}</strong>
              : part
          )}
        </p>
      ))}
    </div>
  )
}

const styles = {
  wrapper: {
    background: 'rgba(255,77,109,0.08)',
    border: '1px solid rgba(255,77,109,0.4)',
    borderRadius: '10px',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    animation: 'fadeIn 0.3s ease',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  icon: {
    fontSize: '16px',
  },
  title: {
    fontFamily: 'Space Mono, monospace',
    fontSize: '11px',
    letterSpacing: '0.12em',
    fontWeight: '700',
    color: 'var(--accent-red)',
  },
  text: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '13px',
    color: '#ffaab8',
    lineHeight: '1.6',
  },
  bold: {
    color: 'var(--accent-red)',
    fontWeight: '700',
  }
}