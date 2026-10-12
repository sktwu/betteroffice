import { SCALE_LIGHTNESS } from './constants'
import { formatOklch, parseColor } from './oklch'

export interface IColorScaleType {
  '50': string
  '100': string
  '150': string
  '200': string
  '300': string
  '400': string
  '500': string
  '600': string
  '700': string
  '800': string
  '900': string
  '950': string
}

/**
 * Generate a color scale with 12 steps (50–950) from a base color.
 * Uses OKLCH color space to ensure perceptually uniform steps.
 */
export function generateColorScale(
  baseColor: string,
  options?: { neutral?: boolean }
): IColorScaleType {
  const parsed = parseColor(baseColor)

  if (!parsed) {
    throw new Error(`Invalid base color for scale: ${baseColor}`)
  }

  const neutral = options?.neutral ?? false
  const chroma = neutral ? Math.min(parsed.c ?? 0, 0.02) : (parsed.c ?? 0)
  const hue = parsed.h

  const scale = {} as IColorScaleType

  // Generate 50, 100, 200, 300, 400, 600, 700, 800, 900, 950
  for (const step of ['50', '100', '200', '300', '400', '600', '700', '800', '900', '950'] as const) {
    const targetL = SCALE_LIGHTNESS[step]

    scale[step] = formatOklch({
      mode: 'oklch',
      l: targetL,
      c: chroma,
      h: hue
    })
  }

  // 150 and 500 are special: interpolate between 100/200 and use base lightness
  scale['150'] = formatOklch({
    mode: 'oklch',
    l: (SCALE_LIGHTNESS['100'] + SCALE_LIGHTNESS['200']) / 2,
    c: chroma,
    h: hue
  })

  scale['500'] = formatOklch({
    mode: 'oklch',
    l: parsed.l ?? SCALE_LIGHTNESS['500'],
    c: chroma,
    h: hue
  })

  return scale
}
