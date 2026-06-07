<template>
  <div class="page-container">
    <h1>Edit Glucose Reading</h1>
    <form @submit.prevent="updateReading" class="form-card-display">
      <div class="form-container">
        <BaseInput
          v-model="reading_date"
          label="Date"
          type="datetime-local"
          required
        />

        <BaseInput
          v-model="reading"
          label="Reading"
          type="number"
          required
        />

        <BaseInput
          v-model="unit"
          label="Unit"
          type="text"
          required
        />

        <div class="form-field">
          <label class="form-label">Type<span class="required">*</span></label>
          <input
            v-model="reading_type"
            list="reading-type-options"
            class="form-input"
            required
            aria-label="Select or enter the type of the glucose reading"
          />
          <datalist id="reading-type-options">
            <option v-for="option in readingTypeOptions" :key="option" :value="option" />
          </datalist>
        </div>
        <!-- Notes Input -->
        <div class="form-field">
          <label class="form-label">Notes</label>
          <textarea
            v-model="notes"
            rows="3"
            class="form-textarea"
            aria-label="Enter any notes for the glucose reading"
          ></textarea>
        </div>

        <div class="form-actions">
          <BaseButton variant="primary" type="submit">Update</BaseButton>
          <BaseButton variant="secondary" @click="router.push({ name: 'GlucoseReadings' })">
            Back to List
          </BaseButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGlucoseReadingStore } from '@/stores/health/GlucoseReadingStore.js';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

const route = useRoute();
const router = useRouter();
const glucoseReadingStore = useGlucoseReadingStore();

const reading_date = ref('');
const reading = ref('');
const unit = ref('');
const reading_type = ref('');
const status = ref('');
const notes = ref('');
const readingTypeOptions = ref(['AM-Fasting', 'Post-Meal', 'Before Meal', 'After Meal', 'Bedtime', 'Random']);

onMounted(async () => {
  await glucoseReadingStore.fetchGlucoseReading(route.params.id);
  const result = glucoseReadingStore.currentGlucoseReading;
  if (!result) return;

  // Convert reading_date to local timezone for datetime-local input
  const isoDate = new Date(result.reading_date);
  const localDate = new Date(isoDate.getTime() - isoDate.getTimezoneOffset() * 60000);
  const formattedDate = localDate.toISOString().slice(0, 16);

  reading_date.value = formattedDate;
  reading.value = result.reading;
  unit.value = result.unit;
  reading_type.value = result.reading_type;
  status.value = result.status;
  notes.value = result.notes;
});

async function updateReading() {
  // Derive status from reading value
  const val = parseFloat(reading.value);
  if (val >= 70 && val <= 99) {
    status.value = 'Good - 70-99 mg/dl';
  } else if (val >= 100 && val <= 125) {
    status.value = 'Prediabetes - 100-125 mg/dl';
  } else if (val >= 126) {
    status.value = 'Diabetes - 126+ mg/dl';
  } else {
    status.value = 'Invalid reading';
  }

  const updatedReading = {
    id: parseInt(route.params.id),
    reading_date: reading_date.value,
    reading: reading.value,
    unit: unit.value,
    reading_type: reading_type.value,
    status: status.value,
    notes: notes.value,
  };

  await glucoseReadingStore.updateGlucoseReading(updatedReading);
  router.push({ name: 'GlucoseReadings' });
}
</script>

<style scoped>
/* Add spacing and alignment for the form */
.page-container {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.form-field {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.4rem;
}

.required {
  color: #d32f2f;
  margin-left: 0.2rem;
}

.form-input,
.form-textarea {
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  padding: 0.6rem;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}
</style>