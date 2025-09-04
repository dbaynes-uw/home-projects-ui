<template>
  <div class="event-list-container">
    <!-- ✅ CONSISTENT CARD CONTAINER -->
    <div class="cards-container">
      
      <!-- ✅ HEADER CARD -->
      <v-card class="mt-5">
        <v-card-title>
          <div>
            <h2>Events Dashboard</h2>
            <h3 class="text-medium-emphasis mb-0">Created by: {{ user?.email }}</h3>
          </div>
        </v-card-title>

        <!-- ✅ MODERN NAVIGATION -->
        <v-card-text>
          <div class="navigation-grid">
            <v-btn
              variant="outlined"
              :to="{ name: 'EventStatistics' }"
              prepend-icon="mdi-chart-bar"
              id="button-as-link"
              style="margin-left: 3rem !important; width: auto;"
            >
              Statistics
            </v-btn>
            
            <v-btn
              variant="outlined"
              :to="{ name: 'EventCreate' }"
              prepend-icon="mdi-plus"
              color="primary"
              id="button-as-link"
              style="margin-left: 1rem !important; width: auto;"

            >
              Create Event
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- ✅ FILTERS CARD -->
      <v-card class="mt-4">
        <v-card-title>
          <h3>Filters & Search</h3>
        </v-card-title>
        
        <v-card-text>
          <!-- ✅ FILTER COMPONENTS ROW -->
          <div class="filters-grid mb-4">
            <EventsPastDue />

            <!-- ✅ STEALTH TOGGLE WITH DYNAMIC STYLING -->
            <div class="filter-button-container">
              <div class="stealth-select-wrapper">
                <label class="stealth-label"></label>
                <button 
                  class="stealth-toggle-button stealth-button"
                  :class="{ 'showing-inactive': !showActiveEvents }"
                  @click="toggleStatus"
                >
                  <div class="stealth-button-content">
                    <v-icon class="stealth-icon">{{ getToggleIcon() }}</v-icon>
                    {{ getToggleText() }}
                  </div>
                </button>
              </div>
            </div>

            <!-- ✅ MODERN V-MODEL BINDING -->
            <EventsDueBy v-model:selectedDueByValue="selectedDueByValue" />
            <EventsLocations v-model:selectedLocationValue="selectedLocationValue" />
          </div>

          <!-- ✅ SEARCH BAR -->
          <v-text-field
            v-model="inputSearchText"
            @input="searchColumns"
            @click:clear="showIndex"
            placeholder="Search events by description or assignee..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            clearable
            hide-details
            class="mb-4"
          />

          <!-- ✅ ENHANCED VIEW TOGGLE -->
          <div>
            <v-btn-toggle
              v-model="viewMode"
              mandatory
              variant="elevated"
              divided
              color="primary"
              class="view-toggle-enhanced"
            >
              <v-btn 
                value="cards"
                class="view-btn consistent-btn"
                :class="{ 'view-btn-active': viewMode === 'cards' }"
                id="button-as-link"
              >
                <v-icon start size="large">mdi-view-grid</v-icon>
                Cards View
              </v-btn>
              <v-btn 
                value="table"
                class="view-btn consistent-btn"
                :class="{ 'view-btn-active': viewMode === 'table' }"
                id="button-as-link"
              >
                <v-icon start size="large">mdi-table</v-icon>
                Table View
              </v-btn>

              <!-- ✅ ADMIN NOTIFICATION - Match the other buttons -->
              <v-btn
                v-if="isAdmin"
                @click="notifyEventsDue"
                class="view-btn consistent-btn"
                id="button-as-link"
                variant="elevated"
              >
                <v-icon start size="large">mdi-email-send</v-icon>
                Notify Due
              </v-btn>
            </v-btn-toggle>
          </div>
        </v-card-text>
      </v-card>

      <br/><br/>

      <!-- ✅ LOADING STATE -->
      <div v-if="isLoading" class="text-center pa-8">
        <v-progress-circular indeterminate color="primary" size="64" />
        <p class="mt-4">Loading events...</p>
      </div>

      <!-- ✅ RESULTS SECTION -->
      <v-card v-else class="mt-4">
        <v-card-title class="d-flex justify-space-between align-center">
          <div>
            <h3>{{ getResultsTitle() }}</h3>
            <p class="text-medium-emphasis mb-0">
              {{ getResultsCount() }} event{{ displayEvents.length !== 1 ? 's' : '' }} found
            </p>
          </div>

          <!-- ✅ LEGEND -->
          <v-chip-group>
            <v-chip color="success" variant="outlined" size="small">
              <v-icon start size="small">mdi-check-circle</v-icon>
              Complete
            </v-chip>
            <v-chip color="warning" variant="outlined" size="small">
              <v-icon start size="small">mdi-clock-alert</v-icon>
              Incomplete
            </v-chip>
            <v-chip color="error" variant="outlined" size="small">
              <v-icon start size="small">mdi-alert-circle</v-icon>
              Past Due
            </v-chip>
          </v-chip-group>
        </v-card-title>

        <v-card-text>
          <!-- ✅ CARDS VIEW -->
          <div v-if="viewMode === 'cards'" class="events-grid">
            <v-card
              v-for="event in displayEvents"
              :key="event.id"
              @dblclick="showEvent(event)"
              :class="getEventCardClass(event)"
              variant="outlined"
              hover
              class="event-card"
            >
              <v-card-title class="pb-2">
                <div class="d-flex align-center">
                  <v-icon 
                    :color="getEventStatusColor(event)"
                    start
                  >
                    {{ getEventStatusIcon(event) }}
                  </v-icon>
                  <span class="text-truncate">{{ event.description }}</span>
                </div>
              </v-card-title>

              <v-card-text>
                <div class="event-details">          
                  <div class="d-flex align-center mb-2">
                    <v-icon size="small" class="mr-2">mdi-account</v-icon>
                    <span>{{ event.assigned }}</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon size="small" class="mr-2">mdi-map-marker</v-icon>
                    <span>Frequency: {{ event.frequency }} Days</span>
                  </div>                         
                  <div class="d-flex align-center mb-2">
                    <v-icon size="small" class="mr-2">mdi-calendar</v-icon>
                    <span>Last Action: {{ formatStandardDate(event.action_completed_date) }}</span>
                  </div>                  
                  <div class="d-flex align-center mb-2">
                    <v-icon size="small" class="mr-2">mdi-calendar</v-icon>
                    <span> Due: {{ formatStandardDate(event.action_due_date) }}</span>
                    <v-chip
                      v-if="isEventPastDue(event)"
                      color="error"
                      size="x-small"
                      class="ml-2"
                    >
                      PAST DUE
                    </v-chip>
                  </div>

                  <div class="d-flex align-center">
                    <v-icon size="small" class="mr-2">mdi-map-marker</v-icon>
                    <span>{{ event.location || 'No location' }}</span>
                  </div>
                </div>
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn
                  @click.stop="showEvent(event)"
                  variant="text"
                  size="small"
                  color="primary"
                >
                  <v-icon start>mdi-pencil</v-icon>
                  Edit
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>

          <!-- ✅ TABLE VIEW -->
          <div v-else>
            <EventIndex :events="displayEvents" />
          </div>
        </v-card-text>
      </v-card>
      
    </div> <!-- ✅ END cards-container -->
  </div> <!-- ✅ END event-list-container -->
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
import DateFormatService from "@/services/DateFormatService.js";

