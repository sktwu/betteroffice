import { createContext, useContext } from 'react'
import type { IBetterOfficeThemeSeed } from '@betteroffice/theme'

export const SetSeedContext = createContext<((seed: IBetterOfficeThemeSeed) => void) | null>(null)

export function useSetSeed() {
  const setSeed = useContext(SetSeedContext)
  if (!setSeed) throw new Error('useSetSeed must be inside SetSeedContext')
  return setSeed
}
