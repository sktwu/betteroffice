import { useTheme } from '@betteroffice/docx-react'
import ColorPicker from './ColorPicker'
import { useSetSeed } from '../seed-context'

export default function ThemePanel() {
  const { seed, mode, setMode } = useTheme()
  const setSeed = useSetSeed()

  return (
    <aside className="theme-panel">
      <h2>Theme</h2>
      <ColorPicker
        label="Primary Color"
        value={seed.primary}
        onChange={(primary) => setSeed({ ...seed, primary })}
      />
      <ColorPicker
        label="Neutral Color"
        value={seed.neutral}
        onChange={(neutral) => setSeed({ ...seed, neutral })}
      />
      <button
        type="button"
        className="mode-toggle"
        onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
      >
        {mode === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </aside>
  )
}