const router = useRouter();
const store = useStore();

// ✅ REACTIVE STATE
const isLoading = ref(true);
const inputSearchText = ref('');
const viewMode = ref('cards');
const apiUrl = ref('');

// ✅ FILTER VALUES (these need to actually be used)
const selectedLocationValue = ref(''); 
const selectedDueByValue = ref('');    

// ✅ STATUS TOGGLE STATE
const showActiveEvents = ref(true);

// ✅ COMPUTED PROPERTIES
const user = computed(() => store.state.user?.resource_owner);
const events = computed(() => store.state.events || []);
//const eventsRequest = computed(() => store.state.eventsRequest);

const isAdmin = computed(() => 
  user.value?.email?.toLowerCase().includes('baynes') || 
  user.value?.email === 'dlbaynes@gmail.com'
);

// ✅ SEARCH & FILTER LOGIC
const filteredResults = ref([]);

// ✅ UPDATED - Actually use the filter values for filtering
const displayEvents = computed(() => {
  const targetStatus = showActiveEvents.value ? 'active' : 'inactive';
  
  // Start with all events filtered by current status
  let statusFiltered = events.value.filter(event => 
    event.status === targetStatus
  );
  
  // ✅ APPLY LOCATION FILTER if selected
  if (selectedLocationValue.value && selectedLocationValue.value !== '') {
    statusFiltered = statusFiltered.filter(event => 
      event.location === selectedLocationValue.value
    );
  }
  
  // ✅ APPLY DUE BY FILTER if selected
  if (selectedDueByValue.value && selectedDueByValue.value !== '') {
    const daysAhead = parseInt(selectedDueByValue.value);
    const targetDate = dayjs().add(daysAhead, 'day').format('YYYY-MM-DD');
    statusFiltered = statusFiltered.filter(event => 
      event.action_due_date <= targetDate
    );
  }
  
  // If there are search results, apply same filters
  if (filteredResults.value.length > 0) {
    let searchFiltered = filteredResults.value.filter(event => 
      event.status === targetStatus
    );
    
    // Apply location filter to search results
    if (selectedLocationValue.value && selectedLocationValue.value !== '') {
      searchFiltered = searchFiltered.filter(event => 
        event.location === selectedLocationValue.value
      );
    }
    
    // Apply due by filter to search results
    if (selectedDueByValue.value && selectedDueByValue.value !== '') {
      const daysAhead = parseInt(selectedDueByValue.value);
      const targetDate = dayjs().add(daysAhead, 'day').format('YYYY-MM-DD');
      searchFiltered = searchFiltered.filter(event => 
        event.action_due_date <= targetDate
      );
    }
    
    return searchFiltered;
  }
  
  return statusFiltered;
});

