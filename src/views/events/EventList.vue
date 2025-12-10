<template>
  <div class="event-list-container">
    <!-- ✅ HEADER CARD -->
    <div class="card mt-5">
      <div class="card-header">
        <h2 class="card-title">
          <i class="fas fa-calendar-alt"></i>
          Events Dashboard
        </h2>
        <p class="subtitle">Created by: {{ user?.email }}</p>
      </div>
      
      <!-- ✅ NAVIGATION -->
      <div class="card-body">
        <div class="navigation-flex">
          <router-link
            :to="{ name: 'EventStatistics' }"
            class="btn btn-outlined"
          >
            <i class="fas fa-chart-bar"></i>
            Statistics
          </router-link>

          <router-link
            :to="{ name: 'EventCreate' }"
            class="btn btn-primary"
          >
            <i class="fas fa-plus"></i>
            New Event
          </router-link>
        </div>
      </div>
    </div>

    <!-- ✅ FILTERS CARD -->
    <div class="card mt-4">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-filter"></i>
          Filters & Search
        </h3>
      </div>

      <div class="card-body">
        <!-- ✅ FILTER COMPONENTS ROW -->
        <div class="filters-grid mb-4">
          <div class="filter-with-counter">
            <EventsPastDue />
            <div class="counter-badge counter-badge-red pulse-animation">
              {{ pastDueCount }}
            </div>
          </div>

          <div class="filter-with-counter">
            <EventsStatus 
              :show-active-events="showActiveEvents"
              @toggle-status="handleStatusToggle"
            />
            <div :class="getStatusBadgeClass()">
              {{ displayEvents.length }}
            </div>
          </div>

          <!-- ✅ DUE BY FILTER -->
          <EventsDueBy 
            :selectedDueByValue="selectedDueByValue"
            @events-due-by="handleDueByFilter"
            @clear-due-by="handleClearDueBy"
          />
          
          <!-- ✅ LOCATIONS FILTER -->
          <EventsLocations 
            :selectedLocationValue="selectedLocationValue"
            @events-location="handleLocationFilter"
            @clear-location="handleClearLocation"
          />
        </div>
        
        <!-- ✅ SEARCH INPUT (NO VUETIFY) -->
        <div class="search-section">
          <div class="form-group">
            <div class="search-input-wrapper">
              <i class="fas fa-search search-icon"></i>
              <input
                v-model="inputSearchText"
                @input="searchColumns"
                @focus="searchFocused = true"
                @blur="searchFocused = false"
                type="text"
                class="form-input search-input"
                placeholder="Search events by description or assignee..."
              />
              <button
                v-if="inputSearchText"
                @click="showIndex"
                class="clear-search-btn"
                type="button"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            <small v-if="searchFocused && inputSearchText" class="search-hint">
              {{ filteredResults.length }} results found
            </small>
          </div>
        </div>
        
        <!-- ✅ VIEW TOGGLE (NO VUETIFY) -->
        <div class="view-toggle-section">
          <div class="btn-group">
            <button
              @click="viewMode = 'cards'"
              class="btn"
              :class="{ 'btn-primary': viewMode === 'cards', 'btn-outlined': viewMode !== 'cards' }"
            >
              <i class="fas fa-th"></i>
              Cards View
            </button>

            <button
              @click="viewMode = 'table'"
              class="btn"
              :class="{ 'btn-primary': viewMode === 'table', 'btn-outlined': viewMode !== 'table' }"
            >
              <i class="fas fa-table"></i>
              Table View
            </button>

            <button
              v-if="isAdmin"
              @click="notifyEventsDue"
              class="btn btn-success"
            >
              <i class="fas fa-envelope"></i>
              Notify Due
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ LOADING STATE -->
    <div v-if="isLoading" class="card mt-4">
      <div class="card-body text-center">
        <div class="spinner"></div>
        <p class="mt-3">Loading events...</p>
      </div>
    </div>

    <!-- ✅ RESULTS SECTION -->
    <div v-else class="card mt-4">
      <div class="card-header">
        <div>
          <h3 class="card-title">
            <i class="fas fa-list"></i>
            {{ getResultsTitle() }}
          </h3>
          <p class="subtitle">
            {{ getResultsCount() }} event{{ displayEvents.length !== 1 ? 's' : '' }} found
          </p>
          <p class="hint-text">
            <i class="fas fa-info-circle"></i>
            Double click a card to view details or edit
          </p>
        </div>

        <!-- ✅ LEGEND -->
        <div class="legend-chips">
          <span class="chip chip-success chip-small">
            <i class="fas fa-check-circle"></i>
            Complete
          </span>
          <span class="chip chip-warning chip-small">
            <i class="fas fa-clock"></i>
            Incomplete
          </span>
          <span class="chip chip-danger chip-small">
            <i class="fas fa-exclamation-triangle"></i>
            Past Due
          </span>
        </div>
      </div>

      <div class="card-body">
        <!-- ✅ CARDS VIEW -->
        <div v-if="viewMode === 'cards'" class="events-grid">
          <div
            v-for="event in displayEvents"
            :key="event.id"
            @dblclick="showEvent(event)"
            :class="['event-card', getEventCardClass(event)]"
          >
            <!-- ✅ CARD HEADER -->
            <div class="event-card-header">
              <i :class="[getEventStatusIcon(event), 'event-status-icon']"></i>
              <h4 class="event-title">{{ event.description }}</h4>
            </div>
            
            <!-- ✅ CARD BODY -->
            <div class="event-card-body">
              <div class="event-detail-row">
                <i class="fas fa-user"></i>
                <span>{{ event.assigned }}</span>
              </div>

              <div class="event-detail-row">
                <i class="fas fa-sync-alt"></i>
                <span>Every {{ event.frequency }} days</span>
              </div>

              <div class="event-detail-row">
                <i class="fas fa-calendar-alt"></i>
                <span>Last: {{ formatStandardDate(event.action_completed_date) }}</span>
              </div>

              <div class="event-detail-row">
                <i class="fas fa-calendar-check"></i>
                <span>Due: {{ formatStandardDate(event.action_due_date) }}</span>
                <span 
                  v-if="isEventPastDue(event)"
                  class="chip chip-danger chip-tiny ml-2"
                >
                  <i class="fas fa-exclamation-triangle"></i>
                  PAST DUE
                </span>
              </div>

              <div class="event-detail-row">
                <i class="fas fa-map-marker-alt"></i>
                <span>{{ event.location || 'No location' }}</span>
              </div>

              <div class="event-detail-row">
                <i class="fas fa-info-circle"></i>
                <span>{{ event.status.charAt(0).toUpperCase() + event.status.slice(1) }}</span>
              </div>
            </div>
            
            <!-- ✅ CARD FOOTER -->
            <div class="event-card-footer">
              <button
                @click.stop="editEvent(event)"
                class="btn btn-small btn-text"
              >
                <i class="fas fa-edit"></i>
                Edit
              </button>
            </div>
          </div>
        </div>

        <!-- ✅ TABLE VIEW -->
        <div v-else>
          <EventIndex :events="displayEvents" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import dayjs from 'dayjs';
