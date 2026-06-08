import { useState } from 'react'
import axios from 'axios'
import DBSelector from './components/DBSelector'
import QueryInput from './components/QueryInput'
import SQLOutput from './components/SQLOutput'
import WarningBanner from './components/WarningBanner'
import SchemaInput from './components/SchemaInput'

export default function App() {
  const [prompt, setPrompt] = useState('')
  const [dbType, setDbType] = useState('mysql')
  const [schema, setSchema] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const response = await axios.post('/api/query', {
        prompt,
        dbType,
        schema: schema.trim() || undefined,
      })
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
      <div style={styles.grid} aria-hidden="true" />

      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.logoRow}>
            <span style={styles.logoIcon}>⬡</span>
            <span style={styles.logoText}>TEXT<span style={styles.logoAccent}>2</span>SQL</span>
          </div>
          <p style={styles.tagline}>Natural language → SQL query, instantly.</p>
        </header>

        <main style={styles.card}>
          <DBSelector selected={dbType} onChange={setDbType} />
          <div style={styles.divider} />
          <SchemaInput value={schema} onChange={setSchema} />
          <div style={styles.divider} />
          <QueryInput
            value={prompt}
            onChange={setPrompt}
            onSubmit={handleGenerate}
            loading={loading}
          />

          {error && (
            <div style={styles.errorBox}>
              <span style={styles.errorIcon}>🚫</span>
              <span style={styles.errorText}>{error}</span>
            </div>
          )}

          {result && (
            <div style={styles.results}>
              {result.schemaUsed && (
                <div style={styles.schemaTag}>
                  ✓ Query generated using your schema
                </div>
              )}
              <WarningBanner warnings={result.warnings} />
              <SQLOutput sql={result.sql} dbType={result.dbType} />
            </div>
          )}
        </main>

        <footer style={styles.footer}>
          <span style={styles.footerText}>
            Powered by <span style={styles.footerAccent}>Groq API</span> · Dual-layer security · Schema-aware generation
          </span>
        </footer>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
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
  header: { textAlign: 'center', paddingTop: '20px' },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  logoIcon: { fontSize: '28px', color: 'var(--accent)', filter: 'drop-shadow(0 0 10px var(--accent-glow))' },
  logoText: { fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: '800', letterSpacing: '0.04em' },
  logoAccent: { color: 'var(--accent)' },
  tagline: { fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.08em' },
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '22px',
    boxShadow: '0 0 60px rgba(91,91,214,0.06)',
  },
  divider: { height: '1px', background: 'var(--border)' },
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
  errorIcon: { fontSize: '16px', flexShrink: 0 },
  errorText: { fontFamily: 'Syne, sans-serif', fontSize: '14px', color: '#ffaab8', lineHeight: '1.5' },
  results: { display: 'flex', flexDirection: 'column', gap: '14px' },
  schemaTag: {
    fontFamily: 'Space Mono, monospace',
    fontSize: '11px',
    color: 'var(--accent-green)',
    padding: '6px 12px',
    background: 'rgba(0,214,143,0.07)',
    border: '1px solid rgba(0,214,143,0.2)',
    borderRadius: '6px',
    letterSpacing: '0.04em',
  },
  footer: { textAlign: 'center' },
  footerText: { fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.04em' },
  footerAccent: { color: 'var(--accent)' },
}