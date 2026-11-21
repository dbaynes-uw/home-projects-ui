const normalizeName = (name) => String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

const numericResult = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  const text = String(value ?? '').trim()
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(text)) return null
  const number = Number(text)
  return Number.isFinite(number) ? number : null
}

const dateValue = (value) => {
  if (!value) return null
  const timestamp = new Date(value).getTime()
  return Number.isFinite(timestamp) ? timestamp : null
}

export function getHealthMarkerTrend(marker, allMarkers) {
  const markerName = normalizeName(marker?.marker_name)
  const currentDate = dateValue(marker?.marker_date)
  const currentValue = numericResult(marker?.marker_result)
  if (!markerName || currentDate === null || currentValue === null) return null

  const previous = (allMarkers || [])
    .map(candidate => ({ candidate, date: dateValue(candidate.marker_date) }))
    .filter(({ candidate, date }) =>
      String(candidate.id) !== String(marker.id) &&
      normalizeName(candidate.marker_name) === markerName &&
      date !== null && (
        date < currentDate ||
        (date === currentDate && Number(candidate.id) < Number(marker.id))
      ) &&
      numericResult(candidate.marker_result) !== null
    )
    .sort((a, b) => {
      if (a.date !== b.date) return b.date - a.date
      const createdAtDifference = dateValue(b.candidate.created_at) - dateValue(a.candidate.created_at)
      if (Number.isFinite(createdAtDifference) && createdAtDifference !== 0) return createdAtDifference
      return Number(b.candidate.id) - Number(a.candidate.id)
    })[0]?.candidate

  if (!previous) return null
  const previousValue = numericResult(previous.marker_result)
  if (currentValue > previousValue) return 'up'
  if (currentValue < previousValue) return 'down'
  return 'stable'
}

export function getLatestHealthMarkerTrends(allMarkers) {
  const grouped = new Map()

  ;(allMarkers || []).forEach((marker) => {
    const name = normalizeName(marker?.marker_name)
    if (!name || dateValue(marker?.marker_date) === null || numericResult(marker?.marker_result) === null) return
    if (!grouped.has(name)) grouped.set(name, [])
    grouped.get(name).push(marker)
  })

  return [...grouped.values()].map((readings) => {
    const ordered = [...readings].sort((a, b) => {
      const dateDifference = dateValue(b.marker_date) - dateValue(a.marker_date)
      if (dateDifference !== 0) return dateDifference
      const createdAtDifference = dateValue(b.created_at) - dateValue(a.created_at)
      if (Number.isFinite(createdAtDifference) && createdAtDifference !== 0) return createdAtDifference
      return Number(b.id) - Number(a.id)
    })
    const latest = ordered[0]
    return { marker: latest, trend: getHealthMarkerTrend(latest, readings) }
  }).filter(({ trend }) => trend !== null)
}

export function getLatestHealthMarkerTrendForName(markerName, allMarkers) {
  const normalizedName = normalizeName(markerName)
  if (!normalizedName) return null
  return getLatestHealthMarkerTrends(allMarkers)
    .find(({ marker }) => normalizeName(marker.marker_name) === normalizedName)?.trend || null
}
