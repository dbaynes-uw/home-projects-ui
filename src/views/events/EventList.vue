<template>
  <div class="page-wrapper">
      <!-- ✅ ANIMATED BACKGROUND SHAPES -->
    <div class="background-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
      <div class="shape shape-4"></div>
      <div class="shape shape-5"></div>
      <div class="shape shape-6"></div>
    </div>
    <div class="event-list-container">
      <!-- ✅ CONSISTENT CARD CONTAINER -->
      <div class="cards-container">
        <div class="background-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
          <div class="shape shape-4"></div>
          <div class="shape shape-5"></div>
          <div class="shape shape-6"></div>
        </div>
        <!-- ✅ HEADER CARD -->
        <v-card class="mt-5">
          <v-card-title>
            <div>
              <h2>Events Dashboard</h2>
              <h3 class="text-medium-emphasis mb-0">Created by: {{ user?.email }}</h3>
            </div>
          </v-card-title>
        </v-card>
        <!-- ✅ MODERN NAVIGATION -->
        <!-- ✅ NAVIGATION SECTION -->
        <div class="card-wrapper">     
          <v-card-text>
            <div class="navigation-flex">
              <v-btn
                variant="outlined"
                :to="{ name: 'EventStatistics' }"
                prepend-icon="fas fa-chart-bar"
                id="button-as-link"
                class="nav-button"
              >
                Statistics
              </v-btn>

              <v-btn
                variant="outlined"
                :to="{ name: 'EventCreate' }"
                prepend-icon="fas fa-plus"
                color="primary"
                id="button-as-link"
                class="nav-button"
              >
                New Event
              </v-btn>
            </div>
          </v-card-text>
        </div>
      
        <!-- ✅ FILTERS CARD -->
        <div class="card-wrapper">     
          <v-card class="mt-4">
            <v-card-title>
              <h3>Filters & Search</h3>
            </v-card-title>

            <v-card-text>
              <!-- ✅ FILTER COMPONENTS ROW -->
              <div class="filters-grid mb-4">
                <div class="filter-with-counter bounce-animation">
                  <EventsPastDue />
                  <div class="filter-with-counter counter-badge-red pulse-animation">{{ pastDueCount }}</div>
                </div>

                <div class="filter-with-counter">
                  <EventsStatus 
                    :show-active-events="showActiveEvents"
                    @toggle-status="handleStatusToggle"
                  />
                  <div
                    :class="getStatusBadgeClass()" 
                    class="counter-badge-green">{{ displayEvents.length }}</div>
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
              
              <!-- ✅ SEARCH CONTAINER -->
              <div class="search-container" :class="{ 'search-focused': searchFocused }">
                <div class="background-shapes">
                  <div class="shape shape-1"></div>
                  <div class="shape shape-2"></div>
                  <div class="shape shape-3"></div>
                  <div class="shape shape-4"></div>
                  <div class="shape shape-5"></div>
                  <div class="shape shape-6"></div>
                </div>
                
                <v-text-field
                  v-model="inputSearchText"
                  @input="searchColumns"
                  @focus="searchFocused = true"
                  @blur="searchFocused = false"
                  @click:clear="showIndex"
                  placeholder="Search events by description or assignee..."
                  prepend-inner-icon="fas fa-magnify"
                  variant="outlined"
                  clearable
                  hide-details
                  class="morphing-search"
                />
                
                <div class="search-suggestions" v-if="searchFocused && inputSearchText">
                  <div class="suggestion-count">{{ filteredResults.length }} results found</div>
                </div>
              </div>
              
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
                  
                  <!-- ✅ ADMIN NOTIFICATION -->
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
        </div> 

        <br/><br/>

        <!-- ✅ LOADING STATE -->
        <div class="card-wrapper"> 
          <v-card v-if="isLoading" class="mt-4">
            <v-progress-circular indeterminate color="primary" size="64" />
            <p class="mt-4">Loading events...</p>
          </v-card>

          <!-- ✅ RESULTS SECTION -->
          <v-card v-else class="mt-4">
            <div class="background-shapes">
              <div class="shape shape-1"></div>
              <div class="shape shape-2"></div>
              <div class="shape shape-3"></div>
              <div class="shape shape-4"></div>
              <div class="shape shape-5"></div>
              <div class="shape shape-6"></div>
            </div>
            
            <v-card-title class="d-flex justify-space-between align-center">
              <div>
                <h3>{{ getResultsTitle() }}</h3>
                <p class="text-medium-emphasis mb-0">
                  {{ getResultsCount() }} event{{ displayEvents.length !== 1 ? 's' : '' }} found
                </p>
                <p class="text-medium-emphasis mb-0">
                  Double click a card to view details or edit.
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
                  v-for="(event, index) in displayEvents"
                  :key="event.id"
                  @dblclick="showEvent(event)"
                  :class="[getEventCardClass(event), 'animated-card']"
                  :style="{ animationDelay: `${index * 0.1}s` }"
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
                      <div class="background-shapes">
                        <div class="shape shape-1"></div>
                        <div class="shape shape-2"></div>
                        <div class="shape shape-3"></div>
                        <div class="shape shape-4"></div>
                        <div class="shape shape-5"></div>
                        <div class="shape shape-6"></div>
                      </div>
                      
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
                        <span>Location: {{ event.location || 'No location' }}</span>
                      </div>
                      
                      <div class="d-flex align-center">
                        <v-icon size="small" class="mr-2">mdi-map-marker</v-icon>
                        <span>Status: {{ event.status.charAt(0).toUpperCase() + event.status.slice(1) }}</span>
                      </div>
                    </div>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      @click.stop="editEvent(event)"
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
        </div>

      </div> <!-- ✅ END cards-container -->
    </div> <!-- ✅ END event-list-container -->
  </div>  <!-- ✅ END page-wrapper -->
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

