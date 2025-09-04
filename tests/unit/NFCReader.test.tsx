import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NFCReader } from '../../src/components/NFCReader/NFCReader'

// Mock useNFC hook
vi.mock('../../src/hooks/useNFC', () => ({
  useNFC: vi.fn()
}))

import { useNFC } from '../../src/hooks/useNFC'

describe('NFCReader Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show not supported message when NFC is not supported', () => {
    vi.mocked(useNFC).mockReturnValue({
      isSupported: false,
      isReading: false,
      error: null,
      tagData: null,
      history: [],
      startReading: vi.fn(),
      stopReading: vi.fn(),
      clearHistory: vi.fn()
    })

    render(<NFCReader />)
    
    expect(screen.getByText(/Web NFC API는 Android Chrome에서만 지원됩니다/)).toBeInTheDocument()
    expect(screen.getByText(/iOS 기기에서는 사용할 수 없습니다/)).toBeInTheDocument()
  })

  it('should show start reading button when NFC is supported', () => {
    const mockStartReading = vi.fn()
    
    vi.mocked(useNFC).mockReturnValue({
      isSupported: true,
      isReading: false,
      error: null,
      tagData: null,
      history: [],
      startReading: mockStartReading,
      stopReading: vi.fn(),
      clearHistory: vi.fn()
    })

    render(<NFCReader />)
    
    const button = screen.getByText('NFC 태그 읽기')
    expect(button).toBeInTheDocument()
    
    fireEvent.click(button)
    expect(mockStartReading).toHaveBeenCalledTimes(1)
  })

  it('should show reading state when reading', () => {
    const mockStopReading = vi.fn()
    
    vi.mocked(useNFC).mockReturnValue({
      isSupported: true,
      isReading: true,
      error: null,
      tagData: null,
      history: [],
      startReading: vi.fn(),
      stopReading: mockStopReading,
      clearHistory: vi.fn()
    })

    render(<NFCReader />)
    
    expect(screen.getByText('NFC 태그를 대기 중...')).toBeInTheDocument()
    expect(screen.getByText('태그를 휴대폰 뒷면에 가까이 대주세요')).toBeInTheDocument()
    
    const cancelButton = screen.getByText('취소')
    fireEvent.click(cancelButton)
    expect(mockStopReading).toHaveBeenCalledTimes(1)
  })

  it('should show error message when there is an error', () => {
    vi.mocked(useNFC).mockReturnValue({
      isSupported: true,
      isReading: false,
      error: 'NFC 권한이 거부되었습니다.',
      tagData: null,
      history: [],
      startReading: vi.fn(),
      stopReading: vi.fn(),
      clearHistory: vi.fn()
    })

    render(<NFCReader />)
    
    expect(screen.getByText('NFC 권한이 거부되었습니다.')).toBeInTheDocument()
  })
})