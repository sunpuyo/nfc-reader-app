export interface NDEFMessage {
  records: NDEFRecord[]
}

export interface NDEFRecord {
  recordType: string
  mediaType?: string
  id?: string
  data?: DataView
  encoding?: string
  lang?: string
}

export interface NFCReadingError {
  name: string
  message: string
}

export interface NFCTagData {
  serialNumber: string
  message?: NDEFMessage
  rawData?: string
  readTime: Date
  recordTypes?: string[]
}

export interface NFCReaderState {
  isSupported: boolean
  isReading: boolean
  error: string | null
  tagData: NFCTagData | null
  history: NFCTagData[]
}

declare global {
  interface Window {
    NDEFReader: any
  }
}

export interface NDEFReaderOptions {
  signal?: AbortSignal
}

export interface NDEFScanOptions {
  signal?: AbortSignal
}

export interface NDEFWriteOptions {
  overwrite?: boolean
  signal?: AbortSignal
}