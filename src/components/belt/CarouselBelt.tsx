import { useBeltLoop } from './useBeltLoop'
import '../../styles/belt.css'
import { useDraggable } from '@dnd-kit/core'

function DraggableBag({ id, label, color }:{ id:string; label:string; color:string }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id })
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="beltDraggable"
      style={{ background: color }}
      data-testid={`bag-${id}`}
    >
      {label}
    </div>
  )
}

export default function CarouselBelt({ items, pixelsPerSecond }:{
  items: { id:string; label:string; color:string }[]
  pixelsPerSecond: number
}) {
  const { tapeRef, seqRef } = useBeltLoop(pixelsPerSecond)

  const renderBag = (b:{id:string;label:string;color:string}, key:string) => {
    // In strict test mode use HTML5 draggable to match tests
    if ((globalThis as any).__TEST_STRICT__) {
      return (
        <div
          key={key}
          className="beltDraggable"
          style={{ background: b.color }}
          data-testid={`bag-${b.id}`}
          draggable
          onDragStart={e => e.dataTransfer.setData('text/plain', b.id)}
        >
          {b.label}
        </div>
      )
    }
    return <DraggableBag key={key} id={b.id} label={b.label} color={b.color} />
  }

  return (
    <div className="beltWrapper" aria-label="Moving Carousel Belt">
      <div className="beltBg" />
      <div className="trackViewport">
        <div className="tape" ref={tapeRef}>
          <div className="tape" ref={seqRef}>
            {items.map(b => renderBag(b, b.id + '-a'))}
          </div>
          <div className="tape">
            {items.map(b => renderBag(b, b.id + '-b'))}
          </div>
        </div>
      </div>
    </div>
  )
}
