// Types
export type { IBetterOfficeThemeSeed, IBetterOfficeThemeTokens, IBetterOfficeThemeMode } from './types'

// Core API
export { generateBetterOfficeTheme, applyBetterOfficeTheme, createBetterOfficeThemeCss } from './theme'

// Constants
export {
  BETTEROFFICE_DEFAULT_PRIMARY,
  BETTEROFFICE_DEFAULT_NEUTRAL,
  STATUS_COLOR_PRESETS
} from './color/constants'

// Color utilities (for advanced users)
export { generateColorScale } from './color/scale'
export { pickForeground, ensureContrast, lightenForDarkMode, darkenForLightMode } from './color/contrast'
export { normalizeColorInput, formatOklch, parseColor, getOklchLightness, withOklchLightness } from './color/oklch'
