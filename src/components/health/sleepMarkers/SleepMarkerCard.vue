<template>
  <BaseCard 
    class="sleep-marker-card" 
    :hover="viewMode === 'grid'" 
    :clickable="viewMode === 'grid'" 
    @click="viewMode === 'grid' ? $emit('view', sleepMarker) : null"
  >
    <div class="card-header">
      <div class="date-badge">
        <i class="fas fa-calendar-day"></i>
        Night of {{ formattedDate }}
      </div>
      <!-- ✅ Only show action buttons in grid mode -->
      <div v-if="viewMode === 'grid'" class="actions">
        <button class="action-btn edit-btn" @click.stop="$emit('edit', sleepMarker)" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn delete-btn" @click.stop="$emit('delete', sleepMarker)" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>

    <div class="card-body">
      <!-- Sleep Times -->
      <div class="time-row">
        <!--viewMode === 'detail' && -->
        <div v-if="sleepMarker.sleep_score" class="time-item">
          <i class="fas fa-bed"></i>
          <span class="time-label">Sleep Score</span>
          <span class="time-value">{{ sleepMarker.sleep_score }}</span>
        </div>
        <div v-if="sleepMarker.sleep_score_rating" class="time-item">
          <i class="fas fa-bed"></i>
          <span class="time-label">Sleep Score Rating</span>
          <span class="time-value">{{ sleepMarker.sleep_score_rating }}</span>
        </div>        
        <div v-if="sleepMarker.duration_score" class="time-item">
          <i class="fas fa-bed"></i>
          <span class="time-label">Duration Score</span>
          <span class="time-value">{{ sleepMarker.duration_score }}</span>
        </div>
        <div v-if="sleepMarker.duration_score_explained" class="time-item">
          <i class="fas fa-bed"></i>
          <span class="time-label">Duration Score Explained</span>
          <span class="time-value">{{ sleepMarker.duration_score_explained }}</span>
        </div>
        <div v-if="sleepMarker.bedtime_score" class="time-item">
          <i class="fas fa-bed"></i>
          <span class="time-label">Bedtime Score</span>
          <span class="time-value">{{ sleepMarker.bedtime_score }}</span>
        </div>
        <div v-if="sleepMarker.bedtime_score_explained" class="time-item">
          <i class="fas fa-bed"></i>
          <span class="time-label">Bedtime Score Explained</span>
          <span class="time-value">{{ sleepMarker.bedtime_score_explained }}</span>
        </div>     
        <div class="stat-item">
          <i class="fas fa-star stat-icon"></i>
          <span class="stat-value">{{ sleepMarker.interruptions_score }}</span>
          <span class="stat-label">Interruptions Score</span>
        </div>
        <div class="stat-item">
          <i class="fas fa-eye stat-icon"></i>
          <span class="stat-value">{{ sleepMarker.interruptions_score_explained }}</span>
          <span class="stat-label">Interruptions Score Explained</span>
        </div>
        <div class="time-item">
          <i class="fas fa-clock"></i>
          <span class="time-label">Time in Bed</span>
          <span class="time-value">{{ sleepMarker.time_in_bed }}</span>
        </div>    
        <div class="time-item">
          <i class="fas fa-moon"></i>
          <span class="time-label">Time Asleep</span>
          <span class="time-value">{{ sleepMarker.time_asleep }}</span>
        </div>
        <div class="stat-item">
          <i class="fas fa-eye stat-icon"></i>
          <span class="stat-value">{{ sleepMarker.from_heart_beats_per_minute }}</span>
          <span class="stat-label">From Heart Beats Per Minute</span>
        </div>
        <div class="stat-item">
          <i class="fas fa-eye stat-icon"></i>
          <span class="stat-value">{{ sleepMarker.to_heart_beats_per_minute }}</span>
          <span class="stat-label">To Heart Beats Per Minute</span>
        </div>                      
        <div class="stat-item">
          <i class="fas fa-eye stat-icon"></i>
          <span class="stat-value">{{ sleepMarker.from_breaths_per_minute }}</span>
          <span class="stat-label">From Breaths Per Minute</span>
        </div>
        <div class="stat-item">
          <i class="fas fa-eye stat-icon"></i>
          <span class="stat-value">{{ sleepMarker.to_breaths_per_minute }}</span>
          <span class="stat-label">To Breaths Per Minute</span>
        </div> 
      </div>
      <!-- Fasting Glucose Banner -->
      <div v-if="sleepMarker.am_fasting_glucose_value" class="glucose-banner" :class="glucoseColorClass">
        <div class="glucose-content">
          <i class="fas fa-tint"></i>
          <div class="glucose-info">
            <span class="glucose-label">Morning Fasting Glucose</span>
            <span class="glucose-value">{{ sleepMarker.am_fasting_glucose_value }} mg/dL</span>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-item">
          <i class="fas fa-brain stat-icon"></i>
          <span class="stat-value">{{ sleepMarker.awake }}</span>
          <span class="stat-label">Awake Sleep</span>
        </div>
        <div class="stat-item">
          <i class="fas fa-brain stat-icon"></i>
          <span class="stat-value">{{ sleepMarker.rem }}</span>
          <span class="stat-label">REM Sleep</span>
        </div>
        <div class="stat-item">
          <i class="fas fa-brain stat-icon"></i>
          <span class="stat-value">{{ sleepMarker.core }}</span>
          <span class="stat-label">Core Sleep</span>
        </div>
        <div class="stat-item">
          <i class="fas fa-brain stat-icon"></i>
          <span class="stat-value">{{ sleepMarker.deep }}</span>
          <span class="stat-label">Deep Sleep</span>
        </div>        
      </div>

      <!-- Fasting Weight Banner -->
      <div class="weight-banner">
        <div class="weight-content">
          <i class="fas fa-weight"></i>
          <div class="weight-info">
            <span class="weight-label">Morning Fasting Weight</span>
            <span v-if="sleepMarker.fasting_weight" class="weight-value">{{ formattedWeight }} lbs</span>
          </div>
        </div>
      </div>

      <!-- OOB Section -->
      <div v-if="sleepMarker.had_oob" class="oob-details">
        <div class="oob-header">
          <i class="fas fa-ghost"></i>
          <router-link :to="{ name: 'OobDetails', params: { id: sleepMarker.oob_id } }" class="oob-link">
            <span>OOB Experience</span>
          </router-link>
        </div>
        <div class="oob-info">
          <div class="oob-duration">
            <strong>Duration:</strong> {{ oobDurationLabel }}
          </div>
          <div v-if="sleepMarker.oob_circumstances" class="oob-circumstances">
            <strong>Details:</strong>
            <p>{{ sleepMarker.oob_circumstances }}</p>
          </div>
          <div v-else class="notes-indicator">
            <span>OOB (no notes)</span>
          </div>            
        </div>
      </div>

      <!-- Dreams Section -->
      <div v-if="sleepMarker.dream_notes" class="dreams-section">
        <div class="dreams-header">
          <i class="fas fa-cloud"></i>
          <span>Dreams Recorded</span>
        </div>
        <div v-if="sleepMarker.dream_notes" class="dreams-notes">
          <p>{{ sleepMarker.dream_notes }}</p>
        </div>
        <!--div v-else class="notes-indicator">
          <span>Dreams occurred (no notes)</span>
        <div-->
      </div>      

      <!-- Diet Section -->
      <div v-if="sleepMarker.diet_notes" class="info-section sugar-section">
        <div class="info-header">
          <i class="fas fa-candy-cane"></i>
          <span>Diet</span>
        </div>
        <div v-if="sleepMarker.diet_notes" class="info-content">
          <p>{{ sleepMarker.diet_notes }}</p>
        </div>
        <!--div v-else class="notes-indicator">
          <span>Diet (no notes)</span>
        </!--div-->        
      </div>

      <!-- Exercise Section -->
      <div v-if="sleepMarker.exercise_notes" class="info-section exercise-section">
        <div class="info-header">
          <i class="fas fa-dumbbell"></i>
          <span>Exercise</span>
        </div>
        <div v-if="sleepMarker.exercise_notes" class="info-content">
          <p>{{ sleepMarker.exercise_notes }}</p>
        </div>
        <!--div v-else class="notes-indicator">
          <span>Exercise (no notes)</span>
        </!--div-->             
      </div>

      <!-- Alcohol Section -->
      <div v-if="sleepMarker.alcohol_notes" class="info-section alcohol-section">
        <div class="info-header">
          <i class="fas fa-wine-glass"></i>
          <span>Alcohol</span>
        </div>
        <div v-if="sleepMarker.alcohol_notes" class="info-content">
          <p>{{ sleepMarker.alcohol_notes }}</p>
        </div>
        <!--div v-else class="notes-indicator">
          <span>Alcohol (none)</span>
        </div-->  
      </div>

      <!-- Sugar Section -->
      <div v-if="sleepMarker.sugar_notes" class="info-section sugar-section">
        <div class="info-header">
          <i class="fas fa-candy-cane"></i>
          <span>Sugar</span>
        </div>
        <div v-if="sleepMarker.sugar_notes" class="info-content">
          <p>{{ sleepMarker.sugar_notes }}</p>
        </div>
        <!--div v-else class="notes-indicator">
          <span>Sugar (no notes)</span>
        </div-->        
      </div>

      <!-- Sleep Notes Section -->
      <div v-if="sleepMarker.sleep_notes" class="sleep-notes-section">
        <div class="notes-header">
          <i class="fas fa-sticky-note"></i>
          <span>Sleep Notes</span>
        </div>
        <div v-if="sleepMarker.sleep_notes" class="notes-content">
          <p>{{ sleepMarker.sleep_notes }}</p>
        </div>
        <!--div v-else class="notes-indicator">
          <span>Sleep (no notes)</span>
        </div-->  
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue';
import BaseCard from '@/components/ui/BaseCard.vue';

