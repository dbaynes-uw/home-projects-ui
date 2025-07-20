<template>
  <div>
    <h3 id="h3-left-heading">
      {{ title }} (Total: {{ total }})<br/>
      <span id="date-range-display"><u>({{ dateRange.start }} to {{ dateRange.end }})</u>:</span>
    </h3>
    <ul
      v-for="(averageObj, type) in averages"
      :key="type"
      :style="{ color: isWithinRange(type, averageObj.average) }"
    >
      <li>
        <p id="h3-left-subheading">
          * {{ type }} Average: {{ averageObj.average }} mg/dl ({{ averageObj.count }})
        </p>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  averages: Object,
  total: Number,
  dateRange: Object,
  isWithinRange: Function
});
</script>
<style>
#date-range-display {
  font-size: 1.25rem;
  font-weight: bolder;
}
</style>