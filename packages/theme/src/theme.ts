import { generateColorScale } from './color/scale'
import { pickForeground, lightenForDarkMode } from './color/contrast'
import { fitInGamut, formatOklch, parseColor } from './color/oklch'
import { STATUS_COLOR_PRESETS, BETTEROFFICE_DEFAULT_PRIMARY, BETTEROFFICE_DEFAULT_NEUTRAL } from './color/constants'
import type { IBetterOfficeThemeSeed, IBetterOfficeThemeTokens } from './types'

const ACCENT_HUE_OFFSET = 30
const CHROME_CHROMA = 0.045

const DEFAULT_SEED: IBetterOfficeThemeSeed = {
  primary: BETTEROFFICE_DEFAULT_PRIMARY,
  neutral: BETTEROFFICE_DEFAULT_NEUTRAL
}

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
  seed: IBetterOfficeThemeSeed = DEFAULT_SEED,
  mode: 'light' | 'dark' = 'light',
  overrides?: Partial<IBetterOfficeThemeTokens>
): IBetterOfficeThemeTokens {
  const tokens = mode === 'light' ? generateLightTokens(seed) : generateDarkTokens(seed)
  const fitted = fitTokenColors(tokens)
  return overrides ? { ...fitted, ...overrides } : fitted
}

function chrome(neutral: string, lightness: number): string {
  const parsed = parseColor(neutral)
  if (!parsed) return neutral
  return formatOklch({
    mode: 'oklch',
    l: lightness,
    c: Math.min(parsed.c ?? 0, CHROME_CHROMA),
    h: parsed.h
  })
}

