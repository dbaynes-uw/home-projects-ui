<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <!--Index Detail Flag: {{ this.RequestDetailIndexFlag }}-->
  <v-table density="compact">
    <tr>
      <th id="background-blue" @click="sortList('description')">Description</th>
      <th id="background-blue" @click="sortList('frequency')">Frequency</th>
      <th id="background-blue" @click="sortList('action_date')">Action Date</th>
      <th id="background-blue" @click="sortList('action_completed_date')">
        Completed Date
      </th>
      <th id="background-blue" @click="sortList('assigned')">Assigned</th>
      <th id="background-blue">Status</th>
      <th id="background-blue">Action</th>
    </tr>
    <tr v-for="(result, resultIndex) in events" :key="resultIndex">
      <td>{{ result.description }}</td>
      <td>Every {{ result.frequency }} Days</td>
      <td>{{ formatFullYearDate(result.action_date) }}</td>
      <td>{{ formatFullYearDate(result.action_completed_date) }}</td>
      <td>{{ result.assigned }}</td>
      <td>{{ result.action_active == true ? "Active" : "Not Active" }}</td>
      <td>
        <span v-if="this.onlineStatus">
          <span class="fa-stack">
            <router-link
              :to="{ name: 'EventEdit', params: { id: `${result.id}` } }"
            >
              <i
                id="event-icon-edit"
                class="fa-solid fa-pen-to-square fa-stack-1x"
              >
              </i>
            </router-link>
            <span class="fa-stack fa-table-stack">
              <router-link
                :to="{
                  name: 'EventDetails',
                  params: { id: `${result.id}` },
                }"
              >
                <i id="event-icon-eye" class="fa fa-eye"></i>
              </router-link>
            </span>
            <span class="fa-table-stack">
              <i
                @click="deleteEvent(result)"
                class="fas fa-trash-alt fa-stack-1x"
                id="event-icon-delete"
              >
              </i>
            </span>
          </span>
        </span>
        <span v-else>
          <router-link
            :to="{ name: 'EventDetails', params: { id: `${result.id}` } }"
          >
            View |
          </router-link>
          <router-link
            :to="{ name: 'EventEdit', params: { id: `${result.id}` } }"
          >
            Edit |
          </router-link>
          <span class="ok-btn" @click="deleteEvent(result)"><u>Del</u></span>
        </span>
      </td>
    </tr>
  </v-table>
  <br />
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: "EventIndex",
  props: ["events", "requestIndexDetailFlag"],
  components: {
    ConfirmDialogue,
  },
  data() {
    return {
      inputSearchText: "",
      onlineStatus: navigator.onLine,
      //statusMessage: "",
    };
  },
  methods: {
    searchTitles() {
      this.filteredResult = [];
      this.titleDetails = null;
      if (
        this.inputSearchText == null ||
        (this.inputSearchText != null && this.inputSearchText.length === 0)
      ) {
        this.filteredResult = [];
        this.titleDetails = null;
      } else {
        if (
          this.events &&
          this.events.length > 0 &&
          this.inputSearchText.length >= 2
        ) {
          this.events.forEach((event) => {
            const searchHasTitle =
              event.title &&
              event.title
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            const searchHasAuthor =
              event.author &&
              event.author
                .toLowerCase()
                .includes(this.inputSearchText.toLowerCase());
            if (searchHasTitle || searchHasAuthor) {
              this.filteredResult.push(event);
            }
          });
        }
      }
    },
    showCharacterDetails(result) {
      this.characterDetails = result;
    },
    sortList(sortBy) {
      this.sortedData = this.events;
      console.log("SORTLIST - sortedData: ", this.sortedData);
      console.log("SORTLIST: ", sortBy);
      console.log("SORTLIST - sortedbyASC: ", this.sortedbyASC);
      if (this.sortedbyASC) {
        this.sortedData.sort((x, y) => (x[sortBy] > y[sortBy] ? -1 : 1));
        this.sortedbyASC = false;
      } else {
        this.sortedData.sort((x, y) => (x[sortBy] < y[sortBy] ? -1 : 1));
        this.sortedbyASC = true;
      }
    },
    async deleteEvent(event) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Event from List",
        message:
          "Are you sure you want to delete " +
          event.title +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteEvent", event);
        this.statusMessage =
          "Event was Deleted for " +
          event.title +
          "! Page will restore in 2 seconds";
        setTimeout(() => location.reload(), 2500);
      }
    },
    formatFullYearDate(value) {
      return DateFormatService.formatFullYearDate(value);
    },
  },
};
</script>
