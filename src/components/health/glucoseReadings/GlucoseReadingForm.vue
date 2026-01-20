<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/components/health/glucoseReadings/GlucoseReadingForm.vue -->

<template>
  <form @submit.prevent="handleSubmit" class="glucose-reading-form">
    <!-- Date & Time -->
    <div class="form-row">
      <div class="form-group">
        <label class="form-label required">
          <i class="fas fa-calendar-day"></i>
          Reading Date - Note: Select Date before if AM-Fasting
        </label>
        <input
          v-model="formState.reading_date"
          type="date"
          class="form-input"
          required
        />
      </div>

      <div class="form-group">
        <label class="form-label required">
          <i class="fas fa-clock"></i>
          Reading Time
        </label>
        <input
          v-model="formState.reading_time"
          type="time"
          class="form-input"
          required
        />
      </div>
    </div>

    <!-- Glucose Value & Type -->
    <div class="form-row">
      <div class="form-group">
        <label class="form-label required">
          <i class="fas fa-tint"></i>
          Glucose Value (mg/dL)
        </label>
        <input
          v-model="formState.glucose_value"
          type="number"
          class="form-input"
          min="0"
          max="600"
          step="1"
          required
        />
        <div v-if="formState.glucose_value" class="glucose-indicator" :class="getGlucoseClass(formState.glucose_value)">
          {{ getGlucoseLabel(formState.glucose_value) }}
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">
          <i class="fas fa-utensils"></i>
          Reading Type
        </label>
        <select v-model="formState.reading_type" class="form-input">
          <option value="">Select type...</option>
          <option value="AM-Fasting">AM-Fasting</option>
          <option value="Before Meal">Before Meal</option>
          <option value="After Meal">After Meal (1-2 hours)</option>
          <option value="Bedtime">Bedtime</option>
          <option value="Random">Random</option>
        </select>
      </div>
    </div>

    <!-- Insulin -->
    <div class="form-section">
      <h3 class="section-title">
        <i class="fas fa-syringe"></i>
        Insulin Information
      </h3>
      
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">
            <i class="fas fa-syringe"></i>
            Insulin Units
          </label>
          <input
            v-model="formState.insulin_units"
            type="number"
            class="form-input"
            min="0"
            max="100"
            step="0.5"
          />
        </div>

        <div class="form-group">
          <label class="form-label">
            <i class="fas fa-tag"></i>
            Insulin Type
          </label>
          <select v-model="formState.insulin_type" class="form-input">
            <option value="">Select type...</option>
            <option value="Rapid-Acting">Rapid-Acting</option>
            <option value="Short-Acting">Short-Acting</option>
            <option value="Intermediate-Acting">Intermediate-Acting</option>
            <option value="Long-Acting">Long-Acting</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Carbs & Medication -->
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">
          <i class="fas fa-bread-slice"></i>
          Carbs Consumed (grams)
        </label>
        <input
          v-model="formState.carbs_consumed"
          type="number"
          class="form-input"
          min="0"
          max="500"
          step="1"
        />
      </div>

      <div class="form-group">
        <label class="form-label checkbox-label">
          <input
            v-model="formState.medication_taken"
            type="checkbox"
            class="form-checkbox"
          />
          <span>
            <i class="fas fa-pills"></i>
            Medication Taken
          </span>
        </label>
      </div>
    </div>

    <!-- Notes -->
    <div class="form-group">
      <label class="form-label">
        <i class="fas fa-sticky-note"></i>
        Notes
      </label>
      <textarea
        v-model="formState.notes"
        class="form-input"
        rows="4"
        placeholder="Any additional notes about this reading..."
      ></textarea>
    </div>

    <!-- Actions -->
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
        <i class="fas fa-times"></i>
        Cancel
      </button>
      <button type="submit" class="btn btn-primary">
        <i class="fas fa-save"></i>
        {{ isEditing ? 'Update' : 'Save' }} Reading
      </button>
    </div>
  </form>
</template>

<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/components/health/glucoseReadings/GlucoseReadingForm.vue -->

<script setup>
import { reactive, computed, watch } from 'vue';

