
export type RowType = 'priority' | 'standard'

export interface LuggageItem { id: string; label: string; color: string }
export interface PlacedRecord { itemId: string; rowIndex: number; slotIndex: number; seq: number }
export interface RowState { type: RowType; slots: (string | null)[] }

export interface AppState {
  itemsById: Record<string, LuggageItem>
  pool: string[]
  rows: RowState[]
  history: PlacedRecord[]
  unloaded: string[]
  beltSpeed: number
}
