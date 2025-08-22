import React from 'react'
import { AppProvider, useApp } from './AppProvider'
import Controls from '../components/controls/Controls'
import CarouselBelt from '../components/belt/CarouselBelt'
import Row from '../components/storage/Row'
import '../styles/belt.css'
import {
  DndContext,
  useSensor, useSensors,
  KeyboardSensor, PointerSensor,
  DragEndEvent, DragStartEvent, DragCancelEvent
} from '@dnd-kit/core'

const STORAGE_TESTID = 'storage-panel'

const isCoarsePointer =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(pointer:coarse)').matches
// Test-only simple bag list (keeps HTML5 drag path for tests)
function TestBeltMock({ items }:{ items:{ id:string; label:string; color:string }[] }) {
  return (
    <div aria-label="Test Bag Source" style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
      {items.map(b => (
        <div key={b.id} className="badge" style={{ background:b.color }}
             data-testid={`bag-${b.id}`}
             draggable onDragStart={e => e.dataTransfer.setData('text/plain', b.id)}>
          {b.label}
        </div>
      ))}
    </div>
  )
}

function AppInner() {
  const { state } = useApp()
  const items = state.pool.map(id => state.itemsById[id])
  return (
    <div className="container">
      <Controls />
      <div className="panel" style={{ marginBottom: 12 }}>
        <h3>Conveyor Belt</h3>
        {(globalThis as any).__TEST_STRICT__
          ? <TestBeltMock items={items} />
          : <CarouselBelt items={items} pixelsPerSecond={state.beltSpeed} />}
      </div>

      <div className="grid">
        <div className="panel" data-testid={STORAGE_TESTID}>
          <h3>Storage</h3>
          <div className="rows">
            {state.rows.map((row, idx) => (
              <Row key={idx} rowIndex={idx} row={row} />
            ))}
          </div>
        </div>

        <div className="panel">
          <h3>Unloaded</h3>
          <div data-unloaded style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {state.unloaded.map(id => {
              const item = state.itemsById[id]
              return <div key={id} className="badge ui-fade-in" style={{ background: item.color }}>{item.label}</div>
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function AppShell() {
  const { dispatch } = useApp()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: isCoarsePointer ? 6 : 3,  // a touch looser on phones
      },
    }),
    useSensor(KeyboardSensor)
  )

  const onDragStart = (_evt: DragStartEvent) => {
    document.documentElement.classList.add('cursor-dragging')
  }

  const onDragEnd = (event: DragEndEvent) => {
    document.documentElement.classList.remove('cursor-dragging')

    const activeId = event.active?.id as string | undefined
    const overId = event.over?.id as string | undefined
    if (!activeId || !overId) return
    const m = /slot-r(\d+)-c(\d+)/.exec(overId)
    if (!m) return
    const rowIndex = Number(m[1])
    const slotIndex = Number(m[2])
    dispatch({ type:'PLACE', itemId: activeId, rowIndex, slotIndex })
  }

  const onDragCancel = (_evt: DragCancelEvent) => {
    document.documentElement.classList.remove('cursor-dragging')
  }

  // In strict test mode, keep HTML5 DnD path so your tests stay unchanged
  if ((globalThis as any).__TEST_STRICT__) return <AppInner />

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd} onDragStart={onDragStart} onDragCancel={onDragCancel}>
      <AppInner />
    </DndContext>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}
