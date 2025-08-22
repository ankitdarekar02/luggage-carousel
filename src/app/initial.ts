
import { AppState, LuggageItem, RowState } from './types'
import { TOTAL_BAGS, COLORS, COLS_PER_ROW, DEFAULT_BELT_SPEED } from './constants'

function makeItems(): LuggageItem[] {
  return Array.from({ length: TOTAL_BAGS }).map((_, i) => ({
    id: String(i + 1),
    label: `Bag #${i + 1}`,
    color: COLORS[i % COLORS.length],
  }))
}

function rowsInitial(): RowState[] {
  return [
    { type: 'priority', slots: Array(COLS_PER_ROW).fill(null) },
    { type: 'standard', slots: Array(COLS_PER_ROW).fill(null) },
    { type: 'standard', slots: Array(COLS_PER_ROW).fill(null) },
  ]
}

export function initialState(): AppState {
  const items = makeItems()
  return {
    itemsById: Object.fromEntries(items.map(i => [i.id, i])),
    pool: items.map(i => i.id),
    rows: rowsInitial(),
    history: [],
    unloaded: [],
    beltSpeed: DEFAULT_BELT_SPEED,
  }
}
