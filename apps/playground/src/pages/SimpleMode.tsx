import { useState, useEffect } from 'react'
import { generateBetterOfficeTheme, applyBetterOfficeTheme } from '@betteroffice/theme'
import ColorPicker from '../components/ColorPicker'

export default function SimpleMode() {
  const theme = (window as any).__betterOfficeTheme
  const [primary, setPrimary] = useState(theme.seed.primary)

  useEffect(() => {
    const handleThemeChange = () => {
      setPrimary(theme.seed.primary)
    }
    window.addEventListener('themechange', handleThemeChange)
    return () => window.removeEventListener('themechange', handleThemeChange)
  }, [])

  const handleChange = (color: string) => {
    setPrimary(color)
    const newSeed = { ...theme.seed, primary: color }
    const lightTokens = generateBetterOfficeTheme(newSeed, 'light')
    const darkTokens = generateBetterOfficeTheme(newSeed, 'dark')
    theme.seed = newSeed
    theme.lightTokens = lightTokens
    theme.darkTokens = darkTokens
    const tokens = theme.mode === 'light' ? lightTokens : darkTokens
    applyBetterOfficeTheme(tokens, '.oox-root')
  }

  return (
    <div className="simple-mode">
      <h2>Simple Mode - Primary Color Only</h2>
      <p>All other tokens are automatically derived from this primary color.</p>
      <div className="simple-controls">
        <ColorPicker label="Primary Color" value={primary} onChange={handleChange} />
      </div>
      <div className="simple-preview">
        <button className="btn-primary">Primary Button</button>
        <button className="btn-secondary">Secondary Button</button>
        <input type="text" placeholder="Input field" />
        <div className="card">
          <h3>Card Title</h3>
          <p>This card is themed with the primary color.</p>
        </div>
      </div>
    </div>
  )
}
