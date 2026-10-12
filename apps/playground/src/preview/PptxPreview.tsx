import { useEffect, useMemo, useState } from 'react'
import { PptxEditor } from '@betteroffice/pptx-react'
import type { PptxFontFace } from '@betteroffice/pptx'
import { loadBundledFontBytes, resolveLastResortFace, resolveMetricCompatFace } from '@betteroffice/fonts'
import FormatPreview, { type IPreviewActions } from './FormatPreview'
import { FORMATS, type ILoadedFile } from './formats'

const NOT_THEMED = '此编辑器暂不跟随主题'

let fontsPromise: Promise<PptxFontFace[]> | null = null

function loadFonts(): Promise<PptxFontFace[]> {
  fontsPromise ??= Promise.all(
    [
      { bold: false, italic: false },
      { bold: true, italic: false },
      { bold: false, italic: true },
      { bold: true, italic: true }
    ].map(async ({ bold, italic }) => {
      const face = resolveMetricCompatFace('Arial', bold, italic) ?? resolveLastResortFace('Arial', bold, italic)
      const bytes = await loadBundledFontBytes(face)
      return { family: 'Arial', bold, italic, bytes: new Uint8Array(bytes.slice(0)) }
    })
  )
  return fontsPromise
}

interface IPptxPreviewProps {
  file: ILoadedFile | undefined
  onFile: (file: ILoadedFile) => void
}

function PptxStage({ file, fonts, actions }: { file: ILoadedFile; fonts: PptxFontFace[]; actions: IPreviewActions }) {
  const bytes = useMemo(() => file.bytes.slice(), [file])
  return (
    <PptxEditor
      key={file.id}
      file={bytes}
      fileName={file.name}
      fonts={fonts}
      onError={(cause) => actions.reportError(cause.message)}
    />
  )
}

export default function PptxPreview({ file, onFile }: IPptxPreviewProps) {
  const [fonts, setFonts] = useState<PptxFontFace[] | null>(null)
  const [fontError, setFontError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    loadFonts().then(
      (loaded) => !cancelled && setFonts(loaded),
      (cause: unknown) => !cancelled && setFontError(cause instanceof Error ? cause.message : String(cause))
    )
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <FormatPreview format={FORMATS.pptx} file={file} onFile={onFile} notice={NOT_THEMED}>
      {(loaded, actions) =>
        fontError ? (
          <p className="format-message">Failed to load fonts: {fontError}</p>
        ) : fonts ? (
          <PptxStage file={loaded} fonts={fonts} actions={actions} />
        ) : (
          <p className="format-message">Loading fonts…</p>
        )
      }
    </FormatPreview>
  )
}
