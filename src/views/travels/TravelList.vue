<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div>
    <h2>Travel List</h2>
    <h2 id="status-message">
      <u>{{ this.statusMessage }}</u>
    </h2>
    <h2>
      <router-link :to="{ name: 'TravelCreate' }">Add Travel</router-link>
    </h2>
    <br />
    <div class="travel-list">
      <table class="table-index-style">
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Reference</th>
          <th>Notes</th>
          <th style="text-align: right">Actions</th>
        </tr>
        <tr v-for="travel in travels" :key="travel.id" :travel="travel">
          <td>{{ travel.trail_head_name }}</td>
          <td>{{ travel.description }}</td>
          <td>{{ formatStandardDate(travel.start_date) }}</td>
          <td>{{ formatStandardDate(travel.end_date) }}</td>
          <td>
            <a :href="travel.url_reference" target="_blank">Reference</a>
          </td>
          <td>{{ travel.notes }}</td>
          <td style="padding-left: 0">
            <span class="fa-stack">
              <router-link
                :to="{ name: 'TravelEdit', params: { id: `${travel.id}` } }"
              >
                <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
              </router-link>
              <span class="fa-stack fa-table-stack">
                <router-link
                  :to="{
                    name: 'TravelDetails',
                    params: { id: `${travel.id}` },
                  }"
                >
                  <i class="fa fa-eye" style="top: 0.4rem; font-size: 18px"></i>
                </router-link>
              </span>
              <span
                class="fa-table-stack"
                style="position: relative; top: 0.5rem; left: 2.3rem"
              >
                <i
                  @click="deleteTravel(travel)"
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
  name: "TravelList",
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
  created() {
    console.log("Created Store Dispatch - fetchTravels. ");
    this.$store.dispatch("fetchTravels");
  },
  computed: {
    travels() {
      console.log("Computed Store Dispatch - fetchTravels. ");
      return this.$store.state.travels;
    },
  },
  methods: {
    async deleteTravel(travel) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Travel from List",
        message:
          "Are you sure you want to delete " +
          travel.title +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteTravel", travel);
        this.statusMessage =
          "Travel was Deleted for " +
          travel.title +
          "! Page will restore in 2 seconds";
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
