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

      <!-- Bed Time -->
      <BaseInput
        v-model="formData.bed_time"
        label="Bed Time"
        type="time"
        prepend-icon="clock-outline"
        required
        :error="errors.bed_time"
        hint="What time did you go to bed?"
      />

      <!-- Wake Time -->
      <BaseInput
        v-model="formData.wake_time"
        label="Wake Time"
        type="time"
        prepend-icon="alarm"
        required
        :error="errors.wake_time"
        hint="What time did you wake up?"
      />

      <!-- Sleep Quality -->
      <div class="form-group">
        <label class="form-label">
          Sleep Quality
          <span class="quality-value">({{ formData.sleep_quality }}/10)</span>
        </label>
        <input
          v-model.number="formData.sleep_quality"
          type="range"
          min="0"
          max="10"
          step="0.5"
          class="range-slider"
        />
        <div class="range-labels">
          <span>Poor</span>
          <span>Excellent</span>
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

      <!-- Awakenings -->
      <BaseInput
        v-model.number="formData.awakenings"
        label="Number of Awakenings"
        type="number"
        min="0"
        prepend-icon="eye-off"
        :error="errors.awakenings"
      />

      <!-- ✅ HOURS/MINUTES INPUTS -->
      <HoursMinutesInput
        v-model="formData.awake_sleep"
        label="Awake Sleep"
        :error="errors.awake_sleep"
      />

      <HoursMinutesInput
        v-model="formData.rem_sleep"
        label="REM Sleep"
        :error="errors.rem_sleep"
      />

      <HoursMinutesInput
        v-model="formData.core_sleep"
        label="Core Sleep"
        :error="errors.core_sleep"
      />

      <HoursMinutesInput
        v-model="formData.deep_sleep"
        label="Deep Sleep"
        :error="errors.deep_sleep"
      />

      <!-- ✅ DREAMS CHECKBOX -->
      <div class="form-group checkbox-group">
        <label class="checkbox-label">
          <input v-model="formData.dreams" type="checkbox" class="checkbox-input" />
          <span class="checkbox-text">
            <i class="fas fa-cloud"></i>
            Dreams?
          </span>
        </label>
      </div>
    </div>

    <!-- ✅ DREAM NOTES TEXTAREA (Conditional, Full Width) -->
    <div v-if="formData.dreams" class="notes-section">
      <label class="form-label">
        <i class="fas fa-pen"></i>
        Dream Notes
      </label>
      <textarea
        v-model="formData.dream_notes"
        class="notes-textarea"
        rows="4"
        placeholder="Describe your dreams..."
      ></textarea>
    </div>
    <!-- ✅ SLEEP NOTES TEXTAREA (Conditional, Full Width) -->
    <div class="notes-section">
      <label class="form-label">
        <i class="fas fa-pen"></i>
        Relevant Factors like diet, exercise, stress, etc.
      </label>
      <textarea
        v-model="formData.sleep_notes"
        class="notes-textarea"
        rows="4"
        placeholder="Describe your thoughts here..."
      ></textarea>
    </div>
    <!-- Form Actions -->
    <div class="form-actions">
      <BaseButton type="button" variant="ghost" @click="$emit('cancel')">
        Cancel
      </BaseButton>

      <BaseButton
        type="submit"
        variant="success"
        icon="content-save"
        :loading="isSubmitting"
      >
        {{ marker?.id ? "Update Entry" : "Save Entry" }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from "vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import HoursMinutesInput from "@/components/ui/HoursMinutesInput.vue";

const props = defineProps({
  marker: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["save", "cancel"]);

const isSubmitting = ref(false);
const errors = ref({});

const formData = ref({
  sleep_date: "",
  bed_time: "",
  wake_time: "",
  sleep_quality: 7,
  deep_sleep: "0m",
  rem_sleep: "0m",
  core_sleep: "0m",
  awake_sleep: "0m",
  awakenings: 0,
  time_in_bed: "0m",
  time_awake: "0m",
  time_asleep: "0m",
  dreams: false,
  dream_notes: "",
  sleep_notes: "",
});

// Watch for marker changes (edit mode)
watch(
  () => props.marker,
  (newMarker) => {
    if (newMarker) {
      formData.value = { ...newMarker };
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

// ✅ Clear dream notes when checkbox is unchecked
watch(
  () => formData.value.dreams,
  (hasDreams) => {
    if (!hasDreams) {
      formData.value.dream_notes = "";
    }
  }
);

function resetForm() {
  formData.value = {
    sleep_date: new Date().toISOString().split("T")[0],
    bed_time: "22:00",
    wake_time: "07:00",
    sleep_quality: 7,
    deep_sleep: "0m",
    rem_sleep: "0m",
    core_sleep: "0m",
    awake_sleep: "0m",
    awakenings: 0,
    time_in_bed: "0m",
    time_awake: "0m",
    time_asleep: "0m",
    dreams: false,
    dream_notes: "",
    sleep_notes: "",  
  };
  errors.value = {};
}

function validateForm() {
  errors.value = {};

  if (!formData.value.sleep_date) {
    errors.value.sleep_date = "Sleep date is required";
  }

  if (!formData.value.bed_time) {
    errors.value.bed_time = "Bed time is required";
  }

  if (!formData.value.wake_time) {
    errors.value.wake_time = "Wake time is required";
  }

  return Object.keys(errors.value).length === 0;
}

async function handleSubmit() {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    emit("save", { ...formData.value });
    resetForm();
  } catch (error) {
    console.error("Error submitting form:", error);
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

/* ✅ CHECKBOX STYLING */
.checkbox-group {
  grid-column: span 2;
  display: flex;
  align-items: center;
  padding: 12px 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  cursor: pointer;
  accent-color: #667eea;
}

.checkbox-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #333;
  font-size: 15px;
}

.checkbox-text i {
  color: #667eea;
  font-size: 18px;
}
/* ✅ DREAM and SLEEP NOTES STYLING */
.notes-section {
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.05) 0%,
    rgba(118, 75, 162, 0.05) 100%
  );
  border-radius: 12px;
  border: 2px solid rgba(102, 126, 234, 0.2);
}

.notes-section .form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #667eea;
}

.notes-section .form-label i {
  font-size: 16px;
}

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
