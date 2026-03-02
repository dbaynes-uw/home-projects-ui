<template>
  <div class="travel-event-index-wrapper">
    <ConfirmDialogue ref="confirmDialogue" />

    <div class="card">
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th class="sortable-th" @click="toggleSort('title')">
                Title
                <i :class="sortIcon('title')"></i>
              </th>
              <th>Description</th>
              <th>Event Info</th>
              <th class="sortable-th" @click="toggleSort('start_date')">
                Dates
                <i :class="sortIcon('start_date')"></i>
              </th>
              <th>Transport</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="event in sortedEvents"
              :key="event.id"
              @dblclick="viewDetails(event)"
              :class="['table-row-clickable', eventStatusClass(event)]"
            >
              <td class="title-cell">
                <div class="cell-content">
                  <i class="fas fa-map-marker-alt icon-travel"></i>
                  <span class="event-title">{{ event.title }}</span>
                </div>
              </td>
              <td class="description-cell">
                <div class="multiline-text">
                  <span v-for="(line, idx) in splitLines(event.description)" :key="idx">{{ line }}<br v-if="idx < splitLines(event.description).length - 1" /></span>
                  <span v-if="!event.description">—</span>
                </div>
              </td>
              <td class="info-cell">
                <a v-if="isUrl(event.travel_event_url)" :href="event.travel_event_url" target="_blank" class="event-link" @click.stop>
                  <i class="fas fa-external-link-alt"></i>
                  View Site
                </a>
                <span v-else>—</span>
              </td>
              <td class="dates-cell">
                <div v-if="event.start_date" class="date-line">
                  <i class="fas fa-play"></i>
                  {{ formatDate(event.start_date) }}
                </div>
                <div v-if="event.end_date" class="date-line">
                  <i class="fas fa-stop"></i>
                  {{ formatDate(event.end_date) }}
                </div>
              </td>
              <td class="transport-cell">
                <div>
                  <span v-if="event.transport">{{ event.transport }}</span>
                  <a v-if="isUrl(event.transport_url)" :href="event.transport_url" target="_blank" class="event-link" @click.stop>
                    <i class="fas fa-map"></i> Map
                  </a>
                  <span v-if="!event.transport && !isUrl(event.transport_url)">—</span>
                </div>
              </td>
              <td class="notes-cell">
                <div class="multiline-text">
                  <span v-for="(line, idx) in splitLines(event.notes)" :key="idx">{{ line }}<br v-if="idx < splitLines(event.notes).length - 1" /></span>
                  <span v-if="!event.notes">—</span>
                </div>
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button @click.stop="viewDetails(event)" class="btn btn-sm btn-info" title="View Details">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button @click.stop="handleEdit(event)" class="btn btn-sm btn-primary" title="Edit">
                    <i class="fas fa-pencil-alt"></i>
                  </button>
                  <button @click.stop="handleDelete(event)" class="btn btn-sm btn-danger" title="Delete">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="travel_events.length === 0">
              <td colspan="7" class="empty-cell">
                <div class="empty-state">
                  <i class="fas fa-calendar-times"></i>
                  <p>No travel events yet</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTravelStore } from '@/stores/travel/TravelStore'
import ConfirmDialogue from '@/components/ConfirmDialogue.vue'
import DateFormatService from '@/services/DateFormatService.js'
import dayjs from 'dayjs'

