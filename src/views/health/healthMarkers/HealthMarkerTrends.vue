<template>
  <div class="marker-trends-wrapper">
    <div class="page-wrapper gradient-health">
      <div class="page-container">
        <div class="page-header">
          <h1>
            <router-link :to="{ name: 'HealthDashboard' }" class="breadcrumb-link">
              <i class="fas fa-pills"></i>
              Health Dashboard
            </router-link>
            <i class="fas fa-chevron-right breadcrumb-separator"></i>
            <router-link :to="{ name: 'HealthMarkers' }" class="breadcrumb-link">
              <i class="fas fa-heartbeat"></i>
              Health Markers
            </router-link>
            <i class="fas fa-chevron-right breadcrumb-separator"></i>
            <span>{{ markerInfo?.label || marker?.marker_name || 'Marker Trends' }}</span>
          </h1>
        </div>
      </div>
    </div>

    <main class="trend-content">
      <div v-if="isLoading" class="trend-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading marker history…</p>
      </div>

      <div v-else-if="errorMessage" class="trend-state trend-error">
        <i class="fas fa-exclamation-circle"></i>
        <h2>Unable to load marker trends</h2>
        <p>{{ errorMessage }}</p>
        <button class="btn btn-primary" type="button" @click="fetchTrendData">Try Again</button>
      </div>

      <section v-else class="trend-card">
        <header class="trend-header">
          <div>
            <p class="eyebrow">Marker trend</p>
            <h2>{{ markerInfo?.label || marker?.marker_name }}</h2>
              <div v-if="normalRangeText" class="summary-item normal-range-summary">
                <span class="summary-label">Normal Range</span>
                <strong>{{ normalRangeText }}</strong>
              </div>
            <p class="trend-description">
              {{ markerInfo?.category || 'Health marker' }}
              <span v-if="unit">· {{ unit }}</span>
              · {{ chartPoints.length }} numeric reading{{ chartPoints.length === 1 ? '' : 's' }}
            </p>
          </div>
          <router-link :to="{ name: 'HealthMarkerDetails', params: { id: markerId } }" class="btn btn-outlined">
            <i class="fas fa-arrow-left"></i>
            Marker Details
          </router-link>
        </header>

        <div v-if="chartPoints.length < 2" class="trend-state no-trend-data">
          <i class="fas fa-chart-line"></i>
          <h3>Not enough data for a trend line</h3>
          <p v-if="chartPoints.length === 1">There is one numeric reading. Add another reading for this marker to see its trend.</p>
          <p v-else>No numeric readings are available for this marker yet.</p>
        </div>

        <div v-else class="chart-wrap">
          <div class="latest-reading">
            <span>Latest result</span>
            <strong>{{ latestPoint.value }} <small>{{ unit }}</small></strong>
            <span>{{ latestPoint.formattedDate }}</span>
            <span :class="['trend-direction', `trend-${direction}`]">
              <i :class="directionIcon"></i>
              {{ directionLabel }}
            </span>
          </div>
          <div class="overall-trend" :class="`trend-${overallDirection}`">
            <span class="overall-trend-label">Overall trend · {{ firstPoint.formattedDate }} to {{ latestPoint.formattedDate }}</span>
            <strong>
              <i :class="overallDirectionIcon"></i>
              {{ overallDirectionLabel }}
            </strong>
            <span>{{ firstPoint.value }} → {{ latestPoint.value }} {{ unit }}</span>
          </div>

          <svg class="trend-chart" viewBox="0 0 800 360" role="img" :aria-label="`${markerInfo?.label || marker?.marker_name} results over time`">
            <g class="grid-lines">
              <line v-for="(line, index) in gridLines" :key="`grid-${index}`" x1="72" :y1="line.y" x2="780" :y2="line.y" />
            </g>
            <g class="axis-labels">
              <text v-for="(tick, index) in yTicks" :key="`y-${index}`" x="62" :y="tick.y + 4" text-anchor="end">{{ tick.value }}</text>
              <text v-for="(tick, index) in xTicks" :key="`x-${index}`" :x="tick.x" y="340" text-anchor="middle">{{ tick.label }}</text>
            </g>
            <polyline :points="linePoints" class="trend-line" />
            <g v-for="point in chartPoints" :key="point.id">
              <circle :cx="point.x" :cy="point.y" r="5" class="trend-point">
                <title>{{ point.formattedDate }}: {{ point.value }} {{ unit }}</title>
              </circle>
            </g>
          </svg>
          <p class="chart-note">Readings are ordered by test date. The line shows numeric results only.</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import EventService from '@/services/EventService'
import { useMarkerDefinitionStore } from '@/stores/health/MarkerDefinitionStore'
import { getLatestHealthMarkerTrends, normalizeHealthMarkerName } from '@/utils/healthMarkerTrend.js'

