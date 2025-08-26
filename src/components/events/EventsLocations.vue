<template>
  <StealthDropdown
    v-model="internalValue"
    label=""
    icon="mdi-map-marker-outline"
    :items="locationOptions"
    placeholder="Filter by Location"
    store-action="Location"
    @update:model-value="handleChange"
  />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import StealthDropdown from '@/components/shared/StealthDropdown.vue';
const store = useStore();

// ✅ DEFINE PROPS AND EMITS
const props = defineProps({
  selectedLocationValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:selectedLocationValue']);

// ✅ REACTIVE STATE
const internalValue = ref(props.selectedLocationValue);
const locationOptions = ref([]);

// ✅ COMPUTED PROPERTIES
const events = computed(() => store.state.events || []);

// ✅ GET UNIQUE LOCATIONS FROM EVENTS
function getUniqueLocations() {
  if (!events.value || events.value.length === 0) return [];
  
  const locations = events.value
    .map(event => event.location)
    .filter(location => location && location.trim() !== '')
    .filter((location, index, array) => array.indexOf(location) === index)
    .sort();
  
  return locations.map(location => ({
    title: location,
    value: location
  }));
}

// ✅ SIMPLIFIED - NO EVENTSERVICE CALLS
function handleChange(newValue) {
  internalValue.value = newValue;
  
  // Just emit to parent - let parent handle all filtering
  emit('update:selectedLocationValue', newValue);
  
  // ✅ OPTIONAL: Just update request type for tracking (no service call)
  if (newValue) {
    store.commit('SET_EVENTS_REQUEST', 'Location');
  } else {
    store.commit('SET_EVENTS_REQUEST', '');
  }
}

// ✅ LIFECYCLE
onMounted(() => {
  locationOptions.value = getUniqueLocations();
});

// ✅ WATCH FOR EVENTS CHANGES
watch(events, () => {
  locationOptions.value = getUniqueLocations();
}, { deep: true });
</script>

<style scoped>
.location-select {
  max-width: 250px;
}
</style>