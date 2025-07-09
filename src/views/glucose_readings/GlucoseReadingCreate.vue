<template>
  <v-container>
    <h1>Create Glucose Reading</h1>
    <v-form @submit.prevent="createReading" ref="form">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="reading_date"
            label="Date"
            type="datetime-local"
            outlined
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="reading"
            label="Reading"
            type="number"
            outlined
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn color="primary" type="submit">Create</v-btn>
          <v-btn color="secondary" :to="{ name: 'GlucoseReadingList' }">Back to List</v-btn>
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

    const reading_date = ref('');
    const reading = ref('');

    const createReading = async () => {
      const glucose_reading = {
        reading: reading.value, // Define the reading field here
        reading_date: reading_date.value,
      };
      const glucose_reading_params = {
        glucose_reading: {
          reading_date: reading_date.value,
          reading: reading.value,
        },
      };
      console.log("CreateReading: ", glucose_reading);
      console.log("Sending data to API: ", glucose_reading_params);

      // Dispatch the action with the structured params
      await store.dispatch('createGlucoseReading', glucose_reading_params);

      // Redirect to the list view after successful creation
      router.push({ name: 'GlucoseReadingList' });
    };

    return { reading_date, reading, createReading };
  },
};
</script>