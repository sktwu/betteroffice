# @betteroffice/theme

Pure-function color theme system for BetterOffice DOM chrome. Generate all `--doc-*` tokens from a minimal seed configuration.

## Features

✨ **Two-input system**: Just provide `primary` and `neutral` colors  
✨ **Automatic derivation**: 40+ tokens generated for light and dark modes  
✨ **OKLCH color space**: Perceptually uniform scales, mathematically consistent dark mode  
✨ **WCAG contrast checking**: Automatic foreground color selection for readability  
✨ **Zero dependencies** (except `culori` for color conversion)  

## Installation

```bash
bun add @betteroffice/theme
```

## Basic Usage

### Generate tokens from seed

```typescript
import { generateBetterOfficeTheme, applyBetterOfficeTheme } from '@betteroffice/theme'

// Minimal seed: just primary and neutral colors
const seed = {
  primary: '#1a73e8',    // Google blue
  neutral: '#202124'     // Google gray
}

// Generate tokens for light mode
const lightTokens = generateBetterOfficeTheme(seed, 'light')

// Generate tokens for dark mode
const darkTokens = generateBetterOfficeTheme(seed, 'dark')

// Apply to DOM
applyBetterOfficeTheme(lightTokens, '.oox-root')
```

### React Integration

Use `@betteroffice/docx-react` for React bindings:

```typescript
import { BetterOfficeThemeProvider, useTheme, useSetMode } from '@betteroffice/docx-react'

function App() {
  return (
    <BetterOfficeThemeProvider
      seed={{ primary: '#1a73e8', neutral: '#202124' }}
      defaultMode="light"
    >
      <Editor />
    </BetterOfficeThemeProvider>
  )
}

function Editor() {
  const { mode, setMode } = useTheme()
  
  return (
    <>
      <button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
        Toggle theme
      </button>
    </>
  )
}
```

## Seed Configuration

### `IBetterOfficeThemeSeed`

```typescript
interface IBetterOfficeThemeSeed {
  // Required
  primary: string      // e.g., '#1a73e8', 'oklch(0.556 0.194 254.5)'
  neutral: string      // e.g., '#202124', 'oklch(0.162 0.003 250)'

  // Optional (defaults provided if omitted)
  error?: string       // default: '#c5221f'
  success?: string     // default: '#34a853'
  warning?: string     // default: '#f9a825'
  link?: string        // default: '#0563c1'
}
```

All color inputs accept hex (#RRGGBB), rgb(), oklch(), or any format supported by culori.

## Generated Tokens

### Primary Family
- `--doc-primary`: Main action color (scale 500)
- `--doc-primary-hover`: Darker for hover states (scale 600)
- `--doc-primary-light`: Light background (scale 100)
- `--doc-accent`: Secondary accent (same as primary by default)
- `--doc-accent-bg`: Accent background (scale 50)
- `--doc-on-primary`: Text/icon on colored surfaces (auto-selected for contrast)

### Surfaces
- `--doc-surface`: Main surface (white/dark-bg)
- `--doc-card`: Card backgrounds (near-white/dark-card)
- `--doc-bg`: App background
- `--doc-bg-subtle`: Subtle section backgrounds
- `--doc-bg-hover`: Hover state backgrounds
- `--doc-bg-input`: Input field backgrounds

### Text
- `--doc-text`: Primary text
- `--doc-text-muted`: Secondary text
- `--doc-text-subtle`: Tertiary/disabled text
- `--doc-text-placeholder`: Placeholder text

### Borders
- `--doc-border`: Standard borders
- `--doc-border-light`: Lighter borders
- `--doc-border-dark`: Darker borders (tables)
- `--doc-border-input`: Input borders

### Status
- `--doc-error`, `--doc-error-bg`
- `--doc-success`, `--doc-success-bg`
- `--doc-warning`, `--doc-warning-bg`, `--doc-warning-text`

### Effects
- `--doc-link`: Hyperlink color
- `--doc-shadow`, `--doc-shadow-strong`, `--doc-shadow-subtle`, `--doc-shadow-lg`
- `--doc-card-shadow`, `--doc-card-shadow-strong`
- `--doc-overlay`: Modal background
- `--doc-focus-ring`: Focus indicator
- `--doc-selection`: Text selection background
- `--doc-scrollbar-thumb`: Scrollbar color
- `--doc-caret`: Text cursor color

## API Reference

### `generateBetterOfficeTheme(seed?, mode?)`

Generate all tokens from a seed.

```typescript
function generateBetterOfficeTheme(
  seed?: IBetterOfficeThemeSeed,
  mode?: 'light' | 'dark'
): IBetterOfficeThemeTokens
```

**Defaults**: Uses `BETTEROFFICE_DEFAULT_PRIMARY` and `BETTEROFFICE_DEFAULT_NEUTRAL` if seed is omitted.

### `applyBetterOfficeTheme(tokens, selector?)`

Apply tokens as CSS variables on a DOM element.

```typescript
function applyBetterOfficeTheme(
  tokens: IBetterOfficeThemeTokens,
  selector?: string  // default: '.oox-root'
): void
```

**Note**: Pure function. If called in SSR context (no `document`), silently no-ops.

## Dark Mode

Dark mode uses the `lightenForDarkMode()` algorithm:

1. Parse input color to OKLCH
2. Increase lightness by ~0.45 (clamped 0.75–0.92)
3. Reduce chroma by ~15% for softer colors
4. Regenerate all scales with inverted values

Result: Readable dark mode with automatically adjusted contrast.

## Integrating with Panacy

Map Panacy preset to BetterOffice seed:

```typescript
import { useTheme as usePanacyTheme } from '@panacy/theme'
import { BetterOfficeThemeProvider } from '@betteroffice/docx-react'

function App() {
  const { preset: panacyPreset, mode } = usePanacyTheme()

  const seed = {
    primary: panacyPreset.light.primary,
    neutral: panacyPreset.light.foreground,
    error: panacyPreset.light.destructive,
    success: panacyPreset.light.success,
    warning: panacyPreset.light.warning
  }

  return (
    <BetterOfficeThemeProvider seed={seed} defaultMode={mode}>
      {/* Your app */}
    </BetterOfficeThemeProvider>
  )
}
```

## Advanced Usage

### Custom color utilities

```typescript
import {
  generateColorScale,
  pickForeground,
  lightenForDarkMode,
  normalizeColorInput
} from '@betteroffice/theme'

// Generate a 12-step color scale
const scale = generateColorScale('#1a73e8')
console.log(scale['500'])  // '#1a73e8'
console.log(scale['600'])  // darker shade
console.log(scale['100'])  // lighter shade

// Pick white or black for readability
const fgColor = pickForeground('#1a73e8')  // 'oklch(0.985 0 0)' (white)

// Convert color to OKLCH and lighten for dark mode
const darkVersion = lightenForDarkMode('#1a73e8')  // '#4e9dff'
```

## Exports

- `generateBetterOfficeTheme(seed?, mode?)`
- `applyBetterOfficeTheme(tokens, selector?)`
- `generateColorScale(baseColor, options?)`
- `pickForeground(background)`
- `lightenForDarkMode(color)`
- `normalizeColorInput(color)`
- Types: `IBetterOfficeThemeSeed`, `IBetterOfficeThemeTokens`
- Constants: `BETTEROFFICE_DEFAULT_PRIMARY`, `BETTEROFFICE_DEFAULT_NEUTRAL`

## Browser Support

- Chrome/Edge: 100+
- Firefox: 97+
- Safari: 15.4+
- Requires OKLCH support (can fallback to hex via culori)

## License

Apache-2.0
