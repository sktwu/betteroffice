import { useState, useEffect } from 'react'
import { generateBetterOfficeTheme, applyBetterOfficeTheme } from '@betteroffice/theme'
import ColorPicker from '../components/ColorPicker'
import TokenTable from '../components/TokenTable'
import ComponentShowcase from '../components/ComponentShowcase'

export default function ThemeLab() {
  const theme = (window as any).__betterOfficeTheme
  const [primary, setPrimary] = useState(theme.seed.primary)
  const [neutral, setNeutral] = useState(theme.seed.neutral)
  const [, setUpdate] = useState({})

  useEffect(() => {
    const handleThemeChange = () => {
      setPrimary(theme.seed.primary)
      setNeutral(theme.seed.neutral)
      setUpdate({})
    }
    window.addEventListener('themechange', handleThemeChange)
    return () => window.removeEventListener('themechange', handleThemeChange)
  }, [])

  const handlePrimaryChange = (color: string) => {
    setPrimary(color)
    const newSeed = { ...theme.seed, primary: color }
    const lightTokens = generateBetterOfficeTheme(newSeed, 'light')
    const darkTokens = generateBetterOfficeTheme(newSeed, 'dark')
    theme.seed = newSeed
    theme.lightTokens = lightTokens
    theme.darkTokens = darkTokens
    const tokens = theme.mode === 'light' ? lightTokens : darkTokens
    applyBetterOfficeTheme(tokens, '.oox-root')
    setUpdate({})
  }

  const handleNeutralChange = (color: string) => {
    setNeutral(color)
    const newSeed = { ...theme.seed, neutral: color }
    const lightTokens = generateBetterOfficeTheme(newSeed, 'light')
    const darkTokens = generateBetterOfficeTheme(newSeed, 'dark')
    theme.seed = newSeed
    theme.lightTokens = lightTokens
    theme.darkTokens = darkTokens
    const tokens = theme.mode === 'light' ? lightTokens : darkTokens
    applyBetterOfficeTheme(tokens, '.oox-root')
    setUpdate({})
  }

  return (
    <div className="theme-lab">
      <div className="lab-controls">
        <ColorPicker label="Primary Color" value={primary} onChange={handlePrimaryChange} />
        <ColorPicker label="Neutral Color" value={neutral} onChange={handleNeutralChange} />
      </div>
      <div className="lab-content">
        <div className="lab-preview">
          <ComponentShowcase />
        </div>
        <div className="lab-tokens">
          <TokenTable />
        </div>
      </div>
    </div>
  )
}
