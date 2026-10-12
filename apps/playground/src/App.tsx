import { useState, useEffect } from 'react'
import { generateBetterOfficeTheme, applyBetterOfficeTheme } from '@betteroffice/theme'
import ThemeLab from './pages/ThemeLab'
import SimpleMode from './pages/SimpleMode'
import ComponentGallery from './pages/ComponentGallery'
import './styles/app.css'

type PageType = 'lab' | 'simple' | 'gallery'

// Simple hook to access global theme
function useTheme() {
  const [, setUpdate] = useState({})
  const theme = (window as any).__betterOfficeTheme
  
  useEffect(() => {
    const handleThemeChange = () => setUpdate({})
    window.addEventListener('themechange', handleThemeChange)
    return () => window.removeEventListener('themechange', handleThemeChange)
  }, [])
  
  return {
    seed: theme.seed,
    mode: theme.mode,
    lightTokens: theme.lightTokens,
    darkTokens: theme.darkTokens,
    setMode: theme.setMode,
    setSeed: (seed: any) => {
      theme.seed = seed
      theme.lightTokens = generateBetterOfficeTheme(seed, 'light')
      theme.darkTokens = generateBetterOfficeTheme(seed, 'dark')
      const tokens = theme.mode === 'light' ? theme.lightTokens : theme.darkTokens
      applyBetterOfficeTheme(tokens, '.oox-root')
      window.dispatchEvent(new CustomEvent('themechange', { detail: { seed } }))
    }
  }
}

(window as any).useTheme = useTheme

export default function App() {
  const [page, setPage] = useState<PageType>('lab')
  const { mode, setMode } = useTheme()

  return (
    <div className="app-container oox-root" data-mode={mode}>
      <header className="app-header">
        <h1>🎨 BetterOffice Theme Playground</h1>
        <div className="header-controls">
          <nav className="nav-tabs">
            <button
              className={`tab ${page === 'lab' ? 'active' : ''}`}
              onClick={() => setPage('lab')}
            >
              Theme Lab
            </button>
            <button
              className={`tab ${page === 'simple' ? 'active' : ''}`}
              onClick={() => setPage('simple')}
            >
              Simple Mode
            </button>
            <button
              className={`tab ${page === 'gallery' ? 'active' : ''}`}
              onClick={() => setPage('gallery')}
            >
              Component Gallery
            </button>
          </nav>
          <button
            className="mode-toggle"
            onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
          >
            {mode === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </header>

      <main className="app-main">
        {page === 'lab' && <ThemeLab />}
        {page === 'simple' && <SimpleMode />}
        {page === 'gallery' && <ComponentGallery />}
      </main>

      <footer className="app-footer">
        <p>Theme tokens update in real-time. Try switching between light and dark modes!</p>
      </footer>
    </div>
  )
}
