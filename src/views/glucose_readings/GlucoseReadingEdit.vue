<template>
  <v-container>
    <h1>Edit Glucose Reading</h1>
    <v-form @submit.prevent="updateReading">
      <v-row>
        <!-- Name Input -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="reading_date"
            label="Date"
            type="datetime-local"
            outlined
            required
            aria-label="Enter the date of the glucose reading"
          ></v-text-field>
        </v-col>

        <!-- Reading Input -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="reading"
            label="Reading"
            type="number"
            outlined
            required
            aria-label="Enter the reading of the glucose reading"
          ></v-text-field>
        </v-col>

        <!-- Unit Input -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="unit"
            label="Unit"
            type="text"
            outlined
            required
            aria-label="Enter the reading unit of the glucose reading"
          ></v-text-field>
        </v-col>        

        <!-- Reading Type Input -->
        <v-col cols="12" md="6">
          <v-autocomplete
            v-model="reading_type"
            :items="readingTypeOptions"
            label="Type"
            outlined
            required
            aria-label="Select or enter the type of the glucose reading"
            hide-no-data
            allow-new
          ></v-autocomplete>
        </v-col>
        <!-- Status or Diagnosis Bullet Points
        <v-col cols="12" md="6" id="bullet-style">
          <v-list dense>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Fasting 70-99 - Normal</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Fasting 126+ - Diabetes</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Fasting 100-125 - Prediabetes</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
        -->
        <!-- Status Input Calculated Below -->
        <!--v-col cols="12" md="6">
          <v-select
            v-model="status"
            :items="statusOptions"
            label="Status"
            outlined
            aria-label="Select the status of the glucose reading"
          ></v-select>
        </v-col-->
        <!-- Notes Input -->
        <v-col cols="12">
          <v-textarea
            v-model="notes"
            label="Notes"
            outlined
            rows="3"
            aria-label="Enter any notes for the glucose reading"
          ></v-textarea>
        </v-col>
      </v-row>
      <!-- Action Buttons -->
      <v-row>
        <v-col cols="12">
          <v-btn color="primary" type="submit" aria-label="Update the glucose reading">
            Update
          </v-btn>
          <v-btn color="secondary" :to="{ name: 'GlucoseReadings' }" aria-label="Go back to the glucose reading list">
            Back to List
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

const store = useStore();
const route = useRoute();
const router = useRouter();

const reading_date = ref('');
const reading = ref('');
const unit = ref('');
const reading_type = ref('');
const status = ref('');
const notes = ref('');
  // Dropdown options for the reading_type field
  const readingTypeOptions = ref([]);
  // Fetch unique reading_types from Vuex store or API
  const fetchReadingTypeOptions = async () => {
    try {
      // Assuming glucose readings are stored in Vuex state
      const glucoseReadings = store.state.glucoseReadings;
      
      // Extract unique reading_types
      const uniqueReadingTypes = [...new Set(glucoseReadings.map(reading => reading.reading_type))];
      readingTypeOptions.value = uniqueReadingTypes;
    } catch (error) {
      console.error('Error fetching reading type options:', error);
    }
  };
  // Fetch reading_type options on component mount

onMounted(async () => {
  await store.dispatch('fetchGlucoseReading', route.params.id);
  const result = store.state.glucoseReading;
  fetchReadingTypeOptions();
  // Convert the reading_date to local timezone and format for datetime-local input
  const isoDate = new Date(result.reading_date);
  const localDate = new Date(isoDate.getTime() - isoDate.getTimezoneOffset() * 60000);
  const formattedDate = localDate.toISOString().slice(0, 16);

  reading_date.value = formattedDate;
  reading.value = result.reading;
  unit.value = result.unit;
  reading_type.value = result.reading_type;
  status.value = result.status;
  notes.value = result.notes;
});

async function updateReading() {
  // Determine the status based on the reading value
  if (reading.value >= 70 && reading.value <= 99) {
    status.value = 'Good - 70-99 mg/dl';
  } else if (reading.value >= 100 && reading.value <= 125) {
    status.value = 'Prediabetes - 100-125 mg/dl';
  } else if (reading.value >= 126) {
    status.value = 'Diabetes - 126+ mg/dl';
  } else {
    status.value = 'Invalid reading';
  }
  const updatedReading = {
    id: route.params.id,
    reading_date: reading_date.value,
    reading: reading.value,
    unit: unit.value,
    reading_type: reading_type.value,
    status: status.value,
    notes: notes.value,
  };
  await store.dispatch('updateGlucoseReading', updatedReading);
  router.push({ name: 'GlucoseReadings' });
}
</script>

<style scoped>
/* Add spacing and alignment for the form */
.v-container {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.v-btn {
  margin-right: 10px;
}
</style>