import axios from 'axios';

// Components
import EventIndex from "@/components/events/EventIndex.vue";
import EventsDueBy from "@/components/events/EventsDueBy.vue";
import EventsLocations from "@/components/events/EventsLocations.vue";
import EventsPastDue from "@/components/events/EventsPastDue.vue";
import EventsStatus from "@/components/events/EventsStatus.vue";
import DateFormatService from "@/services/DateFormatService.js";

const router = useRouter();
const store = useStore();

// ✅ REACTIVE STATE
const showActiveEvents = ref(true);
const isLoading = ref(true);
const inputSearchText = ref('');
const viewMode = ref('cards');
const apiUrl = ref('');
const selectedLocationValue = ref(''); 
const selectedDueByValue = ref('');    
const filteredResults = ref([]);
const searchFocused = ref(false);

// ✅ COMPUTED PROPERTIES
const user = computed(() => store.state.user?.resource_owner);
const events = computed(() => store.state.events || []);

const isAdmin = computed(() => 
  user.value?.email?.toLowerCase().includes('baynes') || 
  user.value?.email === 'dlbaynes@gmail.com'
);

const pastDueCount = computed(() => {
  return events.value.filter(event => isEventPastDue(event)).length;
});

const displayEvents = computed(() => {
  let filtered = events.value;
  
  // Status filter
  if (showActiveEvents.value) {
    filtered = filtered.filter(event => event.status.toLowerCase() === 'active');
  } else {
    filtered = filtered.filter(event => event.status.toLowerCase() === 'inactive');
  }
  
  // Due by filter
  if (selectedDueByValue.value && selectedDueByValue.value !== '' && selectedDueByValue.value !== null) {
    if (selectedDueByValue.value === 'all') {
      filtered = filtered.filter(event => 
        event.action_due_date && event.action_due_date !== ''
      );
    } else {
      const daysAhead = parseInt(selectedDueByValue.value);
      const targetDate = dayjs().add(daysAhead, 'day').format('YYYY-MM-DD');
      filtered = filtered.filter(event => 
        event.action_due_date && event.action_due_date <= targetDate
      );
    }
  }
  
  // Location filter
  if (selectedLocationValue.value && selectedLocationValue.value !== '' && selectedLocationValue.value !== 'all') {
    filtered = filtered.filter(event => event.location === selectedLocationValue.value);
  }
  
  return filtered;
});

