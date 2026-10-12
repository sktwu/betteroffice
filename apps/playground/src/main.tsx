import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BetterOfficeThemeProvider } from '@betteroffice/docx-react'
import {
  BETTEROFFICE_DEFAULT_NEUTRAL,
  BETTEROFFICE_DEFAULT_PRIMARY,
  type IBetterOfficeThemeSeed
} from '@betteroffice/theme'
import '@betteroffice/docx-react/styles.css'
import App from './App'
import { SetSeedContext } from './seed-context'
import './styles/playground.css'

function Root() {
  const [seed, setSeed] = useState<IBetterOfficeThemeSeed>({
    primary: BETTEROFFICE_DEFAULT_PRIMARY,
    neutral: BETTEROFFICE_DEFAULT_NEUTRAL
  })
  return (
    <BetterOfficeThemeProvider seed={seed} defaultMode="light">
      <SetSeedContext.Provider value={setSeed}>
        <App />
      </SetSeedContext.Provider>
    </BetterOfficeThemeProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
