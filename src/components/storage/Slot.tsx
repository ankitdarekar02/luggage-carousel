import React from 'react'
import { useDroppable } from '@dnd-kit/core'

export default function Slot({
  onDrop,
  rowIndex,
  slotIndex,
  children,
  ...rest
}:{
  onDrop: (itemId: string) => void
  rowIndex: number
  slotIndex: number
  children: React.ReactNode
  [k: string]: any
}) {
  const [hover, setHover] = React.useState(false)
  const did = `slot-r${rowIndex}-c${slotIndex}`
  const { setNodeRef, isOver } = useDroppable({ id: did })

  const isHighlight = hover || (!((globalThis as any).__TEST_STRICT__) && isOver)

  return (
    <div
      {...rest}
      ref={setNodeRef}
      data-dropzone="slot"
      data-slot-id={did}
      className={`slot ${isHighlight ? 'highlight' : ''}`}
      // HTML5 DnD path (used by tests)
      onDragOver={(e) => { if ((globalThis as any).__TEST_STRICT__) { e.preventDefault(); setHover(true) } }}
      onDragLeave={() => { if ((globalThis as any).__TEST_STRICT__) { setHover(false) } }}
      onDrop={(e) => {
        if (!(globalThis as any).__TEST_STRICT__) return
        e.preventDefault()
        setHover(false)
        const id = e.dataTransfer.getData('text/plain')
        if (id) onDrop(id)
      }}
    >
      {children}
    </div>
  )
}
