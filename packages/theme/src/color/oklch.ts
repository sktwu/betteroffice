import { converter, displayable, formatCss, parse, type Oklch } from 'culori'

const toOklch = converter('oklch')

export function parseColor(input: string): Oklch | undefined {
  const parsed = parse(input.trim())

  if (!parsed) {
    return undefined
  }

  const oklch = toOklch(parsed)

  if (oklch?.mode !== 'oklch') {
    return undefined
  }

  return oklch
}

export function formatOklch(color: Oklch, alpha?: number): string {
  const value: Oklch = {
    mode: 'oklch',
    l: clamp01(color.l ?? 0),
    c: Math.max(0, color.c ?? 0),
    h: normalizeHue(color.h)
  }

  if (alpha !== undefined && alpha < 1) {
    return formatCss({ ...value, alpha: clamp01(alpha) })
  }

  return formatCss(value)
}

/** Reduce chroma until the color fits sRGB. */
export function fitInGamut(color: string): string {
  const parsed = parseColor(color)

  if (!parsed) {
    return color
  }

  let chroma = parsed.c ?? 0
  while (chroma > 0 && !displayable({ ...parsed, c: chroma })) {
    chroma = Math.max(0, Math.round((chroma - 0.01) * 1000) / 1000)
  }

  return formatOklch({ ...parsed, c: chroma })
}

export function hslComponentsToOklch(hsl: string): string {
  const parsed = parse(`hsl(${hsl})`)

  if (!parsed) {
    throw new Error(`Invalid HSL components: ${hsl}`)
  }

  const oklch = toOklch(parsed)

  if (!oklch) {
    throw new Error(`Unable to convert HSL to OKLCH: ${hsl}`)
  }

  return formatOklch(oklch)
}

export function withOklchLightness(color: string, lightness: number): string {
  const parsed = parseColor(color)

  if (!parsed) {
    throw new Error(`Invalid color: ${color}`)
  }

  return formatOklch({
    ...parsed,
    l: clamp01(lightness)
  })
}

export function getOklchLightness(color: string): number {
  const parsed = parseColor(color)

  if (parsed?.l === undefined) {
    throw new Error(`Invalid color: ${color}`)
  }

  return parsed.l
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

function normalizeHue(hue: number | undefined): number | undefined {
  if (hue === undefined || Number.isNaN(hue)) {
    return undefined
  }

  const normalized = hue % 360
  return normalized < 0 ? normalized + 360 : normalized
}

export function normalizeColorInput(input: string): string {
  const trimmed = input.trim()

  if (trimmed.startsWith('oklch(')) {
    const parsed = parseColor(trimmed)

    if (!parsed) {
      throw new Error(`Invalid OKLCH color: ${input}`)
    }

    return formatOklch(parsed)
  }

  if (trimmed.startsWith('#')) {
    const parsed = parseColor(trimmed)

    if (!parsed) {
      throw new Error(`Invalid hex color: ${input}`)
    }

    return formatOklch(parsed)
  }

  if (trimmed.startsWith('hsl(')) {
    const parsed = parseColor(trimmed)

    if (!parsed) {
      throw new Error(`Invalid HSL color: ${input}`)
    }

    return formatOklch(parsed)
  }

  const parsed = parseColor(trimmed)

  if (!parsed) {
    throw new Error(`Invalid color: ${input}`)
  }

  return formatOklch(parsed)
}
