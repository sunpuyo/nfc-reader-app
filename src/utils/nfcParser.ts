import { NDEFRecord } from '../types/nfc'

export function parseNDEFRecord(record: NDEFRecord): {
  type: string
  content: string
} {
  const decoder = new TextDecoder(record.encoding || 'utf-8')
  
  let type = 'Unknown'
  let content = ''
  
  console.log('Parsing record:', {
    recordType: record.recordType,
    mediaType: record.mediaType,
    encoding: record.encoding,
    hasData: !!record.data,
    dataLength: record.data?.byteLength
  })
  
  switch (record.recordType) {
    case 'text':
      type = 'Text'
      if (record.data) {
        try {
          // Text records have language code in first bytes
          const langCodeLength = new DataView(record.data.buffer).getUint8(0) & 0x3f
          const textStartIndex = langCodeLength + 1
          content = decoder.decode(new DataView(
            record.data.buffer,
            textStartIndex,
            record.data.byteLength - textStartIndex
          ))
        } catch (e) {
          console.error('Error parsing text record:', e)
          content = dataViewToHex(record.data)
        }
      }
      break
      
    case 'url':
      type = 'URL'
      if (record.data) {
        try {
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
        } catch (e) {
          console.error('Error parsing URL record:', e)
          content = dataViewToHex(record.data)
        }
      }
      break
      
    case 'mime':
      type = `MIME (${record.mediaType || 'unknown'})`
      if (record.data) {
        try {
          content = decoder.decode(record.data)
        } catch (e) {
          console.error('Error parsing MIME record:', e)
          content = dataViewToHex(record.data)
        }
      }
      break
    
    case 'absolute-url':
    case 'smart-poster':
    case 'empty':
    case 'unknown':
      type = record.recordType.charAt(0).toUpperCase() + record.recordType.slice(1)
      if (record.data && record.data.byteLength > 0) {
        try {
          content = decoder.decode(record.data)
        } catch (e) {
          content = dataViewToHex(record.data)
        }
      } else if (record.recordType === 'empty') {
        content = '(빈 레코드)'
      } else {
        content = '(데이터 없음)'
      }
      break
      
    default:
      // Handle custom types or external types
      type = `Custom (${record.recordType})`
      if (record.data) {
        try {
          // Try to decode as text first
          content = decoder.decode(record.data)
          // If it looks like binary data, show as hex
          if (content.includes('\0') || content.includes('\ufffd')) {
            content = `HEX: ${dataViewToHex(record.data)}`
          }
        } catch (e) {
          console.error('Error parsing custom record:', e)
          content = `HEX: ${dataViewToHex(record.data)}`
        }
      }
      
      // Log raw data for debugging
      console.log('Custom record raw data:', {
        type: record.recordType,
        hex: record.data ? dataViewToHex(record.data) : 'No data',
        mediaType: record.mediaType
      })
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