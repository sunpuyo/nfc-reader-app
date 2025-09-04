import { useState, useEffect } from 'react'

interface LogEntry {
  timestamp: Date
  type: 'log' | 'error' | 'warn'
  message: string
  data?: any
}

export function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn
    }

    const captureLog = (type: 'log' | 'error' | 'warn') => (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ')
      
      setLogs(prev => [...prev, {
        timestamp: new Date(),
        type,
        message,
        data: args.length === 1 && typeof args[0] === 'object' ? args[0] : undefined
      }].slice(-50))
      
      originalConsole[type](...args)
    }

    console.log = captureLog('log')
    console.error = captureLog('error')
    console.warn = captureLog('warn')

    return () => {
      console.log = originalConsole.log
      console.error = originalConsole.error
      console.warn = originalConsole.warn
    }
  }, [])

  const clearLogs = () => setLogs([])

  const getLogColor = (type: LogEntry['type']) => {
    switch(type) {
      case 'error': return 'text-red-600'
      case 'warn': return 'text-yellow-600'
      default: return 'text-gray-700'
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50"
      >
        콘솔 로그 {logs.length > 0 && `(${logs.length})`}
      </button>

      {isOpen && (
        <div className="fixed bottom-16 right-4 w-96 max-w-[90vw] bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <div className="flex justify-between items-center p-3 border-b">
            <h3 className="font-semibold">Console Logs</h3>
            <div className="flex gap-2">
              <button
                onClick={clearLogs}
                className="text-sm px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto p-3 space-y-2 font-mono text-xs">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className={`border-l-2 pl-2 ${getLogColor(log.type)}`}>
                  <div className="text-gray-500">
                    [{log.timestamp.toLocaleTimeString()}]
                  </div>
                  <pre className="whitespace-pre-wrap break-all">{log.message}</pre>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  )
}