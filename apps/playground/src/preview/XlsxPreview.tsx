import { useMemo } from 'react'
import { XlsxEditor } from '@betteroffice/xlsx-react'
import FormatPreview from './FormatPreview'
import { FORMATS, type ILoadedFile } from './formats'

const NOT_THEMED = '此编辑器暂不跟随主题'

interface IXlsxPreviewProps {
  file: ILoadedFile | undefined
  onFile: (file: ILoadedFile) => void
}

function XlsxStage({ file }: { file: ILoadedFile }) {
  const bytes = useMemo(() => file.bytes.slice(), [file])
  return <XlsxEditor key={file.id} file={bytes} fileName={file.name} />
}

export default function XlsxPreview({ file, onFile }: IXlsxPreviewProps) {
  return (
    <FormatPreview format={FORMATS.xlsx} file={file} onFile={onFile} notice={NOT_THEMED}>
      {(loaded) => <XlsxStage file={loaded} />}
    </FormatPreview>
  )
}