// ✅ METHODS
function handleDueByFilter(daysValue) {
  selectedDueByValue.value = daysValue;
}

function handleClearDueBy() {
  selectedDueByValue.value = '';
}

function handleLocationFilter(locationValue) {
  selectedLocationValue.value = locationValue;
}

function handleClearLocation() {
  selectedLocationValue.value = '';
}

function handleStatusToggle(newActiveState) {
  showActiveEvents.value = newActiveState;
  filteredResults.value = [];
  inputSearchText.value = '';
  selectedLocationValue.value = '';
  selectedDueByValue.value = '';
}

function getStatusBadgeClass() {
  return showActiveEvents.value ? 'counter-badge counter-badge-green' : 'counter-badge counter-badge-purple';
}

function getResultsTitle() {
  const statusText = showActiveEvents.value ? 'Active' : 'Inactive';
  let title = `${statusText} Events`;
  
  if (selectedLocationValue.value) {
    title += ` - ${selectedLocationValue.value}`;
  }
  
  if (selectedDueByValue.value) {
    title += ` - Due in ${selectedDueByValue.value} days`;
  }
  
  if (filteredResults.value.length > 0) {
    title += ` - Search Results`;
  }
  
  return title;
}

function searchColumns() {
  filteredResults.value = [];
  
  if (!inputSearchText.value || inputSearchText.value.length < 2) {
    return;
  }

  events.value.forEach((event) => {
    const searchHasDescription = 
      event.description?.toLowerCase().includes(inputSearchText.value.toLowerCase());
    const searchHasAssigned = 
      event.assigned?.toLowerCase().includes(inputSearchText.value.toLowerCase());
    
    if (searchHasDescription || searchHasAssigned) {
      filteredResults.value.push(event);
    }
  });
}

function showIndex() {
  filteredResults.value = [];
  inputSearchText.value = '';
}

function getEventCardClass(event) {
  if (event.status === 'inactive') return 'event-inactive';
  if (isEventPastDue(event)) return 'event-pastdue';
  return 'event-active';
}

function getEventStatusIcon(event) {
  if (event.status === 'inactive') return 'fas fa-pause-circle';
  if (isEventPastDue(event)) return 'fas fa-exclamation-circle';
  return 'fas fa-check-circle';
}

function isEventPastDue(event) {
  const today = dayjs().format("YYYY-MM-DD");
  return event.status === 'active' && event.action_due_date < today;
}

function getResultsCount() {
  return displayEvents.value.length;
}

function editEvent(event) {
  router.push({ name: 'EventEdit', params: { id: event.id } });
}

function showEvent(event) {
  router.push({ name: 'EventShow', params: { id: event.id } });
}

async function notifyEventsDue() {
  try {
    const result = await axios.put(apiUrl.value + "notification_events_due");
    
    if (result.statusText.toLowerCase() === 'ok') {
      alert('✅ Notification emails sent successfully');
    } else {
      alert('❌ Error sending notification emails');
    }
  } catch (error) {
    console.error("❌ Failed to send notifications:", error);
    alert('❌ Failed to send notifications');
  }
}

