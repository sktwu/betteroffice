import { useCallback, useEffect, useRef, useState, type DragEvent, type ReactNode } from 'react'
import { hasPart, isZip, type IFormatConfig, type ILoadedFile } from './formats'

interface IFormatPreviewProps {
  format: IFormatConfig
  file: ILoadedFile | undefined
  onFile: (file: ILoadedFile) => void
  notice?: string
  children: (file: ILoadedFile, actions: IPreviewActions) => ReactNode
}

export interface IPreviewActions {
  reportError: (message: string) => void
  openFile: (file: File) => void
}

let nextFileId = 1

export default function FormatPreview({ format, file, onFile, notice, children }: IFormatPreviewProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const sequence = useRef(0)
  const current = useRef(file)
  const previous = useRef<ILoadedFile | undefined>(undefined)
  current.current = file

  const accept = useCallback(
    (name: string, bytes: Uint8Array) => {
      previous.current = current.current
      setError(null)
      onFile({ id: nextFileId++, name, bytes })
    },
    [onFile]
  )

  const openBlob = useCallback(
    async (blob: Blob, name: string) => {
      const ticket = ++sequence.current
      if (!name.toLowerCase().endsWith(format.extension)) {
        setError(`${name}: expected a ${format.extension} file`)
        return
      }
      setLoading(true)
      try {
        const bytes = new Uint8Array(await blob.arrayBuffer())
        if (ticket !== sequence.current) return
        if (!isZip(bytes)) {
          setError(`${name}: not a valid ${format.extension} package (missing ZIP header)`)
          return
        }
        if (!hasPart(bytes, format.mainPart)) {
          setError(`${name}: not a ${format.extension} package (missing ${format.mainPart})`)
          return
        }
        accept(name, bytes)
      } catch (cause) {
        if (ticket === sequence.current) {
          setError(`${name}: ${cause instanceof Error ? cause.message : String(cause)}`)
        }
      } finally {
        if (ticket === sequence.current) setLoading(false)
      }
    },
    [accept, format.extension, format.mainPart]
  )

  const loadSample = useCallback(async () => {
    const ticket = ++sequence.current
    setLoading(true)
    try {
      const response = await fetch(format.sample.url)
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
      const bytes = new Uint8Array(await response.arrayBuffer())
      if (ticket === sequence.current) accept(format.sample.name, bytes)
    } catch (cause) {
      if (ticket === sequence.current) {
        setError(`${format.sample.name}: ${cause instanceof Error ? cause.message : String(cause)}`)
      }
    } finally {
      if (ticket === sequence.current) setLoading(false)
    }
  }, [accept, format.sample])

  useEffect(() => {
    if (!current.current) void loadSample()
  }, [loadSample])

  const reportError = useCallback(
    (message: string) => {
      const failed = current.current
      setError(`${failed?.name ?? format.label}: ${message}`)
      const fallback = previous.current
      previous.current = undefined
      if (fallback && fallback !== failed) onFile(fallback)
    },
    [format.label, onFile]
  )

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    setDragging(false)
    const picked = event.dataTransfer.files?.[0]
    if (picked) void openBlob(picked, picked.name)
  }

  return (
    <div className="format-preview">
      <div className="format-toolbar">
        <label className="btn-primary format-open">
          <input
            type="file"
            accept={`${format.extension},${format.mime}`}
            hidden
            onChange={(event) => {
              const picked = event.target.files?.[0]
              event.target.value = ''
              if (picked) void openBlob(picked, picked.name)
            }}
          />
          Open {format.extension}
        </label>
        <button type="button" className="btn-secondary" onClick={() => void loadSample()}>
          Load sample
        </button>
        {file && <span className="format-filename">{file.name}</span>}
        {notice && <span className="format-notice">{notice}</span>}
      </div>
      {error && (
        <div className="format-error" role="alert">
          <span>{error}</span>
          <button type="button" aria-label="Dismiss error" onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}
      <div
        className={`format-stage${dragging ? ' dragging' : ''}`}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {file ? children(file, { reportError, openFile: (picked) => void openBlob(picked, picked.name) }) : null}
        {(loading || !file) && (
          <div className="format-overlay">{loading ? 'Opening…' : `Drop a ${format.extension} here`}</div>
        )}
      </div>
    </div>
  )
}
