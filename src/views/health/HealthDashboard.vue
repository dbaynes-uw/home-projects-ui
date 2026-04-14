<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2><i class="fas fa-pills"></i> Health Dashboard</h2>
    </v-card-title>
     
    <HealthDashboardNav />
  </v-card>
</template>
<script setup>
import HealthDashboardNav from '@/components/health/shared/HealthDashboardNav.vue';
</script>
<style scoped>
@import '@/assets/styles/health-dashboard.css';
</style>