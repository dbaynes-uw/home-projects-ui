<template>
  <v-container>
    <h1>Create Glucose Reading</h1>
    <v-form @submit.prevent="createReading" ref="form">
      <v-row>
        <!-- Date Input -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="reading_date"
            label="Date"
            type="datetime-local"
            outlined
            required
            aria-label="Enter the date and time of the glucose reading"
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
            aria-label="Enter the glucose reading value"
          ></v-text-field>
        </v-col>
        <!-- Unit Input -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="unit"
            label="Unit"
            type="text"
            outlined
            aria-label="Enter the glucose reading value"
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
        <!-- Status or Diagnosis Bullet Points -->
        <v-col cols="12" md="6" id="bullet-style">
          <v-list dense>
            <v-list-item>
              <v-list-item-title><span class="text-green">Fasting: Good 70-99 mg/dl</span></v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title><span class="text-blue">Fasting: Prediabetes 100-125 mg/dl</span></v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title><span class="text-red">Fasting: Type 2 Diabetes 126+ mg/dl</span></v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title><span class="text-green">NonFasting: Good 80-140 mg/dl</span></v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title><span class="text-blue">NonFasting: Prediabetes 140-200 mg/dl</span></v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title><span class="text-red">NonFasting: Type 2 Diabetes 200+ mg/dl</span></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
        <!-- Status Input Calculated below -->
        <!-- Notes Input -->
        <v-col cols="12" md="6">
          <v-textarea
            v-model="notes"
            label="notes"
            type="textarea"
            outlined
            aria-label="Enter any additional notes about the glucose reading"
          ></v-textarea>
        </v-col>
      </v-row>
      <!-- Action Buttons -->
      <v-row>
        <v-col cols="12">
          <v-btn color="primary" type="submit" aria-label="Submit the glucose reading">
            Create
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
import { useRouter } from 'vue-router';
  const store = useStore();
  const router = useRouter();
  // Reactive variables for form inputs
  const reading_date = ref('');
  const reading = ref('');
  const unit = ref('mg/dl'); // Default unit, can be changed if needed
  const reading_type = ref('AM-Fasting'); // Default reading type, can be changed if needed
  const status = ref(''); // Optional status field, can be used for additional information
  const notes = ref(''); // Optional notes field  
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
  onMounted(fetchReadingTypeOptions);
  //
  // Dropdown options for the status field
  //const statusOptions = ref([
  //  'Good - 70-99 mg/dl',
  //  'Prediabetes - 100-125 mg/dl',
  //  'Diabetes - 126+ mg/dl',
  //]);
  // Method to handle form submission
  const createReading = async () => {
  try {
    //Determine the status based on the reading value
    if (reading.value >= 70 && reading.value <= 99) {
      status.value = 'Good - 70-99 mg/dl';
    } else if (reading.value >= 100 && reading.value <= 125) {
      status.value = 'Prediabetes - 100-125 mg/dl';
    } else if (reading.value >= 126) {
      status.value = 'Diabetes - 126+ mg/dl';
    } else {
      status.value = 'Invalid reading'; // Handle edge cases
    }
    // Flatten the object
    const glucose_reading = {
      reading_date: reading_date.value,
      reading: reading.value,
      unit: unit.value,
      reading_type: reading_type.value,
      status: status.value,
      notes: notes.value,
    };
    // Dispatch the Vuex action with the flattened object
    await store.dispatch('createGlucoseReading', glucose_reading);     
    // Redirect to the list view after successful creation
    router.push({ name: 'GlucoseReadings' });
  } catch (error) {
    console.error("Error creating glucose reading:", error);
    alert("Failed to create glucose reading. Please try again.");
  }
};
  // If you want to emit events to parent, uncomment below
  // const emit = defineEmits(['delete']);
</script>
<style scoped>
/* Add spacing and alignment for the form */
.v-container {
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: 100px; /* ✅ Add padding to prevent footer overlap */
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.v-btn {
  margin-right: 10px;
}

#bullet-style{
  margin-top: -25px;
  text-align: left;
}

.text-green {
  color: #0a5a36 !important;
  font-weight: bold;
  font-size: 1rem;
}

.text-blue {
  color: #0000ff !important;
  font-size: 1rem;
}

.text-red {
  color: #e31b1b !important;
  font-weight: bold;
  font-size: 1rem;
}
</style>