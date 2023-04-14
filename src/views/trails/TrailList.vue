<template>
  <div>
    <h2>Trail List</h2>
    <h2>
      <router-link :to="{ name: 'TrailCreate' }">Add Trail</router-link>
    </h2>
    <br />
    <div class="trail-list">
      <table class="table-index-style">
        <tr>
          <th>Trail Head</th>
          <th>Location</th>
          <th>Distance (Miles)</th>
          <th>Date Last Hiked</th>
          <th>Notes</th>
          <th style="text-align: right">Actions</th>
        </tr>
        <tr v-for="trail in trails" :key="trail.id" :trail="trail">
          <td>{{ trail.head_name }}</td>
          <td>{{ trail.location }}</td>
          <td>{{ trail.distance }}</td>
          <td>{{ formatStandardDate(trail.date_last_hiked) }}</td>
          <td>{{ trail.notes }}</td>
          <td style="padding-left: 0">
            <span class="fa-stack">
              <router-link
                :to="{ name: 'TrailEdit', params: { id: `${trail.id}` } }"
              >
                <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
              </router-link>
              <span class="fa-stack fa-table-stack">
                <router-link
                  :to="{ name: 'TrailDetails', params: { id: `${trail.id}` } }"
                >
                  <i class="fa fa-eye" style="top: 0.4rem; font-size: 18px"></i>
                </router-link>
              </span>
              <span
                class="fa-table-stack"
                style="position: relative; top: 0.5rem; left: 2.3rem"
              >
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
  </div>
</template>
<script>
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: "TrailList",
  components: {},
  data() {
    return {
      description: null,
      frequency: null,
      completed: 0,
    };
  },
  created() {
    console.log("Created Store Dispatch - fetchTrails. ");
    this.$store.dispatch("fetchTrails");
  },
  computed: {
    trails() {
      console.log("Computed Store Dispatch - fetchTrails. ");
      return this.$store.state.trails;
    },
  },
  methods: {
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
</style>
