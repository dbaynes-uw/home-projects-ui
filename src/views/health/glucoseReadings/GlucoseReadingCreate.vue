<template>
  <div class="page-container">
    <h1>Create Glucose Reading</h1>
    <form @submit.prevent="createReading" class="form-card-display">
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

        <div id="bullet-style">
          <ul class="bullet-list">
            <li><span class="text-green">Fasting: Good 70-99 mg/dl</span></li>
            <li><span class="text-blue">Fasting: Prediabetes 100-125 mg/dl</span></li>
            <li><span class="text-red">Fasting: Type 2 Diabetes 126+ mg/dl</span></li>
            <li><span class="text-green">NonFasting: Good 80-140 mg/dl</span></li>
            <li><span class="text-blue">NonFasting: Prediabetes 140-200 mg/dl</span></li>
            <li><span class="text-red">NonFasting: Type 2 Diabetes 200+ mg/dl</span></li>
          </ul>
        </div>

        <div class="form-field">
          <label class="form-label">Notes</label>
          <textarea
            v-model="notes"
            rows="3"
            class="form-textarea"
            aria-label="Enter any additional notes about the glucose reading"
          ></textarea>
        </div>

        <div class="form-actions">
          <BaseButton variant="primary" type="submit">Create</BaseButton>
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
import { useRouter } from 'vue-router';
import { useGlucoseReadingStore } from '@/stores/health/GlucoseReadingStore.js';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

  const router = useRouter();
  const glucoseReadingStore = useGlucoseReadingStore();

  // Reactive variables for form inputs
  const reading_date = ref('');
  const reading = ref('');
  const unit = ref('mg/dl');
  const reading_type = ref('AM-Fasting');
  const status = ref('');
  const notes = ref('');

  // Dropdown options for the reading_type field
  const readingTypeOptions = ref([
    'AM-Fasting', 'PM-Fasting', 'Before Breakfast', 'After Breakfast',
    'Before Lunch', 'After Lunch', 'Before Dinner', 'After Dinner', 'Bedtime', 'Random'
  ]);

  onMounted(async () => {
    if (!glucoseReadingStore.allGlucoseReadings.length) {
      await glucoseReadingStore.fetchGlucoseReadings();
    }
    // Merge any extra types found in existing readings
    const existing = [...new Set(glucoseReadingStore.allGlucoseReadings.map(r => r.reading_type).filter(Boolean))];
    existing.forEach(t => { if (!readingTypeOptions.value.includes(t)) readingTypeOptions.value.push(t); });
  });
  //
  // Dropdown options for the status field
  //const statusOptions = ref([
  //  'Good - 70-99 mg/dl',
  //  'Prediabetes - 100-125 mg/dl',
  //  'Diabetes - 126+ mg/dl',
  //]);
  // Method to handle form submission
  const createReading = async () => {
  try {
    //Determine the status based on the reading value
    if (reading.value >= 70 && reading.value <= 99) {
      status.value = 'Good - 70-99 mg/dl';
    } else if (reading.value >= 100 && reading.value <= 125) {
      status.value = 'Prediabetes - 100-125 mg/dl';
    } else if (reading.value >= 126) {
      status.value = 'Diabetes - 126+ mg/dl';
    } else {
      status.value = 'Invalid reading'; // Handle edge cases
    }
    // Flatten the object
    const glucose_reading = {
      reading_date: reading_date.value,
      reading: reading.value,
      unit: unit.value,
      reading_type: reading_type.value,
      status: status.value,
      notes: notes.value,
    };
    await glucoseReadingStore.createGlucoseReading(glucose_reading);
    router.push({ name: 'GlucoseReadings' });
  } catch (error) {
    console.error("Error creating glucose reading:", error);
    alert("Failed to create glucose reading. Please try again.");
  }
};
  // If you want to emit events to parent, uncomment below
  // const emit = defineEmits(['delete']);
</script>
<style scoped>
/* Add spacing and alignment for the form */
.page-container {
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: 100px; /* ✅ Add padding to prevent footer overlap */
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

.bullet-list {
  margin: 0;
  padding-left: 1.2rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

#bullet-style{
  margin-top: -25px;
  text-align: left;
}

.text-green {
  color: #0a5a36 !important;
  font-weight: bold;
  font-size: 1rem;
}

.text-blue {
  color: #0000ff !important;
  font-size: 1rem;
}

.text-red {
  color: #e31b1b !important;
  font-weight: bold;
  font-size: 1rem;
}
</style>