<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-table density="compact">
    <tr>
      <th id="background-blue" @click="sortList('course')">Course</th>
      <th id="background-blue" @click="sortList('tees_played')">Tees Played</th>
      <th id="background-blue" @click="sortList('date_played')">
        Date Played
      </th>
      <th id="background-blue">Holes Played</th>
      <th id="background-blue" @click="sortList('par')">
        Par
      </th>
      <th id="background-blue" @click="sortList(this.par)">
        Score
      </th>
      <th id="background-blue">URL to Review</th>
      <th class="td-center" id="background-blue">Actions</th>
    </tr> 
    <tr id="averages">
      <th id="background-blue" ></th>
      <th id="background-blue"></th>
      <th id="background-blue"></th>
      <th id="background-blue-right" colspan="2" >Averages:</th>
      <th id="background-blue-left">
        9 - {{ calculateAverageScore9(golfs) }}<br/>18-{{ calculateAverageScore18(golfs) }}
      </th>
      <th id="background-blue" ></th>
      <th id="background-blue"></th>
    </tr>   
    <tr v-for="(result, resultIndex) in golfs" :key="resultIndex">
      <td>{{ result.course }}</td>
      <td class="td-center" >{{ result.tees_played }}</td>
      <td class="td-center" >{{ formatFullYearDate(result.date_played) }}</td>
      <td class="td-center" >{{ determineHolesPlayed(result) }}</td>
      <td class="td-center" >{{ this.par = calculateTotalPar(result)}}</td>
      <td class="td-center" >{{ calculateTotalScore(result)}}</td>
      <td class="td-center" >
        <a :href="result.url_to_course" target="_blank">Review</a>
      </td>
      <td class="td-center">
        <span v-if="this.onlineStatus">
          <span class="fa-stack">
            <router-link
              :to="{ name: 'GolfEdit', params: { id: `${result.id}` } }"
            >
              <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
            </router-link>
          </span>
          <span class="fa-stack">
            <router-link
              :to="{ name: 'GolfDetails', params: { id: `${result.id}` } }"
            >
              <i class="fa-solid fa-eye fa-stack-1x"></i>
            </router-link>
          </span>
          <span class="fa-stack">
            <i
              @click="deleteGolf(result)"
              class="fa-solid fa-trash-alt fa-stack-1x"
            >
            </i>
          </span>
        </span>
        <span v-else>
          <router-link
            :to="{ name: 'GolfDetails', params: { id: `${result.id}` } }"
          >
            View |
          </router-link>
          <router-link
            :to="{ name: 'GolfEdit', params: { id: `${result.id}` } }"
          >
            Edit |
          </router-link>
          <span class="ok-btn" @click="deleteGolf(result)"><u>Del</u></span>
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
import GolfCalculations from "@/components/golfs/GolfCalculations.js";

export default {
  name: "GolfIndex",
  props: ["golfs"],
  components: {
    ConfirmDialogue,
  },
  data() {
    return {
      inputSearchText: "",
      onlineStatus: navigator.onLine,
      par: 0,
    };
  },
  methods: {
    showCharacterDetails(result) {
      this.characterDetails = result;
    },
    sortList(sortBy) {
      console.log("SORT IN INDEX")
      this.sortedData = this.golfs;
      if (this.sortedbyASC) {
        this.sortedData.sort((x, y) => (x[sortBy] > y[sortBy] ? -1 : 1));
        this.sortedbyASC = false;
      } else {
        this.sortedData.sort((x, y) => (x[sortBy] < y[sortBy] ? -1 : 1));
        this.sortedbyASC = true;
      }
    },
    async deleteGolf(golf) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Golf from List",
        message:
          "Are you sure you want to delete " +
          golf.title +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteGolf", golf);
        this.statusMessage =
          "Golf was Deleted for " +
          golf.title +
          "! Page will restore in 2 seconds";
        setTimeout(() => location.reload(), 2500);
      }
    },
    formatFullYearDate(value) {
      return DateFormatService.formatYearDate(value);
    },
    calculateTotalPar(golf) {
      return GolfCalculations.calculateTotalPar(golf)
    },
    calculateTotalScore(golf) {
      return GolfCalculations.calculateTotalScore(golf)
    },
    calculateAverageScore9(golfs) {
      return GolfCalculations.calculateAverageScore9(golfs)
    },
    calculateAverageScore18(golfs) {
      return GolfCalculations.calculateAverageScore18(golfs)
    },
    determineHolesPlayed(golf) {
      return GolfCalculations.determineHolesPlayed(golf)
    },
  },
};
</script>
<style scoped>
.fa-stack {
  position: relative;
  top: .5rem;
  width: 1.25rem;
}
.fa-solid {
  color: gray;
}
.td-center {
  text-align: center;
}
</style>
