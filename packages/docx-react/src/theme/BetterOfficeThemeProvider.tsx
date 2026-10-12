import { createContext, useState, useEffect, useMemo, ReactNode } from 'react'
import {
  generateBetterOfficeTheme,
  createBetterOfficeThemeCss,
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
  overrides?: Partial<IBetterOfficeThemeTokens>
  defaultMode?: 'light' | 'dark'
  onModeChange?: (mode: 'light' | 'dark') => void
}

const DEFAULT_SEED: IBetterOfficeThemeSeed = {
  primary: BETTEROFFICE_DEFAULT_PRIMARY,
  neutral: BETTEROFFICE_DEFAULT_NEUTRAL
}

/** Pass `mode` to the editor's `colorMode`; the editor owns the `.dark` class. */
export function BetterOfficeThemeProvider({
  children,
  seed = DEFAULT_SEED,
  overrides,
  defaultMode = 'light',
  onModeChange
}: IBetterOfficeThemeProviderProps) {
  const [mode, setModeState] = useState<'light' | 'dark'>(defaultMode)

  const lightTokens = useMemo(() => generateBetterOfficeTheme(seed, 'light', overrides), [seed, overrides])
  const darkTokens = useMemo(() => generateBetterOfficeTheme(seed, 'dark', overrides), [seed, overrides])
  const css = useMemo(
    () => createBetterOfficeThemeCss(lightTokens, darkTokens),
    [lightTokens, darkTokens]
  )

  const [styleElement, setStyleElement] = useState<HTMLStyleElement | null>(null)

  useEffect(() => {
    const element = document.createElement('style')
    element.setAttribute('data-betteroffice-theme', '')
    document.head.appendChild(element)
    setStyleElement(element)
    return () => {
      element.remove()
    }
  }, [])

  useEffect(() => {
    if (styleElement) styleElement.textContent = css
  }, [styleElement, css])

  const value = useMemo<IBetterOfficeThemeContextValue>(
    () => ({
      seed,
      mode,
      lightTokens,
      darkTokens,
      setMode: (next) => {
        setModeState(next)
        onModeChange?.(next)
      }
    }),
    [seed, mode, lightTokens, darkTokens, onModeChange]
  )

  return (
    <BetterOfficeThemeContext.Provider value={value}>
      {children}
    </BetterOfficeThemeContext.Provider>
  )
}
