import { describe, it, expect } from 'vitest'
import { 
  formatSerialNumber, 
  formatReadTime, 
  dataViewToHex,
  parseNDEFRecord 
} from '../../src/utils/nfcParser'

describe('NFC Parser Utilities', () => {
  describe('formatSerialNumber', () => {
    it('should format serial number with colons', () => {
      expect(formatSerialNumber('aabbccdd')).toBe('AA:BB:CC:DD')
      expect(formatSerialNumber('112233445566')).toBe('11:22:33:44:55:66')
    })

    it('should handle odd length serial numbers', () => {
      expect(formatSerialNumber('abc')).toBe('A:BC')
    })

    it('should handle empty string', () => {
      expect(formatSerialNumber('')).toBe('')
    })
  })

  describe('dataViewToHex', () => {
    it('should convert DataView to hex string', () => {
      const buffer = new ArrayBuffer(4)
      const view = new DataView(buffer)
      view.setUint8(0, 0xAB)
      view.setUint8(1, 0xCD)
      view.setUint8(2, 0xEF)
      view.setUint8(3, 0x12)
      
      expect(dataViewToHex(view)).toBe('AB CD EF 12')
    })

    it('should handle empty DataView', () => {
      const buffer = new ArrayBuffer(0)
      const view = new DataView(buffer)
      expect(dataViewToHex(view)).toBe('')
    })

    it('should handle undefined', () => {
      expect(dataViewToHex(undefined)).toBe('')
    })
  })

  describe('formatReadTime', () => {
    it('should format date to Korean locale string', () => {
      const date = new Date('2024-01-15T14:30:45')
      const formatted = formatReadTime(date)
      
      // Check that it contains date and time components
      expect(formatted).toMatch(/\d{4}/)  // year
      expect(formatted).toMatch(/\d{2}/)  // month/day
      expect(formatted).toMatch(/\d{2}:\d{2}:\d{2}/)  // time
    })
  })

  describe('parseNDEFRecord', () => {
    it('should parse text record', () => {
      const textData = new Uint8Array([0x02, 0x65, 0x6E, 0x48, 0x65, 0x6C, 0x6C, 0x6F])
      const buffer = textData.buffer
      const record = {
        recordType: 'text',
        data: new DataView(buffer)
      }
      
      const result = parseNDEFRecord(record)
      expect(result.type).toBe('Text')
      expect(result.content).toBe('Hello')
    })

    it('should parse URL record with prefix', () => {
      // URL with https://www. prefix (index 2)
      const urlData = new Uint8Array([0x02, ...Array.from(new TextEncoder().encode('example.com'))])
      const record = {
        recordType: 'url',
        data: new DataView(urlData.buffer)
      }
      
      const result = parseNDEFRecord(record)
      expect(result.type).toBe('URL')
      expect(result.content).toBe('https://www.example.com')
    })

    it('should parse MIME record', () => {
      const mimeData = new TextEncoder().encode('{"test": "data"}')
      const record = {
        recordType: 'mime',
        mediaType: 'application/json',
        data: new DataView(mimeData.buffer)
      }
      
      const result = parseNDEFRecord(record)
      expect(result.type).toBe('MIME (application/json)')
      expect(result.content).toBe('{"test": "data"}')
    })

    it('should handle unknown record type', () => {
      const data = new TextEncoder().encode('unknown data')
      const record = {
        recordType: 'custom-type',
        data: new DataView(data.buffer)
      }
      
      const result = parseNDEFRecord(record)
      expect(result.type).toBe('custom-type')
      expect(result.content).toBe('unknown data')
    })

    it('should handle record without data', () => {
      const record = {
        recordType: 'text'
      }
      
      const result = parseNDEFRecord(record)
      expect(result.type).toBe('Text')
      expect(result.content).toBe('')
    })
  })
})