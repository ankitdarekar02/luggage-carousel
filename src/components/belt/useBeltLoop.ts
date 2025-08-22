
import React from 'react'

export function useBeltLoop(pixelsPerSecond: number) {
  const tapeRef = React.useRef<HTMLDivElement | null>(null)
  const seqRef = React.useRef<HTMLDivElement | null>(null)
  const lastTsRef = React.useRef<number | null>(null)
  const offsetRef = React.useRef<number>(0)
  const widthRef = React.useRef<number>(0)
  const rafRef = React.useRef<number | null>(null)

  const start = React.useCallback(() => {
    if (!tapeRef.current || !seqRef.current) return
    widthRef.current = seqRef.current.getBoundingClientRect().width + 10
    offsetRef.current = -widthRef.current

    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts
      const dt = (ts - lastTsRef.current) / 1000
      lastTsRef.current = ts

      offsetRef.current += pixelsPerSecond * dt
      if (offsetRef.current >= 0) offsetRef.current = -widthRef.current

      if (tapeRef.current) tapeRef.current.style.transform = `translateX(${offsetRef.current}px)`
      rafRef.current = requestAnimationFrame(tick)
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)
  }, [pixelsPerSecond])

  React.useEffect(() => {
    start()
    const ro = new ResizeObserver(() => start())
    if (seqRef.current) ro.observe(seqRef.current)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); ro.disconnect() }
  }, [start])

  return { tapeRef, seqRef }
}
