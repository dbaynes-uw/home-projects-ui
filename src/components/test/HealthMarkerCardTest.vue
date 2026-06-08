<template>
  <div class="health-marker-test-container">
    <div class="hm-row">
      <div class="hm-col hm-col-12">
        <h2>Health Marker Card Layout Test</h2>
      </div>
    </div>
    
    <!-- Single Card Test -->
    <div class="hm-row">
      <div class="hm-col hm-col-12 hm-col-md-6 hm-col-lg-4">
        <h3>Single Card</h3>
        <HealthMarkerCard 
          :health-marker="singleMarker"
          @dblclick="onCardDoubleClick"
        />
      </div>
    </div>
    
    <v-divider class="my-6" />
    
    <!-- Multiple Cards Grid -->
    <div class="hm-row">
      <div class="hm-col hm-col-12">
        <h3>Multiple Cards Grid</h3>
      </div>
      <div 
        v-for="marker in mockMarkers" 
        :key="marker.id"
        class="hm-col hm-col-12 hm-col-md-6 hm-col-lg-4"
      >
        <HealthMarkerCard 
          :health-marker="marker"
          @dblclick="onCardDoubleClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import HealthMarkerCard from '@/components/health/healthMarkers/HealthMarkerCard.vue';

// Define mock data directly in the component
const mockMarkers = ref([
  {
    id: 1,
    marker_name: 'HbA1c',
    marker_result: 6.2,
    marker_date: '2024-10-15',
    notes: 'Fasting test taken in the morning. Patient had been following dietary recommendations.',
    created_by: 'Dr. Smith'
  },
  {
    id: 2,
    marker_name: 'Total Cholesterol',
    marker_result: 220,
    marker_date: '2024-09-20',
    notes: 'Annual checkup. Recommend dietary changes and follow-up in 3 months.',
    created_by: 'Dr. Johnson'
  },
  {
    id: 3,
    marker_name: 'TSH',
    marker_result: 2.5,
    marker_date: '2024-11-01',
    notes: null,
    created_by: 'Dr. Williams'
  }
]);

const singleMarker = ref({
  id: 1,
  marker_name: 'HbA1c',
  marker_result: 6.2,
  marker_date: '2024-10-15',
  notes: 'Fasting test taken in the morning. Patient had been following dietary recommendations.',
  created_by: 'Dr. Smith'
});

const onCardDoubleClick = (marker) => {
  console.log('Card double-clicked:', marker);
};
</script>

<style scoped>
.health-marker-test-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  box-sizing: border-box;
}

.hm-row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -0.5rem;
}

.hm-col {
  box-sizing: border-box;
  padding: 0.5rem;
}

.hm-col-12 {
  flex: 0 0 100%;
  max-width: 100%;
}

.hm-col-md-6,
.hm-col-lg-4 {
  flex: 0 0 100%;
  max-width: 100%;
}

@media (min-width: 960px) {
  .hm-col-md-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (min-width: 1280px) {
  .hm-col-lg-4 {
    flex: 0 0 33.3333%;
    max-width: 33.3333%;
  }
}
</style>