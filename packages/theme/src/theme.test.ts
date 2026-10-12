import { describe, expect, test } from 'bun:test'
import { displayable } from 'culori'
import { parseColor } from './color/oklch'
import { createBetterOfficeThemeCss, generateBetterOfficeTheme } from './theme'

const light = generateBetterOfficeTheme(undefined, 'light')
const dark = generateBetterOfficeTheme(undefined, 'dark')

describe('createBetterOfficeThemeCss', () => {
  test('emits light and dark rules with every token', () => {
    const css = createBetterOfficeThemeCss(light, dark)
    const [lightRule, darkRule] = css.trim().split('\n')
    expect(lightRule.startsWith(':root .oox-root{')).toBe(true)
    expect(darkRule.startsWith(':root .oox-root.dark, :root .oox-root.dark .oox-root{')).toBe(true)
    for (const [key, value] of Object.entries(light)) {
      expect(lightRule).toContain(`--${key}:${value};`)
    }
    for (const [key, value] of Object.entries(dark)) {
      expect(darkRule).toContain(`--${key}:${value};`)
    }
  })

  test('honours a custom selector', () => {
    const css = createBetterOfficeThemeCss(light, dark, '.my-host')
    expect(css).toContain(':root .my-host{')
    expect(css).toContain(':root .my-host.dark, :root .my-host.dark .my-host{')
    expect(css).not.toContain('.oox-root')
  })

  test('is deterministic and keeps token-key order', () => {
    const css = createBetterOfficeThemeCss(light, dark)
    expect(createBetterOfficeThemeCss(light, dark)).toBe(css)
    const keys = Object.keys(light)
    const positions = keys.map((key) => css.indexOf(`--${key}:`))
    expect(positions).toEqual([...positions].sort((a, b) => a - b))
  })

  test('declares doc tokens only', () => {
    const css = createBetterOfficeThemeCss(light, dark)
    expect(css).toContain(`--doc-primary:${light['doc-primary']};`)
    expect(css).not.toContain('--primary:')
    expect(css).not.toContain('--foreground:')
  })

  test('overrides a single token', () => {
    const tokens = generateBetterOfficeTheme(undefined, 'light', { 'doc-surface': '#fffdf8' })
    expect(tokens['doc-surface']).toBe('#fffdf8')
    expect(tokens['doc-bg']).toBe(light['doc-bg'])
  })

  test('keeps accent distinct and shows the neutral hue on surfaces', () => {
    expect(light['doc-accent']).not.toBe(light['doc-primary'])
    const tinted = generateBetterOfficeTheme({ primary: '#1a73e8', neutral: '#6b4f2a' }, 'light')
    const surface = parseColor(tinted['doc-surface'])
    expect(surface?.l ?? 1).toBeLessThan(0.97)
    expect(surface?.c ?? 0).toBeGreaterThan(0.02)
    expect(tinted['doc-focus-ring']).toContain('color-mix')
    expect(tinted['doc-shadow']).not.toContain('60, 64, 67')
  })

  test('fits the dark primary into sRGB', () => {
    const primary = parseColor(dark['doc-primary'])
    expect(primary && displayable(primary)).toBe(true)
  })

  test('does not touch the DOM', () => {
    expect(typeof document).toBe('undefined')
    expect(() => createBetterOfficeThemeCss(light, dark)).not.toThrow()
  })
})
