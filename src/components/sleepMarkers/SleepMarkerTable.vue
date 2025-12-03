<template>
  <v-card class="table-card">
    <v-card-title class="table-header">
      <h3>
        <i class="fas fa-table"></i>
        Sleep Entries Table
      </h3>
    </v-card-title>
    
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="markers"
        :items-per-page="10"
        class="sleep-table"
      >
        <!-- Date Column -->
        <template v-slot:item.sleep_date="{ item }">
          <strong>{{ formatDate(item.sleep_date) }}</strong>
        </template>

        <!-- Quality Column with Color -->
        <template v-slot:item.sleep_quality="{ item }">
          <v-chip
            :color="getQualityColor(item.sleep_quality)"
            size="small"
          >
            {{ item.sleep_quality }}/10
          </v-chip>
        </template>

        <!-- ✅ OOB Column - Convert boolean to Yes/No -->
        <template v-slot:item.had_oob="{ item }">
          {{ item.had_oob ? 'Yes' : 'No' }}
        </template>

        <!-- Actions Column -->
        <template v-slot:item.actions="{ item }">
          <v-btn
            size="small"
            color="info"
            variant="text"
            @click="$emit('edit', item)"
          >
            <i class="fas fa-edit"></i>
          </v-btn>
          <v-btn
            size="small"
            color="error"
            variant="text"
            @click="$emit('delete', item)"
          >
            <i class="fas fa-trash"></i>
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup>
import dayjs from 'dayjs';

defineProps({
  markers: {
    type: Array,
    required: true
  }
});

defineEmits(['edit', 'delete']);

const headers = [
  { title: 'Date', key: 'sleep_date', sortable: true },
  { title: 'Bed Time', key: 'bed_time', sortable: true },
  { title: 'Wake Time', key: 'wake_time', sortable: true },
  { title: 'Total Sleep', key: 'total_sleep_hours', sortable: true },
  { title: 'Ups', key: 'awakenings', sortable: true },
  { title: 'Quality', key: 'sleep_quality', sortable: true },
  { title: 'Awake Sleep', key: 'awake_sleep', sortable: true },
  { title: 'REM Sleep', key: 'rem_sleep', sortable: true },
  { title: 'Core Sleep', key: 'core_sleep', sortable: true },  
  { title: 'Deep Sleep', key: 'deep_sleep', sortable: true },    
  { title: 'OOBs', key: 'had_oob', sortable: true }, 
  { title: 'Actions', key: 'actions', sortable: false }
];

function formatDate(date) {
  return dayjs(date).format('MMM DD, YYYY');
}

function getQualityColor(quality) {
  const q = parseFloat(quality);
  if (q >= 8) return 'success';
  if (q >= 6) return 'warning';
  return 'error';
}
</script>

<style scoped>
.table-card {
  margin-top: 1rem;
}

.table-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
}

.table-header h3 {
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sleep-table {
  margin-top: 1rem;
}
</style>