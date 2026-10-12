import { useMemo } from 'react'
import { DocxEditor, useTheme } from '@betteroffice/docx-react'
import { configureDefaultFonts } from '@betteroffice/docx/layout'
import { setGoogleFontsEnabled } from '@betteroffice/docx/utils'
import FormatPreview, { type IPreviewActions } from './FormatPreview'
import { FORMATS, type ILoadedFile } from './formats'

configureDefaultFonts({ load: () => import('@betteroffice/fonts/cdn') })
setGoogleFontsEnabled(false)

interface IDocxPreviewProps {
  file: ILoadedFile | undefined
  onFile: (file: ILoadedFile) => void
}

function DocxStage({ file, actions }: { file: ILoadedFile; actions: IPreviewActions }) {
  const { mode } = useTheme()
  const buffer = useMemo(() => file.bytes.slice().buffer, [file])
  return (
    <DocxEditor
      key={file.id}
      documentBuffer={buffer}
      documentName={file.name}
      colorMode={mode}
      onOpen={actions.openFile}
      onError={(cause) => actions.reportError(cause.message)}
      showToolbar
      showRuler
      showZoomControl
    />
  )
}

export default function DocxPreview({ file, onFile }: IDocxPreviewProps) {
  return (
    <FormatPreview format={FORMATS.docx} file={file} onFile={onFile}>
      {(loaded, actions) => <DocxStage file={loaded} actions={actions} />}
    </FormatPreview>
  )
}
