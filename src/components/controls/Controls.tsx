
import React from 'react'
import { useApp } from '../../app/AppProvider'
import FlyLayer, { FlyItem } from '../belt/FlyLayer'
import { pickNext, egressDurationMs } from '../../services/unloadService'

export default function Controls() {
  const { state, dispatch } = useApp()
  const [fly, setFly] = React.useState<FlyItem[]>([])
  const addFly = (it: FlyItem) => setFly(s => [...s, it])
  const removeFly = (k: string) => setFly(s => s.filter(x => x.key !== k))

  const getSlotCenter = (rowIndex: number, slotIndex: number) => {
    const el = document.querySelector(`[data-rc="r${rowIndex}-c${slotIndex}"]`) as HTMLElement | null
    if (!el) return { x: 0, y: 0 }
    const r = el.getBoundingClientRect()
    return { x: r.left + r.width/2, y: r.top + r.height/2 }
  }

  const getUnloaded = () => document.querySelector('[data-unloaded]') as HTMLElement | null
  const createPlaceholder = () => {
    const u = getUnloaded()
    if (!u) return { el: null as HTMLElement | null, center: { x: 0, y: 0 } }
    const ph = document.createElement('div')
    ph.className = 'badge ui-fade-in'
    ph.textContent = ' '
    u.appendChild(ph)
    const r = ph.getBoundingClientRect()
    return { el: ph, center: { x: r.left + r.width/2, y: r.top + r.height/2 } }
  }

  const unload = () => {
    const pick = pickNext(state)
    if (!pick) return
    const item = state.itemsById[pick.itemId]
    const from = getSlotCenter(pick.rowIndex, pick.slotIndex)
    const { el: ph, center: to } = createPlaceholder()
    const key = `${pick.itemId}-${Date.now()}`
    const ms = egressDurationMs(state.beltSpeed)

    // Synchronous appearance in Unloaded
    dispatch({ type: 'UNLOADED_ADD', itemId: pick.itemId })
    // Start ghost flight (fade-out)
    addFly({ key, label: item.label, color: item.color, from, to, durationMs: ms })

    // Remove from storage only after animation finishes
    setTimeout(() => {
      dispatch({ type:'UNLOAD_ONE' })
      if (ph && ph.parentElement) ph.parentElement.removeChild(ph)
      removeFly(key)
    }, ms + 40)
  }

  const clear = () => {
    const list = state.history.slice().sort((a,b)=>a.seq - b.seq)
    if (!list.length) return
    const ms = Math.max(600, egressDurationMs(state.beltSpeed))
    const u = getUnloaded()

    // Create placeholders and measure targets
    const targets: { x:number; y:number }[] = []
    const placeholders: HTMLElement[] = []
    if (u) {
      list.forEach(() => {
        const ph = document.createElement('div')
        ph.className = 'badge ui-fade-in'
        ph.textContent = ' '
        u.appendChild(ph)
        placeholders.push(ph)
      })
      placeholders.forEach(ph => {
        const r = ph.getBoundingClientRect()
        targets.push({ x: r.left + r.width/2, y: r.top + r.height/2 })
      })
    }

    // Persist immediately for synchronous appearance
    list.forEach((rec) => dispatch({ type:'UNLOADED_ADD', itemId: rec.itemId }))

    // Launch ghosts
    list.forEach((rec, i) => {
      const item = state.itemsById[rec.itemId]
      const from = getSlotCenter(rec.rowIndex, rec.slotIndex)
      const to = targets[i] || (u ? (() => { const r = u.getBoundingClientRect(); return { x: r.left + 24, y: r.top + 24 } })() : { x:0, y:0 })
      const key = `${rec.itemId}-${Date.now()}-${i}`
      addFly({ key, label: item.label, color: item.color, from, to, durationMs: ms })
      setTimeout(() => removeFly(key), ms + 40)
    })

    // Clearing storage immediately so ghosts appear to fade out from prior positions
    dispatch({ type:'CLEAR' })

    // Cleanup placeholders after all ghosts land
    setTimeout(() => { placeholders.forEach(ph => ph.parentElement && ph.parentElement.removeChild(ph)) }, ms + 100)
  }

  return (
    <>
      <div className="header">
        <h2 style={{ margin: 0 }}>Luggage Carousel</h2>
        <div className="btns">
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#b7c0e3' }}>
            Speed
            <input aria-label="Speed" type="range" min={10} max={120} step={5}
              value={state.beltSpeed}
              onChange={(e) => dispatch({ type:'SET_SPEED', speed: Number(e.target.value) })} />
            <span>{state.beltSpeed}px/s</span>
          </label>
          <button onClick={unload}>Unload</button>
          <button onClick={clear}>Clear</button>
          <button onClick={() => dispatch({ type:'RESET' })}>Reset</button>
        </div>
      </div>
      <FlyLayer items={fly} onDone={removeFly} />
    </>
  )
}
