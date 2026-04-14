<template>
  <div class="health-dashboard-nav">
    <router-link :to="{ name: 'HealthMarkers' }" class="nav-btn" id="button-as-link">
      <i class="fas fa-heartbeat"></i>
      <span>&nbsp;Health Markers</span>
    </router-link>

    <router-link :to="{ name: 'SleepMarkers' }" class="nav-btn" id="button-as-link">
      <i class="fas fa-bed" aria-hidden="true"></i>
      <span>&nbsp;Sleep Markers</span>
    </router-link>

    <router-link :to="{ name: 'GlucoseReadings' }" class="nav-btn glucose-btn" id="button-as-link">
      <i class="fa fa-heart" aria-hidden="true"></i>
      <span>&nbsp;Glucose</span>
    </router-link>

    <router-link :to="{ name: 'Oobs' }" class="nav-btn glucose-btn" id="button-as-link">
      <i class="fa fa-thumbs-down" aria-hidden="true"></i>
      <span>&nbsp;Oobs</span>
    </router-link>
  </div>
</template>

<script setup>
// No props needed — links are fixed health section routes
</script>

<style scoped>
.health-dashboard-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0.75rem 0;
  margin-bottom: 1rem;
}
</style>
