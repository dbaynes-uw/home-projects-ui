<template>
  <div>
    <h1>Edit Glucose Reading</h1>
    <form @submit.prevent="updateReading">
      <label for="name">Name:</label>
      <input id="name" v-model="name" type="text" />
      <label for="value">Value:</label>
      <input id="value" v-model="value" type="number" />
      <button type="submit">Update</button>
    </form>
    <router-link :to="{ name: 'GlucoseReadingList' }">Back to List</router-link>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'GlucoseReadingEdit',
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const name = ref('');
    const value = ref('');

    onMounted(async () => {
      await store.dispatch('fetchGlucoseReading', route.params.id);
      const result = store.state.glucoseReading;
      name.value = result.name;
      value.value = result.reading;
    });

    const updateReading = async () => {
      await store.dispatch('updateGlucoseReading', { id: route.params.id, name: name.value, value: value.value });
      router.push({ name: 'GlucoseReadingList' });
    };

    return { name, value, updateReading };
  },
};
</script>