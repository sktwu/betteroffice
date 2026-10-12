/**
 * OKLCH L targets for Tailwind-like 50–950 scales.
 * Ensures perceptually uniform color transitions.
 */
export const SCALE_LIGHTNESS: Record<string, number> = {
  '50': 0.985,
  '100': 0.967,
  '200': 0.92,
  '300': 0.87,
  '400': 0.708,
  '500': 0.556,
  '600': 0.439,
  '700': 0.371,
  '800': 0.269,
  '900': 0.205,
  '950': 0.145
}

/**
 * Default seed colors (Google Docs blue/gray).
 * Used when no seed is provided.
 */
export const BETTEROFFICE_DEFAULT_PRIMARY = '#1a73e8'
export const BETTEROFFICE_DEFAULT_NEUTRAL = '#202124'

/**
 * Predefined status colors (used if not provided in seed).
 */
export const STATUS_COLOR_PRESETS = {
  error: '#c5221f',
  success: '#34a853',
  warning: '#f9a825',
  link: '#0563c1'
} as const
