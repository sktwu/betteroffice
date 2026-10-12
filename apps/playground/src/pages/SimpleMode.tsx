import { useTheme } from '@betteroffice/docx-react'
import ColorPicker from '../components/ColorPicker'
import { useSetSeed } from '../seed-context'

export default function SimpleMode() {
  const { seed } = useTheme()
  const setSeed = useSetSeed()

  return (
    <div className="simple-mode">
      <h2>Simple Mode - Primary Color Only</h2>
      <p>All other tokens are automatically derived from this primary color.</p>
      <div className="simple-controls">
        <ColorPicker
          label="Primary Color"
          value={seed.primary}
          onChange={(primary) => setSeed({ ...seed, primary })}
        />
      </div>
      <div className="simple-preview">
        <button className="btn-primary">Primary Button</button>
        <button className="btn-secondary">Secondary Button</button>
        <input type="text" placeholder="Input field" />
        <div className="card">
          <h3>Card Title</h3>
          <p>This card is themed with the primary color.</p>
        </div>
      </div>
    </div>
  )
}
