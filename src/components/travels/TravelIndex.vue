<template>
  <div class="travel-table-container">
    <div v-if="travels.length > 0" class="expenses-summary">
      Total Travel Expenses from <strong>{{ earliestDate }}</strong> to <strong>{{ latestDate }}</strong>:
      <strong>{{ formatCurrency(totalExpenses) }}</strong>
    </div>

    <div v-if="travels.length === 0" class="empty-table">
      <i class="fas fa-map fa-2x"></i>
      <p>No travels to display</p>
    </div>
    
    <table v-else class="travel-table">
      <thead>
        <tr>
          <th class="table-header" @click="sortList('title')">
            <span class="header-content">
              Title
              <i class="fas fa-sort sort-icon"></i>
            </span>
          </th>
          <th class="table-header" @click="sortList('description')">
            <span class="header-content">
              Description
              <i class="fas fa-sort sort-icon"></i>
            </span>
          </th>
          <th class="table-header" @click="sortList('departure_date')">
            <span class="header-content">
              Dates
              <i class="fas fa-sort sort-icon"></i>
            </span>
          </th>
          <th class="table-header" @click="sortList('expenses')">
            <span class="header-content">
              Expenses
              <i class="fas fa-sort sort-icon"></i>
            </span>
          </th>
          <th class="table-header actions-header">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="travel in displayedTravels" 
          :key="travel.id" 
          class="travel-row"
          :class="{
            'row-past': hasEventPassed(travel),
            'row-current': isEventCurrent(travel) && !hasEventPassed(travel)
          }"
        >
          <td class="travel-title">
            <router-link
              :to="{ name: 'TravelDetails', params: { id: `${travel.id}` } }"
              class="title-link"
            >
              {{ travel.title }}
            </router-link>
          </td>
          <td class="travel-description">
            <div class="description-cell">
              {{ truncateText(travel.description, 50) }}
            </div>
          </td>
          <td class="travel-date">
            <div>{{ formatFullYearDate(travel.departure_date) }}</div>
            <div>{{ formatFullYearDate(travel.return_date) }}</div>
          </td>
          <td class="travel-expenses">
            {{ formatCurrency(travel.expenses) || '—' }}
          </td>
          <td class="travel-actions">
            <div class="action-buttons">
              <BaseButton 
                variant="ghost" 
                size="sm" 
                icon="eye"
                @click="viewDetails(travel)"
                title="View Details"
              />
              <BaseButton 
                variant="ghost" 
                size="sm" 
                icon="edit"
                @click="$emit('edit', travel)"
                title="Edit Travel"
              />
              <BaseButton 
                variant="ghost" 
                size="sm" 
                icon="trash"
                @click="$emit('delete', travel)"
                title="Delete Travel"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="travels.length > 0" class="expenses-summary">
      Total Travel Expenses from <strong>{{ earliestDate }}</strong> to <strong>{{ latestDate }}</strong>:
      <strong>{{ formatCurrency(totalExpenses) }}</strong>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import DateFormatService from '@/services/DateFormatService.js'
import { formatCurrency } from '@/utils/formatCurrency.js'
import dayjs from 'dayjs'

// Props
const props = defineProps({
  travels: {
    type: Array,
    required: true,
    default: () => []
  }
})

// Emits
defineEmits(['edit', 'delete'])

// Composables
const router = useRouter()

// Reactive data
const sortField = ref('departure_date')
const sortDirection = ref('asc')

// Computed
const totalExpenses = computed(() =>
  props.travels.reduce((sum, travel) => sum + Number(travel.expenses || 0), 0)
)

const earliestDate = computed(() => {
  const dates = props.travels.map(t => t.departure_date).filter(Boolean).map(d => dayjs(d))
  return dates.length ? formatFullYearDate(dates.reduce((a, b) => (b.isBefore(a) ? b : a))) : '—'
})

const latestDate = computed(() => {
  const dates = props.travels.map(t => t.return_date || t.departure_date).filter(Boolean).map(d => dayjs(d))
  return dates.length ? formatFullYearDate(dates.reduce((a, b) => (b.isAfter(a) ? b : a))) : '—'
})
const displayedTravels = computed(() => {
  const sorted = [...props.travels].sort((a, b) => {
    const aVal = a[sortField.value] || ''
    const bVal = b[sortField.value] || ''
    
    if (sortField.value.includes('date')) {
      const aDate = dayjs(aVal)
      const bDate = dayjs(bVal)
      return sortDirection.value === 'asc' 
        ? aDate.isAfter(bDate) ? 1 : -1
        : aDate.isBefore(bDate) ? 1 : -1
    }
    
    const comparison = sortField.value === 'expenses'
      ? Number(aVal || 0) - Number(bVal || 0)
      : aVal.toString().localeCompare(bVal.toString())
    return sortDirection.value === 'asc' ? comparison : -comparison
  })
  
  return sorted
})

