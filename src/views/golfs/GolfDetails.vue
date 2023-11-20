<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div>
    <h1>Golf Details</h1>
    <br />
    <div v-if="golf" class="event" id="center-align">
      <h3>
        <b>{{ golf.title }}</b>
      </h3>
      <ul class="ul-left">
        <li>
          Author:
          <b>{{ golf.author }}</b>
        </li>
        <li v-if="golf.date_written">
          Date Golf Played:
          <b>{{ formatStandardDate(golf.date_written) }}</b>
        </li>
        <li v-if="golf.date_read">
          Date Golf Read:
          <b>{{ formatStandardDate(golf.date_read) }}</b>
        </li>
        <li v-if="golf.url_to_review">
          URL to Review:
          <a :href="golf.url_to_review" target="_blank">Click</a>
        </li>
        <li>
          Notes:
          <b>{{ golf.notes }}</b>
        </li>
        <li>
          Date Entered:
          <b>{{ formatStandardDate(golf.created_at) }}</b>
        </li>
      </ul>
      <br />
      <router-link :to="{ name: 'GolfList' }">
        <i class="fa-solid fa-backward fa-stack-1x"></i>
      </router-link>
      <span class="fa-stack">
        <router-link :to="{ name: 'GolfEdit', params: { id: `${golf.id}` } }">
          <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
        </router-link>
      </span>
      <span class="fa-stack">
        <i @click="deleteGolf(golf)" class="fas fa-trash-alt fa-stack-1x"></i>
      </span>
      <br />
      <router-link :to="{ name: 'GolfList' }">
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
      updatedGolf: null,
    };
  },
  methods: {
    async deleteGolf(golf) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Golf",
        message:
          "Are you sure you want to delete " +
          golf.title +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteGolf", golf);
        alert("Golf was Deleted for " + golf.title);
        this.$router.push({ name: "GolfList" });
      }
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDate(value);
    },
  },
  created() {
    this.$store.dispatch("fetchGolf", this.id);
  },
  computed: {
    golf() {
      return this.$store.state.golf;
    },
  },
};
</script>
<style scoped>
.event {
  font-size: 1.5rem;
}
#align-right {
  text-align: center;
}
body {
  font-size: 1.6rem;
}
.right-align {
  text-align: right;
}
</style>
