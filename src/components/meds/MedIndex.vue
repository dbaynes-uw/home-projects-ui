<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h3 id="h3-left">Total: {{ meds.length }}</h3>
  <v-table density="compact">
    <tr>
      <th id="background-blue" @click="sortList('date_of_occurrence')">Date of Occcurrence</th>
      <th id="background-blue" @click="sortList('duration')">Duration</th>
      <th id="background-blue" @click="sortList('interval_days')">Days Since Last</th>
      <th id="background-blue">Hours since Last </th>
      <th id="background-blue">Minutes since Last </th>
      <th id="background-blue">Circumstances </th>
      <th class="th-center" id="background-blue">Actions</th>
    </tr>
    <tr v-for="(med, medIndex) in meds" :key="medIndex">
      <td>{{ formatStandardDateTime(med.date_of_occurrence) }} </td>
      <td>{{ med.duration }}</td>
      <td>{{ med.interval_days }} days</td>
      <td>{{ med.interval_hours }} hours</td>
      <td>{{ med.interval_minutes }} minutes</td>
      <td>
        <textarea v-if="med.circumstances" cols="30" rows="3" v-model="med.circumstances"></textarea>
      </td>
      <td class="td-center" >
        <span v-if="this.onlineStatus">
          <span class="fa-stack">
            <router-link
              :to="{ name: 'MedEdit', params: { id: `${med.id}` } }"
            >
              <i
                id="medium-icon-edit"
                class="fa-solid fa-pen-to-square fa-stack-1x"
              >
              </i>
            </router-link>
            <span class="fa-stack fa-table-stack">
              <router-link
                :to="{ name: 'MedDetails', params: { id: `${med.id}` } }"
              >
                <i id="medlist-icon-eye" class="fa fa-eye"></i>
              </router-link>
            </span>
            <span class="fa-table-stack">
              <i
                @click="deleteMed(med)"
                class="fas fa-trash-alt fa-stack-1x"
                id="medlist-icon-delete"
              >
              </i>
            </span>
          </span>
        </span>
        <span v-else>
          <router-link
            :to="{ name: 'MedDetails', params: { id: `${med.id}` } }"
          >
            View |
          </router-link>
          <router-link
            :to="{ name: 'MedEdit', params: { id: `${med.id}` } }"
          >
            Edit |
          </router-link>
          <span class="ok-btn" @click="deleteMed(med)"><u>Delete</u></span>
        </span>
      </td>
    </tr> 
  </v-table>
  <br />
  <!--b>Online Status: {{ this.onlineStatus }}</b!-->
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  name: "MedIndex",
  props: ["meds"],
  components: {
    ConfirmDialogue,
  },
  async mounted() {},
  data() {
    return {
      med: {
        id: "",
        date_of_occurrence: "",
        duration: "",
        circumstances: "",
      },
      inputSearchText: "",
      onlineStatus: navigator.onLine,
      filteredResults: [],
    };
  },
  methods: {
    showCharacterDetails(med) {
      this.characterDetails = med;
    },
    sortList(sortBy) {
      this.sortedData = this.meds;
      if (sortBy.includes('interval')){
        if (this.sortedbyASC) {
          this.sortedData.sort((x, y) => (parseInt(x[sortBy]) > parseInt(y[sortBy]) ? -1 : 1));
          this.sortedbyASC = false;
        } else {
          this.sortedData.sort((x, y) => (parseInt(x[sortBy]) < parseInt(y[sortBy]) ? -1 : 1));
          this.sortedbyASC = true;
        }
      } else {
          if (this.sortedbyASC) {
            this.sortedData.sort((x, y) => x[sortBy] > y[sortBy] ? -1 : 1);
            this.sortedbyASC = false;
          } else {
            this.sortedData.sort((x, y) => x[sortBy] < y[sortBy] ? -1 : 1);
            this.sortedbyASC = true;
          }
      }
    },
    async deleteMed(med) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Med from List",
        message:
          "Are you sure you want to delete " +
          med.date_of_occurrence +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteMed", med);
        alert("Med " + med.date_of_occurrence + " was deleted");
        this.statusMessage =
          "Med was Deleted for " +
          med.date_of_occurrence +
          "! Page will restore in 2 seconds";
          setTimeout(() => location.reload(), 2000);
      }
    },
    formatStandardDateTime(value) {
      return DateFormatService.formatStandardDateTimejs(value);
    },
  },
};
</script>