// Methods
const sortList = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const formatFullYearDate = (value) => {
  return DateFormatService.formatFullYearDatejs ? 
    DateFormatService.formatFullYearDatejs(value) : 
    dayjs(value).format('MMM DD, YYYY')
}

const truncateText = (text, maxLength) => {
  if (!text) return '—'
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const hasEventPassed = (travel) => {
  const today = dayjs()
  const returnDate = dayjs(travel.return_date)
  return returnDate.isBefore(today, 'day')
}

const isEventCurrent = (travel) => {
  const today = dayjs()
  const departureDate = dayjs(travel.departure_date)
  const returnDate = dayjs(travel.return_date)
  return (
    (departureDate.isSame(today, 'day') || departureDate.isBefore(today, 'day')) &&
    (returnDate.isSame(today, 'day') || returnDate.isAfter(today, 'day'))
  )
}

const viewDetails = (travel) => {
  router.push({ name: 'TravelDetails', params: { id: travel.id } })
}
</script>
<style scoped>
/* ✅ TABLE CONTAINER */
.travel-table-container {
  width: 100%;
}

/* ✅ EMPTY STATE */
.empty-table {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-text-secondary);
}

.empty-table i {
  margin-bottom: 1rem;
  opacity: 0.6;
}

.empty-table p {
  margin: 0;
}

/* ✅ TABLE */
.travel-table {
  width: 100%;
  border-collapse: collapse;
}

/* ✅ HEADER */
.table-header {
  /* Global .table-header (table-components.css) sets display:flex, which breaks <th> layout */
  display: table-cell;
  background: var(--color-primary);
  color: black;
  padding: 1rem 0.75rem;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
  border: none;
}

.table-header:hover {
  background: var(--color-primary-hover, var(--color-primary));
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  font-weight: 600;
}

.sort-icon {
  font-size: 0.75rem;
  opacity: 0.7;
}

.actions-header {
  text-align: center;
  cursor: default;
}

.actions-header:hover {
  background: var(--color-primary);
}

/* ✅ ROWS */
.travel-row {
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.2s;
}

.travel-row:hover {
  background: var(--color-surface-hover);
}

.travel-row td {
  padding: 1rem 0.75rem;
  vertical-align: top;
}

/* ✅ STATUS ROWS */
.row-past {
  background: rgba(107, 114, 128, 0.05);
}

.row-current {
  background: rgba(34, 197, 94, 0.05);
}

/* ✅ CELL CONTENT */
.travel-title {
  font-weight: 500;
}

.title-link {
  color: var(--color-primary);
  text-decoration: none;
  transition: opacity 0.2s;
}

.title-link:hover {
  opacity: 0.8;
}

.travel-description {
  max-width: 200px;
}

.description-cell {
  word-break: break-word;
  line-height: 1.4;
}

.travel-date {
  white-space: nowrap;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 0.875rem;
}

.travel-expenses {
  white-space: nowrap;
  text-align: left;
}

.expenses-summary {
  text-align: left;
  padding: 0.75rem 0.75rem;
}

/* ✅ ACTIONS */
.travel-actions {
  text-align: center;
}

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* ✅ RESPONSIVE */
@media (max-width: 1024px) {
  .travel-table {
    font-size: 0.875rem;
  }
  
  .travel-row td {
    padding: 0.75rem 0.5rem;
  }
  
  .travel-description {
    max-width: 150px;
  }
}

@media (max-width: 768px) {
  .travel-table {
    font-size: 0.8rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .sort-icon {
    display: none;
  }
  
  .travel-description {
    max-width: 120px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.25rem;
  }
}

/* ✅ DARK MODE */
@media (prefers-color-scheme: dark) {
  .table-header {
    background: var(--color-primary-dark, var(--color-primary));
  }
  
  .row-past {
    background: rgba(107, 114, 128, 0.1);
  }
  
  .row-current {
    background: rgba(34, 197, 94, 0.1);
  }
}
</style>

