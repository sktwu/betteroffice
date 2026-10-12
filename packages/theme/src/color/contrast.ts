import { wcagContrast, type Oklch } from 'culori'

import { formatOklch, parseColor } from './oklch'

const MIN_CONTRAST = 4.5

const LIGHT_FOREGROUND = 'oklch(0.985 0 0)'
const DARK_FOREGROUND = 'oklch(0.205 0 0)'

export function pickForeground(background: string): string {
  const bg = parseColor(background)

  if (!bg) {
    return LIGHT_FOREGROUND
  }

  const lightContrast = contrastRatio(bg, parseColor(LIGHT_FOREGROUND)!)
  const darkContrast = contrastRatio(bg, parseColor(DARK_FOREGROUND)!)

  if (lightContrast >= MIN_CONTRAST && lightContrast >= darkContrast) {
    return LIGHT_FOREGROUND
  }

  if (darkContrast >= MIN_CONTRAST) {
    return DARK_FOREGROUND
  }

  return bg.l !== undefined && bg.l > 0.6 ? DARK_FOREGROUND : LIGHT_FOREGROUND
}

export function ensureContrast(background: string, foreground: string): string {
  const bg = parseColor(background)
  const fg = parseColor(foreground)

  if (!bg || !fg) {
    return pickForeground(background)
  }

  if (contrastRatio(bg, fg) >= MIN_CONTRAST) {
    return formatOklch(fg)
  }

  return pickForeground(background)
}

function contrastRatio(a: Oklch, b: Oklch): number {
  return wcagContrast(a, b) ?? 1
}

export function lightenForDarkMode(color: string): string {
  const parsed = parseColor(color)

  if (!parsed) {
    return color
  }

  const targetL = Math.min(0.92, Math.max(0.75, (parsed.l ?? 0.5) + 0.45))

  return formatOklch({
    ...parsed,
    l: targetL,
    c: Math.max(0.03, (parsed.c ?? 0) * 0.85)
  })
}

export function darkenForLightMode(color: string): string {
  const parsed = parseColor(color)

  if (!parsed) {
    return color
  }

  const targetL = Math.max(0.2, Math.min(0.45, (parsed.l ?? 0.5) - 0.05))

  return formatOklch({
    ...parsed,
    l: targetL
  })
}
