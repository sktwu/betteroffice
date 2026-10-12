import React from 'react'
import ReactDOM from 'react-dom/client'
import { generateBetterOfficeTheme, applyBetterOfficeTheme, BETTEROFFICE_DEFAULT_PRIMARY, BETTEROFFICE_DEFAULT_NEUTRAL } from '@betteroffice/theme'
import App from './App'
import './styles/playground.css'

// Create a simple theme context substitute for demo
window.__betterOfficeTheme = {
  seed: {
    primary: BETTEROFFICE_DEFAULT_PRIMARY,
    neutral: BETTEROFFICE_DEFAULT_NEUTRAL
  },
  mode: 'light' as const,
  lightTokens: generateBetterOfficeTheme({ primary: BETTEROFFICE_DEFAULT_PRIMARY, neutral: BETTEROFFICE_DEFAULT_NEUTRAL }, 'light'),
  darkTokens: generateBetterOfficeTheme({ primary: BETTEROFFICE_DEFAULT_PRIMARY, neutral: BETTEROFFICE_DEFAULT_NEUTRAL }, 'dark'),
  setMode: (mode: 'light' | 'dark') => {
    window.__betterOfficeTheme!.mode = mode
    const tokens = mode === 'light' ? window.__betterOfficeTheme!.lightTokens : window.__betterOfficeTheme!.darkTokens
    applyBetterOfficeTheme(tokens, '.oox-root')
    const root = document.querySelector('.oox-root')
    if (root) {
      if (mode === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
    window.dispatchEvent(new CustomEvent('themechange', { detail: { mode } }))
  }
}

// Apply initial theme
const root = document.querySelector('.oox-root')
if (root) {
  applyBetterOfficeTheme(window.__betterOfficeTheme!.lightTokens, '.oox-root')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
