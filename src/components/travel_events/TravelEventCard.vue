<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div :class="{ 'event-has-passed': hasEventPassed(travel), 'card': isEventCurrent}">
    <p id="p-custom-link">
      <router-link
        :to="{ name: 'TravelDetails', params: { id: `${travel.id}` } }"
      >
        {{ travel.description }}
      </router-link>
    </p>
    <ul>
      <span v-if="travel.description">
        <li class="li-left">Title: <b>{{ travel.description }}</b></li>
      </span>
      <li class="li-left">Notes:</li>
      <b class="li-left-none" v-for="(notes, idx) in splitList(travel, this.splitLength)" :key="idx">{{ notes }}</b>
    </ul>
    <p id="p-custom-link-1rem">
      <router-link
        :to="{ name: 'TravelEventCreate', params: { id: `${travel.id}` } }"
      >
        Add a Travel Event for {{ travel.title }}
      </router-link>
    </p>
    <br/>
    <span class="fa-stack">
      <router-link :to="{ name: 'TravelEdit', params: { id: `${travel.id}` } }">
        <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
      </router-link>
    </span>
    <span>
      <router-link :to="{ name: 'TravelDetails', params: { id: `${travel.id}` } }">
        <i class="fa-solid fa-eye fa-stack-1x"></i>
      </router-link>
    </span>
    <span class="fa-stack">
      <i @click="deleteTravel(travel)" class="fas fa-trash-alt fa-stack-1x">
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
    travel: {
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
    splitList(travelData, splitLength) {
      return SplitStringService.splitList(travelData.notes, splitLength) 
    },
    formatStandardDateTime(value) {
      return DateFormatService.formatStandardDateTimejs(value);
    },
    formatYearDate(value) {
      return DateFormatService.formatYearDatejs(value);
    },
    hasEventPassed(t) {
      var dayjs = require('dayjs')
      let formatDateToday = dayjs(new Date()).format("MM-DD-YY");
      if (DateFormatService.formatYearDatejs(t.return_date) < formatDateToday) {
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
