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
    <div style="width: 100%">
      <div class="auto-search-container">
        <input
          type="text"
          class="np-input-search"
          v-model="inputSearchText"
          placeholder="Search"
          autocomplete="off"
          v-on:keyup="searchColumns"
        />
      </div>
    </div>
    <div class="trail-list">
      <span v-if="filteredResults.length == 0">
        <TrailIndex :trails="trails" />
      </span>
      <span v-if="filteredResults.length > 0">
        <TrailSearchResults :filteredResults="filteredResults" />
      </span>
    </div>
  </div>
</template>
<script>
import TrailIndex from "@/components/trails/TrailIndex.vue";
import TrailSearchResults from "@/components/trails/TrailSearchResults.vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: "TrailList",
  props: ["filteredResults[]"],
  components: {
    ConfirmDialogue,
    TrailIndex,
    TrailSearchResults,
  },
  data() {
    return {
      inputSearchText: "",
      filteredResults: [],
      columnDetails: null,
      sortedData: [],
      sortedbyASC: false,
      description: null,
      frequency: null,
      completed: 0,
      statusMessage: "",
    };
  },
  mounted() {
    this.sortedData = this.trails;
  },
  created() {
    this.$store.dispatch("fetchTrails");
  },
  computed: {
    trails() {
      return this.$store.state.trails;
    },
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
.table-index-style {
  font-family: arial, sans-serif;
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
