<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Trail List</h2>
      <h2 id="status-message">
        <u>{{ this.statusMessage }}</u>
      </h2>
    </v-card-title>
    <ul>
      <li class="left">
        <button id="button-as-link">
          <router-link  :to="{ name: 'TrailCreate' }">Add Trail</router-link>
        </button>
      </li>
      <li>
        <button id="button-as-link" @click="requestIndexDetail">
          <u>Detail Index View</u>
        </button>
      </li>
    </ul> 
    <br/>
  </v-card>
  <br/>
  <div style="width: 100%">
    <div class="auto-search-container">
      <v-text-field
        clearable
        clear-icon="mdi-close"
        @click:clear="showIndex"
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
      <span v-if="searchResults == false">
        <h3 id="h3-left">No Search Results Returned</h3>
      </span>
      <span v-else>
        <span v-if="requestIndexDetailFlag == true">
          <h3 id="h3-left">Total: {{ trails.length }}</h3>
            <span class="h3-left-total-child">Double click Item Below to Edit</span>
          <div class="cards">
            <TrailCard
              v-for="trail in trails"
              :key="trail.id"
              :trail="trail"
              class="card"
              @dblclick="onDoubleClick(trail)"
            />
            <br />
          </div>
        </span>
        <span v-else>
          <trailIndex :trails="trails" />
        </span>
      </span>
    </span>
    <span v-if="filteredResults.length > 0">
      <span v-if="requestIndexDetailFlag == true">
        <h3 id="h3-left">Total: {{ filteredResults.length }}</h3>
        <span>Double click to Edit</span>
        <div class="cards">
          <TrailCard
            v-for="trail in filteredResults"
            :key="trail.id"
            :trail="trail"
            class="card"
            @dblclick="onDoubleClick(trail)"
          />
          <br />
        </div>
      </span>
      <span v-else>
        <trailIndex :trails="filteredResults" />
      </span>
    </span>
  </div>
</template>
<script>
import TrailIndex from "@/components/trails/TrailIndex.vue";
import TrailCard from "@/components/trails/TrailCard.vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: "TrailList",
  props: ["filteredResults[]"],
  components: {
    TrailCard,
    ConfirmDialogue,
    TrailIndex,
  },
  data() {
    return {
      requestIndexDetailFlag: true,
      searchResults: null,
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
    requestIndexDetail() {
      this.requestIndexDetailFlag = this.requestIndexDetailFlag == true ? false : true;
    },
    onDoubleClick(trail) {
      this.$router.push({ name: 'TrailEdit', params: { id: `${trail.id}` } });
    },
    showIndex() {
      this.filteredResults = [];
    },
    searchColumns() {
      this.searchResults = true;
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
              trail.trail_head_name &&
              trail.trail_head_name
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
            if (this.filteredResults.length > 0) {
              this.searchResults = true;
            } else {
              this.searchResults = false;
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
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
  },
};
</script>
<style scoped>
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
i {
  bottom: 0px;
  color: gray;
}
#status-message {
  text-align: center;
  color: navy;
}
</style>
