<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div>
    <h3>Trail Details</h3>
    <div class="legend">
      <span>Double click to mark as complete.</span>
      <span><span class="incomplete-box"></span> = Incomplete</span>
      <span><span class="complete-box"></span> = Complete</span>
    </div>
    <br />
    <div v-if="trail" class="event" id="center-align">
      <h1>
        <b>{{ trail.head_name }}</b>
      </h1>
      <ul class="ul-left">
        <li>
          <b>{{ trail.location }}</b>
        </li>
        <li>
          <b>{{ trail.distance }}</b>
        </li>
        <li v-if="trail.date_last_hiked">
          Date Last Hiked:
          <b>{{ formatStandardDate(trail.date_last_hiked) }}</b>
        </li>
        <li v-if="trail.url_to_map">
          URL:
          <a :href="trail.url_to_map" target="_blank">Click</a>
        </li>
        <li>
          Notes:
          <b>{{ trail.notes }}</b>
        </li>
        <li>
          Date Created:
          <b>{{ formatStandardDate(trail.created_at) }}</b>
        </li>
      </ul>
      <br />
      <router-link :to="{ name: 'TrailList' }">
        <i class="fa-solid fa-backward fa-stack-1x"></i>
      </router-link>
      <span class="fa-stack">
        <router-link :to="{ name: 'TrailEdit', params: { id: `${trail.id}` } }">
          <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
        </router-link>
      </span>
      <span class="fa-stack">
        <i @click="deleteTrail(trail)" class="fas fa-trash-alt fa-stack-1x">
        </i>
      </span>
      <br />
      <router-link :to="{ name: 'TrailList' }">
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
      updatedTrail: null,
    };
  },
  methods: {
    async deleteTrail(trail) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Trail",
        message:
          "Are you sure you want to delete " +
          trail.head_name +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteTrail", trail);
        alert("Trail was Deleted for " + trail.head_name);
        this.$router.push({ name: "TrailList" });
      }
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDate(value);
    },
  },
  created() {
    this.$store.dispatch("fetchTrail", this.id);
  },
  computed: {
    trail() {
      return this.$store.state.trail;
    },
  },
};
</script>
<style scoped>
ul {
  list-style-type: none;
}
#align-right {
  text-align: center;
}
.right-align {
  text-align: right;
}
</style>
