import { useContext } from 'react'
import { BetterOfficeThemeContext } from './BetterOfficeThemeProvider'

export function useTheme() {
  const context = useContext(BetterOfficeThemeContext)
  if (!context) {
    throw new Error('useTheme must be inside BetterOfficeThemeProvider')
  }
  return context
}

export function useSetMode() {
  const { setMode } = useTheme()
  return setMode
}

export function useThemeTokens() {
  const { lightTokens, darkTokens } = useTheme()
  return { light: lightTokens, dark: darkTokens }
}
