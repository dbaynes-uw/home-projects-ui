<template>
  <div>
    <span class="h3-left-total-child">Double click Item Below to Edit</span>
    <div class="cards">
      <GlucoseReadingCard
        v-for="glucose_reading in glucose_readings"
        :key="glucose_reading.id"
        :glucose_reading="glucose_reading"
        class="card"
        @dblclick="$emit('edit', glucose_reading)"
      />
    </div>
  </div>
</template>

<script>
import GlucoseReadingCard from "@/components/glucose_readings/GlucoseReadingCard.vue";
export default {
  name: 'GlucoseReadingList',
  components: { GlucoseReadingCard },
  props: {
    glucose_readings: { type: Array, required: true }
  }
};
</script>