import { useEffect, useState } from 'react'

export default function TokenTable() {
  const theme = (window as any).__betterOfficeTheme
  const [, setUpdate] = useState({})

  useEffect(() => {
    const handleThemeChange = () => setUpdate({})
    window.addEventListener('themechange', handleThemeChange)
    return () => window.removeEventListener('themechange', handleThemeChange)
  }, [])

  const tokens = theme.mode === 'light' ? theme.lightTokens : theme.darkTokens

  const categories = {
    'Primary': ['doc-primary', 'doc-primary-hover', 'doc-primary-light'],
    'Text': ['doc-text', 'doc-text-muted', 'doc-text-subtle'],
    'Backgrounds': ['doc-surface', 'doc-card', 'doc-bg', 'doc-bg-hover'],
    'Borders': ['doc-border', 'doc-border-light', 'doc-border-dark'],
    'Status': ['doc-error', 'doc-success', 'doc-warning', 'doc-link'],
  }

  return (
    <div className="token-table">
      <h3>Current Tokens ({theme.mode})</h3>
      {Object.entries(categories).map(([category, keys]) => (
        <div key={category} className="token-category">
          <h4>{category}</h4>
          <div className="token-list">
            {keys.map((key) => {
              const value = tokens[key as keyof typeof tokens]
              return (
                <div key={key} className="token-item">
                  <div className="token-swatch" style={{ backgroundColor: value as string }} />
                  <div className="token-info">
                    <div className="token-name">{key}</div>
                    <div className="token-value">{value}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
