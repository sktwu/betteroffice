import { useMemo } from 'react'
import { useTheme } from '@betteroffice/docx-react'
import { XlsxEditor } from '@betteroffice/xlsx-react'
import FormatPreview from './FormatPreview'
import { FORMATS, type ILoadedFile } from './formats'

interface IXlsxPreviewProps {
  file: ILoadedFile | undefined
  onFile: (file: ILoadedFile) => void
}

function XlsxStage({ file }: { file: ILoadedFile }) {
  const { mode } = useTheme()
  const bytes = useMemo(() => file.bytes.slice(), [file])
  return <XlsxEditor key={file.id} file={bytes} fileName={file.name} colorMode={mode} />
}

export default function XlsxPreview({ file, onFile }: IXlsxPreviewProps) {
  return (
    <FormatPreview format={FORMATS.xlsx} file={file} onFile={onFile}>
      {(loaded) => <XlsxStage file={loaded} />}
    </FormatPreview>
  )
}
