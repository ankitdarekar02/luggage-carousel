
import { AppState, PlacedRecord } from './types'
import { PRIORITY_ROW_INDEX } from './constants'
import { initialState } from './initial'

export type Action =
  | { type:'PLACE'; itemId:string; rowIndex:number; slotIndex:number }
  | { type:'UNLOAD_ONE' }
  | { type:'CLEAR' }
  | { type:'RESET' }
  | { type:'SET_SPEED'; speed:number }
  | { type:'UNLOADED_ADD'; itemId:string }

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'PLACE': {
      const { itemId, rowIndex, slotIndex } = action
      const rows = state.rows.map(r => ({ ...r, slots: [...r.slots] }))
      if (rows[rowIndex].slots[slotIndex]) return state

      for (let r=0; r<rows.length; r++) {
        const idx = rows[r].slots.findIndex(s => s === itemId)
        if (idx !== -1) rows[r].slots[idx] = null
      }
      const pool = state.pool.filter(id => id !== itemId)
      rows[rowIndex].slots[slotIndex] = itemId

      const maxSeq = state.history.reduce((m,h)=>Math.max(m,h.seq),0)
      const history = state.history.filter(h => h.itemId !== itemId)
      history.push({ itemId, rowIndex, slotIndex, seq: maxSeq+1 })

      return { ...state, rows, pool, history }
    }
    case 'UNLOAD_ONE': {
      const pick = pickPriorityThenLifo(state.history)
      if (!pick) return state
      const rows = state.rows.map(r => ({ ...r, slots: [...r.slots] }))
      const { itemId, rowIndex, slotIndex } = pick
      if (rows[rowIndex].slots[slotIndex] === itemId) {
        rows[rowIndex].slots[slotIndex] = null
      } else {
        for (let r=0; r<rows.length; r++) {
          const idx = rows[r].slots.findIndex(s => s === itemId)
          if (idx !== -1) { rows[r].slots[idx] = null; break }
        }
      }
      const history = state.history.filter(h => h.itemId !== itemId)
      return { ...state, rows, history }
    }
    case 'CLEAR': {
      const rows = state.rows.map(r => ({ ...r, slots: r.slots.map(()=>null) }))
      return { ...state, rows, history: [] }
    }
    case 'RESET': return initialState()
    case 'SET_SPEED': return { ...state, beltSpeed: action.speed }
    case 'UNLOADED_ADD': return { ...state, unloaded: [action.itemId, ...state.unloaded] }
    default: return state
  }
}

function pickPriorityThenLifo(history: PlacedRecord[]) {
  if (history.length === 0) return null
  const pr = history.filter(h => h.rowIndex === PRIORITY_ROW_INDEX)
  const arr = pr.length ? pr : history
  return arr.reduce((a,b)=>a.seq>b.seq?a:b)
}
