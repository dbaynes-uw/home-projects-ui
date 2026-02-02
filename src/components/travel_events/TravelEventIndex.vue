<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-table density="compact">
    <tr>
      <th id="background-blue" @click="sortList('title')">Title</th>
      <th id="background-blue" @click="sortList('description')">Description</th>
      <th id="background-blue" @click="sortList('start_date')">
        Start Date
      </th>
      <th id="background-blue" @click="sortList('end_date')">End Date</th>
      <th id="background-blue">Reference</th>
      <th id="background-blue">Notes</th>
      <th id="background-blue" style="text-align: right">Actions</th>
    </tr>
    <tr v-for="travel_event in travel_events"
              :key="travel_event.id"
              travel_event="travel_event"
              :id="eventPassed(travel_event)"
      >
      <td>{{ travel_event.title }}</td>
      <td>{{ travel_event.description }}</td>
      <td>{{ formatFullYearDate(travel_event.start_date) }}</td>
      <td>{{ formatFullYearDate(travel_event.end_date) }}</td>
      <td>
        <a :href="travel_event.transport_url" target="_blank">Review</a>
      </td>
      <td>{{ travel_event.notes }}</td>
      <td style="padding-left: 0">
        <!--span v-if="this.onlineStatus"-->
          <span class="fa-stack">
            <router-link
              :to="{ name: 'TravelEventEdit', params: { id: `${travel_event.id}` } }"
            >
              <i
                id="travel-icon-edit"
                class="fa-solid fa-pen-to-square fa-stack-1x"
              >
              </i>
            </router-link>
            <span class="fa-stack fa-table-stack">
              <router-link
                :to="{ name: 'TravelEventDetails', params: { id: `${travel_event.id}` } }"
              >
                <i class="fa fa-eye" id="action-eye-icon"></i>
              </router-link>
            </span>
            <span class="fa-table-stack" id="action-delete-icon">
              <i
                @click="deleteTravelEvent(travel_event)"
                class="fas fa-trash-alt fa-stack-1x"
                id="travel-icon-delete"
              >
              </i>
            </span>
          </span>
      </td>
    </tr>
  </v-table>
  <br />
  <b>Online Status: {{ onlineStatus }}</b>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTravelStore } from '@/stores/travel/TravelStore'
import ConfirmDialogue from "@/components/ConfirmDialogue.vue"
import DateFormatService from "@/services/DateFormatService.js"
import dayjs from 'dayjs'

// Props
defineProps({
  travel_events: {
    type: Array,
    default: () => []
  }
})

// Composables
const travelStore = useTravelStore()
const _router = useRouter()

// Reactive data
const _inputSearchText = ref("")
const onlineStatus = ref(navigator.onLine)
const confirmDialogue = ref(null)
const statusMessage = ref("")
// Methods
const eventPassed = (e) => {
  const formatDateToday = dayjs(new Date()).format("YYYY-MM-DD")
  return e.end_date < formatDateToday ? 'event-passed' : 'event-current'
}

const deleteTravelEvent = async (travel_event) => {
  const ok = await confirmDialogue.value.show({
    title: "Delete TravelEvent from List",
    message:
      "Are you sure you want to delete " +
      travel_event.title +
      "? It cannot be undone.",
    okButton: "Delete",
  })
  
  if (ok) {
    await travelStore.deleteTravelEvent(travel_event)
    statusMessage.value =
      "Travel Event was Deleted for " +
      travel_event.title +
      "! Page will restore in 2 seconds"
    setTimeout(() => location.reload(), 2500)
  }
}

const _searchColumns = () => {
  // Method placeholder for compatibility
}

const _sortList = (_sortBy) => {
  // Method placeholder for compatibility  
}

const formatFullYearDate = (value) => {
  return DateFormatService.formatFullYearDatejs(value)
}
    //    message:
    //      "Are you sure you want to delete " +
    //      travel.title +
    //      "? It cannot be undone.",
    //    okButton: "Delete",
    //  });
    //  // If you throw an error, the method will terminate here unless you surround it wil try/catch
    //  if (ok) {
    //    this.$store.dispatch("deleteTravel", travel);
    //    this.statusMessage =
    //      "Travel was Deleted for " +
    //      travel.title +
    //      "! Page will restore in 2 seconds";
    //    setTimeout(() => location.reload(), 2500);
</script>
<style scoped>
#event-passed {
  color: #706e6e;
  font-weight: bold;
}
#event-current {
  font-weight: bold;
}
#action-eye-icon {
  top: 0.4rem;
  font-size: 18px;
}
#action-delete-icon {
  position: relative;
  top: 0.5rem;
  left: 1.75rem;
}


.fa-table-stack {
  position: relative;
  left: 2rem;
}
i {
  bottom: 0px;
  color: gray;
}
</style>

