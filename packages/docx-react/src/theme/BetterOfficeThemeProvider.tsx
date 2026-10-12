import { createContext, useState, useEffect, useMemo, ReactNode } from 'react'
import {
  generateBetterOfficeTheme,
  applyBetterOfficeTheme,
  BETTEROFFICE_DEFAULT_PRIMARY,
  BETTEROFFICE_DEFAULT_NEUTRAL,
  type IBetterOfficeThemeSeed,
  type IBetterOfficeThemeTokens
} from '@betteroffice/theme'

export interface IBetterOfficeThemeContextValue {
  seed: IBetterOfficeThemeSeed
  mode: 'light' | 'dark'
  lightTokens: IBetterOfficeThemeTokens
  darkTokens: IBetterOfficeThemeTokens
  setMode: (mode: 'light' | 'dark') => void
}

export const BetterOfficeThemeContext = createContext<IBetterOfficeThemeContextValue | null>(null)

export interface IBetterOfficeThemeProviderProps {
  children: ReactNode
  seed?: IBetterOfficeThemeSeed
  defaultMode?: 'light' | 'dark'
  onModeChange?: (mode: 'light' | 'dark') => void
}

export function BetterOfficeThemeProvider({
  children,
  seed = {
    primary: BETTEROFFICE_DEFAULT_PRIMARY,
    neutral: BETTEROFFICE_DEFAULT_NEUTRAL
  },
  defaultMode = 'light',
  onModeChange
}: IBetterOfficeThemeProviderProps) {
  const [mode, setModeState] = useState<'light' | 'dark'>(defaultMode)

  const handleSetMode = (newMode: 'light' | 'dark') => {
    setModeState(newMode)
    onModeChange?.(newMode)
  }

  // Memoize token generation to avoid unnecessary regeneration
  const lightTokens = useMemo(
    () => generateBetterOfficeTheme(seed, 'light'),
    [seed]
  )

  const darkTokens = useMemo(
    () => generateBetterOfficeTheme(seed, 'dark'),
    [seed]
  )

  // Apply tokens to DOM whenever mode or tokens change
  useEffect(() => {
    const tokens = mode === 'light' ? lightTokens : darkTokens
    applyBetterOfficeTheme(tokens, '.oox-root')

    // Update .dark class
    const root = document.querySelector('.oox-root')
    if (root) {
      if (mode === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  }, [mode, lightTokens, darkTokens])

  const value: IBetterOfficeThemeContextValue = {
    seed,
    mode,
    lightTokens,
    darkTokens,
    setMode: handleSetMode
  }

  return (
    <BetterOfficeThemeContext.Provider value={value}>
      {children}
    </BetterOfficeThemeContext.Provider>
  )
}
