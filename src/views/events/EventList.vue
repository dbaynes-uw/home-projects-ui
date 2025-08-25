<template>
  <div class="event-list-container">
    <!-- ✅ MODERN HEADER -->
    <v-card class="mx-auto mt-5">
      <v-card-title class="d-flex align-center">
        <v-avatar color="primary" class="mr-3">
          <v-icon>mdi-calendar-check</v-icon>
        </v-avatar>
        <div>
          <h2 class="mb-0">Events Dashboard</h2>
          <p class="text-medium-emphasis mb-0">Created by: {{ user?.email }}</p>
        </div>
      </v-card-title>

      <!-- ✅ MODERN NAVIGATION -->
      <v-card-text>
        <div class="navigation-grid">
          <v-btn
            variant="outlined"
            :to="{ name: 'EventStatistics' }"
            prepend-icon="mdi-chart-bar"
          >
            Statistics
          </v-btn>
          
          <v-btn
            variant="outlined"
            :to="{ name: 'EventCreate' }"
            prepend-icon="mdi-plus"
            color="primary"
          >
            Create Event
          </v-btn>
          
          <v-btn
            variant="outlined"
            @click="refreshPage"
            prepend-icon="mdi-refresh"
          >
            Active Events
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- ✅ MODERN FILTERS & SEARCH -->
    <v-card class="mt-4">
      <v-card-title>
        <h3>Filters & Search</h3>
      </v-card-title>
      
      <v-card-text>
        <!-- ✅ FILTER COMPONENTS ROW -->
        <div class="filters-grid mb-4">
          <EventsPastDue />
          <EventsInactive />
          <EventsDueBy v-model:selectedDueByValue="parentDueBy" />
          <EventsLocations v-model:selectedLocationValue="parentLocation" />
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

        <!-- ✅ VIEW TOGGLE -->
        <div class="d-flex align-center justify-space-between">
          <v-btn-toggle
            v-model="viewMode"
            mandatory
            variant="outlined"
            divided
          >
            <v-btn value="cards">
              <v-icon start>mdi-view-grid</v-icon>
              Cards
            </v-btn>
            <v-btn value="table">
              <v-icon start>mdi-table</v-icon>
              Table
            </v-btn>
          </v-btn-toggle>

          <!-- ✅ ADMIN NOTIFICATION -->
          <v-btn
            v-if="isAdmin"
            @click="notifyEventsDue"
            color="warning"
            variant="elevated"
            prepend-icon="mdi-email-send"
          >
            Send Due Notifications
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

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
            @dblclick="editEvent(event)"
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
                
                <div class="d-flex align-center mb-2">
                  <v-icon size="small" class="mr-2">mdi-calendar</v-icon>
                  <span>{{ formatStandardDate(event.action_due_date) }}</span>
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
import EventsInactive from "@/components/events/EventsInactive.vue";
import EventsLocations from "@/components/events/EventsLocations.vue";
import EventsPastDue from "@/components/events/EventsPastDue.vue";
import DateFormatService from "@/services/DateFormatService.js";

const router = useRouter();
const store = useStore();

// ✅ REACTIVE STATE
const isLoading = ref(true);
const inputSearchText = ref('');
const parentDueBy = ref('');
const parentLocation = ref('');
const viewMode = ref('cards');
const apiUrl = ref('');

// ✅ COMPUTED PROPERTIES
const user = computed(() => store.state.user?.resource_owner);
const events = computed(() => store.state.events || []);
const eventsRequest = computed(() => store.state.eventsRequest);

const isAdmin = computed(() => 
  user.value?.email?.toLowerCase().includes('baynes') || 
  user.value?.email === 'dlbaynes@gmail.com'
);

// ✅ SEARCH & FILTER LOGIC
const filteredResults = ref([]);

const displayEvents = computed(() => {
  return filteredResults.value.length > 0 ? filteredResults.value : events.value;
});

// ✅ SEARCH FUNCTION
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

// ✅ EVENT HELPERS
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

function getResultsTitle() {
  if (filteredResults.value.length > 0) {
    return 'Search Results';
  }
  
  if (eventsRequest.value === 'DueBy') {
    return `Events Due in ${parentDueBy.value} Days`;
  }
  
  if (eventsRequest.value === 'Location') {
    return `${parentLocation.value} Events`;
  }
  
  return 'All Events';
}

function getResultsCount() {
  return displayEvents.value.length;
}

// ✅ ACTIONS
function refreshPage() {
  window.location.reload();
}

function editEvent(event) {
  router.push({ name: 'EventEdit', params: { id: event.id } });
}

async function notifyEventsDue() {
  try {
    const result = await axios.put(apiUrl.value + "notification_events_due");
    
    if (result.statusText.toLowerCase() === 'ok') {
      // Use modern toast notification instead of alert
      console.log("✅ Notification emails sent successfully");
    } else {
      console.error("❌ Error sending notification emails");
    }
  } catch (error) {
    console.error("❌ Failed to send notifications:", error);
  }
}

// ✅ DATE FORMATTING
function formatStandardDate(value) {
  return DateFormatService.formatStandardDatejs(value);
}

// ✅ LIFECYCLE
onMounted(async () => {
  // Set API URL
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
@media (max-width: 600px) {
  .navigation-grid {
    grid-template-columns: 1fr;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .events-grid {
    grid-template-columns: 1fr;
  }
}
</style>