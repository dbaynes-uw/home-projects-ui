<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div :class="{ 'event-has-passed': hasTravelEventPassed(travel_event), 'card': isEventCurrent}">
    <ul>
      <li class="li-left">
        <router-link
          :to="{ name: 'TravelEventDetails', params: { id: `${travel_event.id}`} }"
        >
        <b><span style="margin-left: -1rem">&#8226;&nbsp;</span>{{travel_event.title}}</b>
        </router-link>
      </li>
      <li class="li-left">Description: <b>{{ travel_event.description }}</b></li>
      <span v-if="travel_event.travel_event_url">
        <li class="li-left">Event Information: <b><a :href="travel_event.travel_event_url" target="_blank">Link to Event</a></b></li>
      </span>
      <span v-else>
        <li class="li-left">Event Information: <b>No Url Available</b></li>
      </span>
      <span v-if="travel_event.booking_reference">
        <li class="li-left">Booking Reference: <b>{{ travel_event.booking_reference }}</b></li>
      </span>
      <span v-else>
        <li class="li-left">Booking Reference: <b>No URL Available</b></li>
      </span>
      <li class="li-left">Transportation: <b>{{ travel_event.transport }}</b></li>
      <span v-if="travel_event.transport_url">
        <li class="li-left"><b><a :href="travel_event.transport_url" target="_blank">Transport Reference</a></b></li>
      </span>
      <span v-else>
        <li class="li-left">Transport Reference: <b>No URL Available</b></li>
      </span>
      <li class="li-left">Start: <b>{{ formatStandardDateTime(travel_event.start_date) }}</b></li>
      <li class="li-left">End: <b>{{ formatStandardDateTime(travel_event.end_date) }}</b></li>
      <li class="li-left">Notes:</li>
      <b class="li-left-none" v-for="(notes, idx) in splitList(travel_event, this.splitLength)" :key="idx">{{ notes }}</b>
    </ul>
    <span class="fa-stack">
      <i @click="deleteTravelEvent(travel_event)" class="fas fa-trash-alt fa-stack-1x">
      </i>
    </span>
  </div>
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import SplitStringService from "@/services/SplitStringService.js";
export default {
  name: 'TravelEventCard',
  props: {
    travel_event: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    ConfirmDialogue,
  },
  data() {
    return {
      splitLength: 30,
    };
  },
  methods: {
    async deleteTravelEvent(travel_event) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Travel Event from List",
        message:
          "Are you sure you want to delete " +
          travel_event.title +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteTravelEvent", travel_event);
        this.statusMessage =
          "Travel Event was Deleted for " +
          travel_event.title +
          "! Page will restore in 2 seconds";
        setTimeout(() => location.reload(), 2500);
        this.$router.push({ name: "TravelList" });
      }
    },
    hasTravelEventPassed(te) {
      var dayjs = require('dayjs')
      let formatDateToday = dayjs(new Date()).format("MM-DD-YY");
      if (DateFormatService.formatYearDatejs(te.end_date) < formatDateToday) {
        return true
      } else {
        return false
      }
    },
    isEventCurrent(te) {
      var dayjs = require('dayjs')
      let formatDateToday = dayjs(new Date()).format("MM-DD-YY");
      if (DateFormatService.formatYearDatejs(te.end_date) < formatDateToday) {
        return true
      } else {
        return false
      }
    },
    splitList(travelEventData, splitLength) {
      return SplitStringService.splitList(travelEventData.notes, splitLength) 
    },
    formatStandardDateTime(value) {
      return DateFormatService.formatStandardDateTimejs(value);
    },
    formatYearDate(value) {
      return DateFormatService.formatYearDatejs(value);
    },
  }
}
</script>

<style scoped>
</style>
