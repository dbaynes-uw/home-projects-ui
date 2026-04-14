<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2><i class="fas fa-pills"></i> Health Dashboard</h2>
    </v-card-title>
     
    <div class="navigation-buttons">

      <router-link :to="{ name: 'HealthMarkers' }" class="nav-btn" id="button-as-link">
        <i class="fas fa-heartbeat"></i>
        <span>&nbsp;Health Markers</span>
      </router-link>
      
      <router-link :to="{ name: 'SleepMarkers' }" class="nav-btn" id="button-as-link">
        <i class="fas fa-bed" aria-hidden="true"></i>
        <span>&nbsp;&nbsp;Sleep Markers</span>
      </router-link>

      <router-link :to="{ name: 'GlucoseReadings' }" class="nav-btn glucose-btn" id="button-as-link">
        <!-- ✅ CHANGED: mdi-heart → fas fa-heartbeat -->
        <i class="fa fa-heart" aria-hidden="true"></i>
        <span>&nbsp;Glucose</span>
      </router-link>

      <router-link :to="{ name: 'Oobs' }" class="nav-btn glucose-btn" id="button-as-link">
        <!-- ✅ CHANGED: mdi-heart → fas fa-heartbeat -->
        <i class="fa fa-thumbs-down" aria-hidden="true"></i>
        <span>&nbsp;Oobs</span>
      </router-link>

    </div>
  </v-card>
</template>
<script></script>
<style scoped>
@import '@/assets/styles/health-dashboard.css';
</style>