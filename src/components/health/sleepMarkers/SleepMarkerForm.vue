<!-- filepath: src/components/sleepMarkers/SleepMarkerForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="sleep-marker-form">
    <div class="form-grid">
      <!-- Sleep Date -->
      <BaseInput
        v-model="formData.sleep_date"
        label="Sleep Date"
        type="date"
        prepend-icon="calendar"
        required
        :error="errors.sleep_date"
      />
 formData.scheduled_bedtime: {{ formData.scheduled_bedtime }}
      <!-- Bed Time -->
      <BaseInput
        v-model="formData.scheduled_bedtime"
        label="Scheduled Bed Time"
        type="time"
        prepend-icon="clock-outline"
        :error="errors.scheduled_bedtime"
        hint="What time did you go to bed?"
      />

      formData.scheduled_waketime: {{ formData.scheduled_waketime }}
      <!-- Wake Time -->
      <BaseInput
        v-model="formData.scheduled_waketime"
        label="Wake Time"
        type="time"
        prepend-icon="alarm"
        :error="errors.scheduled_waketime"
        hint="What time did you wake up?"
      />

      <!-- Actual Bed Time -->
      <BaseInput
        v-model="formData.actual_bedtime"
        label="Actual Bed Time"
        type="time"
        prepend-icon="clock-outline"
        :error="errors.actual_bedtime"
        hint="Optional"
      />
      <!-- Sleep Score -->
      <BaseInput
        v-model.number="formData.sleep_score"
        label="Sleep Score"
        type="number"
        min="0"
        max="100"
        prepend-icon="star"
        :error="errors.sleep_score"
        hint="Overall sleep score (0-100)"
      />

      <!-- Sleep Score Rating -->
      <BaseInput
        v-model="formData.sleep_score_rating"
        label="Sleep Score Rating"
        type="text"
        prepend-icon="star-half"
        :error="errors.sleep_score_rating"
        hint="e.g. Excellent, Good, Fair, Poor"
      />

      <!-- Sleep Score Explained -->
      <BaseInput
        v-model="formData.sleep_score_explained"
        label="Sleep Score Explained"
        type="text"
        prepend-icon="comment"
        :error="errors.sleep_score_explained"
        hint="Short explanation of the score"
      />
      <br/>
      <!-- Duration Score -->
      <BaseInput
        v-model="formData.duration_score"
        label="Duration Score"
        type="text"
        prepend-icon="clock"
        :error="errors.duration_score"
        hint="Score for sleep duration. Amount is 'Time Asleep' stage below."
      />

      <!-- Duration Score Explained -->
      <BaseInput
        v-model="formData.duration_score_explained"
        label="Duration Score Explained"
        type="text"
        prepend-icon="comment"
        :error="errors.duration_score_explained"
        hint="Short explanation of the duration score"
      />

      <!-- Bed Time Score -->
      <BaseInput
        v-model="formData.bedtime_score"
        label="Bed Time Score"
        type="text"
        prepend-icon="clock"
        :error="errors.bedtime_score"
        hint="Score for bed time (0-100)"
      />

      <!-- Bed Time Score Explained -->
      <BaseInput
        v-model="formData.bedtime_score_explained"
        label="Bed Time Score Explained"
        type="text"
        prepend-icon="comment"
        :error="errors.bedtime_score_explained"
        hint="Short explanation of the bed time score"
      />

      <!-- Interruptions -->
      <BaseInput
        v-model.number="formData.interruptions"
        label="Interruptions"
        type="number"
        min="0"
        prepend-icon="eye-off"
        :error="errors.interruptions"
        hint="Number of interruptions during sleep"
      />
      <!-- Interruptions Score -->
      <BaseInput
        v-model="formData.interruptions_score"
        label="Interruptions Score"
        type="text"
        prepend-icon="star"
        :error="errors.interruptions_score"
        hint="Score for interruptions (0-100)"
      />

      <!-- Interruptions Score Explained -->
      <BaseInput
        v-model="formData.interruptions_score_explained"
        label="Interruptions Score Explained"
        type="text"
        prepend-icon="comment"
        :error="errors.interruptions_score_explained"
        hint="Short explanation - same amount as Awake stage below."
      />
      <br/>
      <!-- From Heart Beats Per Minute -->
      <BaseInput
        v-model.number="formData.from_heart_beats_per_minute"
        label="From Heart Beats Per Minute"
        type="decimal"
        min="0"
        prepend-icon="eye-off"
        :error="errors.from_heart_beats_per_minute"
        hint="Number of heart beats per minute (from)"
      />
      <!-- To Heart Beats Per Minute -->
      <BaseInput
        v-model.number="formData.to_heart_beats_per_minute"
        label="To Heart Beats Per Minute"
        type="decimal"
        min="0"
        prepend-icon="eye-off"
        :error="errors.to_heart_beats_per_minute"
        hint="Number of heart beats per minute (to)"
      />
      <!-- From Breaths Per Minute -->
      <BaseInput
        v-model.number="formData.from_breaths_per_minute"
        label="From Breaths Per Minute"
        type="decimal"
        min="0"
        prepend-icon="eye-off"
        :error="errors.from_breaths_per_minute"
        hint="Number of breaths per minute (from)"
      />
      <!-- To Breaths Per Minute -->
      <BaseInput
        v-model.number="formData.to_breaths_per_minute"
        label="To Breaths Per Minute"
        type="decimal"
        min="0"
        prepend-icon="eye-off"
        :error="errors.to_breaths_per_minute"
        hint="Number of breaths per minute (to)"
      />

      <!-- ✅ NEW: FASTING WEIGHT (LBS + OZ) -->
      <div class="weight-input-group">
        <label class="form-label">
          <i class="fas fa-weight"></i>
          Fasting Weight
        </label>
        <div class="weight-inputs">
          <BaseInput
            v-model.number="formData.fasting_weight_lbs"
            type="number"
            min="0"
            placeholder="lbs"
            :error="errors.fasting_weight_lbs"
          />
          <span class="weight-separator">lbs</span>
          <BaseInput
            v-model.number="formData.fasting_weight_oz"
            type="number"
            min="0"
            max="15"
            placeholder="oz"
            :error="errors.fasting_weight_oz"
          />
          <span class="weight-separator">oz</span>
        </div>
      </div>
      <HoursMinutesInput
        v-model="formData.time_in_bed"
        label="Time in Bed"
        :error="errors.time_in_bed"
      />

      <HoursMinutesInput
        v-model="formData.time_asleep"
        label="Time Asleep"
        :error="errors.time_asleep"
      />

      <!-- ✅ HOURS/MINUTES INPUTS -->
      <HoursMinutesInput
        v-model="formData.awake"
        label="Awake Sleep"
        :error="errors.awake"
      />

      <HoursMinutesInput
        v-model="formData.rem"
        label="REM Sleep"
        :error="errors.rem"
      />

      <HoursMinutesInput
        v-model="formData.core"
        label="Core Sleep"
        :error="errors.core"
      />

      <HoursMinutesInput
        v-model="formData.deep"
        label="Deep Sleep"
        :error="errors.deep"
      />

    </div>  

    <!-- ✅ DREAM NOTES TEXTAREA (Conditional, Full Width) -->
    <div class="dream-notes-section">
      <label class="form-label">
        <i class="fas fa-cloud"></i>
        Dream Notes
      </label>
      <textarea
        v-model="formData.dream_notes"
        class="dream-textarea"
        rows="4"
        placeholder="Describe your dreams..."
      ></textarea>
    </div>
         
    <!-- ✅ NEW: DIET NOTES -->
    <div class="diet-section">
      <label class="form-label">
        <i class="fas fa-candy-cane"></i>
        Diet (Optional)
      </label>
      <textarea
        v-model="formData.diet_notes"
        class="notes-textarea"
        rows="3"
        placeholder="What did you eat yesterday? Include meals, snacks, etc."
      ></textarea>
    </div>

    <!-- ✅ NEW: EXERCISE NOTES -->
    <div class="notes-section">
      <label class="form-label">
        <i class="fas fa-dumbbell"></i>
        Exercise (Optional)
      </label>
      <textarea
        v-model="formData.exercise_notes"
        class="notes-textarea"
        rows="3"
        placeholder="What exercise did you do yesterday? Duration, intensity, etc."
      ></textarea>
    </div>

    <!-- ✅ NEW: ALCOHOL NOTES -->
    <div class="notes-section">
      <label class="form-label">
        <i class="fas fa-wine-glass"></i>
        Alcohol (Optional)
      </label>
      <textarea
        v-model="formData.alcohol_notes"
        class="notes-textarea"
        rows="3"
        placeholder="Any alcohol consumption? Type, amount, timing..."
      ></textarea>
    </div>

    <!-- ✅ NEW: SUGAR NOTES -->
    <div class="sugar-notes-section">
      <label class="form-label">
        <i class="fas fa-candy-cane"></i>
        Sugar (Optional)
      </label>
      <textarea
        v-model="formData.sugar_notes"
        class="notes-textarea"
        rows="3"
        placeholder="Sugar intake before bed? Desserts, candy, drinks..."
      ></textarea>
    </div>

    <!-- ✅ SLEEP NOTES (General) -->
    <div class="notes-section">
      <label class="form-label">
        <i class="fas fa-sticky-note"></i>
        Sleep Notes (Optional)
      </label>
      <textarea
        v-model="formData.sleep_notes"
        class="notes-textarea"
        rows="4"
        placeholder="Any other notes about your sleep or day..."
      ></textarea>
    </div>

    <!-- Form Actions -->
    <div class="form-actions">
      <BaseButton
        type="button"
        variant="ghost"
        @click="$emit('cancel')"
      >
        Cancel
      </BaseButton>
      
      <BaseButton
        type="submit"
        variant="success"
        icon="content-save"
        :loading="isSubmitting"
      >
        {{ sleepMarker?.id ? 'Update Entry' : 'Save Entry' }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import HoursMinutesInput from '@/components/ui/HoursMinutesInput.vue';

const props = defineProps({
  sleepMarker: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['save', 'cancel']);

const isSubmitting = ref(false);
const errors = ref({});

const formData = ref({
  sleep_date: '',
  scheduled_bedtime: '22:30',
  scheduled_waketime: '06:30',
  actual_bedtime: '22:30',
  total_sleep_hours: 8,
  sleep_score: '',
  sleep_score_rating: '',
  sleep_score_explained: '',
  duration_score: '',
  duration_score_explained: '',
  bedtime_score: '',
  bedtime_score_explained: '',
  interruptions: 0,
  interruptions_score: '',
  interruptions_score_explained: '',
  from_breaths_per_minute: null,
  to_breaths_per_minute: null,
  breaths_per_minute_explained: null,
  from_heart_beats_per_minute: null,
  to_heart_beats_per_minute: null,
  heart_beats_per_minute_explained: null,
  time_in_bed: '0m',
  time_asleep: '0m',
  deep: '0m',
  rem: '0m',
  core: '0m',
  awake: '0m',
  dream_notes: '',
  fasting_weight_lbs: null,
  fasting_weight_oz: null,
  exercise_notes: '',
  alcohol_notes: '',
  sugar_notes: '',
  sleep_notes: ''
});

// Watch for sleepMarker changes (edit mode)
watch(() => props.sleepMarker, (newMarker) => {
  if (newMarker) {
    const data = { ...newMarker };
    
    // ✅ Convert decimal weight back to lbs/oz for editing
    if (data.fasting_weight) {
      const lbs = Math.floor(data.fasting_weight);
      const oz = Math.round((data.fasting_weight - lbs) * 16);
      data.fasting_weight_lbs = lbs;
      data.fasting_weight_oz = oz;
      delete data.fasting_weight; // Remove the decimal field
    }
    
    formData.value = data;
  } else {
    resetForm();
  }
}, { immediate: true });

// ✅ Clear dream notes when checkbox is unchecked
//watch(() => formData.value.had_dreams, (hasDreams) => {
//  if (!hasDreams) {
//    formData.value.dream_notes = '';
//  }
//});

function resetForm() {
  formData.value = {
    sleep_date: new Date().toISOString().split('T')[0],
    scheduled_bedtime: '22:30',
    scheduled_waketime: '06:30',
    actual_bedtime: '',
    sleep_score: '',
    sleep_score_rating: '',
    sleep_score_explained: '',
    duration_score: '',
    duration_score_explained: '',
    bedtime_score: '',
    bedtime_score_explained: '',
    interruptions: 0,
    interruptions_score: '',
    interruptions_score_explained: '',
    from_breaths_per_minute: null,
    to_breaths_per_minute: null,
    breaths_per_minute_explained: null,
    from_heart_beats_per_minute: null,
    to_heart_beats_per_minute: null,
    heart_beats_per_minute_explained: null,
    time_in_bed: '0m',
    time_asleep: '0m',   
    deep: '0m',
    rem: '0m',
    core: '0m',
    awake: '0m',
  };
  errors.value = {};
}

function validateForm() {
  errors.value = {};
  
  if (!formData.value.sleep_date) {
    errors.value.sleep_date = 'Sleep date is required';
  }
  
  return Object.keys(errors.value).length === 0;
}

async function handleSubmit() {
  if (!validateForm()) {
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    const submitData = { ...formData.value };

    // Guard: Ensure scheduled_bedtime and scheduled_waketime are strings in 'HH:mm' format
    const timeRegex = /^\d{2}:\d{2}$/;
    if (typeof submitData.scheduled_bedtime !== 'string' || !timeRegex.test(submitData.scheduled_bedtime)) {
      submitData.scheduled_bedtime = '22:30';
    }
    console.log('scheduled_bedtime before test:', submitData.scheduled_bedtime);
    if (typeof submitData.scheduled_waketime !== 'string' || !timeRegex.test(submitData.scheduled_waketime)) {
      submitData.scheduled_waketime = '06:30';
    }
    console.log('scheduled_waketime before submit:', submitData.scheduled_waketime);
    // ✅ Convert lbs + oz to decimal before submitting
    if (submitData.fasting_weight_lbs !== null || submitData.fasting_weight_oz !== null) {
      const lbs = submitData.fasting_weight_lbs || 0;
      const oz = submitData.fasting_weight_oz || 0;
      submitData.fasting_weight = lbs + (oz / 16);

      // Remove the temporary fields
      delete submitData.fasting_weight_lbs;
      delete submitData.fasting_weight_oz;
    }
    console.log('scheduled_bedtime before submit:', submitData.scheduled_bedtime);

    emit('save', submitData);
    resetForm();
  } catch (error) {
    console.error('Error submitting form:', error);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.sleep-marker-form {
  width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.quality-value {
  color: #667eea;
  font-weight: 700;
}

.range-slider {
  width: 100%;
  height: 8px;
  border-radius: 5px;
  background: linear-gradient(to right, #eb3349 0%, #f5576c 50%, #38ef7d 100%);
  outline: none;
  -webkit-appearance: none;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 3px solid #667eea;
}

.range-slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 3px solid #667eea;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 12px;
  color: #999;
}

/* ✅ DREAM NOTES STYLING */
.dream-notes-section {
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-radius: 12px;
  border: 2px solid rgba(102, 126, 234, 0.2);
}

.dream-notes-section .form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #667eea;
}

.dream-notes-section .form-label i {
  font-size: 16px;
}

.dream-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  transition: all 0.2s;
  background: white;
}

.dream-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.dream-textarea::placeholder {
  color: #999;
  font-style: italic;
}
/* ✅ WEIGHT INPUT GROUP STYLING */
.weight-input-group {
  grid-column: span 2;
  margin-bottom: 20px;
}

.weight-input-group .form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #2563eb;
  font-weight: 600;
}

.weight-input-group .form-label i {
  font-size: 16px;
}

.weight-inputs {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto;
  gap: 12px;
  align-items: center;
}

.weight-separator {
  font-size: 14px;
  font-weight: 600;
  color: #666;
}

@media (max-width: 768px) {
  .weight-input-group {
    grid-column: span 1;
  }
}
/* ✅ DIET NOTES STYLING */
.diet-section {
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(239, 68, 68, 0.05) 100%);
  border-radius: 12px;
  border: 2px solid rgba(236, 72, 153, 0.2);
}

.diet-section .form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #ec4899;
  font-weight: 600;
}

