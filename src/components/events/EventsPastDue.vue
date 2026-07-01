<template>
  <div class="pastdue-wrapper">
    <select v-model="internalValue" @change="handlePastDueChange" class="native-select">
      <option value="">All Events</option>
      <option value="pastdue">Past Due Only</option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const internalValue = ref('');

const props = defineProps({
  selectedPastDueValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['past-due-filter', 'clear-past-due']);

const handlePastDueChange = () => {
  if (internalValue.value === '') {
    emit('clear-past-due');
    store.commit('SET_EVENTS_REQUEST', 'All');
  } else if (internalValue.value === 'pastdue') {
    emit('past-due-filter', 'pastdue');
    store.dispatch('eventsPastDue');
    store.commit('SET_EVENTS_REQUEST', 'PastDue');
  }
};

watch(() => props.selectedPastDueValue, (newVal) => {
  internalValue.value = newVal;
});
</script>

<style scoped>
.pastdue-wrapper {
  position: relative;
  width: 200px;
  height: 48px;
}

.native-select {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: linear-gradient(to right, #16c0b0, #84cf6a);
  color: black;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.native-select:hover {
  background: linear-gradient(to right, #14a89a, #72b558);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 192, 176, 0.4);
}

.native-select:focus {
  outline: none;
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
}

.native-select option {
  background: white;
  color: black;
  font-weight: 600;
  padding: 8px;
}
</style>