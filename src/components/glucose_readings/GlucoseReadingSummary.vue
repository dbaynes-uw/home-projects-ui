<template>
  <div id="stats" class="h3-left-total-child">
    <h3 id="h3-left"><p id="p-bold">Total Glucose Readings: {{ totalReadings }}</p></h3>
    <br />
  <!--span class="h3-left-total-child">
    <p id="p-bold">Average Glucose Reading: {{ averageReading }}</p>
  </!--span-->
  </div>
  <div id="stats" class="h3-left-total-child">
    <h3 id="h3-left-subheading">Readings Color Code:</h3>
    <h3 id="h3-left" class="text-green">Fasting: Green Good 70-99 mg/dl</h3> 
    <h3 id="h3-left" class="text-blue">Fasting: Blue Prediabetes 100-125 mg/dl</h3>
    <h3 id="h3-left" class="text-red">Fasting: Red Type 2 Diabetes</h3>
    <br/>
    <h3 id="h3-left" class="text-green">Post-Meal: Green Good 80-140 mg/dl</h3> 
    <h3 id="h3-left" class="text-blue">Post-Meal: Blue Prediabetes 140-200 mg/dl</h3>
    <h3 id="h3-left" class="text-red">Post-Meal: Red Type 2 Diabetes 200+ mg/dl</h3>
    <br/>

    <h3 id="h3-left-subheading">Averages by Fasting Type: (Total: {{ totalReadings }})</h3>
    <ul
      v-for="(averageObj, type) in averageReadingsByType"
      :key="type"
      :style="{ color: isWithinRange(type, averageObj.average) }"
    >
      <li>
        <p id="p-bold-indent">- {{ type }} Average: {{ averageObj.average }} mg/dl ({{ averageObj.count }})</p>
      </li>
    </ul>
    <br />
    <h3 id="h3-left-subheading">Averages Last 30 Days by Fasting Type (Total: {{ totalReadingsLast30days }})</h3>
    <ul
      v-for="(averageObj, type) in averageReadingsLast30daysByType"
      :key="type"
      :style="{ color: isWithinRange(type, averageObj.average) }"
   >
      <li>
        <p id="p-bold-indent">
          - {{ type }} Average: {{ averageObj.average }} mg/dl ({{ averageObj.count }})
        </p>
      </li>
    </ul>
    <br/>
    <h3 id="h3-left-subheading">Averages Last 60 Days by Fasting Type (Total: {{ totalReadingsLast60days }})</h3>
    <ul
      v-for="(averageObj, type) in averageReadingsLast60daysByType"
      :key="type"
      :style="{ color: isWithinRange(type, averageObj.average) }"
   >
      <li>
        <p id="p-bold-indent">
          - {{ type }} Average: {{ averageObj.average }} mg/dl ({{ averageObj.count }})
        </p>
      </li>
    </ul>
    <br />
    <h3 id="h3-left-subheading">
      Averages Last 90 Days by Fasting Type (Total: {{ totalReadingsLast90days }})
    </h3>
    <ul
      v-for="(averageObj, type) in averageReadingsLast90daysByType"
      :key="type"
      :style="{ color: isWithinRange(type, averageObj.average) }"
    >
      <li>
        <p id="p-bold-indent">
          - {{ type }} Average: {{ averageObj.average }} mg/dl ({{ averageObj.count }})
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  name: "GlucoseReadingSummary",
  props: ["glucose_readings"],
  setup(props) {
    const totalReadings = computed(() => props.glucose_readings.length);
    const totalReadingsLast30days = computed(() => {
      return Object.values(averageReadingsLast30daysByType.value)
        .reduce((sum, obj) => sum + (obj.count || 0), 0);
    });
    const totalReadingsLast60days = computed(() => {
      return Object.values(averageReadingsLast60daysByType.value)
        .reduce((sum, obj) => sum + (obj.count || 0), 0);
    });
    const totalReadingsLast90days = computed(() => {
      return Object.values(averageReadingsLast90daysByType.value)
        .reduce((sum, obj) => sum + (obj.count || 0), 0);
    });
    const averageReadingsByDays = (days) => {
      if (props.glucose_readings.length === 0) return {};
    
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);
      const recentReadings = props.glucose_readings.filter((reading) => {
        const readingDate = new Date(reading.reading_date);
        return readingDate >= daysAgo;
      });
    
      const groupedReadings = recentReadings.reduce((acc, reading) => {
        const type = reading.reading_type;
        if (!acc[type]) {
          acc[type] = { total: 0, count: 0 };
        }
        acc[type].total += reading.reading;
        acc[type].count += 1;
        return acc;
      }, {});
    
      const averages = {};
      for (const type in groupedReadings) {
        averages[type] = {
          average: (groupedReadings[type].total / groupedReadings[type].count).toFixed(2),
          count: groupedReadings[type].count
        };
      }
    
      const sortedAverages = Object.keys(averages)
        .sort()
        .reduce((sortedObj, key) => {
          sortedObj[key] = averages[key];
          return sortedObj;
        }, {});
      
      return sortedAverages;
    };
    const averageReadingsByType = computed(() => averageReadingsByDays(365)); // All readings
    const averageReadingsLast30daysByType = computed(() =>
      averageReadingsByDays(30)
    );
    const averageReadingsLast60daysByType = computed(() =>
      averageReadingsByDays(60)
    );
    const averageReadingsLast90daysByType = computed(() =>
      averageReadingsByDays(90)
    );
    const isWithinRange = (type, average) => {
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
    };

    return {
      totalReadings,
      averageReadingsByType,
      averageReadingsLast30daysByType,
      averageReadingsLast60daysByType,
      averageReadingsLast90daysByType,
      totalReadingsLast30days,
      totalReadingsLast60days,
      totalReadingsLast90days,
      isWithinRange,
    };
  },
};
</script>

<style scoped>
#p-bold {
  text-align: left;
  font-weight: bold;
}
#p-bold-indent {
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
#h3-left-subheading {
  font-size: 1.25rem;
  text-align: left;
  font-weight: bold;
  margin-left: 20px;
}
</style>