const props = defineProps({
  travel_events: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['deleted'])

const router = useRouter()
const travelStore = useTravelStore()
const confirmDialogue = ref(null)
const sortKey = ref(null)   // 'title' | 'start_date' | 'end_date'
const sortDir = ref('asc') // 'asc' | 'desc'

const sortedEvents = computed(() => {
  if (!sortKey.value) return props.travel_events
  return [...props.travel_events].sort((a, b) => {
    const aVal = a[sortKey.value] ?? ''
    const bVal = b[sortKey.value] ?? ''
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return sortDir.value === 'asc' ? cmp : -cmp
  })
})

function toggleSort(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}

function isUrl(value) {
  return value && value.startsWith('http')
}

function sortIcon(key) {
  if (sortKey.value !== key) return 'fas fa-sort sort-icon inactive'
  return sortDir.value === 'asc' ? 'fas fa-sort-up sort-icon' : 'fas fa-sort-down sort-icon'
}

function splitLines(text) {
  if (!text) return []
  return text.split('\n').filter(l => l.trim())
}

function formatDate(value) {
  return DateFormatService.formatStandardDateTimejs(value)
}

function eventStatusClass(event) {
  if (!event.end_date) return ''
  const today = dayjs().format('YYYY-MM-DD')
  return event.end_date < today ? 'event-passed-row' : ''
}

function viewDetails(event) {
  router.push({ name: 'TravelEventDetails', params: { id: event.id } })
}

function handleEdit(event) {
  router.push({ name: 'TravelEventEdit', params: { id: event.id } })
}

async function handleDelete(event) {
  if (!confirmDialogue.value) return
  const ok = await confirmDialogue.value.show({
    title: 'Delete Travel Event',
    message: `Are you sure you want to delete "${event.title}"? This cannot be undone.`,
    okButton: 'Delete',
    cancelButton: 'Cancel'
  })
  if (!ok) return
  try {
    await travelStore.deleteTravelEvent(event)
    emit('deleted', event)
  } catch (err) {
    console.error('Delete travel event error:', err)
    await confirmDialogue.value.show({
      title: 'Delete Failed',
      message: 'Failed to delete travel event. Please try again.',
      okButton: 'OK',
      cancelButton: null
    })
  }
}
</script>

<style scoped>
.travel-event-index-wrapper { width: 100%; }

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

.sortable-th {
  cursor: pointer;
  user-select: none;
}

.sortable-th:hover {
  background: #e9ecef;
  color: #3b82f6;
}

.sort-icon {
  margin-left: 0.35rem;
  font-size: 0.75rem;
  color: #3b82f6;
}

.sort-icon.inactive {
  color: #ced4da;
}

.table-container { overflow-x: auto; }

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.data-table thead tr {
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
}

.data-table th {
  padding: 0.875rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.data-table tbody tr {
  border-bottom: 1px solid #e9ecef;
  transition: background 0.15s ease;
}

.data-table tbody tr:last-child { border-bottom: none; }

.table-row-clickable { cursor: pointer; }
.table-row-clickable:hover { background: #f0f7ff; }
.event-passed-row { opacity: 0.6; }
.event-passed-row td { color: #6c757d; }

td { padding: 0.875rem 1rem; vertical-align: top; }

.cell-content { display: flex; align-items: center; gap: 0.5rem; }
.icon-travel { color: #667eea; font-size: 0.875rem; flex-shrink: 0; }
.event-title { font-weight: 600; color: #1f2937; }

.multiline-text {
  max-width: 200px;
  color: #4b5563;
  line-height: 1.5;
  font-size: 0.875rem;
}

.event-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
}
.event-link:hover { color: #1d4ed8; text-decoration: underline; }

.dates-cell { white-space: nowrap; font-size: 0.875rem; }
.date-line { display: flex; align-items: center; gap: 0.4rem; color: #4b5563; margin-bottom: 0.25rem; }
.date-line i { color: #9ca3af; font-size: 0.7rem; }

.transport-cell { font-size: 0.875rem; color: #4b5563; }

.actions-cell { white-space: nowrap; }
.action-buttons { display: flex; gap: 0.4rem; }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}
.btn-sm { padding: 0.4rem 0.6rem; font-size: 0.8rem; }
.btn-info { background: #0dcaf0; color: white; }
.btn-info:hover { background: #0aa2c0; }
.btn-primary { background: #3b82f6; color: white; }
.btn-primary:hover { background: #1d4ed8; }
.btn-danger { background: #ef4444; color: white; }
.btn-danger:hover { background: #dc2626; }

.empty-cell { text-align: center; padding: 3rem !important; }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; color: #9ca3af; }
.empty-state i { font-size: 2.5rem; }
.empty-state p { margin: 0; font-size: 1rem; }
</style>
