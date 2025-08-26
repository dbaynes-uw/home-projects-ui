<template>
  <StealthDropdown
    v-model="internalValue"
    label=""
    icon="mdi-clock-outline"
    :items="dueByOptions"
    placeholder="Filter by Due Date"
    format-prefix="Due in"
    format-suffix="days"
    store-action="DueBy"
    @update:model-value="handleChange"
  />
</template>

<script setup>
import { ref } from 'vue';
import StealthDropdown from '@/components/shared/StealthDropdown.vue';

// ✅ DEFINE PROPS AND EMITS
const props = defineProps({
  selectedDueByValue: {
    type: [String, Number],
    default: ''
  }
});

const emit = defineEmits(['update:selectedDueByValue']);

// ✅ REACTIVE STATE
const internalValue = ref(props.selectedDueByValue);

// ✅ OPTIONS DATA
const dueByOptions = [
  { title: '7 days', value: '7' },
  { title: '10 days', value: '10' },
  { title: '14 days', value: '14' },
  { title: '21 days', value: '21' },
  { title: '30 days', value: '30' },
  { title: '60 days', value: '60' },
  { title: '90 days', value: '90' },
  { title: '120 days', value: '120' },
  { title: '180 days', value: '180' },
  { title: '360 days', value: '360' }
];

// ✅ HANDLE CHANGES
function handleChange(newValue) {
  internalValue.value = newValue;
  emit('update:selectedDueByValue', newValue);
}
</script>