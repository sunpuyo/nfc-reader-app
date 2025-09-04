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
        
        // Log raw message structure for debugging
        if (message) {
          console.log('Message structure:', {
            hasRecords: !!message.records,
            recordCount: message.records?.length,
            records: message.records?.map((r: any, i: number) => ({
              index: i,
              recordType: r.recordType,
              mediaType: r.mediaType,
              hasData: !!r.data,
              dataSize: r.data?.byteLength,
              id: r.id,
              encoding: r.encoding,
              lang: r.lang
            }))
          })
        }

        const tagData: NFCTagData = {
          serialNumber: serialNumber || 'Unknown',
          readTime: new Date(),
          recordTypes: []
        }

        if (message && message.records) {
          tagData.message = {
            records: message.records.map((record: any) => {
              // Log each record in detail
              console.log('Processing record:', {
                type: record.recordType,
                mediaType: record.mediaType,
                dataBytes: record.data ? Array.from(new Uint8Array(record.data.buffer, record.data.byteOffset, Math.min(20, record.data.byteLength))) : null
              })
              
              return {
                recordType: record.recordType || 'unknown',
                mediaType: record.mediaType,
                id: record.id,
                data: record.data,
                encoding: record.encoding,
                lang: record.lang
              }
            })
          }

          tagData.recordTypes = message.records.map((r: any) => r.recordType || 'unknown')
          
          // Convert all records to hex for debugging
          const hexData: string[] = []
          message.records.forEach((record: any, index: number) => {
            if (record.data) {
              hexData.push(`Record ${index}: ${dataViewToHex(record.data)}`)
            }
          })
          if (hexData.length > 0) {
            tagData.rawData = hexData.join('\n')
          }
        } else {
          console.warn('No NDEF message or records found in tag')
          tagData.rawData = 'No NDEF data found'
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