const route = useRoute()
const markerDefinitionStore = useMarkerDefinitionStore()
const marker = ref(null)
const allMarkers = ref([])
const isLoading = ref(true)
const errorMessage = ref('')
const markerId = computed(() => Number(route.params.id))
const markerInfo = computed(() => markerDefinitionStore.getDefinitionByName(marker.value?.marker_name))
const unit = computed(() => marker.value?.unit || markerInfo.value?.unit || '')
const normalRangeText = computed(() => {
  const low = marker.value?.normal_range_low ?? markerInfo.value?.normal_range_low
  const high = marker.value?.normal_range_high ?? markerInfo.value?.normal_range_high
  if (low === null || low === undefined || low === '') {
    return high === null || high === undefined || high === '' ? '' : `≤ ${high} ${unit.value}`.trim()
  }
  if (high === null || high === undefined || high === '') return `≥ ${low} ${unit.value}`.trim()
  return `${low} - ${high} ${unit.value}`.trim()
})

const chartPoints = computed(() => {
  const markerName = normalizeHealthMarkerName(marker.value?.marker_name)
  if (!markerName) return []

  const readings = allMarkers.value
    .filter(reading => normalizeHealthMarkerName(reading.marker_name) === markerName && reading.marker_date)
    .map(reading => ({ ...reading, numericValue: parseNumericResult(reading.marker_result) }))
    .filter(reading => reading.numericValue !== null)
    .sort((a, b) => {
      const dateDifference = new Date(a.marker_date).getTime() - new Date(b.marker_date).getTime()
      return dateDifference || Number(a.id) - Number(b.id)
    })

  if (marker.value && !readings.some(reading => reading.id === marker.value.id)) {
    const value = parseNumericResult(marker.value.marker_result)
    if (value !== null && marker.value.marker_date) {
      readings.push({ ...marker.value, numericValue: value })
      readings.sort((a, b) => {
        const dateDifference = new Date(a.marker_date).getTime() - new Date(b.marker_date).getTime()
        return dateDifference || Number(a.id) - Number(b.id)
      })
    }
  }

  if (readings.length === 0) return []
  const values = readings.map(reading => reading.numericValue)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || Math.max(Math.abs(max) * 0.1, 1)
  const low = min - range * 0.15
  const high = max + range * 0.15
  const xStart = 80
  const xEnd = 770
  const yTop = 24
  const yBottom = 320
  const firstDate = new Date(`${readings[0].marker_date}T00:00:00`).getTime()
  const lastDate = new Date(`${readings[readings.length - 1].marker_date}T00:00:00`).getTime()
  const dateRange = lastDate - firstDate

  return readings.map((reading, index) => {
    const date = new Date(`${reading.marker_date}T00:00:00`)
    const x = readings.length === 1 || dateRange === 0
      ? (xStart + xEnd) / 2
      : xStart + ((date.getTime() - firstDate) / dateRange) * (xEnd - xStart)
    const y = yBottom - ((reading.numericValue - low) / (high - low)) * (yBottom - yTop)
    return {
      ...reading,
      x,
      y,
      value: formatNumber(reading.numericValue),
      formattedDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      index,
    }
  })
})

const linePoints = computed(() => chartPoints.value.map(point => `${point.x},${point.y}`).join(' '))
const firstPoint = computed(() => chartPoints.value[0] || null)
const latestPoint = computed(() => chartPoints.value[chartPoints.value.length - 1] || null)
const latestTrend = computed(() => getLatestHealthMarkerTrends(allMarkers.value)
  .find(({ marker: reading }) => normalizeHealthMarkerName(reading.marker_name) === normalizeHealthMarkerName(marker.value?.marker_name))?.trend || 'stable'
)
const direction = computed(() => {
  if (chartPoints.value.length < 2) return 'stable'
  return latestTrend.value
})
const directionIcon = computed(() => ({ up: 'fas fa-arrow-trend-up', down: 'fas fa-arrow-trend-down', stable: 'fas fa-arrows-left-right' }[direction.value]))
const directionLabel = computed(() => ({ up: 'Trending up', down: 'Trending down', stable: 'Stable' }[direction.value]))
const overallDirection = computed(() => {
  if (!firstPoint.value || !latestPoint.value) return 'stable'
  if (latestPoint.value.numericValue > firstPoint.value.numericValue) return 'up'
  if (latestPoint.value.numericValue < firstPoint.value.numericValue) return 'down'
  return 'stable'
})
const overallDirectionIcon = computed(() => ({ up: 'fas fa-arrow-trend-up', down: 'fas fa-arrow-trend-down', stable: 'fas fa-arrows-left-right' }[overallDirection.value]))
const overallDirectionLabel = computed(() => ({ up: 'Increased', down: 'Decreased', stable: 'Unchanged' }[overallDirection.value]))

