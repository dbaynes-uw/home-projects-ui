<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="trail-list">
    <table class="table-index-style">
      <tr>
        <th @click="sortList('trail_head_name')">Trail Head</th>
        <th @click="sortList('location')">Location</th>
        <th @click="sortList('distance')">Distance (Miles)</th>
        <th @click="sortList('date_last_hiked')">Date Last Hiked</th>
        <th>URL</th>
        <th>Notes</th>
        <th style="text-align: right">Actions</th>
      </tr>
      <tr v-for="trail in trails" :key="trail.id" :trail="trail">
        <td>{{ trail.trail_head_name }}</td>
        <td>{{ trail.location }}</td>
        <td>{{ trail.distance }}</td>
        <td>{{ formatStandardDate(trail.date_last_hiked) }}</td>
        <td>
          <a :href="trail.url_to_map" target="_blank">Map</a>
        </td>
        <td>{{ trail.notes }}</td>
        <td style="padding-left: 0">
          <span class="fa-stack">
            <router-link
              :to="{ name: 'TrailEdit', params: { id: `${trail.id}` } }"
            >
              <i
                class="fa-solid fa-pen-to-square fa-stack-1x"
                id="trail-icon-edit"
              ></i>
            </router-link>
            <span class="fa-stack fa-table-stack">
              <router-link
                :to="{ name: 'TrailDetails', params: { id: `${trail.id}` } }"
              >
                <i class="fa fa-eye" id="action-eye-icon"></i>
              </router-link>
            </span>
            <span class="fa-table-stack" id="action-delete-icon">
              <i
                @click="deleteTrail(trail)"
                class="fas fa-trash-alt fa-stack-1x"
              >
              </i>
            </span>
          </span>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: "TrailIndex",
  props: ["trails"],
  components: {
    ConfirmDialogue,
  },
  data() {
    return {
      description: null,
      frequency: null,
      completed: 0,
      statusMessage: "",
    };
  },
  methods: {
    searchColumns() {
      this.filteredResults = [];
      this.columnDetails = null;
      if (
        this.inputSearchText == null ||
        (this.inputSearchText != null && this.inputSearchText.length === 0)
      ) {
        this.filteredResults = [];
        this.columnDetails = null;
      } else {
        if (
          this.trails &&
          this.trails.length > 0 &&
          this.inputSearchText.length >= 2
        ) {
          this.trails.forEach((trail) => {
            const searchHasHeadName =
              trail.head_name &&
              trail.head_name
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            const searchHasLocation =
              trail.location &&
              trail.location
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            if (searchHasHeadName || searchHasLocation) {
              this.filteredResults.push(trail);
            }
          });
        }
      }
    },
    showCharacterDetails(result) {
      this.characterDetails = result;
    },
    sortList(sortBy) {
      this.sortedData = this.trails;
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
#action-eye-icon {
  top: 0.4rem;
  font-size: 18px;
}
#action-delete-icon {
  position: relative;
  top: 0.5rem;
  left: 2.3rem;
}
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