function formatStandardDate(value) {
  return DateFormatService.formatStandardDatejs(value);
}

// ✅ LIFECYCLE
onMounted(async () => {  
  if (window.location.port === "8080") {
    apiUrl.value = "http://localhost:3000/api/v1/events/";
  } else {
    apiUrl.value = "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/events/";
  }

  try {
    await store.dispatch("fetchEvents");
  } catch (error) {
    console.error('❌ Error loading events:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* ✅ IMPORT SHARED STYLES */
@import '@/assets/styles/ui-components.css';
@import '@/assets/styles/event-components.css';

/* ========================================
   EVENT LIST SPECIFIC STYLES
   ======================================== */

.event-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

/* Navigation */
.navigation-flex {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.navigation-flex .btn {
  flex: 1;
  min-width: 200px;
}

/* Filters Grid */
.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filter-with-counter {
  position: relative;
}

/* Counter Badges */
.counter-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  color: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
  z-index: 10;
}

.counter-badge-red {
  background: linear-gradient(45deg, #ff416c, #ff4b2b);
  box-shadow: 0 2px 8px rgba(255, 65, 108, 0.4);
}

.counter-badge-green {
  background: linear-gradient(45deg, #4caf50, #8bc34a);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.4);
}

.counter-badge-purple {
  background: linear-gradient(45deg, #9c27b0, #e91e63);
  box-shadow: 0 2px 8px rgba(156, 39, 176, 0.4);
}

.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); box-shadow: 0 4px 16px rgba(255, 65, 108, 0.6); }
}

/* Search Section */
.search-section {
  margin: 1.5rem 0;
}

.search-input-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 1.1rem;
}

.search-input {
  padding-left: 3rem;
  padding-right: 3rem;
}

.clear-search-btn {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.clear-search-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #333;
}

.search-hint {
  color: #667eea;
  font-weight: 600;
  margin-top: 0.5rem;
  display: block;
}

/* View Toggle */
.view-toggle-section {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
}

.btn-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Legend */
.legend-chips {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.75rem;
}

/* Events Grid */
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1rem;
}

/* Event Cards */
.event-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.event-active {
  border-left: 4px solid #4CAF50;
}

.event-pastdue {
  border-left: 4px solid #ef4444;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.02) 0%, rgba(239, 68, 68, 0.05) 100%);
}

.event-inactive {
  border-left: 4px solid #9e9e9e;
  background: linear-gradient(135deg, rgba(158, 158, 158, 0.02) 0%, rgba(158, 158, 158, 0.05) 100%);
  opacity: 0.8;
}

.event-card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.event-status-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.event-active .event-status-icon {
  color: #4CAF50;
}

.event-pastdue .event-status-icon {
  color: #ef4444;
}

.event-inactive .event-status-icon {
  color: #9e9e9e;
}

.event-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.event-card-body {
  padding: 1.25rem;
}

.event-detail-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  font-size: 0.95rem;
  color: #555;
}

.event-detail-row i {
  color: #667eea;
  width: 20px;
  flex-shrink: 0;
}

.event-card-footer {
  padding: 0.75rem 1.25rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: flex-end;
}

/* Loading Spinner */
.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Utilities */
.subtitle {
  margin: 0.5rem 0 0;
  color: #666;
  font-size: 0.95rem;
}

.hint-text {
  margin: 0.5rem 0 0;
  color: #999;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mt-3 { margin-top: 0.75rem; }
.mt-4 { margin-top: 1rem; }
.mt-5 { margin-top: 1.5rem; }
.mb-4 { margin-bottom: 1rem; }
.ml-2 { margin-left: 0.5rem; }

.text-center {
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .event-list-container {
    padding: 0.5rem;
  }
  
  .navigation-flex {
    flex-direction: column;
  }
  
  .navigation-flex .btn {
    width: 100%;
    min-width: auto;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .events-grid {
    grid-template-columns: 1fr;
  }
  
  .legend-chips {
    justify-content: center;
  }
  
  .btn-group {
    width: 100%;
  }
  
  .btn-group .btn {
    flex: 1;
  }
}
</style>