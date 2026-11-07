import test from 'node:test'
import assert from 'node:assert/strict'
import { applyPendingProductSelections, toggleProductSelection } from '../src/utils/productSelectionChanges.js'

test('tracks changed products and removes a change when toggled back', () => {
  const pending = new Map()
  const first = { id: 1, active: true }
  const second = { id: 2, active: false }

  toggleProductSelection(first, pending)
  toggleProductSelection(second, pending)
  assert.deepEqual([...pending.values()], [
    { id: 1, active: false, originalActive: true },
    { id: 2, active: true, originalActive: false },
  ])

  toggleProductSelection(first, pending)
  assert.equal(first.active, true)
  assert.deepEqual([...pending.keys()], [2])
})

test('preserves pending selections when product data is reloaded', () => {
  const pending = new Map()
  const product = { id: 1, active: true }
  toggleProductSelection(product, pending)
  const reloaded = { id: 1, active: true }
  const unchanged = { id: 2, active: false }

  applyPendingProductSelections([{ products: [reloaded, unchanged] }, {}], pending)
  assert.equal(reloaded.active, false)
  assert.equal(unchanged.active, false)
  toggleProductSelection(reloaded, pending)
  assert.equal(reloaded.active, true)
  assert.equal(pending.size, 0)
})
