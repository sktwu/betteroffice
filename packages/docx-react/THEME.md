# React Theme Integration

Use `BetterOfficeThemeProvider` to manage and apply themes in React applications.

## Installation

```bash
bun add @betteroffice/docx-react @betteroffice/theme
```

## Basic Setup

Wrap your app with the theme provider:

```typescript
import { BetterOfficeThemeProvider } from '@betteroffice/docx-react'
import { DocxEditor } from '@betteroffice/docx-react'

function App() {
  return (
    <BetterOfficeThemeProvider
      seed={{
        primary: '#1a73e8',
        neutral: '#202124'
      }}
      defaultMode="light"
    >
      <DocxEditor />
    </BetterOfficeThemeProvider>
  )
}
```

## Hooks

### `useTheme()`

Access the current theme context.

```typescript
import { useTheme } from '@betteroffice/docx-react'

function MyComponent() {
  const { seed, mode, lightTokens, darkTokens, setMode } = useTheme()

  return (
    <button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
      Current mode: {mode}
    </button>
  )
}
```

Returns:
- `seed`: Current `IBetterOfficeThemeSeed`
- `mode`: Current mode ('light' or 'dark')
- `lightTokens`: Light mode token set
- `darkTokens`: Dark mode token set
- `setMode(mode)`: Function to change mode

### `useSetMode()`

Shorthand for changing the mode.

```typescript
const setMode = useSetMode()
setMode('dark')
```

### `useThemeTokens()`

Access token sets directly.

```typescript
const { light, dark } = useThemeTokens()
const currentTokens = useTheme().mode === 'light' ? light : dark
```

## Props

### `IBetterOfficeThemeProviderProps`

```typescript
interface IBetterOfficeThemeProviderProps {
  children: ReactNode

  // Theme seed configuration
  seed?: IBetterOfficeThemeSeed

  // Initial mode
  defaultMode?: 'light' | 'dark'

  // Optional callback when mode changes
  onModeChange?: (mode: 'light' | 'dark') => void
}
```

## Customization

### Sync with system preference

```typescript
function App() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  return (
    <BetterOfficeThemeProvider
      seed={customSeed}
      defaultMode={prefersDark ? 'dark' : 'light'}
    >
      {/* App */}
    </BetterOfficeThemeProvider>
  )
}
```

### Change theme dynamically

The theme provider automatically regenerates tokens when the seed changes.

```typescript
function ThemeSelector() {
  const [theme, setTheme] = useState('default')

  const seed = theme === 'default'
    ? { primary: '#1a73e8', neutral: '#202124' }
    : { primary: '#9c27b0', neutral: '#4a148c' }

  return (
    <>
      <BetterOfficeThemeProvider seed={seed}>
        {/* App updates automatically */}
      </BetterOfficeThemeProvider>
      <select onChange={(e) => setTheme(e.target.value)}>
        <option value="default">Google</option>
        <option value="purple">Purple</option>
      </select>
    </>
  )
}
```

## Styling Components

Use CSS variables in your stylesheets:

```css
.my-button {
  background-color: var(--doc-primary);
  color: var(--doc-on-primary);
  border: 1px solid var(--doc-border);
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.my-button:hover {
  background-color: var(--doc-primary-hover);
}

/* Dark mode automatically handled via .oox-root.dark class */
.oox-root.dark .my-button {
  /* Inherits dark mode tokens automatically */
}
```

## Accessibility

- All token generation includes WCAG contrast checking
- `--doc-on-primary` automatically selects white or black for readability
- Status colors (error, success, warning) maintain 4.5:1 minimum contrast
- Focus ring colors ensure visibility in both modes

## Performance

- Tokens are memoized and regenerated only when seed changes
- DOM updates batched in a single effect
- No runtime re-renders unless seed or mode changes
- Suitable for high-frequency updates

## Troubleshooting

**Q: Styles aren't applying?**  
A: Ensure the `.oox-root` element exists in your DOM. The provider applies styles to this element.

**Q: Dark mode not working?**  
A: Verify `.dark` class is being added to `.oox-root` when switching to dark mode.

**Q: Colors look wrong?**  
A: Check that seed colors are valid hex (#RRGGBB) or OKLCH format.

## See Also

- [@betteroffice/theme](../../packages/theme) - Core generation API
- [Theme Playground](../../apps/playground) - Interactive demo
