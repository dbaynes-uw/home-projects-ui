<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div>
    <h2>Trail Details</h2>
    <button id="link-as-button">
      <router-link  :to="{ name: 'TrailList' }">Back to Trail List</router-link>
    </button>
    <span class="h3-left-total-child">Double click Item Below to Edit</span>
    <br/><br/>
    <div class="card-display">
      <TrailCard
        :key="trail.id"
        :trail="trail"
        class="card"
        @dblclick="editTrail(trail)"
      />
      <br />
    </div>
  </div>
</template>

<script>
//import { ref, computed } from "vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import TrailCard from "@/components/trails/TrailCard.vue";

export default {
  props: ["id"],
  components: {
    ConfirmDialogue,
    TrailCard,
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
          trail.trail_head_name +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteTrail", trail);
        alert("Trail was Deleted for " + trail.trail_head_name);
        this.$router.push({ name: "TrailList" });
      }
    },
    editTrail(trail) {
      this.$router.push({ name: 'TrailEdit', params: { id: `${trail.id}` } });
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
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