const props = defineProps({
  sleepMarker: {
    type: Object,
    required: true
  },
  viewMode: {
    type: String,
    default: 'grid',
    validator: (value) => ['grid', 'detail'].includes(value)
  }
});

defineEmits(['view', 'edit', 'delete']);

const formattedDate = computed(() => {
  if (!props.sleepMarker.sleep_date) return '';
  const [year, month, day] = props.sleepMarker.sleep_date.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric'
  });
});

const oobDurationLabel = computed(() => {
  const durations = {
    'short': 'Short (< 1 min)',
    'medium': 'Medium (1-2 mins)',
    'long': 'Long (> 2 mins)'
  };
  return durations[props.sleepMarker.oob_duration] || props.sleepMarker.oob_duration;
});

const glucoseColorClass = computed(() => {
  const value = parseFloat(props.sleepMarker.am_fasting_glucose_value);
  if (value < 100) return 'glucose-good';
  if (value >= 100 && value <= 125) return 'glucose-warning';
  return 'glucose-high';
});

const formattedWeight = computed(() => {
  if (!props.sleepMarker.fasting_weight) return '';
  const lbs = Math.floor(props.sleepMarker.fasting_weight);
  const oz = Math.round((props.sleepMarker.fasting_weight - lbs) * 16);
  if (oz === 0) return `${lbs} lbs`;
  return `${lbs} lbs ${oz} oz`;
});
</script>

<style scoped>
/* ✅ All shared styles now come from card-components.css */
/* Only sleep-specific styles remain here */

.oob-details {
  /* Unique OOB styling - not shared with other cards */
  margin-top: 16px;
  padding: 12px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  border-radius: 8px;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.oob-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 8px;
  font-size: 14px;
}

.oob-header i {
  font-size: 16px;
}

.oob-link {
  color: #667eea;
  text-decoration: none;
  transition: all 0.2s;
}

.oob-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.oob-info {
  font-size: 13px;
  color: #666;
}

.oob-duration {
  margin-bottom: 8px;
}

.oob-circumstances p {
  margin: 4px 0 0 0;
  line-height: 1.5;
  font-style: italic;
}
</style>