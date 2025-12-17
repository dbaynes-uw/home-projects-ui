<template>
  <v-card class="charts-card">
    <v-card-title class="charts-header">
      <h3>
        <i class="fas fa-chart-line"></i>
        Sleep Analytics & Trends
      </h3>
    </v-card-title>
    
    <v-card-text>
      <div class="charts-placeholder">
        <i class="fas fa-chart-bar" style="font-size: 64px; color: #ccc;"></i>
        <p class="mt-4">Charts & Analytics Coming Soon!</p>
        <p class="text-subtitle-2">Will display:</p>
        <ul class="features-list">
          <li>Sleep duration trends over time</li>
          <li>Sleep quality patterns</li>
          <li>Sleep stage distribution</li>
          <li>Weekly/Monthly averages</li>
          <li>Best and worst sleep nights</li>
        </ul>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  markers: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.charts-card {
  margin-top: 1rem;
}

.charts-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
}

.charts-header h3 {
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.charts-placeholder {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.features-list {
  text-align: left;
  display: inline-block;
  margin-top: 1rem;
}

.features-list li {
  margin: 0.5rem 0;
}
</style>