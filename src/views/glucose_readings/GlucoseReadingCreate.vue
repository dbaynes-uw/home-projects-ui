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
            label="Type"
            type="text"
            outlined
            aria-label="Enter the glucose reading value"
          ></v-text-field>
        </v-col>
        <!-- Reading Type Input -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="reading_type"
            label="Type"
            type="text"
            outlined
            aria-label="Enter the glucose reading value"
          ></v-text-field>
        </v-col>

        <!-- Status or Diagnosis Bullet Points 
        <v-col cols="12" md="6" id="bullet-style">
          <v-list dense>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Good 70-99 mg/dl</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Prediabetes 100-125 mg/dl</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Type 2 Diabetes 126+ mg/dl</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
        -->
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
          <v-btn color="secondary" :to="{ name: 'GlucoseReadingList' }" aria-label="Go back to the glucose reading list">
            Back to List
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'GlucoseReadingCreate',
  setup() {
    const store = useStore();
    const router = useRouter();

    // Reactive variables for form inputs
    const reading_date = ref('');
    const reading = ref('');
    const unit = ref('mg/dl'); // Default unit, can be changed if needed
    const reading_type = ref('AM-Fasting'); // Default reading type, can be changed if needed
    const status = ref(''); // Optional status field, can be used for additional information
    const notes = ref(''); // Optional notes field  
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
      router.push({ name: 'GlucoseReadingList' });
    } catch (error) {
      console.error("Error creating glucose reading:", error);
      alert("Failed to create glucose reading. Please try again.");
    }
  };
    return { reading_date,
             reading,
             unit,
             reading_type,
             status,
             notes,
             //statusOptions,
             createReading };
  },
};
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
#bullet-style{
  margin-top: -25px;
  text-align: left;
}
</style>