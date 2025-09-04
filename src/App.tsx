import { NFCReader } from './components/NFCReader/NFCReader'
import { DataDisplay } from './components/DataDisplay/DataDisplay'
import { LogViewer } from './components/LogViewer/LogViewer'
import { useNFC } from './hooks/useNFC'

function App() {
  const { tagData, history, clearHistory } = useNFC()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            NFC Tag Reader
          </h1>
          <p className="text-gray-600">
            Android 스마트폰에서 NFC 태그를 읽어보세요
          </p>
        </header>

        <main>
          <div className="bg-white rounded-xl shadow-xl p-6">
            <NFCReader />
          </div>

          <DataDisplay 
            data={tagData} 
            history={history}
            onClearHistory={clearHistory}
          />
        </main>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Web NFC API를 사용합니다. Android Chrome 89+ 필요</p>
          <p className="mt-1">HTTPS 연결에서만 작동합니다</p>
        </footer>
      </div>
      <LogViewer />
    </div>
  )
}

export default App