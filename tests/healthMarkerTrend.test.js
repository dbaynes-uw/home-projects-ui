import test from 'node:test'
import assert from 'node:assert/strict'
import { getHealthMarkerTrend, getLatestHealthMarkerTrendForName, getLatestHealthMarkerTrends } from '../src/utils/healthMarkerTrend.js'

const history = [
  { id: 1, marker_name: 'Cholesterol', marker_result: '180', marker_date: '2025-01-01' },
  { id: 2, marker_name: 'Cholesterol', marker_result: '200', marker_date: '2025-06-01' },
]

test('compares against the most recent prior result for the same marker', () => {
  assert.equal(getHealthMarkerTrend({ id: 3, marker_name: 'Cholesterol', marker_result: '210', marker_date: '2025-11-01' }, history), 'up')
  assert.equal(getHealthMarkerTrend({ id: 3, marker_name: 'Cholesterol', marker_result: '190', marker_date: '2025-11-01' }, history), 'down')
  assert.equal(getHealthMarkerTrend({ id: 3, marker_name: 'Cholesterol', marker_result: '200', marker_date: '2025-11-01' }, history), 'stable')
})

test('normalizes names and ignores incomparable or same-day results', () => {
  assert.equal(getHealthMarkerTrend({ id: 3, marker_name: 'cholesterol', marker_result: '201', marker_date: '2025-11-01' }, history), 'up')
  assert.equal(getHealthMarkerTrend({ id: 1, marker_name: 'Cholesterol', marker_result: '180', marker_date: '2025-01-01' }, history), null)
  assert.equal(getHealthMarkerTrend({ id: 3, marker_name: 'Blood Pressure', marker_result: '120/80', marker_date: '2025-11-01' }, history), null)
  assert.equal(getHealthMarkerTrend({ id: 3, marker_name: 'Glucose', marker_result: '<0.1', marker_date: '2025-11-01' }, history), null)
})

test('compares ISO timestamps by each reading date', () => {
  const readings = [
    { id: 1, marker_name: 'TSH', marker_result: '2.1', marker_date: '2025-01-01T08:00:00.000Z' },
    { id: 2, marker_name: 'TSH', marker_result: '3.2', marker_date: '2025-06-01T08:00:00.000Z' },
  ]
  assert.equal(getHealthMarkerTrend(readings[1], readings), 'up')
})

test('uses an earlier record as the prior reading when dates match', () => {
  const readings = [
    { id: 20, marker_name: 'TSH', marker_result: '2.1', marker_date: '2025-01-01' },
    { id: 21, marker_name: 'TSH', marker_result: '3.2', marker_date: '2025-01-01' },
  ]
  assert.equal(getHealthMarkerTrend(readings[1], readings), 'up')
})

test('returns one direction per marker type from its latest two readings', () => {
  const readings = [
    { id: 1, marker_name: 'Cholesterol', marker_result: '180', marker_date: '2025-01-01' },
    { id: 2, marker_name: 'Cholesterol', marker_result: '210', marker_date: '2025-02-01' },
    { id: 3, marker_name: 'Cholesterol', marker_result: '190', marker_date: '2025-03-01' },
    { id: 4, marker_name: 'TSH', marker_result: '2', marker_date: '2025-01-01' },
    { id: 5, marker_name: 'TSH', marker_result: '3', marker_date: '2025-02-01' },
  ]

  const trends = getLatestHealthMarkerTrends(readings)
  assert.equal(trends.length, 2)
  assert.deepEqual(
    trends.map(({ marker, trend }) => [marker.marker_name, marker.id, trend]),
    [['Cholesterol', 3, 'down'], ['TSH', 5, 'up']]
  )
})

test('shows latest marker-type trend on older cards of that marker type', () => {
  const readings = [
    { id: 1, marker_name: 'Cholesterol', marker_result: '180', marker_date: '2025-01-01' },
    { id: 2, marker_name: 'Cholesterol', marker_result: '210', marker_date: '2025-02-01' },
    { id: 3, marker_name: 'Cholesterol', marker_result: '190', marker_date: '2025-03-01' },
  ]
  assert.equal(getLatestHealthMarkerTrendForName(' cholesterol ', readings), 'down')
})