function mix(color: string, percent: number): string {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`
}

function accentFamily(primary: string, accent: string | undefined) {
  if (accent) {
    const scale = generateColorScale(accent)
    return { color: scale['500'], light: scale['50'], dark: scale['900'] }
  }
  const parsed = parseColor(primary)
  const hue = ((parsed?.h ?? 0) + ACCENT_HUE_OFFSET) % 360
  const shifted = formatOklch({
    mode: 'oklch',
    l: parsed?.l ?? 0.5,
    c: parsed?.c ?? 0,
    h: hue
  })
  const scale = generateColorScale(shifted)
  return { color: scale['500'], light: scale['50'], dark: scale['900'] }
}

function fitTokenColors(tokens: IBetterOfficeThemeTokens): IBetterOfficeThemeTokens {
  const next = { ...tokens }
  for (const key of Object.keys(next) as (keyof IBetterOfficeThemeTokens)[]) {
    if (next[key].startsWith('oklch(')) next[key] = fitInGamut(next[key])
  }
  return next
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
  const accent = accentFamily(primary, seed.accent)

  return {
    // Primary family
    'doc-primary': primaryScale['500'],
    'doc-primary-hover': primaryScale['600'],
    'doc-primary-light': primaryScale['100'],
    'doc-accent': accent.color,
    'doc-accent-bg': accent.light,
    'doc-on-primary': pickForeground(primaryScale['500']),
    'doc-toggle-active-bg': primaryScale['100'],
    'doc-toggle-active-fg': primaryScale['700'],

    // Surfaces
    'doc-surface': chrome(neutral, 0.955),
    'doc-card': chrome(neutral, 0.97),
    'doc-bg': chrome(neutral, 0.93),
    'doc-bg-subtle': chrome(neutral, 0.9),
    'doc-bg-hover': chrome(neutral, 0.86),
    'doc-bg-input': chrome(neutral, 0.94),

    // Text
    'doc-text': neutralScale['900'],
    'doc-text-muted': neutralScale['600'],
    'doc-text-subtle': neutralScale['500'],
    'doc-text-placeholder': neutralScale['400'],

    // Borders
    'doc-border': chrome(neutral, 0.8),
    'doc-border-light': chrome(neutral, 0.86),
    'doc-border-dark': chrome(neutral, 0.74),
    'doc-border-input': chrome(neutral, 0.78),

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
    'doc-shadow': mix(neutral, 15),
    'doc-shadow-strong': mix(neutral, 30),
    'doc-shadow-subtle': mix(neutral, 6),
    'doc-shadow-lg': `0 10px 15px -3px ${mix(neutral, 10)}, 0 4px 6px -4px ${mix(neutral, 10)}`,
    'doc-card-shadow': `0 1px 3px ${mix(neutral, 20)}, 0 2px 6px ${mix(neutral, 8)}`,
    'doc-card-shadow-strong': `0 1px 3px ${mix(neutral, 30)}, 0 4px 8px 3px ${mix(neutral, 15)}`,

    // Other
    'doc-overlay': mix(neutral, 50),
    'doc-focus-ring': mix(primaryScale['500'], 40),
    'doc-selection': mix(primaryScale['500'], 30),

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
  const accent = accentFamily(primaryDark, seed.accent ? lightenForDarkMode(seed.accent) : undefined)

  return {
    // Primary family (inverted - darker primary becomes lighter in dark mode)
    'doc-primary': primaryScale['500'],
    'doc-primary-hover': primaryScale['400'],
    'doc-primary-light': primaryScale['200'],
    'doc-accent': accent.color,
    'doc-accent-bg': accent.dark,
    'doc-on-primary': pickForeground(primaryScale['500']),
    'doc-toggle-active-bg': primaryScale['200'],
    'doc-toggle-active-fg': primaryScale['500'],

    // Surfaces (inverted)
    'doc-surface': chrome(neutral, 0.22),
    'doc-card': chrome(neutral, 0.26),
    'doc-bg': chrome(neutral, 0.18),
    'doc-bg-subtle': chrome(neutral, 0.26),
    'doc-bg-hover': chrome(neutral, 0.32),
    'doc-bg-input': chrome(neutral, 0.24),

    // Text (inverted - light in dark mode)
    'doc-text': neutralScale['50'],
    'doc-text-muted': neutralScale['300'],
    'doc-text-subtle': neutralScale['400'],
    'doc-text-placeholder': neutralScale['500'],

    // Borders (inverted)
    'doc-border': chrome(neutral, 0.4),
    'doc-border-light': chrome(neutral, 0.36),
    'doc-border-dark': chrome(neutral, 0.3),
    'doc-border-input': chrome(neutral, 0.42),

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
    'doc-shadow': mix(neutral, 40),
    'doc-shadow-strong': mix(neutral, 60),
    'doc-shadow-subtle': mix(neutral, 20),
    'doc-shadow-lg': `0 10px 15px -3px ${mix(neutral, 50)}, 0 4px 6px -4px ${mix(neutral, 50)}`,
    'doc-card-shadow': `0 1px 3px ${mix(neutral, 40)}, 0 2px 6px ${mix(neutral, 20)}`,
    'doc-card-shadow-strong': `0 1px 3px ${mix(neutral, 50)}, 0 4px 8px 3px ${mix(neutral, 30)}`,

    // Other
    'doc-overlay': mix(neutral, 70),
    'doc-focus-ring': mix(primaryScale['500'], 45),
    'doc-selection': mix(primaryScale['500'], 32),

    'doc-scrollbar-thumb': `color-mix(in srgb, ${neutralScale['500']} 45%, transparent)`,
    'doc-scrollbar-thumb-hover': `color-mix(in srgb, ${neutralScale['500']} 65%, transparent)`,

    'doc-caret': neutralScale['100']
  }
}

function declarations(tokens: IBetterOfficeThemeTokens): string {
  return Object.entries(tokens)
    .map(([key, value]) => `--${key}:${value};`)
    .join('')
}

/**
 * Build a stylesheet theming every `selector` element (light) and `selector.dark` (dark),
 * including roots nested inside a dark root. Declarations are `--doc-*` only.
 * Pure; the `:root` prefix outranks the editor's default rules.
 */
export function createBetterOfficeThemeCss(
  light: IBetterOfficeThemeTokens,
  dark: IBetterOfficeThemeTokens,
  selector: string = '.oox-root'
): string {
  const darkTargets = `:root ${selector}.dark, :root ${selector}.dark ${selector}`
  return `:root ${selector}{${declarations(light)}}\n${darkTargets}{${declarations(dark)}}\n`
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
