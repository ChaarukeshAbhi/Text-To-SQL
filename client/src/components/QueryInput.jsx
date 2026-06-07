export default function QueryInput({ value, onChange, onSubmit, loading }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      onSubmit()
    }
  }

  return (
    <div style={styles.wrapper}>
      <span style={styles.label}>YOUR QUESTION</span>
      <div style={styles.inputBox}>
        <span style={styles.prompt}>›</span>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Get all users who registered in the last 30 days and have made at least 2 orders..."
          style={styles.textarea}
          rows={4}
          disabled={loading}
        />
      </div>
      <div style={styles.footer}>
        <span style={styles.hint}>Press Ctrl + Enter to generate</span>
        <button
          onClick={onSubmit}
          disabled={loading || !value.trim()}
          style={{
            ...styles.button,
            ...(loading || !value.trim() ? styles.buttonDisabled : {}),
          }}
        >
          {loading ? (
            <span style={styles.loadingInner}>
              <span style={styles.spinner} />
              Generating...
            </span>
          ) : (
            '⚡ Generate SQL'
          )}
        </button>
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
  inputBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '14px 16px',
    transition: 'border-color 0.2s',
  },
  prompt: {
    fontFamily: 'Space Mono, monospace',
    fontSize: '18px',
    color: 'var(--accent)',
    lineHeight: '1.6',
    userSelect: 'none',
    marginTop: '1px',
  },
  textarea: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text-primary)',
    fontFamily: 'Syne, sans-serif',
    fontSize: '15px',
    lineHeight: '1.6',
    resize: 'none',
    width: '100%',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hint: {
    fontFamily: 'Space Mono, monospace',
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  button: {
    padding: '10px 24px',
    borderRadius: '8px',
    border: 'none',
    background: 'var(--accent)',
    color: '#fff',
    fontFamily: 'Syne, sans-serif',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
    boxShadow: '0 0 20px var(--accent-glow)',
    letterSpacing: '0.02em',
  },
  buttonDisabled: {
    background: 'var(--bg-input)',
    color: 'var(--text-muted)',
    boxShadow: 'none',
    cursor: 'not-allowed',
  },
  loadingInner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  spinner: {
    display: 'inline-block',
    width: '12px',
    height: '12px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
}