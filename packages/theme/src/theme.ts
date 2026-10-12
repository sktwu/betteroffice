import { generateColorScale } from './color/scale'
import { pickForeground, lightenForDarkMode } from './color/contrast'
import { STATUS_COLOR_PRESETS, BETTEROFFICE_DEFAULT_PRIMARY, BETTEROFFICE_DEFAULT_NEUTRAL } from './color/constants'
import type { IBetterOfficeThemeSeed, IBetterOfficeThemeTokens } from './types'

/**
 * Generate a complete set of theme tokens from a seed configuration.
 * 
 * @param seed - { primary, neutral } colors. If not provided, uses defaults.
 * @param mode - 'light' or 'dark' mode
 * @returns Complete IBetterOfficeThemeTokens object
 * 
 * @example
 * const tokens = generateBetterOfficeTheme(
 *   { primary: '#1a73e8', neutral: '#202124' },
 *   'light'
 * )
 */
export function generateBetterOfficeTheme(
  seed: IBetterOfficeThemeSeed = {
    primary: BETTEROFFICE_DEFAULT_PRIMARY,
    neutral: BETTEROFFICE_DEFAULT_NEUTRAL
  },
  mode: 'light' | 'dark' = 'light'
): IBetterOfficeThemeTokens {
  const { primary, neutral } = seed

  if (mode === 'light') {
    return generateLightTokens(seed)
  } else {
    return generateDarkTokens(seed)
  }
}

/**
 * Generate light-mode tokens from seed.
 */
function generateLightTokens(seed: IBetterOfficeThemeSeed): IBetterOfficeThemeTokens {
  const { primary, neutral } = seed

  const primaryScale = generateColorScale(primary)
  const neutralScale = generateColorScale(neutral, { neutral: true })

  // Generate status color scales
  const errorColor = seed.error || STATUS_COLOR_PRESETS.error
  const successColor = seed.success || STATUS_COLOR_PRESETS.success
  const warningColor = seed.warning || STATUS_COLOR_PRESETS.warning
  const linkColor = seed.link || STATUS_COLOR_PRESETS.link

  const errorScale = generateColorScale(errorColor)
  const successScale = generateColorScale(successColor)
  const warningScale = generateColorScale(warningColor)
  const linkScale = generateColorScale(linkColor)

  return {
    // Primary family
    'doc-primary': primaryScale['500'],
    'doc-primary-hover': primaryScale['600'],
    'doc-primary-light': primaryScale['100'],
    'doc-accent': primaryScale['500'],
    'doc-accent-bg': primaryScale['50'],
    'doc-on-primary': pickForeground(primaryScale['500']),

    // Surfaces
    'doc-surface': neutralScale['50'] || '#ffffff',
    'doc-card': neutralScale['50'],
    'doc-bg': neutralScale['100'],
    'doc-bg-subtle': neutralScale['150'],
    'doc-bg-hover': neutralScale['200'],
    'doc-bg-input': neutralScale['100'],

    // Text
    'doc-text': neutralScale['900'],
    'doc-text-muted': neutralScale['600'],
    'doc-text-subtle': neutralScale['500'],
    'doc-text-placeholder': neutralScale['400'],

    // Borders
    'doc-border': neutralScale['300'],
    'doc-border-light': neutralScale['200'],
    'doc-border-dark': neutralScale['400'],
    'doc-border-input': neutralScale['300'],

    // Status
    'doc-error': errorScale['500'],
    'doc-error-bg': errorScale['100'],
    'doc-success': successScale['500'],
    'doc-success-bg': successScale['100'],
    'doc-warning': warningScale['500'],
    'doc-warning-bg': warningScale['100'],
    'doc-warning-text': warningScale['700'],

    // Links
    'doc-link': linkScale['600'],

    // Shadows
    'doc-shadow': 'rgba(0, 0, 0, 0.15)',
    'doc-shadow-strong': 'rgba(0, 0, 0, 0.3)',
    'doc-shadow-subtle': 'rgba(0, 0, 0, 0.06)',
    'doc-shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    'doc-card-shadow': '0 1px 3px rgba(60, 64, 67, 0.2), 0 2px 6px rgba(60, 64, 67, 0.08)',
    'doc-card-shadow-strong': '0 1px 3px rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15)',

    // Other
    'doc-overlay': 'rgba(0, 0, 0, 0.5)',
    'doc-focus-ring': `rgba(26, 115, 232, 0.4)`,
    'doc-selection': `rgba(26, 115, 232, 0.3)`,

    'doc-scrollbar-thumb': `color-mix(in srgb, ${neutralScale['500']} 45%, transparent)`,
    'doc-scrollbar-thumb-hover': `color-mix(in srgb, ${neutralScale['500']} 65%, transparent)`,

    'doc-caret': neutralScale['900']
  }
}

/**
 * Generate dark-mode tokens from seed.
 * Uses lightenForDarkMode() to invert primary, neutralScale is reversed for dark.
 */
