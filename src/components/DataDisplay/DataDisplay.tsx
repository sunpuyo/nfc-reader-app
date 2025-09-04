import React from 'react'
import { NFCTagData } from '../../types/nfc'
import { parseNDEFRecord, formatSerialNumber, formatReadTime, dataViewToHex } from '../../utils/nfcParser'

interface DataDisplayProps {
  data: NFCTagData | null
  history: NFCTagData[]
  onClearHistory: () => void
}

export const DataDisplay: React.FC<DataDisplayProps> = ({ data, history, onClearHistory }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Could add a toast notification here
        console.log('Copied to clipboard')
      })
      .catch(err => {
        console.error('Failed to copy:', err)
      })
  }

  if (!data && history.length === 0) {
    return null
  }

  return (
    <div className="space-y-6 mt-8">
      {data && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">최근 읽은 태그</h2>
            <span className="text-sm text-gray-500">{formatReadTime(data.readTime)}</span>
          </div>

          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">시리얼 번호</label>
              <div className="flex items-center justify-between">
                <code className="text-lg font-mono text-gray-900">
                  {formatSerialNumber(data.serialNumber)}
                </code>
                <button
                  onClick={() => copyToClipboard(data.serialNumber)}
                  className="ml-2 p-1 text-gray-500 hover:text-gray-700"
                  title="복사"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {data.message && data.message.records.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">NDEF 레코드</h3>
                {data.message.records.map((record, index) => {
                  const { type, content } = parseNDEFRecord(record)
                  return (
                    <div key={index} className="bg-gray-50 rounded-md p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {type}
                        </span>
                      </div>
                      {content && (
                        <div className="mt-2">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap break-all font-mono">
                            {content}
                          </pre>
                        </div>
                      )}
                      {record.data && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                            원시 데이터 (Hex)
                          </summary>
                          <pre className="mt-2 text-xs text-gray-600 font-mono bg-gray-100 p-2 rounded overflow-x-auto">
                            {dataViewToHex(record.data)}
                          </pre>
                        </details>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {data.rawData && !data.message && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">원시 데이터</h3>
                <pre className="text-xs text-gray-600 font-mono bg-gray-100 p-3 rounded overflow-x-auto">
                  {data.rawData}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">읽기 기록</h2>
            <button
              onClick={onClearHistory}
              className="text-sm text-red-600 hover:text-red-700"
            >
              기록 삭제
            </button>
          </div>
          <div className="space-y-2">
            {history.map((item, index) => (
              <div
                key={`${item.serialNumber}-${item.readTime.getTime()}`}
                className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500">#{history.length - index}</span>
                  <code className="text-sm font-mono text-gray-900">
                    {formatSerialNumber(item.serialNumber)}
                  </code>
                  {item.recordTypes && item.recordTypes.length > 0 && (
                    <span className="text-xs text-gray-500">
                      ({item.recordTypes.join(', ')})
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {formatReadTime(item.readTime)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}