const yTicks = computed(() => {
  if (!chartPoints.value.length) return []
  const values = chartPoints.value.map(point => point.numericValue)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || Math.max(Math.abs(max) * 0.1, 1)
  const low = min - range * 0.15
  const high = max + range * 0.15
  return Array.from({ length: 5 }, (_, index) => {
    const ratio = index / 4
    return { value: formatNumber(high - ratio * (high - low)), y: 24 + ratio * 296 }
  })
})
const gridLines = computed(() => yTicks.value.map(tick => ({ y: tick.y })))
const xTicks = computed(() => {
  const points = chartPoints.value
  if (points.length <= 1) return points.map(point => ({ x: point.x, label: point.formattedDate }))
  const indices = [...new Set([0, Math.floor((points.length - 1) / 2), points.length - 1])]
  return indices.map(index => ({ x: points[index].x, label: points[index].formattedDate }))
})

function parseNumericResult(result) {
  const value = String(result ?? '').trim()
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value)) return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function formatNumber(value) {
  return Number(value.toPrecision(4)).toString()
}

async function fetchTrendData() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const [markerResponse, markersResponse] = await Promise.all([
      EventService.getHealthMarker(markerId.value),
      EventService.getHealthMarkers(),
    ])
    marker.value = markerResponse.data
    allMarkers.value = Array.isArray(markersResponse.data) ? markersResponse.data : []
  } catch (error) {
    console.error('Failed to load marker trend:', error)
    errorMessage.value = 'Please try again. If the problem continues, return to Health Markers.'
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await markerDefinitionStore.fetchDefinitions()
  await fetchTrendData()
})
</script>

<style scoped>
@import '@/assets/styles/health/health-shared.css';

.marker-trends-wrapper { min-height: 100vh; }
.page-wrapper { padding-bottom: 1.5rem; }
.breadcrumb-link { color: #fff; text-decoration: none; }
.breadcrumb-link:hover { text-decoration: underline; }
.breadcrumb-separator { margin: 0 0.75rem; opacity: 0.7; }
.trend-content { max-width: 1100px; margin: 2rem auto; padding: 0 1rem; }
.trend-card { background: #fff; border-radius: 14px; padding: 1.5rem; box-shadow: 0 4px 14px rgba(15, 23, 42, .08); }
.trend-header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
.trend-header h2 { margin: 0; color: #1f2937; }
.eyebrow { margin: 0 0 .25rem; color: #667eea; text-transform: uppercase; letter-spacing: .08em; font-weight: 700; font-size: .75rem; }
.trend-description { color: #6b7280; margin: .35rem 0 0; }
.chart-wrap { position: relative; }
.latest-reading { display: flex; align-items: baseline; flex-wrap: wrap; gap: .75rem; color: #64748b; }
.latest-reading strong { color: #1e293b; font-size: 1.5rem; }
.latest-reading small { font-size: .9rem; color: #64748b; }
.overall-trend { display: flex; align-items: center; flex-wrap: wrap; gap: .5rem .75rem; margin-top: .75rem; padding: .65rem .8rem; border-radius: 8px; font-size: .9rem; }
.overall-trend strong { display: inline-flex; align-items: center; gap: .35rem; }
.overall-trend-label { color: #475569; }
.trend-direction { display: inline-flex; gap: .35rem; align-items: center; padding: .3rem .6rem; border-radius: 999px; font-size: .85rem; font-weight: 700; }
.trend-up { color: #9a3412; background: #ffedd5; }
.trend-down { color: #166534; background: #dcfce7; }
.trend-stable { color: #475569; background: #f1f5f9; }
.trend-chart { display: block; width: 100%; max-height: 460px; margin-top: 1rem; overflow: visible; }
.grid-lines line { stroke: #e2e8f0; stroke-width: 1; }
.axis-labels text { fill: #64748b; font-size: 12px; }
.trend-line { fill: none; stroke: #667eea; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
.trend-point { fill: #667eea; stroke: #fff; stroke-width: 2; }
.chart-note { color: #64748b; font-size: .85rem; margin: .5rem 0 0; }
.trend-state { min-height: 220px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: .5rem; text-align: center; color: #64748b; background: #fff; border-radius: 14px; padding: 2rem; }
.trend-state > i { font-size: 2rem; color: #667eea; }
.trend-state h2, .trend-state h3, .trend-state p { margin: 0; }
.trend-error > i { color: #dc2626; }
@media (max-width: 640px) {
  .trend-card { padding: 1rem; }
  .trend-chart { min-height: 250px; }
  .axis-labels text { font-size: 10px; }
}
</style>
