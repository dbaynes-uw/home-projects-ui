<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h3 id="h3-left"><p id="p-bold">Total Glucose Readings: {{ glucose_readings.length }}</p></h3>
  <!--span class="h3-left-total-child">
    <p id="p-bold">Average Glucose Reading: {{ averageReading }}</p>
  </!--span-->
  <br/>
  <div class="h3-left-total-child">
    <h3 id="h3-left">Readings Color Code:</h3>
    <h3 id="h3-left" class="text-green">Fasting: Green Good 70-99 mg/dl</h3> 
    <h3 id="h3-left" class="text-blue">Fasting: Blue Prediabetes 100-125 mg/dl</h3>
    <h3 id="h3-left" class="text-red">Fasting: Red Type 2 Diabetes</h3>
    <br/>
    <h3 id="h3-left" class="text-green">Post-Meal: Green Good 80-140 mg/dl</h3> 
    <h3 id="h3-left" class="text-blue">Post-Meal: Blue Prediabetes 140-200 mg/dl</h3>
     <h3 id="h3-left" class="text-red">Post-Meal: Red Type 2 Diabetes 200+ mg/dl</h3>
    
    <h3 id="h3-left">Averages by Fastinging Type:</h3>
    <ul
        v-for="(average, type) in averageReadingsByType()"
        :key="type"
        :style="{ color: isWithinRange(type, average) }"
      >
        <li>
          <p id="p-bold-indent">- {{ type }} Average: {{ average }} mg/dl</p>
        </li>
    </ul>
  </div> 
  <br/><br/>
  <v-table density="compact">
    <tr>
      <th id="background-blue" @click="sortList('reading_date')">Date</th>
      <th id="background-blue" @click="sortList('reading')">Reading</th>
      <th id="background-blue" @click="sortList('reading_type')">Reading Type</th>
      <th id="background-blue" @click="sortList('status')">Result</th>
      <th id="background-blue">Notes</th>

      <th class="th-center" id="background-blue">Actions</th>
    </tr>
    <tr v-for="(result, resultIndex) in glucose_readings" :key="resultIndex">
      <td class="td-center">{{ formatStandardDateTime(result.reading_date) }}</td>
      <td>{{ result.reading }} mg/dl</td>
      <td>{{ result.reading_type }}</td>
      <td>{{ result.status }}</td>
      <td>{{ result.notes }}</td>
       <td class="td-center" >
        <span v-if="this.onlineStatus">
          <span class="fa-stack" style="text-align: center">
            <router-link
              :to="{ name: 'GlucoseReadingEdit', params: { id: `${result.id}` } }"
            >
              <i
                id="medium-icon-edit"
                class="fa-solid fa-pen-to-square fa-stack-1x"
              >
              </i>
            </router-link>
            <span class="fa-stack fa-table-stack">
              <router-link
                :to="{ name: 'GlucoseReadingDetails', params: { id: `${result.id}` } }"
              >
                <i id="booklist-icon-eye" class="fa fa-eye"></i>
              </router-link>
            </span>
            <span class="fa-table-stack">
              <i
                @click="deleteGlucoseReading(result)"
                class="fas fa-trash-alt fa-stack-1x"
                id="booklist-icon-delete"
              >
              </i>
            </span>
          </span>
        </span>
        <span v-else>
          <router-link
            :to="{ name: 'GlucoseReadingDetails', params: { id: `${result.id}` } }"
          >
            View |
          </router-link>
          <router-link
            :to="{ name: 'GlucoseReadingEdit', params: { id: `${result.id}` } }"
          >
            Edit |
          </router-link>
          <span class="ok-btn" @click="deleteGlucoseReading(result)"><u>Delete</u></span>
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
  name: "GlucoseReadingIndex",
  props: ["glucose_readings"],
  components: {
    ConfirmDialogue,
  },
  data() {
    return {
      inputSearchText: "",
      onlineStatus: navigator.onLine,
      filteredResults: [],
    };
  },
  methods: {
    averageReading() {
      if (this.glucose_readings.length === 0) return 0; // Handle empty list
      const total = this.glucose_readings.reduce(
        (sum, reading) => sum + reading.reading,
        0
      );
      return (total / this.glucose_readings.length).toFixed(2); // Calculate average and format to 2 decimal places
    },
    averageReadingsByType() {
      if (this.glucose_readings.length === 0) return {}; // Handle empty list

      const groupedReadings = this.glucose_readings.reduce((acc, reading) => {
        const type = reading.reading_type;
        if (!acc[type]) {
          acc[type] = { total: 0, count: 0 };
        }
        acc[type].total += reading.reading;
        acc[type].count += 1;
        return acc;
      }, {});

      // Calculate averages for each type
      const averages = {};
      for (const type in groupedReadings) {
        averages[type] = (groupedReadings[type].total / groupedReadings[type].count).toFixed(2);
      }
        // Sort the keys alphabetically and return a sorted object
      const sortedAverages = Object.keys(averages)
        .sort() // Sort keys alphabetically
        .reduce((sortedObj, key) => {
          sortedObj[key] = averages[key];
          return sortedObj;
      }, {});
      // Return the sorted averages object
      return sortedAverages;
    },
    isWithinRange(type, average) {
      const avg = parseFloat(average); // Convert average to a number
      if (type === "AM-Fasting") {
        if (avg >= 70 && avg <= 99) {
          return "green"; // Normal fasting range
        } else if (avg >= 100 && avg <= 125) {
          return "blue"; // Elevated fasting range
        } else {
          return "red"; // Fasting 126+ Type 2 Diabetes
        }
      } else if (type === "Post-Meal") {
        if (avg >= 80 && avg <= 139) {
          return "green"; // Normal post-meal range
        } else if (avg >= 140 && avg <= 200) {
          return "blue"; // Elevated fasting range          
        } else {
          return "red"; // Nonfasting 200+ Type 2 Diabetes
        }
      } else {
        return "black"; // Default for unknown types
      }
    },
    sortList(sortBy) {
      this.sortedData = this.glucose_readings;
      if (this.sortedbyASC) {
        this.sortedData.sort((x, y) => (x[sortBy] > y[sortBy] ? -1 : 1));
        this.sortedbyASC = false;
      } else {
        this.sortedData.sort((x, y) => (x[sortBy] < y[sortBy] ? -1 : 1));
        this.sortedbyASC = true;
      }
    },
    async deleteGlucoseReading(glucose_reading) {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete GlucoseReading from List",
        message:
          "Are you sure you want to delete readint at " +
          glucose_reading.reading_date +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        this.$store.dispatch("deleteGlucoseReading", glucose_reading);
        this.statusMessage =
          "GlucoseReading was Deleted for " +
          glucose_reading.reading_date +
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
<style scoped>
#p-bold{
  text-align: left;
  font-weight: bold;
}
#h3-left-indent{
  text-align: left;
  margin-left: 20px;
}
#p-bold-indent{
  font-size: 1.2rem;
  text-align: left;
  font-weight: bold;
  margin-left: 20px;
}
.text-green {
  color: #0a5a36 !important;
  font-weight: bold;
}
.text-blue {
  color: #0000ff !important;
}
.text-red {
  color: #e31b1b !important;
  font-weight: bold;
}
</style>