.diet-section .form-label i {
  font-size: 16px;
}

/* ✅ EXERCISE NOTES STYLING */
.notes-section {
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%);
  border-radius: 12px;
  border: 2px solid rgba(34, 197, 94, 0.2);
}

.notes-section .form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #22c55e;
  font-weight: 600;
}

.notes-section .form-label i {
  font-size: 16px;
}

/* ✅ ALCOHOL NOTES STYLING - Override for alcohol section */
.notes-section:has(.fa-wine-glass) {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.05) 100%);
  border: 2px solid rgba(245, 158, 11, 0.2);
}

.notes-section:has(.fa-wine-glass) .form-label {
  color: #f59e0b;
}

/* ✅ SUGAR NOTES STYLING */
.sugar-notes-section {
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(219, 39, 119, 0.05) 100%);
  border-radius: 12px;
  border: 2px solid rgba(236, 72, 153, 0.2);
}

.sugar-notes-section .form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #ec4899;
  font-weight: 600;
}

.sugar-notes-section .form-label i {
  font-size: 16px;
}

/* ✅ SLEEP NOTES STYLING - Override for general sleep notes */
.notes-section:has(.fa-sticky-note) {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(249, 115, 22, 0.05) 100%);
  border: 2px solid rgba(245, 158, 11, 0.2);
}

.notes-section:has(.fa-sticky-note) .form-label {
  color: #f59e0b;
}

/* ✅ SHARED TEXTAREA STYLING */
.notes-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  transition: all 0.2s;
  background: white;
}

.notes-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.notes-textarea::placeholder {
  color: #999;
  font-style: italic;
}

.notes-textarea::placeholder {
  color: #999;
  font-style: italic;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .checkbox-group {
    grid-column: span 1;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .form-actions button {
    width: 100%;
  }
}
</style>