<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div>
    <h2>Trail Details</h2>
    <div class="details-top-links">
      <router-link class="details-top-link" :to="{ name: 'TrailList' }">
        Back to Trail List
      </router-link>
    </div>
    <span class="list-intro-center">Double click Item Below to Edit</span>
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
.details-top-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0 0.75rem;
}

.details-top-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  background: #f8fafc;
  color: #0f172a;
  text-decoration: none;
  font: inherit;
}

.details-top-link:hover {
  background: #e2e8f0;
}

@media (max-width: 600px) {
  .details-top-links {
    flex-direction: column;
    align-items: stretch;
  }

  .details-top-link {
    width: 100%;
  }
}
</style>
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
