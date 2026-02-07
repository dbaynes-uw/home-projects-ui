<template>
  <BaseCard class="travel-card" @dblclick="navigateToDetails">
    <template #header>
      <div class="travel-card-header">
        <h3 class="travel-title">
          <router-link
            :to="{ name: 'TravelDetails', params: { id: `${travel.id}` } }"
            class="title-link"
          >
            {{ travel.title }}
          </router-link>
        </h3>
        
        <!--div class="travel-actions">
          <BaseButton 
            variant="primary" 
            size="small" 
            icon="edit"
            @click="$emit('edit', travel)"
            >
              Edit
            </BaseButton>
          <BaseButton 
            variant="danger" 
            size="small" 
            icon="trash"
            @click="$emit('delete', travel)"
          >
            Delete
          </BaseButton> 
        </div-->
      </div>
    </template>

    <div class="travel-details">
      <div v-if="travel.description" class="detail-row">
        <span class="detail-label">Description:</span>
        <span class="detail-value">{{ travel.description }}</span>
      </div>
      
      <div v-if="travel.booking_reference" class="detail-row">
        <span class="detail-label">Booking Code:</span>
        <span class="detail-value">{{ travel.booking_reference }}</span>
      </div>
      
      <div class="detail-row">
        <span class="detail-label">Transportation:</span>
        <span class="detail-value">{{ travel.transport }}</span>
      </div>
      
      <div v-if="travel.transport_url" class="detail-row">
        <span class="detail-label">Transport Link:</span>
        <b><a :href="travel.transport_url" target="_blank" class="detail-link-blue">
          {{travel.transport}} Website
        </a></b>
      </div>
      
      <div class="detail-row">
        <span class="detail-label">Departure:</span>
        <span class="detail-value">{{ formatStandardDateTime(travel.departure_date) }}</span>
      </div>
      
      <div class="detail-row">
        <span class="detail-label">Return:</span>
        <span class="detail-value">{{ formatStandardDateTime(travel.return_date) }}</span>
      </div>
      
      <div v-if="travel.notes" class="detail-row notes-row">
        <span class="detail-label">Notes:</span>
        <div class="detail-value notes-content">
          {{ travel.notes }}
        </div>
      </div>
    </div>

    <!-- Travel Events -->
    <div v-if="travel.travel_events && travel.travel_events.length > 0" class="travel-events">
      <h2 style="margin-left: -1rem;">Travel Events:</h2>
      <div class="events-list">
        <router-link
          v-for="event in travel.travel_events"
          :key="event.id"
          :to="{ name: 'TravelEventDetails', params: { id: `${event.id}` } }"
          class="event-link"
        >
          • {{ event.title }}
        </router-link>
      </div>
    </div>

    <template #footer>
      <div class="travel-footer">
        <router-link
          :to="{ name: 'TravelEventCreate', params: { id: `${travel.id}` } }"
          class="add-event-link"
        >
          <i class="fas fa-plus"></i>
          Add Event
        </router-link>
        
        <div class="travel-status">
          <span 
            :class="[
              'status-badge',
              { 
                'status-past': hasEventPassed(travel),
                'status-current': isEventCurrent(travel) && !hasEventPassed(travel),
                'status-upcoming': !isEventCurrent(travel) && !hasEventPassed(travel)
              }
            ]"
          >
            {{ getTravelStatus(travel) }}
          </span>
        </div>
      </div>
    </template>
  </BaseCard>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import DateFormatService from '@/services/DateFormatService.js'
import SplitStringService from '@/services/SplitStringService.js'
import dayjs from 'dayjs'

// Composables
const router = useRouter()

// Props
const props = defineProps({
  travel: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

// Emits
defineEmits(['edit', 'delete'])

// Reactive data
const splitLength = ref(30)

// Methods
const navigateToDetails = () => {
  router.push({ name: 'TravelDetails', params: { id: props.travel.id } })
}

const splitList = (travelData, splitLength) => {
  return SplitStringService.splitList(travelData.notes, splitLength)
}

const formatStandardDateTime = (value) => {
  return DateFormatService.formatStandardDateTimejs(value)
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

const getTravelStatus = (travel) => {
  if (hasEventPassed(travel)) return 'Completed'
  if (isEventCurrent(travel)) return 'Current'
  return 'Upcoming'
}
</script>
<style scoped>
/* ✅ CARD LAYOUT */
.travel-card {
  font-size: 1.1rem;
  transition: all 0.2s;
}

.travel-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* ✅ HEADER */
.travel-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.travel-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.title-link {
  color: var(--color-primary);
  text-decoration: none;
  transition: opacity 0.2s;
}

.title-link:hover {
  opacity: 0.8;
}

.travel-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

/* ✅ DETAILS */
.travel-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1rem 0;
}

.detail-row {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.detail-label {
  font-weight: 900;
  color: var(--color-text-secondary);
  min-width: 100px;
  flex-shrink: 0;
}

.detail-value {
  color: var(--color-text-primary);
  flex: 1;
}

.detail-link {
  color: var(--color-primary);
  text-decoration: none;
}

.detail-link:hover {
  text-decoration: underline;
}
.detail-link-blue {
  margin-left: 0rem;
  text-underline-position: below;
  color: blue;
  text-decoration: none;
}
.notes-row {
  align-items: flex-start;
}

.notes-content {
  white-space: pre-line;
  line-height: 1.5;
}

/* ✅ EVENTS */
.travel-events {
  margin: 1rem 0;
  padding: 1rem;
  background: var(--color-surface-variant);
  border-radius: 6px;
}

.events-title {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.event-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: 1.1rem;
  transition: opacity 0.2s;
}

.event-link:hover {
  opacity: 0.8;
}

/* ✅ FOOTER */
.travel-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.add-event-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-primary);
  text-decoration: none;
  font-size: 0.875rem;
  transition: opacity 0.2s;
}

.add-event-link:hover {
  opacity: 0.8;
}

.travel-status {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-upcoming {
  background: rgba(59, 130, 246, 0.1);
  color: rgb(59, 130, 246);
}

.status-current {
  background: rgba(34, 197, 94, 0.1);
  color: rgb(34, 197, 94);
}

.status-past {
  background: rgba(107, 114, 128, 0.1);
  color: rgb(107, 114, 128);
}

/* ✅ RESPONSIVE */
@media (max-width: 480px) {
  .travel-card-header {
    flex-direction: column;
    align-items: stretch;
  }

  .travel-actions {
    align-self: flex-end;
  }

  .detail-row {
    flex-direction: column;
    gap: 0.25rem;
  }

  .detail-label {
    min-width: auto;
  }

  .travel-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
}
</style>
