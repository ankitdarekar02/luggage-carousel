
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import App from '../app/App'
import { createDataTransfer } from './dnd-polyfill'

describe('Basic UI', () => {
  it('renders and allows dragging Bag #1 into first priority slot', async () => {
    render(<App />)

    const bag = await screen.findByTestId('bag-1')
    const storagePanel = screen.getByTestId('storage-panel')
    const firstRow = storagePanel.querySelectorAll('.row')[0]
    const firstSlot = firstRow.querySelectorAll('.slot')[0]

    const dt = createDataTransfer()
    fireEvent.dragStart(bag, { dataTransfer: dt })
    fireEvent.dragOver(firstSlot, { dataTransfer: dt })
    fireEvent.drop(firstSlot, { dataTransfer: dt })

    expect(within(firstSlot).getByText(/Bag #1/)).toBeInTheDocument()
  })
})
