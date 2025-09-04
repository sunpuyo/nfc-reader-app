import { useState, useEffect, useCallback } from 'react'
import { NFCReaderState, NFCTagData } from '../types/nfc'
import { dataViewToHex } from '../utils/nfcParser'

export function useNFC() {
  const [state, setState] = useState<NFCReaderState>({
    isSupported: false,
    isReading: false,
    error: null,
    tagData: null,
    history: []
  })

  useEffect(() => {
    // Check if Web NFC API is available
    if ('NDEFReader' in window) {
      setState(prev => ({ ...prev, isSupported: true }))
    } else {
      setState(prev => ({ 
        ...prev, 
        isSupported: false,
        error: 'Web NFC API는 이 브라우저에서 지원되지 않습니다. Android Chrome을 사용해주세요.'
      }))
    }
  }, [])

  const startReading = useCallback(async () => {
    if (!state.isSupported) {
      setState(prev => ({ 
        ...prev, 
        error: 'NFC가 지원되지 않는 환경입니다.' 
      }))
      return
    }

    setState(prev => ({ 
      ...prev, 
      isReading: true, 
      error: null,
      tagData: null 
    }))

    try {
      const ndef = new (window as any).NDEFReader()
      await ndef.scan()

      ndef.addEventListener('reading', ({ message, serialNumber }: any) => {
        console.log('NFC Tag detected:', serialNumber)
        console.log('NDEF Message:', message)

        const tagData: NFCTagData = {
          serialNumber: serialNumber || 'Unknown',
          readTime: new Date(),
          recordTypes: []
        }

        if (message && message.records) {
          tagData.message = {
            records: message.records.map((record: any) => ({
              recordType: record.recordType,
              mediaType: record.mediaType,
              id: record.id,
              data: record.data,
              encoding: record.encoding,
              lang: record.lang
            }))
          }

          tagData.recordTypes = message.records.map((r: any) => r.recordType)
          
          // Convert first record to hex for raw data display
          if (message.records.length > 0 && message.records[0].data) {
            tagData.rawData = dataViewToHex(message.records[0].data)
          }
        }

        setState(prev => ({
          ...prev,
          tagData,
          history: [tagData, ...prev.history.slice(0, 9)], // Keep last 10 readings
          error: null
        }))
      })

      ndef.addEventListener('readingerror', () => {
        console.error('NFC 읽기 오류 발생')
        setState(prev => ({ 
          ...prev, 
          error: 'NFC 태그를 읽는 중 오류가 발생했습니다.' 
        }))
      })

    } catch (error: any) {
      console.error('NFC Error:', error)
      let errorMessage = 'NFC를 시작할 수 없습니다.'
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'NFC 권한이 거부되었습니다. 권한을 허용해주세요.'
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'This device does not support NFC.'
      } else if (error.name === 'SecurityError') {
        errorMessage = 'HTTPS 연결이 필요합니다.'
      }
      
      setState(prev => ({ 
        ...prev, 
        isReading: false,
        error: errorMessage 
      }))
    }
  }, [state.isSupported])

  const stopReading = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isReading: false 
    }))
  }, [])

  const clearHistory = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      history: [],
      tagData: null
    }))
  }, [])

  return {
    ...state,
    startReading,
    stopReading,
    clearHistory
  }
}