// ✅ MOVE THESE TO THE TOP - BEFORE ANY COMPUTED PROPERTIES
const showActiveEvents = ref(true); // ✅ DEFAULT TO INACTIVE
const isLoading = ref(true);
const inputSearchText = ref('');
const viewMode = ref('cards');
const apiUrl = ref('');
const selectedLocationValue = ref(''); 
const selectedDueByValue = ref('');    
const filteredResults = ref([]);
const searchFocused = ref(false);
// ✅ NOW COMPUTED PROPERTIES CAN ACCESS THE REFS ABOVE
const user = computed(() => store.state.user?.resource_owner);
const events = computed(() => store.state.events || []);

const isAdmin = computed(() => 
  user.value?.email?.toLowerCase().includes('baynes') || 
  user.value?.email === 'dlbaynes@gmail.com'
);
const pastDueCount = computed(() => {
  return events.value.filter(event => isEventPastDue(event)).length;
});

// ✅ NOW displayEvents CAN ACCESS showActiveEvents
const displayEvents = computed(() => {  
  // ✅ CHECK WHAT STATUS VALUES WE ACTUALLY HAVE
  //if (events.value?.length > 0) {
  //  const statusCounts = events.value.reduce((acc, event) => {
  //    acc[event.status] = (acc[event.status] || 0) + 1;
  //    return acc;
  //  }, {});
  //  console.log('🔍 Status breakdown:', statusCounts);
  //}
  
  // ✅ DETERMINE TARGET STATUS
  const targetStatus = showActiveEvents.value ? 'active' : 'inactive';
  // Start with all events filtered by current status
  let statusFiltered = events.value.filter(event => {
    return event.status === targetStatus;
  });
    
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


// ✅ FUNCTIONS

function handleDueByFilter(daysValue) {
  console.log('🎯 EventList received due-by filter:', daysValue);
  selectedDueByValue.value = daysValue;
  console.log('✅ Due by filter applied:', selectedDueByValue.value);
}
// ✅ ADD THIS MISSING LOCATION HANDLER
function handleLocationFilter(locationValue) {
  console.log('📍 EventList received location filter:', locationValue);
  console.log('📍 Type:', typeof locationValue);
  
  selectedLocationValue.value = locationValue;
  console.log('✅ Location filter applied:', selectedLocationValue.value);
}
function handleClearDueBy() {
  console.log('🗑️ EventList received clear due-by filter');
  selectedDueByValue.value = '';
  console.log('✅ Due by filter cleared');
}
function handleClearLocation() {
  console.log('🗑️ EventList received clear location filter');
  selectedLocationValue.value = '';
  console.log('✅ Location filter cleared');
}
function handleStatusToggle(newActiveState) {
  showActiveEvents.value = newActiveState;
  
  // Clear all filters when switching status
  filteredResults.value = [];
  inputSearchText.value = '';
  selectedLocationValue.value = '';
  selectedDueByValue.value = '';
  
}
function getStatusBadgeClass() {
  const baseClass = 'counter-badge';
  
  if (showActiveEvents.value) {
    return `${baseClass}-green`; // Green for active
  } else {
    return `${baseClass}-purple`;  // Purple for inactive
  }
}
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

// ✅ ALL YOUR OTHER FUNCTIONS (unchanged)
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
  if (event.status === 'inactive') return 'fas fa-pause-circle';
  if (isEventPastDue(event)) return 'fas fa-alert-circle';
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

// ✅ ONMOUNTED
onMounted(async () => {
  if (window.location.port === "8080") {
    apiUrl.value = "http://localhost:3000/api/v1/events/";
  } else {
    apiUrl.value = "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/events/";
  }

  try {
    // ✅ LOAD INACTIVE EVENTS BY DEFAULT
    await store.dispatch("eventsStatus", "active");
    console.log("✅ Loaded active events by default");
  } catch (error) {
    console.error("❌ Error fetching events:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* ✅ FLOATING SHAPES BACKGROUND */
.page-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
  position: relative;
  overflow-x: hidden;
  height: 102% !important
}

.background-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}
/* ✅ PAGE WRAPPER AND BACKGROUND */
.page-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
  position: relative;
  overflow-x: hidden;
  height: 102% !important;
}

/* ✅ LAYERED BACKGROUND SHAPES - MULTIPLE SECTIONS */

/* PAGE-LEVEL BACKGROUND SHAPES */
.page-wrapper > .background-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

/* CARDS CONTAINER BACKGROUND SHAPES */
.cards-container > .background-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

/* SEARCH CONTAINER BACKGROUND SHAPES */
.search-container > .background-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  border-radius: 12px;
}

/* RESULTS CARD BACKGROUND SHAPES */
.v-card > .background-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  border-radius: 12px;
}

/* EVENT DETAILS BACKGROUND SHAPES */
.event-details > .background-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  border-radius: 8px;
}

