
import { describe, it, expect } from 'vitest'
import { initialState } from '../app/initial'
import { reducer } from '../app/reducer'
import { PRIORITY_ROW_INDEX } from '../app/constants'

describe('Reducer basics', () => {
  it('PLACE puts an item into a slot and records history', () => {
    const s0 = initialState()
    const s1 = reducer(s0, { type:'PLACE', itemId: '1', rowIndex: 0, slotIndex: 0 })
    expect(s1.rows[0].slots[0]).toBe('1')
    expect(s1.history.length).toBe(1)
    expect(s1.history[0]).toMatchObject({ itemId: '1', rowIndex: 0, slotIndex: 0 })
  })

  it('UNLOAD_ONE removes priority first', () => {
    let s = initialState()
    s = reducer(s, { type:'PLACE', itemId:'1', rowIndex: PRIORITY_ROW_INDEX, slotIndex: 0 })
    s = reducer(s, { type:'PLACE', itemId:'2', rowIndex: 1, slotIndex: 0 })
    const s2 = reducer(s, { type:'UNLOAD_ONE' })
    expect(s2.rows[PRIORITY_ROW_INDEX].slots[0]).toBeNull()
    expect(s2.history.find(h => h.itemId === '1')).toBeUndefined()
  })

  it('UNLOAD_ONE then removes most recently placed (LIFO) among non-priority', () => {
    let s = initialState()
    s = reducer(s, { type:'PLACE', itemId:'2', rowIndex: 1, slotIndex: 0 })
    s = reducer(s, { type:'PLACE', itemId:'3', rowIndex: 1, slotIndex: 1 }) // later seq
    const s2 = reducer(s, { type:'UNLOAD_ONE' })
    expect(s2.rows[1].slots[1]).toBeNull()
    expect(s2.history.find(h => h.itemId === '3')).toBeUndefined()
  })

  it('CLEAR empties all slots and resets history', () => {
    let s = initialState()
    s = reducer(s, { type:'PLACE', itemId:'1', rowIndex: 0, slotIndex: 0 })
    s = reducer(s, { type:'PLACE', itemId:'2', rowIndex: 2, slotIndex: 1 })
    const s2 = reducer(s, { type:'CLEAR' })
    s2.rows.forEach(r => r.slots.forEach(c => expect(c).toBeNull()))
    expect(s2.history.length).toBe(0)
  })
})
