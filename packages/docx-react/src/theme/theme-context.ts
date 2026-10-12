import { createContext } from 'react'
import type { IBetterOfficeThemeSeed, IBetterOfficeThemeTokens } from '@betteroffice/theme'

export interface IBetterOfficeThemeContextValue {
  seed: IBetterOfficeThemeSeed
  mode: 'light' | 'dark'
  lightTokens: IBetterOfficeThemeTokens
  darkTokens: IBetterOfficeThemeTokens
  setMode: (mode: 'light' | 'dark') => void
}

export const BetterOfficeThemeContext = createContext<IBetterOfficeThemeContextValue | null>(null)
