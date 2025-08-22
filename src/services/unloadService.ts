
import { AppState } from '../app/types'
import { PRIORITY_ROW_INDEX } from '../app/constants'

export function pickNext(state: AppState) {
  const pr = state.history.filter(h => h.rowIndex === PRIORITY_ROW_INDEX)
  const arr = pr.length ? pr : state.history
  if (!arr.length) return null
  return arr.reduce((a,b)=>a.seq>b.seq?a:b)
}

export function egressDurationMs(beltSpeed: number) {
  const base = 900
  return Math.max(600, Math.round(base * (40 / Math.max(10, beltSpeed))))
}
