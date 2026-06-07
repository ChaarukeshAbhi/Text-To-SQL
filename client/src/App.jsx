import { useState } from 'react'
import axios from 'axios'
import DBSelector from './components/DBSelector'
import QueryInput from './components/QueryInput'
import SQLOutput from './components/SQLOutput'
import WarningBanner from './components/WarningBanner'

export default function App() {
  const [prompt, setPrompt] = useState('')
  const [dbType, setDbType] = useState('mysql')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const response = await axios.post('/api/query', { prompt, dbType })
      setResult(response.data)
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      {/* Background grid */}
      <div style={styles.grid} aria-hidden="true" />

      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.logoRow}>
            <span style={styles.logoIcon}>⬡</span>
            <span style={styles.logoText}>TEXT<span style={styles.logoAccent}>2</span>SQL</span>
          </div>
          <p style={styles.tagline}>Natural language → SQL query, instantly.</p>
        </header>

        {/* Main Card */}
        <main style={styles.card}>
          <DBSelector selected={dbType} onChange={setDbType} />

          <div style={styles.divider} />

          <QueryInput
            value={prompt}
            onChange={setPrompt}
            onSubmit={handleGenerate}
            loading={loading}
          />

          {/* Error state */}
          {error && (
            <div style={styles.errorBox}>
              <span style={styles.errorIcon}>🚫</span>
              <span style={styles.errorText}>{error}</span>
            </div>
          )}

          {/* Results */}
          {result && (
            <div style={styles.results}>
              <WarningBanner warnings={result.warnings} />
              <SQLOutput sql={result.sql} dbType={result.dbType} />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer style={styles.footer}>
          <span style={styles.footerText}>
            Powered by <span style={styles.footerAccent}>Groq API</span> · Secured with dual-layer prompt & response validation
          </span>
        </footer>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        textarea:focus-within { outline: none; }
        textarea::placeholder { color: var(--text-muted); }
      `}</style>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '40px 16px 60px',
    position: 'relative',
    background: 'var(--bg-primary)',
  },
  grid: {
    position: 'fixed',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(91,91,214,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(91,91,214,0.04) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    pointerEvents: 'none',
    zIndex: 0,
  },
  container: {
    width: '100%',
    maxWidth: '760px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    position: 'relative',
    zIndex: 1,
  },
  header: {
    textAlign: 'center',
    paddingTop: '20px',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  logoIcon: {
    fontSize: '28px',
    color: 'var(--accent)',
    filter: 'drop-shadow(0 0 10px var(--accent-glow))',
  },
  logoText: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '32px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    letterSpacing: '0.04em',
  },
  logoAccent: {
    color: 'var(--accent)',
  },
  tagline: {
    fontFamily: 'Space Mono, monospace',
    fontSize: '12px',
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
  },
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '28px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '22px',
    boxShadow: '0 0 60px rgba(91,91,214,0.06)',
  },
  divider: {
    height: '1px',
    background: 'var(--border)',
    borderRadius: '1px',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    background: 'rgba(255,77,109,0.07)',
    border: '1px solid rgba(255,77,109,0.3)',
    borderRadius: '10px',
    padding: '14px 18px',
    animation: 'fadeIn 0.3s ease',
  },
  errorIcon: {
    fontSize: '16px',
    flexShrink: 0,
    marginTop: '1px',
  },
  errorText: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '14px',
    color: '#ffaab8',
    lineHeight: '1.5',
  },
  results: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  footer: {
    textAlign: 'center',
  },
  footerText: {
    fontFamily: 'Space Mono, monospace',
    fontSize: '11px',
    color: 'var(--text-muted)',
    letterSpacing: '0.04em',
  },
  footerAccent: {
    color: 'var(--accent)',
  }
}