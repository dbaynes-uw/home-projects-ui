<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div>
    <h3>Travel Details</h3>
    <div class="legend">
      <span>Double click to mark as complete.</span>
      <span><span class="incomplete-box"></span> = Incomplete</span>
      <span><span class="complete-box"></span> = Complete</span>
    </div>
    <br />
    <div v-if="travel" class="event" id="center-align">
      <h1>
        <b>{{ travel.title }}</b>
      </h1>
      <ul class="ul-left">
        <li>
          <b>{{ travel.description }}</b>
        </li>
        <li v-if="travel.distance">
          Distance:
          <b>{{ travel.distance }}</b>
        </li>
        <li v-if="travel.start_date">
          Travel Start Date:
          <b>{{ formatStandardDate(travel.start_date) }}</b>
        </li>
        <li v-if="travel.start_date">
          Travel End Date:
          <b>{{ formatStandardDate(travel.end_date) }}</b>
        </li>
        <li v-if="travel.url_reference">
          URL Reference:
          <a :href="travel.url_reference" target="_blank">Click</a>
        </li>
        <li>
          Notes:
          <b>{{ travel.notes }}</b>
        </li>
        <li>
          Date Created:
          <b>{{ formatStandardDate(travel.created_at) }}</b>
        </li>
      </ul>
      <br />
      <router-link :to="{ name: 'TravelList' }">
        <i class="fa-solid fa-backward fa-stack-1x"></i>
      </router-link>
      <span class="fa-stack">
        <router-link
          :to="{ name: 'TravelEdit', params: { id: `${travel.id}` } }"
        >
          <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
        </router-link>
      </span>
      <span class="fa-stack">
        <i @click="deleteTravel(travel)" class="fas fa-trash-alt fa-stack-1x" />
      </span>
      <br />
      <router-link :to="{ name: 'TravelList' }">
        <i class="fa-solid fa-backward fa-stack-1x"></i>
      </router-link>
    </div>
  </div>
</template>

<script>
//import { ref, computed } from "vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  props: ["id"],
  components: {
    ConfirmDialogue,
  },
  data() {
    return {
      updatedTravel: null,
    };
  },
  methods: {
    async deleteTravel(travel) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Travel",
        message:
          "Are you sure you want to delete " +
          travel.title +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteTravel", travel);
        alert("Travel was Deleted for " + travel.title);
        this.$router.push({ name: "TravelList" });
      }
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDate(value);
    },
  },
  created() {
    this.$store.dispatch("fetchTravel", this.id);
  },
  computed: {
    travel() {
      return this.$store.state.travel;
    },
  },
};
</script>
<style scoped>
#align-right {
  text-align: center;
}
.right-align {
  text-align: right;
}
</style>
