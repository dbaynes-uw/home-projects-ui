<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div>
    <h2>Trail List</h2>
    <h2 id="status-message">
      <u>{{ this.statusMessage }}</u>
    </h2>
    <h2>
      <router-link :to="{ name: 'TrailCreate' }">Add Trail</router-link>
    </h2>
    <br />
    <div class="trail-list">
      <table class="table-index-style">
        <tr>
          <th @click="sortList('head_name')">Trail Head</th>
          <th @click="sortList('location')">Location</th>
          <th @click="sortList('distance')">Distance (Miles)</th>
          <th @click="sortList('date_last_hiked')">Date Last Hiked</th>
          <th>URL</th>
          <th>Notes</th>
          <th style="text-align: right">Actions</th>
        </tr>
        <tr v-for="(result, resultIndex) in filteredResults" :key="resultIndex">
          <td>{{ result.head_name }}</td>
          <td>{{ result.location }}</td>
          <td>{{ result.distance }}</td>
          <td>{{ formatStandardDate(result.date_last_hiked) }}</td>
          <td>
            <a :href="result.url_to_map" target="_blank">Map</a>
          </td>
          <td>{{ result.notes }}</td>
          <td style="padding-left: 0">
            <span class="fa-stack">
              <router-link
                :to="{ name: 'TrailEdit', params: { id: `${result.id}` } }"
              >
                <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
              </router-link>
              <span class="fa-stack fa-table-stack">
                <router-link
                  :to="{ name: 'TrailDetails', params: { id: `${result.id}` } }"
                >
                  <i class="fa fa-eye" style="top: 0.4rem; font-size: 18px"></i>
                </router-link>
              </span>
              <span
                class="fa-table-stack"
                style="position: relative; top: 0.5rem; left: 2.3rem"
              >
                <i
                  @click="deleteTrail(result)"
                  class="fas fa-trash-alt fa-stack-1x"
                >
                </i>
              </span>
            </span>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: "TrailList",
  props: ["filteredResults"],
  components: {
    ConfirmDialogue,
  },
  data() {
    return {
      inputSearchText: "",
      onlineStatus: navigator.onLine,
      description: null,
      frequency: null,
      completed: 0,
      statusMessage: "",
    };
  },
  methods: {
    showCharacterDetails(result) {
      this.characterDetails = result;
    },
    sortList(sortBy) {
      this.sortedData = this.filteredResults;
      if (this.sortedbyASC) {
        this.sortedData.sort((x, y) => (x[sortBy] > y[sortBy] ? -1 : 1));
        this.sortedbyASC = false;
      } else {
        this.sortedData.sort((x, y) => (x[sortBy] < y[sortBy] ? -1 : 1));
        this.sortedbyASC = true;
      }
    },
    async deleteTrail(trail) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Trail from List",
        message:
          "Are you sure you want to delete " +
          trail.head_name +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteTrail", trail);
        this.statusMessage =
          "Trail was Deleted for " +
          trail.head_name +
          "! Page will refresh in 2 seconds";
        setTimeout(() => location.reload(), 2500);
      }
    },
    formatStandardDate(value) {
      return DateFormatService.formatStandardDate(value);
    },
  },
};
</script>
<style scoped>
.table-index-style {
  width: 100%;
  border-collapse: collapse;
}
th {
  background-color: #7ba8bd;
  text-align: left;
  padding-left: 1rem;
  padding-right: 1rem;
}
tr {
  line-height: 1.6 !important;
  border: none;
}
tr:nth-child(odd) {
  background-color: #41b88352;
  border: none !important;
}
td {
  padding-left: 1rem;
  padding-right: 1rem;
}
.eventAssigned {
  background: #e8f7f0;
}
.fa-table-stack {
  position: relative;
  left: 2rem;
}
i {
  bottom: 0px;
  color: gray;
}
tr.is-complete {
  background: #35495e;
  color: #fff;
}
#status-message {
  text-align: center;
  color: navy;
}
</style>