<template>
  <BaseCard class="mx-auto mt-5">
    <div class="dashboard-title pb-0">
      <h2><i class="fas fa-pills"></i> Health Dashboard</h2>
    </div>
     
    <HealthDashboardNav />
  </BaseCard>
</template>
<script setup>
import BaseCard from '@/components/ui/BaseCard.vue';
import HealthDashboardNav from '@/components/health/shared/HealthDashboardNav.vue';
</script>
<style scoped>
@import '@/assets/styles/health-dashboard.css';
</style>