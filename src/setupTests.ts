/// <reference types="vitest/globals" />
import '@testing-library/jest-dom'

if (!(globalThis as any).__BASIC_SETUP__) {
  (globalThis as any).__BASIC_SETUP__ = true
  ;(globalThis as any).__TEST_STRICT__ = true

  // Mock animation layers to avoid timers
  vi.mock('./components/belt/FlyLayer', () => ({ __esModule: true, default: () => null }))
  vi.mock('./components/belt/EffectLayer', () => ({ __esModule: true, default: () => null }))

  class ResizeObserverMock {
    cb: ResizeObserverCallback
    constructor(cb: ResizeObserverCallback) { this.cb = cb }
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  ;(globalThis as any).ResizeObserver = ResizeObserverMock as any
}
