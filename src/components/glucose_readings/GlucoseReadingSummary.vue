<template>
  <div id="stats" class="h3-left-total-child">
    <h3 id="h3-left-heading"><p id="p-bold">Total Glucose Readings: {{ totalReadings }}</p></h3>
    <br />
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
    <h3 id="h3-left-heading">
      Averages by Fasting Type:
      <br/>
      Total Readings {{ totalReadings }} from 
      <span v-if="startDateAll && endDateAll">({{ startDateAll }} to {{ endDateAll }})</span>
    </h3>
    <ul
      v-for="(averageObj, type) in averageReadingsByType"
      :key="type"
      :style="{ color: isWithinRange(type, averageObj.average) }"
    >
      <li>
        <p id="h3-left-subheading">* {{ type }} Average: {{ averageObj.average }} mg/dl ({{ averageObj.count }})</p>
      </li>
    </ul>
    <br />
    <h3 id="h3-left-subheading-green">* AM-Fasting Normal: {{ amFastingNormal }}</h3>
    <h3 id="h3-left-subheading-blue">* AM-Fasting Prediabetes: {{ amFastingPrediabetes }}</h3>
    <h3 id="h3-left-subheading-red">* AM-Fasting Diabetes: {{ amFastingDiabetes }}</h3>
    <br />
    <h3 id="h3-left-subheading-green">* Post-Meal Normal: {{ postMealNormal }}</h3>
    <h3 id="h3-left-subheading-blue">* Post-Meal Prediabetes: {{ postMealPrediabetes }}</h3>
    <h3 id="h3-left-subheading-red">* Post-Meal Diabetes: {{ postMealDiabetes }}</h3>
    <br />
    <h3 id="h3-left-heading">Averages Last 30 Days by Fasting Type (Total: {{ totalReadingsLast30days }})</h3>
    <ul
      v-for="(averageObj, type) in averageReadingsLast30daysByType"
      :key="type"
      :style="{ color: isWithinRange(type, averageObj.average) }"
   >
      <li>
        <p id="h3-left-subheading">
          * {{ type }} Average: {{ averageObj.average }} mg/dl ({{ averageObj.count }})
        </p>
      </li>
    </ul>
    <br /> 
    <h3 id="h3-left-subheading-green">
      * AM-Fasting Normal (Last 30d): {{ amFastingNormal30 }}
    </h3>
    <h3 id="h3-left-subheading-blue">
      * AM-Fasting Prediabetes (Last 30d): {{ amFastingPrediabetes30 }}
    </h3>
    <h3 id="h3-left-subheading-red">
      * AM-Fasting Diabetes (Last 30d): {{ amFastingDiabetes30 }}
    </h3>
    <br />
    <h3 id="h3-left-subheading-green">
      * Post-Meal Normal (Last 30d): {{ postMealNormal30 }}
    </h3>
    <h3 id="h3-left-subheading-blue">
      * Post-Meal Prediabetes (Last 30d): {{ postMealPrediabetes30 }}
    </h3>
    <h3 id="h3-left-subheading-red">
      * Post-Meal Diabetes (Last 30d): {{ postMealDiabetes30 }}
    </h3>
    <br/>
    <h3 id="h3-left-subheading">Averages Last 60 Days by Fasting Type (Total: {{ totalReadingsLast60days }})</h3>
    <ul
      v-for="(averageObj, type) in averageReadingsLast60daysByType"
      :key="type"
      :style="{ color: isWithinRange(type, averageObj.average) }"
   >
      <li>
        <p id="h3-left-subheading">
          * {{ type }} Average: {{ averageObj.average }} mg/dl ({{ averageObj.count }})
        </p>
      </li>
    </ul>
    <br />
    <h3 id="h3-left-subheading-green">
      * AM-Fasting Normal (Last 60d): {{ amFastingNormal60 }}
    </h3>
    <h3 id="h3-left-subheading-blue">
      * AM-Fasting Prediabetes (Last 60d): {{ amFastingPrediabetes60 }}
    </h3>
    <h3 id="h3-left-subheading-red">
      * AM-Fasting Diabetes (Last 60d): {{ amFastingDiabetes60 }}
    </h3>
    <br />
    <h3 id="h3-left-subheading-green">
      * Post-Meal Normal (Last 60d): {{ postMealNormal60 }}
    </h3>
    <h3 id="h3-left-subheading-blue">
      * Post-Meal Prediabetes (Last 60d): {{ postMealPrediabetes60 }}
    </h3>
    <h3 id="h3-left-subheading-red">
      * Post-Meal Diabetes (Last 60d): {{ postMealDiabetes60 }}
    </h3>
    <br>
    <h3 id="h3-left-subheading">
      Averages Last 90 Days by Fasting Type (Total: {{ totalReadingsLast90days }})
    </h3>

    <ul
      v-for="(averageObj, type) in averageReadingsLast90daysByType"
      :key="type"
      :style="{ color: isWithinRange(type, averageObj.average) }"
    >
      <li>
        <p id="h3-left-subheading">
          * {{ type }} Average: {{ averageObj.average }} mg/dl ({{ averageObj.count }})
        </p>
      </li>
    </ul>
    <h3 id="h3-left-subheading-green">
      * AM-Fasting Normal (Last 90d): {{ amFastingNormal90 }}
    </h3>
    <h3 id="h3-left-subheading-blue">
      * AM-Fasting Prediabetes (Last 90d): {{ amFastingPrediabetes90 }}
    </h3>
    <h3 id="h3-left-subheading-red">
      * AM-Fasting Diabetes (Last 90d): {{ amFastingDiabetes90 }}
    </h3>
    <br />
    <h3 id="h3-left-subheading-green">
      * Post-Meal Normal (Last 90d): {{ postMealNormal90 }}
    </h3>
    <h3 id="h3-left-subheading-blue">
      * Post-Meal Prediabetes (Last 90d): {{ postMealPrediabetes90 }}
    </h3>
    <h3 id="h3-left-subheading-red">
      * Post-Meal Diabetes (Last 90d): {{ postMealDiabetes90 }}
    </h3>

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
        // Last 30 days
    const amFastingNormal30 = computed(() => countAMFastingInRange(70, 100, 30));
    const amFastingPrediabetes30 = computed(() => countAMFastingInRange(99, 126, 30));
    const amFastingDiabetes30 = computed(() => countAMFastingInRange(125, Infinity, 30));
    // Last 60 days
    const amFastingNormal60 = computed(() => countAMFastingInRange(70, 100, 60));
    const amFastingPrediabetes60 = computed(() => countAMFastingInRange(99, 126, 60));
    const amFastingDiabetes60 = computed(() => countAMFastingInRange(125, Infinity, 60));

    // Last 90 days
    const amFastingNormal90 = computed(() => countAMFastingInRange(70, 100, 90));
    const amFastingPrediabetes90 = computed(() => countAMFastingInRange(99, 126, 90));
    const amFastingDiabetes90 = computed(() => countAMFastingInRange(125, Infinity, 90));    
    //
    //// Last 365 days
    //const amFastingNormal365 = computed(() => countAMFastingInRange(70, 100, 90));
    //const amFastingPrediabetes365 = computed(() => countAMFastingInRange(99, 126, 90));
    //const amFastingDiabetes365 = computed(() => countAMFastingInRange(125, Infinity, 90));    
    
    // Post-Meal Last 30 days
    const postMealNormal30 = computed(() => countPostMealInRange(80, 140, 30));
    const postMealPrediabetes30 = computed(() => countPostMealInRange(140, 200, 30));
    const postMealDiabetes30 = computed(() => countPostMealInRange(201, Infinity, 30));
    // Post-Meal Last 60 days
    const postMealNormal60 = computed(() => countPostMealInRange(80, 140, 60));
    const postMealPrediabetes60 = computed(() => countPostMealInRange(140, 200, 60));
    const postMealDiabetes60 = computed(() => countPostMealInRange(201, Infinity, 60));
    // Post-Meal Last 90 days
    const postMealNormal90 = computed(() => countPostMealInRange(80, 140, 60));
    const postMealPrediabetes90 = computed(() => countPostMealInRange(140, 200, 60));
    const postMealDiabetes90 = computed(() => countPostMealInRange(201, Infinity, 60));


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
        if (avg >= 70 && avg <= 100) {
          return "green"; // Normal fasting range
        } else if (avg > 100 && avg <= 125) {
          return "blue"; // Elevated fasting range
        } else {
          return "red"; // Fasting 126+ Type 2 Diabetes
        }
      } else if (type === "Post-Meal") {
        if (avg >= 80 && avg <= 140) {
          return "green"; // Normal post-meal range
        } else if (avg > 140 && avg <= 200) {
          return "blue"; // Elevated fasting range
        } else {
          return "red"; // Nonfasting 200+ Type 2 Diabetes
        }
      } else {
        return "black"; // Default for unknown types
      }
    };
    const amFastingNormal = computed(() =>
      props.glucose_readings.filter(
        r => r.reading_type === 'AM-Fasting' && r.reading >= 70 && r.reading <= 100
      ).length
    );
    const amFastingPrediabetes = computed(() =>
      props.glucose_readings.filter(
        r => r.reading_type === 'AM-Fasting' && r.reading > 100 && r.reading <= 125
      ).length
    );
    const amFastingDiabetes = computed(() =>
      props.glucose_readings.filter(
        r => r.reading_type === 'AM-Fasting' && r.reading > 125
      ).length
    );
    const postMealNormal = computed(() =>
      props.glucose_readings.filter(
        r => r.reading_type === 'Post-Meal' && r.reading >= 80 && r.reading <= 140
      ).length
    );
    const postMealPrediabetes = computed(() =>
      props.glucose_readings.filter(
        r => r.reading_type === 'Post-Meal' && r.reading > 140 && r.reading <= 200
      ).length
    );
    const postMealDiabetes = computed(() =>
      props.glucose_readings.filter(
        r => r.reading_type === 'Post-Meal' && r.reading > 200
      ).length
    );
    const startDateAll = computed(() => {
      if (!props.glucose_readings.length) return '';
      const minDate = props.glucose_readings
        .map(r => new Date(r.reading_date))
        .reduce((min, d) => d < min ? d : min, new Date(props.glucose_readings[0].reading_date));
      return formatDateMMDDYYYY(minDate);
    });

    const endDateAll = computed(() => {
      if (!props.glucose_readings.length) return '';
      const maxDate = props.glucose_readings
        .map(r => new Date(r.reading_date))
        .reduce((max, d) => d > max ? d : max, new Date(props.glucose_readings[0].reading_date));
      return formatDateMMDDYYYY(maxDate);
    });
    function formatDateMMDDYYYY(date) {
      const d = new Date(date);
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${mm}-${dd}-${yyyy}`;
    }
    function countAMFastingInRange(min, max, days) {
      const now = new Date();
      const daysAgo = new Date();
      daysAgo.setDate(now.getDate() - days);
      return props.glucose_readings.filter(r =>
        r.reading_type === 'AM-Fasting' &&
        r.reading > min &&
        r.reading < max &&
        new Date(r.reading_date) >= daysAgo
      ).length;
    }
    function countPostMealInRange(min, max, days) {
      const now = new Date();
      const daysAgo = new Date();
      daysAgo.setDate(now.getDate() - days);
      return props.glucose_readings.filter(r =>
        r.reading_type === 'Post-Meal' &&
        r.reading >= min &&
        r.reading <= max &&
        new Date(r.reading_date) >= daysAgo
      ).length;
    }
    return {
      totalReadings,
      startDateAll,
      endDateAll,
      averageReadingsByType,
      averageReadingsLast30daysByType,
      averageReadingsLast60daysByType,
      averageReadingsLast90daysByType,
      totalReadingsLast30days,
      totalReadingsLast60days,
      totalReadingsLast90days,
      amFastingNormal,
      amFastingPrediabetes,
      amFastingDiabetes,
      postMealNormal,
      postMealPrediabetes,
      postMealDiabetes,
      amFastingNormal30, amFastingPrediabetes30, amFastingDiabetes30,
      amFastingNormal60, amFastingPrediabetes60, amFastingDiabetes60,
      amFastingNormal90, amFastingPrediabetes90, amFastingDiabetes90,
      //amFastingNormal365, amFastingPrediabetes365, amFastingDiabetes365,
      postMealNormal30, postMealPrediabetes30, postMealDiabetes30,
      postMealNormal60, postMealPrediabetes60, postMealDiabetes60,
      postMealNormal90, postMealPrediabetes90, postMealDiabetes90,
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
  font-size: 1.35rem;
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
#h3-left-heading {
  font-size: 1.5rem;
  text-align: left;
  font-weight: bold;
}
#h3-left-subheading {
  font-size: 1.35rem;
  text-align: left;
  font-weight: bold;
}
#h3-left-subheading-green {
  color: #0a5a36 !important;
  font-size: 1.35rem;
  text-align: left;
  font-weight: bold;
}
#h3-left-subheading-blue {
  color: #0000ff !important;
  font-size: 1.35rem;
  text-align: left;
  font-weight: bold;
}
#h3-left-subheading-red {
  color: #e31b1b !important;
  font-size: 1.35rem;
  text-align: left;
  font-weight: bold;
}
</style>