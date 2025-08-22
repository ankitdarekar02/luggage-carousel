
import React from 'react'

export type FlyItem = {
  key: string
  label: string
  color: string
  from: { x:number; y:number }
  to: { x:number; y:number }
  delayMs?: number
  durationMs?: number
}

export default function FlyLayer({ items, onDone }:{ items: FlyItem[]; onDone: (key:string)=>void }) {
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none' }}>
      {items.map(it => <Ghost key={it.key} item={it} onDone={onDone} />)}
    </div>
  )
}

function Ghost({ item, onDone }:{ item: FlyItem; onDone:(k:string)=>void }) {
  const ref = React.useRef<HTMLDivElement|null>(null)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const { from, to, delayMs=0, durationMs=700 } = item
    el.style.transform = `translate(${from.x}px, ${from.y}px)`
    el.style.opacity = '1'
    el.style.transition = 'none'
    const kick = () => {
      el.style.transition = `transform ${durationMs}ms cubic-bezier(.22,.8,.28,.99), opacity ${Math.max(200, Math.round(durationMs*0.5))}ms ease-out ${Math.round(durationMs*0.4)}ms`
      el.style.transform = `translate(${to.x}px, ${to.y}px)`
      el.style.opacity = '0'
    }
    const t1 = setTimeout(kick, delayMs)
    const t2 = setTimeout(() => onDone(item.key), delayMs + durationMs + 40)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [item, onDone])
  return (
    <div ref={ref} style={{
      position:'absolute', left:0, top:0,
      padding:'6px 10px', borderRadius:10, border:'1px solid rgba(255,255,255,0.12)',
      background:item.color, fontWeight:700, whiteSpace:'nowrap'
    }}>{item.label}</div>
  )
}
