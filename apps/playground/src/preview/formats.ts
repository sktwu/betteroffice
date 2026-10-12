import docxSample from '../../../demo/public/betteroffice-demo.docx?url'
import pptxSample from '../../../demo/public/betteroffice-demo.pptx?url'
import xlsxSample from '../../../demo/public/showcase.xlsx?url'

export type FormatId = 'docx' | 'pptx' | 'xlsx'

export interface ILoadedFile {
  id: number
  name: string
  bytes: Uint8Array
}

export interface IFormatConfig {
  id: FormatId
  label: string
  extension: string
  mime: string
  mainPart: string
  sample: { url: string; name: string }
}

export const FORMATS: Record<FormatId, IFormatConfig> = {
  docx: {
    id: 'docx',
    label: 'Word',
    extension: '.docx',
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    mainPart: 'word/document.xml',
    sample: { url: docxSample, name: 'betteroffice-demo.docx' }
  },
  pptx: {
    id: 'pptx',
    label: 'PowerPoint',
    extension: '.pptx',
    mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    mainPart: 'ppt/presentation.xml',
    sample: { url: pptxSample, name: 'betteroffice-demo.pptx' }
  },
  xlsx: {
    id: 'xlsx',
    label: 'Excel',
    extension: '.xlsx',
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    mainPart: 'xl/workbook.xml',
    sample: { url: xlsxSample, name: 'showcase.xlsx' }
  }
}

export function isZip(bytes: Uint8Array): boolean {
  return bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04
}

/** ZIP stores entry names uncompressed, so a byte search finds the part. */
export function hasPart(bytes: Uint8Array, part: string): boolean {
  const needle = new TextEncoder().encode(part)
  outer: for (let i = 0; i <= bytes.length - needle.length; i++) {
    for (let j = 0; j < needle.length; j++) {
      if (bytes[i + j] !== needle[j]) continue outer
    }
    return true
  }
  return false
}