/* ✅ SHARED SHAPE STYLING */
.shape {
  position: absolute;
  border-radius: 50%;
  animation: float 20s infinite ease-in-out;
}

/* PAGE-LEVEL SHAPES */
.page-wrapper > .background-shapes .shape {
  opacity: 0.1;
}

/* CARDS CONTAINER SHAPES - SLIGHTLY DIFFERENT */
.cards-container > .background-shapes .shape {
  opacity: 0.08;
  animation: float 25s infinite ease-in-out;
}

/* SEARCH CONTAINER SHAPES - SUBTLE */
.search-container > .background-shapes .shape {
  opacity: 0.05;
  animation: float 15s infinite ease-in-out;
  transform: scale(0.6);
}

/* RESULTS CARD SHAPES - SLOW */
.v-card > .background-shapes .shape {
  opacity: 0.06;
  animation: float 30s infinite ease-in-out;
  transform: scale(0.8);
}

/* EVENT DETAILS SHAPES - TINY */
.event-details > .background-shapes .shape {
  opacity: 0.03;
  animation: float 10s infinite ease-in-out;
  transform: scale(0.3);
}

/* ✅ INDIVIDUAL SHAPE DEFINITIONS */
.shape-1 {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #16c0b0, #84cf6a);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  top: 60%;
  right: 10%;
  animation-delay: -5s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  background: linear-gradient(45deg, #ff7e5f, #feb47b);
  top: 30%;
  left: 60%;
  animation-delay: -10s;
}

.shape-4 {
  width: 250px;
  height: 250px;
  background: linear-gradient(45deg, #84cf6a, #16c0b0);
  bottom: 20%;
  left: 20%;
  animation-delay: -15s;
}

.shape-5 {
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, #764ba2, #667eea);
  top: 80%;
  right: 30%;
  animation-delay: -7s;
}

.shape-6 {
  width: 180px;
  height: 180px;
  background: linear-gradient(45deg, #feb47b, #ff7e5f);
  top: 5%;
  right: 50%;
  animation-delay: -12s;
}

/* ✅ SHAPE VARIATIONS FOR DIFFERENT SECTIONS */
.cards-container > .background-shapes .shape-1 {
  top: 15%;
  left: 15%;
  animation-delay: -2s;
}

.cards-container > .background-shapes .shape-2 {
  top: 65%;
  right: 15%;
  animation-delay: -7s;
}

.search-container > .background-shapes .shape-1 {
  top: 20%;
  left: 20%;
  animation-delay: -1s;
}

.search-container > .background-shapes .shape-2 {
  bottom: 20%;
  right: 20%;
  animation-delay: -3s;
}

.v-card > .background-shapes .shape-1 {
  top: 25%;
  left: 25%;
  animation-delay: -4s;
}

.v-card > .background-shapes .shape-2 {
  bottom: 25%;
  right: 25%;
  animation-delay: -8s;
}

.event-details > .background-shapes .shape-1 {
  top: 10%;
  left: 80%;
  animation-delay: -1.5s;
}

.event-details > .background-shapes .shape-2 {
  bottom: 10%;
  left: 10%;
  animation-delay: -3.5s;
}

/* ✅ FLOAT ANIMATION */
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg) scale(1);
  }
  25% {
    transform: translateY(-20px) rotate(90deg) scale(1.1);
  }
  50% {
    transform: translateY(20px) rotate(180deg) scale(0.9);
  }
  75% {
    transform: translateY(-10px) rotate(270deg) scale(1.05);
  }
}

