<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div :class="{ 'event-has-passed': hasEventPassed(travel_event), 'card': isEventCurrent}">
    <h2>{{ travel_event.title }}</h2>
    <p id="p-custom-link-left">
      <router-link
        :to="{ name: 'TravelEventEdit', params: { id: `${travel_event.id}` } }"
      >
        Ref: {{ travel_event.description }}
      </router-link>
    </p>
    <ul>
      <span v-if="startsWithHtml(travel_event.travel_event_url)">
        <li class="li-left">Event Information: <b><a :href="travel_event.event_url" target="_blank">{{travel_event.event_url}}</a></b></li>
      </span>
      <span v-if="startsWithHtml(travel_event.booking_reference)">
        <li class="li-left">Booking Reference: <b><a :href="travel_event.booking_reference" target="_blank">Link</a></b></li>
      </span>
      <span v-if="travel_event.booking_reference && !startsWithHtml(travel_event.booking_reference)">
        <li class="li-left">Booking Reference: <b>{{ travel_event.booking_reference }}</b></li>
      </span>
      <span v-if="!travel_event.booking_reference">
        <li class="li-left">Booking Reference: <b>N/A</b></li>
      </span>
      <li class="li-left">Transportation: {{ travel_event.transport }}</li>
      <span v-if="travel_event.transport_url">
        <li class="li-left"><b><a :href="travel_event.transport_url" target="_blank">Transport Reference</a></b></li>
      </span>
      <span v-if="!travel_event.transport_url">
        <li class="li-left">Transport Reference: <b>URL Not Available</b></li>
      </span>
      <li class="li-left">Start: <b>{{ formatStandardDateTime(travel_event.start_date) }}</b></li>
      <li class="li-left">End: <b>{{ formatStandardDateTime(travel_event.end_date) }}</b></li>
      <li class="li-left">Notes:</li>
      <b class="li-left-none" v-for="(notes, idx) in 
          joinedNotes(travel_event)"
          :key="idx">{{ notes }}
        </b>
    </ul>
  </div>
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: 'TravelEventCard',
  props: {
    travel_event: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {},
  components: {
    ConfirmDialogue,
  },
  data() {
    return {
      splitLength: 30,
    };
  },
  methods: {
    async deleteTravel(travel) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Travel from List",
        message:
          "Are you sure you want to delete " +
          travel.title +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteTravel", travel);
        this.statusMessage =
          "Travel was Deleted for " +
          travel.title +
          "! Page will restore in 2 seconds";
        setTimeout(() => location.reload(), 2500);
        this.$router.push({ name: "TravelList" });
      }
    },
    startsWithHtml(event) {
      if (event.startsWith('https')) {
        return true
      } else {
        return false
      }
    },
    joinedNotes(e) {
      if (e.notes != null){ 
        return e.notes.split('\n')
      }
    },
    formatStandardDateTime(value) {
      return DateFormatService.formatStandardDateTimejs(value);
    },
    formatYearDate(value) {
      return DateFormatService.formatYearDatejs(value);
    },
    //formatStandardDateTime(value) {
    //  return DateFormatService.formatStandardDateTimejs(value);
    //},
    hasEventPassed(event) {
      var dayjs = require('dayjs')
      let formatDateTime = dayjs(new Date()).format("MM-DD-YY H:mma");
      if (DateFormatService.formatDateTimejs(event.end_date) < formatDateTime) {
        return true
      } else {
        return false
      }
    },
    isEventCurrent(t) {
      var dayjs = require('dayjs')
      let formatDateToday = dayjs(new Date()).format("MM-DD-YY");
      if (DateFormatService.formatYearDatejs(t.return_date) < formatDateToday) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
<style scoped></style>
