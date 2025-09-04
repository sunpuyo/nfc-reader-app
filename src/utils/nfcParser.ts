import { NDEFRecord } from '../types/nfc'

export function parseNDEFRecord(record: NDEFRecord): {
  type: string
  content: string
} {
  const decoder = new TextDecoder(record.encoding || 'utf-8')
  
  let type = 'Unknown'
  let content = ''
  
  switch (record.recordType) {
    case 'text':
      type = 'Text'
      if (record.data) {
        // Text records have language code in first bytes
        const langCodeLength = new DataView(record.data.buffer).getUint8(0) & 0x3f
        const textStartIndex = langCodeLength + 1
        content = decoder.decode(new DataView(
          record.data.buffer,
          textStartIndex,
          record.data.byteLength - textStartIndex
        ))
      }
      break
      
    case 'url':
      type = 'URL'
      if (record.data) {
        const urlPrefixes = [
          '',
          'http://www.',
          'https://www.',
          'http://',
          'https://',
          'tel:',
          'mailto:',
          'ftp://anonymous:anonymous@',
          'ftp://ftp.',
          'ftps://',
          'sftp://',
          'smb://',
          'nfs://',
          'ftp://',
          'dav://',
          'news:',
          'telnet://',
          'imap:',
          'rtsp://',
          'urn:',
          'pop:',
          'sip:',
          'sips:',
          'tftp:',
          'btspp://',
          'btl2cap://',
          'btgoep://',
          'tcpobex://',
          'irdaobex://',
          'file://',
          'urn:epc:id:',
          'urn:epc:tag:',
          'urn:epc:pat:',
          'urn:epc:raw:',
          'urn:epc:',
          'urn:nfc:'
        ]
        
        const prefixIndex = new DataView(record.data.buffer).getUint8(0)
        const prefix = urlPrefixes[prefixIndex] || ''
        content = prefix + decoder.decode(new DataView(
          record.data.buffer,
          1,
          record.data.byteLength - 1
        ))
      }
      break
      
    case 'mime':
      type = `MIME (${record.mediaType || 'unknown'})`
      if (record.data) {
        content = decoder.decode(record.data)
      }
      break
      
    default:
      type = record.recordType
      if (record.data) {
        content = decoder.decode(record.data)
      }
  }
  
  return { type, content }
}

export function dataViewToHex(dataView: DataView | undefined): string {
  if (!dataView) return ''
  
  const bytes = new Uint8Array(dataView.buffer, dataView.byteOffset, dataView.byteLength)
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0').toUpperCase())
    .join(' ')
}

export function formatSerialNumber(serialNumber: string): string {
  // Format serial number with colons for better readability
  return serialNumber
    .toUpperCase()
    .match(/.{1,2}/g)
    ?.join(':') || serialNumber
}

export function formatReadTime(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date)
}