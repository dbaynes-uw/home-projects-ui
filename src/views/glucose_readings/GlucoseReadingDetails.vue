<template>
  <div>
    <h1>Glucose Reading Details</h1>
    <p><strong>Name:</strong> {{ glucoseReading.name }}</p>
    <p><strong>Value:</strong> {{ glucoseReading.reading }}</p>
    <router-link :to="{ name: 'GlucoseReadingEdit', params: { id: glucoseReading.id } }">Edit</router-link>
    <router-link :to="{ name: 'GlucoseReadingList' }">Back to List</router-link>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

export default {
  name: 'GlucoseReadingDetails',
  setup() {
    const store = useStore();
    const route = useRoute();
    const glucoseReading = ref(null);

    onMounted(async () => {
      await store.dispatch('fetchGlucoseReading', route.params.id);
      glucoseReading.value = store.state.glucoseReading;
    });

    return { glucoseReading };
  },
};
</script>