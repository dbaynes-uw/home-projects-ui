<template>
  <div class="card">
    <ul>
      <li class="li-left">Date: <b>{{ formatStandardDateTime(glucose_reading.reading_date) }}</b></li>
      <li class="li-left">Reading: {{ glucose_reading.reading }} {{ glucose_reading.unit }}</li>
      <li class="li-left">Fasting Type: {{ glucose_reading.reading_type }}</li>
      <li class="li-left">Result: {{ glucose_reading.status }}</li>
      <li class="li-left">Notes: {{ glucose_reading.notes }}</li>
    </ul>
    <span class="fa-stack">
      <router-link :to="{ name: 'GlucoseReadingEdit', params: { id: `${glucose_reading.id}` } }">
        <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
      </router-link>
    </span>
    <span class="fa-stack">
      <i @click="deleteGlucoseReading(glucose_reading)" class="fas fa-trash-alt fa-stack-1x"></i>
    </span>
    <br />
    <router-link :to="{ name: 'GlucoseReadings' }">
      <i class="fa-solid fa-backward fa-stack-1x"></i>
    </router-link>
  </div>
</template>

<script setup>
//import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import DateFormatService from "@/services/DateFormatService.js";
//import SplitStringService from "@/services/SplitStringService.js";

// Props
defineProps({
  glucose_reading: {
    type: Object,
    default: () => ({})
  }
});

// If you want to emit events to parent, uncomment below
//  const emit = defineEmits(['delete']);

const store = useStore();
const router = useRouter();
//const splitLength = ref(30);

// If you use a confirm dialog, set up a ref for it
// const confirmDialogue = ref(null);

async function deleteGlucoseReading(glucose_reading) {
  // If you use a confirm dialog, uncomment and use:
  // const ok = await confirmDialogue.value.show({
  //   title: "Delete GlucoseReading from List",
  //   message: "Are you sure you want to delete " + glucose_reading.reading_date + "? It cannot be undone.",
  //   okButton: "Delete",
  // });
  // if (!ok) return;

  if (confirm(`Are you sure you want to delete ${glucose_reading.reading_date}? It cannot be undone.`)) {
    await store.dispatch("deleteGlucoseReading", glucose_reading);
    // Optionally show a message or emit an event
    // emit('delete', glucose_reading);
    // Optionally navigate away
    router.push({ name: "GlucoseReadings" });
  }
}

//function splitList(glucose_readingData, splitLength) {
//  return SplitStringService.splitList(glucose_readingData.circumstances, splitLength);
//}

function formatStandardDateTime(value) {
  return DateFormatService.formatStandardDateTimejs(value);
}
</script>