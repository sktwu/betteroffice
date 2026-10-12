import TokenTable from '../components/TokenTable'
import ComponentShowcase from '../components/ComponentShowcase'

export default function ThemeLab() {
  return (
    <div className="lab-content">
      <div className="lab-preview">
        <ComponentShowcase />
      </div>
      <div className="lab-tokens">
        <TokenTable />
      </div>
    </div>
  )
}