// ✅ UPDATED RESULTS TITLE - Show active filters
function getResultsTitle() {
  const statusText = showActiveEvents.value ? 'Active' : 'Inactive';
  let title = `${statusText} Events`;
  
  // Show location filter
  if (selectedLocationValue.value) {
    title += ` - ${selectedLocationValue.value}`;
  }
  
  // Show due by filter
  if (selectedDueByValue.value) {
    title += ` - Due in ${selectedDueByValue.value} days`;
  }
  
  // Show search indicator
  if (filteredResults.value.length > 0) {
    title += ` - Search Results`;
  }
  
  return title;
}

// ✅ UPDATED TOGGLE - Clear filters when switching status
function toggleStatus() {
  showActiveEvents.value = !showActiveEvents.value;
  
  // Clear all filters when toggling status
  filteredResults.value = [];
  inputSearchText.value = '';
  selectedLocationValue.value = '';  // ✅ Clear location filter
  selectedDueByValue.value = '';     // ✅ Clear due by filter
  
  // Update Vuex
  if (showActiveEvents.value) {
    store.dispatch('fetchEvents');
  } else {
    store.dispatch('eventsInactive');
  }
  
  store.dispatch('setEventsRequest', showActiveEvents.value ? 'Active' : 'Inactive');
  
  console.log('✅ Status toggled to:', showActiveEvents.value ? 'active' : 'inactive');
}

function getToggleText() {
  return showActiveEvents.value ? 'Inactive Events' : 'Show Active Events';
}

function getToggleIcon() {
  return showActiveEvents.value ? 'mdi-pause-circle' : 'mdi-play-circle';
}

//function getToggleColor() {
//  return showActiveEvents.value ? 'blue-darken-2' : 'green-darken-3';
//}

