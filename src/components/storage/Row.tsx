
import { useApp } from '../../app/AppProvider'
import { RowState } from '../../app/types'
import Slot from './Slot'
import Bag from './Bag'
import clsx from 'clsx'

export default function Row({ rowIndex, row }:{ rowIndex:number; row: RowState }) {
  const { state, dispatch } = useApp()

  return (
    <div className={clsx('row panel', row.type === 'priority' && 'priority')}>
      <div className="rowTitle">
        <span className="legend">
          <span className="dot" style={{ background: row.type === 'priority' ? '#ff7aa2' : '#7ab7ff' }} />
          {row.type === 'priority' ? 'Priority' : 'Standard'}
        </span>
      </div>
      <div className="slots">
        {row.slots.map((id, slotIndex) => (
          <Slot
          key={slotIndex}
          data-rc={`r${rowIndex}-c${slotIndex}`}
          rowIndex={rowIndex}
          slotIndex={slotIndex}
          onDrop={(itemId) => dispatch({ type:'PLACE', itemId, rowIndex, slotIndex })}
        >
          {id
            ? <Bag id={id} label={state.itemsById[id].label} color={state.itemsById[id].color} />
            : <span style={{ color: '#4b547a', fontSize: 12 }}>Drop here</span>}
        </Slot>
        
        ))}
      </div>
    </div>
  )
}
