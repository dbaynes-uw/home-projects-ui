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

    // Method to handle form submission
    const createReading = async () => {
    try {
      // Flatten the object
      const glucose_reading = {
        reading_date: reading_date.value,
        reading: reading.value,
      };

      console.log("Sending flattened data to Vuex: ", glucose_reading);

      // Dispatch the Vuex action with the flattened object
      await store.dispatch('createGlucoseReading', glucose_reading);

      // Redirect to the list view after successful creation
      router.push({ name: 'GlucoseReadingList' });
    } catch (error) {
      console.error("Error creating glucose reading:", error);
      alert("Failed to create glucose reading. Please try again.");
    }
  };
    return { reading_date, reading, createReading };
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
</style>