function searchColumns() {
  filteredResults.value = [];
  
  if (!inputSearchText.value || inputSearchText.value.length < 2) {
    filteredResults.value = [];
    return;
  }

  if (events.value && events.value.length > 0) {
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

function getEventStatusColor(event) {
  if (event.status === 'inactive') return 'grey';
  if (isEventPastDue(event)) return 'error';
  return 'success';
}

function getEventStatusIcon(event) {
  if (event.status === 'inactive') return 'mdi-pause-circle';
  if (isEventPastDue(event)) return 'mdi-alert-circle';
  return 'mdi-check-circle';
}

function isEventPastDue(event) {
  const today = dayjs().format("YYYY-MM-DD");
  return event.status === 'active' && event.action_due_date < today;
}

function getResultsCount() {
  return displayEvents.value.length;
}

function showEvent(event) {
  router.push({ name: 'EventShow', params: { id: event.id } });
}

async function notifyEventsDue() {
  try {
    const result = await axios.put(apiUrl.value + "notification_events_due");
    
    if (result.statusText.toLowerCase() === 'ok') {
      console.log("✅ Notification emails sent successfully");
    } else {
      console.error("❌ Error sending notification emails");
    }
  } catch (error) {
    console.error("❌ Failed to send notifications:", error);
  }
}

function formatStandardDate(value) {
  return DateFormatService.formatStandardDatejs(value);
}

onMounted(async () => {
  if (window.location.port === "8080") {
    apiUrl.value = "http://localhost:3000/api/v1/events/";
  } else {
    apiUrl.value = "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/events/";
  }

  try {
    await store.dispatch("fetchEvents");
  } catch (error) {
    console.error("❌ Error fetching events:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* ✅ CONSISTENT CARD CONTAINER */
.cards-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.event-list-container {
  padding: 1rem;
}

/* ✅ ENSURE ALL CARDS HAVE CONSISTENT WIDTH */
.cards-container .v-card {
  width: 100%;
  max-width: 100%;
}
.event-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.navigation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1rem;
}

.event-card {
  cursor: pointer;
  transition: all 0.2s ease;
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.event-active {
  border-left: 4px solid rgb(var(--v-theme-success));
}

.event-pastdue {
  border-left: 4px solid rgb(var(--v-theme-error));
  background-color: rgba(var(--v-theme-error), 0.05);
}

.event-inactive {
  border-left: 4px solid rgb(var(--v-theme-grey));
  opacity: 0.7;
}

.event-details {
  font-size: 0.875rem;
}

/* ✅ RESPONSIVE */
.consistent-btn {
  min-width: 280px !important;
  height: 64px !important; /* ✅ FORCE same height for all */
  font-size: 18px !important;
  font-weight: 700 !important;
  text-transform: none !important;
  padding: 0 40px !important;
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
  border: 2px solid transparent !important;
  box-sizing: border-box !important; /* ✅ Important for consistent sizing */
}

/* ✅ CONSISTENT ICON STYLING */
.consistent-btn .v-icon {
  font-size: 28px !important;
  margin-right: 12px !important;
}

/* ✅ VIEW TOGGLE ENHANCED CONTAINER */
.view-toggle-enhanced {
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12) !important;
  min-width: 600px;
}

/* ✅ INACTIVE VIEW BUTTONS */
.view-btn:not(.view-btn-active) {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
  color: #6c757d !important;
  border: 2px solid #dee2e6 !important;
}

.view-btn:not(.view-btn-active):hover {
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%) !important;
  color: #495057 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
}

/* ✅ ACTIVE VIEW BUTTONS */
.view-btn-active[value="cards"] {
  background: linear-gradient(135deg, #16c0b0 0%, #84cf6a 100%) !important;
  color: black !important;
  border: 2px solid #16c0b0 !important;
  box-shadow: 0 4px 16px rgba(22, 192, 176, 0.4) !important;
  font-weight: 800 !important;
}

.view-btn-active[value="table"] {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  border: 2px solid #667eea !important;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4) !important;
  font-weight: 800 !important;
}

/* ✅ NOTIFY BUTTON - Match the same height and styling */
.notify-btn {
  background: linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%) !important;
  color: white !important;
  border: 2px solid #ff7e5f !important;
  box-shadow: 0 4px 16px rgba(255, 126, 95, 0.4) !important;
  margin-left: 20px; /* Space from toggle buttons */
  /* ✅ Override any Vuetify defaults that might make it taller */
  max-height: 64px !important;
  line-height: normal !important;
}

/* ✅ HOVER EFFECTS FOR ALL BUTTONS */
.view-btn-active:hover,
.notify-btn:hover {
  transform: translateY(-3px) scale(1.02);
  filter: brightness(1.1);
}

/* ✅ ANIMATED BACKGROUND EFFECT FOR ALL */
.consistent-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.6s;
}

.consistent-btn:hover::before {
  left: 100%;
}

/* ✅ REMOVE OLD .view-btn STYLES that might conflict */
/* Comment out or remove the old .view-btn styles */

/* ✅ RESPONSIVE - All buttons scale together */
@media (max-width: 1200px) {
  .view-toggle-enhanced {
    min-width: 500px;
  }
  
  .consistent-btn {
    min-width: 220px !important;
    height: 60px !important;
    font-size: 16px !important;
    padding: 0 32px !important;
    max-height: 60px !important;
  }
  
  .consistent-btn .v-icon {
    font-size: 24px !important;
    margin-right: 10px !important;
  }
}

@media (max-width: 768px) {
  .view-toggle-enhanced {
    min-width: 400px;
  }
  
  .consistent-btn {
    min-width: 180px !important;
    height: 56px !important;
    font-size: 15px !important;
    padding: 0 24px !important;
    max-height: 56px !important;
  }
  
  .notify-btn {
    margin-left: 12px;
  }
}

@media (max-width: 640px) {
  .d-flex.align-center.justify-space-between {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .view-toggle-enhanced {
    width: 100% !important;
    min-width: unset !important;
  }
  
  .consistent-btn {
    flex: 1;
    min-width: unset !important;
    height: 52px !important;
    max-height: 52px !important;
  }
  
  .notify-btn {
    margin-left: 0;
    width: 100%;
  }
}

/* ✅ REMOVE/OVERRIDE ANY CONFLICTING GLOBAL STYLES */
#button-as-link.consistent-btn {
  /* Override your global #button-as-link styles for these buttons */
  height: 64px !important;
  width: auto !important;
  margin: 0 !important;
}
/* ✅ STEALTH TOGGLE BUTTON - Match your dropdown styling exactly */
.stealth-toggle-button {
  background: linear-gradient(to right, #16c0b0, #84cf6a) !important;
  border-radius: 12px !important;
  border: none !important;
  height: 48px !important;
  box-shadow: 0 2px 8px rgba(22, 192, 176, 0.3) !important;
  transition: all 0.3s ease !important;
  cursor: pointer !important;
  width: 100% !important;
  padding: 0 !important;
  outline: none !important;
  position: relative;
  overflow: hidden;
}

.stealth-toggle-button:hover {
  background: linear-gradient(to right, #14a89a, #72b558) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 192, 176, 0.4) !important;
}

/* ✅ ANIMATED SHINE EFFECT */
.stealth-toggle-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.6s;
  z-index: 1;
  pointer-events: none;
}

.stealth-toggle-button:hover::before {
  left: 100%;
}

/* ✅ ACTIVE STATE - Different gradient when showing inactive events */
.stealth-toggle-button.showing-inactive {
  background: linear-gradient(to right, #667eea, #764ba2) !important;
  border: 2px solid #667eea !important;
}

.stealth-toggle-button.showing-inactive:hover {
  background: linear-gradient(to right, #5a6fd8, #6a42a0) !important;
}

/* ✅ REMOVE OLD FILTER TOGGLE STYLES */
.filter-toggle-btn {
  /* Override any old styling */
  all: unset;
}
.stealth-select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 250px;
}

.stealth-label {
  color: #1a1a1a !important;
  font-weight: 800 !important;
  font-size: 15px !important;
  text-transform: uppercase !important;
  letter-spacing: 0.8px !important;
  text-align: center !important;
  margin-bottom: 6px !important;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
}

.stealth-button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 25px;
  color: black !important;
  font-weight: 800 !important;
  font-size: 20px !important;
  text-transform: none !important;
  padding-bottom: .5rem !important;
}

.stealth-icon {
  color: black !important;
  font-size: 20px !important;
  margin-right: 8px !important;
}

.stealth-select-wrapper:hover .stealth-label {
  color: #16c0b0 !important;
  transform: translateY(-1px);
}

/* ✅ STEALTH TOGGLE BUTTON - Match your dropdown styling exactly */
.stealth-toggle-button {
  background: linear-gradient(to right, #16c0b0, #84cf6a) !important;
  border-radius: 12px !important;
  border: none !important;
  height: 48px !important;
  box-shadow: 0 2px 8px rgba(22, 192, 176, 0.3) !important;
  transition: all 0.3s ease !important;
  cursor: pointer !important;
  width: 100% !important;
  padding: 0 !important;
  outline: none !important;
  position: relative;
  overflow: hidden;
}

.stealth-toggle-button:hover {
  background: linear-gradient(to right, #14a89a, #72b558) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 192, 176, 0.4) !important;
}

/* ✅ SHOWING INACTIVE STATE - Different gradient */
.stealth-toggle-button.showing-inactive {
  background: linear-gradient(to right, #667eea, #764ba2) !important;
  border: 2px solid #667eea !important;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3) !important;
}

.stealth-toggle-button.showing-inactive:hover {
  background: linear-gradient(to right, #5a6fd8, #6a42a0) !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
}

.stealth-toggle-button.showing-inactive .stealth-button-content {
  color: white !important;
}

.stealth-toggle-button.showing-inactive .stealth-icon {
  color: white !important;
}

/* ✅ ANIMATED SHINE EFFECT */
.stealth-toggle-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.6s;
  z-index: 1;
  pointer-events: none;
}

.stealth-toggle-button:hover::before {
  left: 100%;
}

/* ✅ RESPONSIVE FOR ALL STEALTH COMPONENTS */
@media (max-width: 768px) {
  .stealth-select-wrapper {
    max-width: 100%;
  }
  
  .stealth-label {
    font-size: 12px !important;
  }
  
  .stealth-toggle-button {
    height: 52px !important;
  }
  
  .stealth-button-content {
    height: 52px;
    font-size: 14px !important;
  }
  
  .stealth-icon {
    font-size: 18px !important;
  }
}
</style>