<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>Health Marker Card Layout Test</h2>
      </v-col>
    </v-row>
    
    <!-- Single Card Test -->
    <v-row>
      <v-col cols="12" md="6" lg="4">
        <h3>Single Card</h3>
        <HealthMarkerCard 
          :health-marker="singleMarker"
          @dblclick="onCardDoubleClick"
        />
      </v-col>
    </v-row>
    
    <v-divider class="my-6" />
    
    <!-- Multiple Cards Grid -->
    <v-row>
      <v-col cols="12">
        <h3>Multiple Cards Grid</h3>
      </v-col>
      <v-col 
        v-for="marker in mockMarkers" 
        :key="marker.id"
        cols="12" 
        md="6" 
        lg="4"
      >
        <HealthMarkerCard 
          :health-marker="marker"
          @dblclick="onCardDoubleClick"
        />
      </v-col>
    </v-row>
  </v-container>
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