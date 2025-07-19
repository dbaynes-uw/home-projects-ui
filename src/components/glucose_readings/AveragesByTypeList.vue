<template>
  <div>
    <h3 id="h3-left-heading">
      {{ title }} (Total: {{ total }})<br/>
      ({{ dateRange.start }} to {{ dateRange.end }}):
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