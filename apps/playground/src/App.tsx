import { useEffect, useMemo, useState } from 'react'
import { useTheme } from '@betteroffice/docx-react'
import ThemePanel from './components/ThemePanel'
import ThemeLab from './pages/ThemeLab'
import SimpleMode from './pages/SimpleMode'
import ComponentGallery from './pages/ComponentGallery'
import DocxPreview from './preview/DocxPreview'
import PptxPreview from './preview/PptxPreview'
import XlsxPreview from './preview/XlsxPreview'
import type { FormatId, ILoadedFile } from './preview/formats'
import './styles/app.css'

const TABS = [
  { id: 'docx', label: 'Word' },
  { id: 'pptx', label: 'PowerPoint' },
  { id: 'xlsx', label: 'Excel' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'simple', label: 'Simple Mode' },
  { id: 'gallery', label: 'Gallery' }
] as const

type TabId = (typeof TABS)[number]['id']

function readTab(): TabId {
  const hash = window.location.hash.slice(1)
  return TABS.some((tab) => tab.id === hash) ? (hash as TabId) : 'docx'
}

export default function App() {
  const { mode } = useTheme()
  const [tab, setTab] = useState<TabId>(readTab)
  const [files, setFiles] = useState<Partial<Record<FormatId, ILoadedFile>>>({})

  useEffect(() => {
    const onHashChange = () => setTab(readTab())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const selectTab = (next: TabId) => {
    window.location.hash = next
    setTab(next)
  }

  const setFile = useMemo(() => {
    const handler = (format: FormatId) => (file: ILoadedFile) =>
      setFiles((prev) => ({ ...prev, [format]: file }))
    const handlers = { docx: handler('docx'), pptx: handler('pptx'), xlsx: handler('xlsx') }
    return (format: FormatId) => handlers[format]
  }, [])

  return (
    <div className={`app-container oox-root${mode === 'dark' ? ' dark' : ''}`}>
      <header className="app-header">
        <h1>BetterOffice Theme Playground</h1>
        <nav className="nav-tabs">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`tab ${tab === item.id ? 'active' : ''}`}
              onClick={() => selectTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="app-body">
        <ThemePanel />
        <main className={`app-main${tab === 'docx' || tab === 'pptx' || tab === 'xlsx' ? ' app-main-editor' : ''}`}>
          {tab === 'docx' && <DocxPreview file={files.docx} onFile={setFile('docx')} />}
          {tab === 'pptx' && <PptxPreview file={files.pptx} onFile={setFile('pptx')} />}
          {tab === 'xlsx' && <XlsxPreview file={files.xlsx} onFile={setFile('xlsx')} />}
          {tab === 'tokens' && <ThemeLab />}
          {tab === 'simple' && <SimpleMode />}
          {tab === 'gallery' && <ComponentGallery />}
        </main>
      </div>
    </div>
  )
}
