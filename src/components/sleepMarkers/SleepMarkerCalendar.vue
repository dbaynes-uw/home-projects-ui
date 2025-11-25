<template>
  <v-card class="calendar-card">
    <v-card-title class="calendar-header">
      <h3>
        <i class="fas fa-calendar-alt"></i>
        Sleep Calendar
      </h3>
    </v-card-title>
    
    <v-card-text>
      <div class="calendar-placeholder">
        <i class="fas fa-calendar" style="font-size: 64px; color: #ccc;"></i>
        <p class="mt-4">Calendar view coming soon!</p>
        <p class="text-subtitle-2">Will display sleep entries in a monthly calendar format</p>
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

defineEmits(['edit', 'date-click']);
</script>

<style scoped>
.calendar-card {
  margin-top: 1rem;
}

.calendar-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
}

.calendar-header h3 {
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.calendar-placeholder {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}
</style>