const props = defineProps({
  glucoseReading: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['save', 'cancel']);

const isEditing = computed(() => !!props.glucoseReading?.id);

// ✅ Initialize form state
const formState = reactive({
  id: null,
  reading_date: new Date().toISOString().split('T')[0],
  reading_time: new Date().toTimeString().slice(0, 5),
  glucose_value: null,
  reading_type: '',
  insulin_units: null,
  insulin_type: '',
  carbs_consumed: null,
  medication_taken: false,
  notes: ''
});

// ✅ Watch for prop changes and map API fields to form fields
watch(() => props.glucoseReading, (newReading) => {
  if (newReading) {
    
    // ✅ Extract date and time from reading_date timestamp
    const readingDateTime = new Date(newReading.reading_date);
    const dateStr = readingDateTime.toISOString().split('T')[0];
    const timeStr = readingDateTime.toTimeString().slice(0, 5);
    
    // ✅ Map API fields to form fields
    formState.id = newReading.id;
    formState.reading_date = dateStr;
    formState.reading_time = timeStr;
    formState.glucose_value = newReading.reading || newReading.glucose_value; // ✅ API uses 'reading'
    formState.reading_type = newReading.reading_type || '';
    formState.insulin_units = newReading.insulin_units || null;
    formState.insulin_type = newReading.insulin_type || '';
    formState.carbs_consumed = newReading.carbs_consumed || null;
    formState.medication_taken = newReading.medication_taken || false;
    formState.notes = newReading.notes || '';
    
  } else {
    
    // Reset to defaults for new reading
    formState.id = null;
    formState.reading_date = new Date().toISOString().split('T')[0];
    formState.reading_time = new Date().toTimeString().slice(0, 5);
    formState.glucose_value = null;
    formState.reading_type = '';
    formState.insulin_units = null;
    formState.insulin_type = '';
    formState.carbs_consumed = null;
    formState.medication_taken = false;
    formState.notes = '';
  }
}, { immediate: true });

function handleSubmit() {
  
  // ✅ Map form fields back to API fields
  const cleanData = {
    id: formState.id,
    reading_date: `${formState.reading_date}T${formState.reading_time}:00`, // ✅ Combine date + time
    reading: parseFloat(formState.glucose_value), // ✅ API expects 'reading' not 'glucose_value'
    reading_type: formState.reading_type || null,
    insulin_units: formState.insulin_units ? parseFloat(formState.insulin_units) : null,
    insulin_type: formState.insulin_type || null,
    carbs_consumed: formState.carbs_consumed ? parseInt(formState.carbs_consumed) : null,
    medication_taken: formState.medication_taken || false,
    notes: formState.notes || ''
  };

  emit('save', cleanData);
}

function getGlucoseClass(value) {
  const v = parseFloat(value);
  if (v < 70) return 'glucose-low';
  if (v < 100) return 'glucose-good';
  if (v <= 140) return 'glucose-elevated';
  return 'glucose-high';
}

function getGlucoseLabel(value) {
  const v = parseFloat(value);
  if (v < 70) return '⚠️ Low';
  if (v < 100) return '✅ Normal';
  if (v <= 140) return '⚡ Elevated';
  return '🚨 High';
}
</script><style scoped>
@import '@/assets/styles/ui-components.css';

.glucose-reading-form {
  padding: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-label.required::after {
  content: '*';
  color: #e53e3e;
  margin-left: 4px;
}

.form-label i {
  color: #667eea;
  font-size: 14px;
}

.form-input {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.glucose-indicator {
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  margin-top: 4px;
}

.glucose-low {
  background: #ffe0e0;
  color: #c92a2a;
}

.glucose-good {
  background: #d4edda;
  color: #155724;
}

.glucose-elevated {
  background: #fff3cd;
  color: #856404;
}

.glucose-high {
  background: #f8d7da;
  color: #721c24;
}

.form-section {
  background: #f7fafc;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title i {
  color: #667eea;
}

.checkbox-label {
  flex-direction: row;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.checkbox-label:hover {
  border-color: #cbd5e0;
  background: #f7fafc;
}

.form-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #667eea;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>