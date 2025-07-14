<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div>  
    <GlucoseReadingSummary :glucose_readings="glucose_readings" />
    <br/>
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
import { ref } from "vue";
import GlucoseReadingSummary from "@/components/glucose_readings/GlucoseReadingSummary.vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";

export default {
  name: "GlucoseReadingIndex",
  props: ["glucose_readings"],
  components: {
    ConfirmDialogue,
    GlucoseReadingSummary,
  },
  setup(props) {
    const confirmDialogue = ref(null); // Create a reference for the ConfirmDialogue component
    const inputSearchText = ref("");
    const onlineStatus = ref(navigator.onLine);
    const sortedData = ref([]);
    const sortedbyASC = ref(true);
    const statusMessage = ref("");

    // Average reading for all readings
    //const averageReading = computed(() => {
    //  if (props.glucose_readings.length === 0) return 0; // Handle empty list
    //  const total = props.glucose_readings.reduce(
    //    (sum, reading) => sum + reading.reading,
    //    0
    //  );
    //  return (total / props.glucose_readings.length).toFixed(2); // Calculate average and format to 2 decimal places
    //});
//
    //// Helper function to calculate averages by days
    //const averageReadingsByDays = (days) => {
    //  if (props.glucose_readings.length === 0) return {}; // Handle empty list
//
    //  const daysAgo = new Date();
    //  daysAgo.setDate(daysAgo.getDate() - days);
//
    //  const recentReadings = props.glucose_readings.filter((reading) => {
    //    const readingDate = new Date(reading.reading_date);
    //    return readingDate >= daysAgo;
    //  });
//
    //  const groupedReadings = recentReadings.reduce((acc, reading) => {
    //    const type = reading.reading_type;
    //    if (!acc[type]) {
    //      acc[type] = { total: 0, count: 0 };
    //    }
    //    acc[type].total += reading.reading;
    //    acc[type].count += 1;
    //    return acc;
    //  }, {});
//
    //  const averages = {};
    //  for (const type in groupedReadings) {
    //    averages[type] = (
    //      groupedReadings[type].total / groupedReadings[type].count
    //    ).toFixed(2);
    //  }
//
    //  const sortedAverages = Object.keys(averages)
    //    .sort()
    //    .reduce((sortedObj, key) => {
    //      sortedObj[key] = averages[key];
    //      return sortedObj;
    //    }, {});
//
    //  return sortedAverages;
    //};
//
    //// Computed properties for averages
    //const averageReadingsLast30daysByType = computed(() =>
    //  averageReadingsByDays(30)
    //);
    //const averageReadingsLast90daysByType = computed(() =>
    //  averageReadingsByDays(90)
    //);
    //const averageReadingsByType = computed(() => averageReadingsByDays(0)); // All readings
//
    //// Helper method to determine if the average is within range
    //const isWithinRange = (type, average) => {
    //  const avg = parseFloat(average); // Convert average to a number
    //  if (type === "AM-Fasting") {
    //    if (avg >= 70 && avg <= 99) {
    //      return "green"; // Normal fasting range
    //    } else if (avg >= 100 && avg <= 125) {
    //      return "blue"; // Elevated fasting range
    //    } else {
    //      return "red"; // Fasting 126+ Type 2 Diabetes
    //    }
    //  } else if (type === "Post-Meal") {
    //    if (avg >= 80 && avg <= 139) {
    //      return "green"; // Normal post-meal range
    //    } else if (avg >= 140 && avg <= 200) {
    //      return "blue"; // Elevated fasting range
    //    } else {
    //      return "red"; // Nonfasting 200+ Type 2 Diabetes
    //    }
    //  } else {
    //    return "black"; // Default for unknown types
    //  }
    //};

    // Sort list by column
    const sortList = (sortBy) => {
      sortedData.value = props.glucose_readings;
      if (sortedbyASC.value) {
        sortedData.value.sort((x, y) => (x[sortBy] > y[sortBy] ? -1 : 1));
        sortedbyASC.value = false;
      } else {
        sortedData.value.sort((x, y) => (x[sortBy] < y[sortBy] ? -1 : 1));
        sortedbyASC.value = true;
      }
    };

    // Delete glucose reading
    const deleteGlucoseReading = async (glucose_reading) => {
      const ok = await confirmDialogue.value.show({
        title: "Delete GlucoseReading from List",
        message:
          "Are you sure you want to delete reading at " +
          glucose_reading.reading_date +
          "? It cannot be undone.",
        okButton: "Delete",
      });
      if (ok) {
        props.$store.dispatch("deleteGlucoseReading", glucose_reading);
        statusMessage.value =
          "GlucoseReading was Deleted for " +
          glucose_reading.reading_date +
          "! Page will restore in 2 seconds";
        setTimeout(() => location.reload(), 2000);
      }
    };

    // Format date
    const formatStandardDateTime = (value) =>
      DateFormatService.formatStandardDateTimejs(value);

    return {
      inputSearchText,
      onlineStatus,
      sortedData,
      sortedbyASC,
      statusMessage,
      sortList,
      deleteGlucoseReading,
      formatStandardDateTime,
    };
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
