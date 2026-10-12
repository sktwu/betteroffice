/**
 * Minimal seed configuration required to generate a complete theme.
 * BetterOffice will auto-derive all other colors from these two inputs.
 */
export interface IBetterOfficeThemeSeed {
  /** Primary/action color (e.g., '#1a73e8'). Used for buttons, links, active states. */
  primary: string

  /** Neutral color (e.g., '#202124'). Used for text, borders, backgrounds. */
  neutral: string

  /** Optional accent. When omitted, derived by shifting the primary hue. */
  accent?: string

  /** Optional: Status colors. If not provided, defaults will be used. */
  error?: string
  success?: string
  warning?: string
  link?: string
}

/**
 * Complete set of DOM chrome tokens.
 * All values are generated from the seed and are always strings (hex, rgb, oklch, etc).
 */
export interface IBetterOfficeThemeTokens {
  // Primary color family
  'doc-primary': string
  'doc-primary-hover': string
  'doc-primary-light': string
  'doc-accent': string
  'doc-accent-bg': string
  'doc-on-primary': string
  'doc-toggle-active-bg': string
  'doc-toggle-active-fg': string

  // Surface colors
  'doc-surface': string
  'doc-card': string
  'doc-bg': string
  'doc-bg-subtle': string
  'doc-bg-hover': string
  'doc-bg-input': string

  // Text colors
  'doc-text': string
  'doc-text-muted': string
  'doc-text-subtle': string
  'doc-text-placeholder': string

  // Border colors
  'doc-border': string
  'doc-border-light': string
  'doc-border-dark': string
  'doc-border-input': string

  // Status colors
  'doc-error': string
  'doc-error-bg': string
  'doc-success': string
  'doc-success-bg': string
  'doc-warning': string
  'doc-warning-bg': string
  'doc-warning-text': string

  // Other
  'doc-link': string
  'doc-shadow': string
  'doc-shadow-strong': string
  'doc-shadow-subtle': string
  'doc-shadow-lg': string
  'doc-card-shadow': string
  'doc-card-shadow-strong': string

  'doc-overlay': string
  'doc-focus-ring': string
  'doc-selection': string

  'doc-scrollbar-thumb': string
  'doc-scrollbar-thumb-hover': string

  'doc-caret': string
}

export type IBetterOfficeThemeMode = 'light' | 'dark'