/* ✅ ENSURE CONTENT STAYS ON TOP */
.event-list-container {
  position: relative;
  z-index: 1;
}

.cards-container {
  position: relative;
  z-index: 1;
}

.v-card-title,
.v-card-text,
.v-card-actions {
  position: relative;
  z-index: 2;
}

.search-container .v-text-field {
  position: relative;
  z-index: 2;
}

/* ✅ CARD ANIMATIONS */
.animated-card {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  animation: cardEnter 0.6s ease forwards;
}

@keyframes cardEnter {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.event-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ✅ COUNTER BADGES */
.filter-with-counter {
  position: relative;
}

/* Counter Badges*/
.counter-badge {
  box-shadow: 0 2px 8px rgba(255, 65, 108, 0.4);
}
/* RED - For Past Due (your existing one) */
.counter-badge-red {
  background: linear-gradient(45deg, #ff416c, #ff4b2b);
  box-shadow: 0 2px 8px rgba(255, 65, 108, 0.4);
}

/* GREEN - For Active Events */
.counter-badge-green {
  background: linear-gradient(45deg, #4caf50, #8bc34a);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.4);
}

/* BLUE - For Info/Statistics */
.counter-badge-blue {
  background: linear-gradient(45deg, #2196f3, #03a9f4);
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.4);
}

/* ORANGE - For Warnings */
.counter-badge-orange {
  background: linear-gradient(45deg, #ff9800, #ffc107);
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.4);
}

/* PURPLE - For Special Categories */
.counter-badge-purple {
  background: linear-gradient(45deg, #9c27b0, #e91e63);
  box-shadow: 0 2px 8px rgba(156, 39, 176, 0.4);
}

/* ✅ SHARED COUNTER BADGE BASE STYLES */
.counter-badge,
.counter-badge-red,
.counter-badge-green,
.counter-badge-blue,
.counter-badge-orange,
.counter-badge-purple {
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

.pulse-animation {
  animation: pulse 2s infinite;
}

.bounce-animation {
  animation: bounce 1s 3;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); box-shadow: 0 4px 16px rgba(255, 65, 108, 0.6); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
  60% { transform: translateY(-3px); }
}

/* ✅ SEARCH MORPHING ANIMATION */
.search-container {
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 1rem;
}

.search-focused {
  transform: scale(1.02);
  z-index: 10;
}

.morphing-search {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-focused .morphing-search {
  box-shadow: 0 8px 32px rgba(22, 192, 176, 0.3);
  border-radius: 16px;
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  padding: 1rem;
  transform: translateY(-8px);
  animation: slideDown 0.3s ease forwards;
}

@keyframes slideDown {
  to {
    transform: translateY(0);
  }
}

.suggestion-count {
  color: #16c0b0;
  font-weight: 600;
  font-size: 14px;
}

/* ✅ CARD TITLE STYLING */
:deep(.v-card-title) {
  background: linear-gradient(135deg, rgba(22, 192, 176, 0.08) 0%, rgba(132, 207, 106, 0.08) 100%) !important;
  border-bottom: 1px solid rgba(22, 192, 176, 0.15) !important;
  padding: 1.5rem !important;
  border-radius: 12px 12px 0 0 !important;
}

:deep(.v-card-title)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(22, 192, 176, 0.05) 0%, transparent 50%);
  pointer-events: none;
  border-radius: 12px 12px 0 0;
}

/* ✅ LAYOUT AND GRID STYLING */
.cards-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
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
  position: relative;
  left: -2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1rem;
}

/* ✅ EVENT CARD STYLING */
.event-card {
  cursor: pointer;
  transition: all 0.2s ease;
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
  background-color: rgba(var(--v-theme-error), 0.05);
}

.event-details {
  font-size: 0.875rem;
  position: relative;
}

/* ✅ RESPONSIVE DESIGN */
@media (max-width: 768px) {
  /* Hide some shapes on mobile for performance */
  .shape-4,
  .shape-5,
  .shape-6 {
    display: none;
  }
  
  /* Make remaining shapes smaller */
  .shape {
    transform: scale(0.7) !important;
    opacity: 0.05 !important;
  }
  
  .cards-container {
    padding: 0 0.5rem;
  }
  
  .filters-grid {
    left: 0;
    grid-template-columns: 1fr;
  }
  
  .events-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .shape {
    display: none; /* Hide all shapes on very small screens */
  }
}
</style>