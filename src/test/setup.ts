import '@testing-library/jest-dom'

// Mock Web NFC API for testing
;(globalThis as any).NDEFReader = class {
  scan() {
    return Promise.resolve()
  }
  
  addEventListener(_event: string, _handler: Function) {
    // Mock implementation
  }
  
  removeEventListener(_event: string, _handler: Function) {
    // Mock implementation
  }
}