function generateDarkTokens(seed: IBetterOfficeThemeSeed): IBetterOfficeThemeTokens {
  const { primary, neutral } = seed

  // Lighten primary for dark mode
  const primaryDark = lightenForDarkMode(primary)
  const primaryScale = generateColorScale(primaryDark)

  // Lighten neutral for dark mode
  const neutralDark = lightenForDarkMode(neutral)
  const neutralScale = generateColorScale(neutralDark, { neutral: true })

  // Same treatment for status colors
  const errorColor = seed.error || STATUS_COLOR_PRESETS.error
  const successColor = seed.success || STATUS_COLOR_PRESETS.success
  const warningColor = seed.warning || STATUS_COLOR_PRESETS.warning
  const linkColor = seed.link || STATUS_COLOR_PRESETS.link

  const errorDark = lightenForDarkMode(errorColor)
  const successDark = lightenForDarkMode(successColor)
  const warningDark = lightenForDarkMode(warningColor)
  const linkDark = lightenForDarkMode(linkColor)

  const errorScale = generateColorScale(errorDark)
  const successScale = generateColorScale(successDark)
  const warningScale = generateColorScale(warningDark)
  const linkScale = generateColorScale(linkDark)

  return {
    // Primary family (inverted - darker primary becomes lighter in dark mode)
    'doc-primary': primaryScale['500'],
    'doc-primary-hover': primaryScale['400'],
    'doc-primary-light': primaryScale['200'],
    'doc-accent': primaryScale['500'],
    'doc-accent-bg': primaryScale['900'],
    'doc-on-primary': pickForeground(primaryScale['500']),

    // Surfaces (inverted)
    'doc-surface': neutralScale['950'] || '#1f1f1f',
    'doc-card': neutralScale['900'],
    'doc-bg': neutralScale['800'],
    'doc-bg-subtle': neutralScale['800'],
    'doc-bg-hover': neutralScale['700'],
    'doc-bg-input': neutralScale['800'],

    // Text (inverted - light in dark mode)
    'doc-text': neutralScale['50'],
    'doc-text-muted': neutralScale['300'],
    'doc-text-subtle': neutralScale['400'],
    'doc-text-placeholder': neutralScale['500'],

    // Borders (inverted)
    'doc-border': neutralScale['700'],
    'doc-border-light': neutralScale['700'],
    'doc-border-dark': neutralScale['800'],
    'doc-border-input': neutralScale['700'],

    // Status (inverted)
    'doc-error': errorScale['500'],
    'doc-error-bg': errorScale['900'],
    'doc-success': successScale['500'],
    'doc-success-bg': successScale['900'],
    'doc-warning': warningScale['500'],
    'doc-warning-bg': warningScale['900'],
    'doc-warning-text': warningScale['500'],

    // Links
    'doc-link': linkScale['500'],

    // Shadows (stronger in dark mode)
    'doc-shadow': 'rgba(0, 0, 0, 0.4)',
    'doc-shadow-strong': 'rgba(0, 0, 0, 0.6)',
    'doc-shadow-subtle': 'rgba(0, 0, 0, 0.2)',
    'doc-shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.5)',
    'doc-card-shadow': '0 1px 3px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.2)',
    'doc-card-shadow-strong': '0 1px 3px rgba(0, 0, 0, 0.5), 0 4px 8px 3px rgba(0, 0, 0, 0.3)',

    // Other
    'doc-overlay': 'rgba(0, 0, 0, 0.7)',
    'doc-focus-ring': `rgba(78, 157, 255, 0.45)`,
    'doc-selection': `rgba(78, 157, 255, 0.32)`,

    'doc-scrollbar-thumb': `color-mix(in srgb, ${neutralScale['500']} 45%, transparent)`,
    'doc-scrollbar-thumb-hover': `color-mix(in srgb, ${neutralScale['500']} 65%, transparent)`,

    'doc-caret': neutralScale['100']
  }
}

/**
 * Apply tokens to DOM as inline styles.
 * Pure function - can be called without side effects if selector is undefined.
 * 
 * @param tokens - Generated tokens object
 * @param selector - DOM selector (default: '.oox-root'). If undefined, tokens are not applied.
 * 
 * @example
 * const tokens = generateBetterOfficeTheme()
 * applyBetterOfficeTheme(tokens) // applies to .oox-root
 * applyBetterOfficeTheme(tokens, '.custom-selector') // applies to custom selector
 */
export function applyBetterOfficeTheme(
  tokens: IBetterOfficeThemeTokens,
  selector: string = '.oox-root'
): void {
  if (typeof document === 'undefined') {
    // SSR environment - skip DOM updates
    return
  }

  const element = document.querySelector(selector) as HTMLElement
  if (!element) {
    console.warn(`[BetterOffice Theme] Could not find element: ${selector}`)
    return
  }

  // Apply all tokens as CSS variables
  Object.entries(tokens).forEach(([key, value]) => {
    element.style.setProperty(`--${key}`, value)
  })
}
