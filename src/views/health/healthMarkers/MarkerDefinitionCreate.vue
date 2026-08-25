<template>
  <div class="marker-definition-create-wrapper">
    <div class="page-wrapper gradient-health">
      <div class="page-container">
        <div class="page-header">
          <h1>
            <router-link :to="{ name: 'HealthDashboard' }" class="breadcrumb-link">
              <i class="fas fa-pills"></i>
              Health Dashboard
            </router-link>
            <i class="fas fa-chevron-right breadcrumb-separator"></i>
            <router-link :to="{ name: 'MarkerDefinitions' }" class="breadcrumb-link">
              <i class="fas fa-list"></i>
              Marker Definitions
            </router-link>
            <i class="fas fa-chevron-right breadcrumb-separator"></i>
            <span>
              <i class="fas fa-plus-circle icon-health"></i>
              Create Marker Definition
            </span>
          </h1>
        </div>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="form-container">
        <div class="section-heading">
          <h2><i class="fas fa-vial"></i> New Marker Definition</h2>
          <p>Create a reusable definition for health marker records.</p>
        </div>

        <form @submit.prevent="saveDefinition">
          <div class="form-row">
            <div class="form-group">
              <label for="definition-name" class="required">Marker Name</label>
              <input id="definition-name" v-model.trim="formData.name" type="text" class="form-control" required placeholder="e.g., Vitamin_D">
              <small>Unique identifier for this definition.</small>
            </div>
            <div class="form-group">
              <label for="definition-label" class="required">Display Label</label>
              <input id="definition-label" v-model.trim="formData.label" type="text" class="form-control" required placeholder="e.g., Vitamin D">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="definition-unit">Unit</label>
              <input id="definition-unit" v-model.trim="formData.unit" type="text" class="form-control" placeholder="e.g., ng/mL">
            </div>
            <div class="form-group">
              <label for="definition-category">Category</label>
              <select id="definition-category" v-model="formData.category" class="form-control">
                <option value="">Select category...</option>
                <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="normal-low">Normal Range Low</label>
              <input id="normal-low" v-model.trim="formData.normal_range_low" type="text" class="form-control" placeholder="e.g., 30">
            </div>
            <div class="form-group">
              <label for="normal-high">Normal Range High</label>
              <input id="normal-high" v-model.trim="formData.normal_range_high" type="text" class="form-control" placeholder="e.g., 100">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="borderline-low">Borderline Range Low</label>
              <input id="borderline-low" v-model.trim="formData.borderline_range_low" type="text" class="form-control" placeholder="Optional">
            </div>
            <div class="form-group">
              <label for="borderline-high">Borderline Range High</label>
              <input id="borderline-high" v-model.trim="formData.borderline_range_high" type="text" class="form-control" placeholder="Optional">
            </div>
          </div>

          <div class="form-group">
            <label for="definition-description">Description</label>
            <textarea id="definition-description" v-model.trim="formData.description" class="form-control" rows="5" placeholder="What does this marker measure?"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="test-frequency">Test Frequency</label>
              <input id="test-frequency" v-model.trim="formData.test_frequency" type="text" class="form-control" placeholder="e.g., Annually">
            </div>
            <div class="form-group">
              <label for="definition-icon">Icon</label>
              <input id="definition-icon" v-model.trim="formData.icon" type="text" class="form-control" placeholder="e.g., mdi-test-tube">
            </div>
          </div>

          <div v-if="errorMessage" class="alert alert-danger">
            <i class="fas fa-exclamation-circle"></i>
            {{ errorMessage }}
          </div>

          <div class="form-actions">
            <router-link :to="{ name: 'MarkerDefinitions' }" class="btn btn-secondary">
              <i class="fas fa-times"></i>
              Cancel
            </router-link>
            <button type="submit" class="btn btn-success" :disabled="isSaving">
              <i class="fas" :class="isSaving ? 'fa-spinner fa-spin' : 'fa-save'"></i>
              {{ isSaving ? 'Saving...' : 'Create Definition' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <ConfirmDialogue ref="confirmDialogue" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMarkerDefinitionStore } from '@/stores/health/MarkerDefinitionStore';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';

const router = useRouter();
const definitionStore = useMarkerDefinitionStore();
const confirmDialogue = ref(null);
const isSaving = ref(false);
const errorMessage = ref('');

const categories = ['Diabetes', 'Prostate', 'Thyroid', 'Lipids', 'Vitamins', 'Heart', 'Liver', 'Kidney', 'Liver/Kidney', 'Other'];
const formData = ref({
  name: '',
  label: '',
  unit: '',
  normal_range_low: '',
  normal_range_high: '',
  borderline_range_low: '',
  borderline_range_high: '',
  description: '',
  test_frequency: '',
  category: '',
  icon: 'mdi-test-tube'
});

async function saveDefinition() {
  if (isSaving.value) return;

  isSaving.value = true;
  errorMessage.value = '';

  try {
    await definitionStore.createDefinition(formData.value);
    await confirmDialogue.value.show({
      title: 'Definition Created',
      message: 'Marker definition has been created successfully.',
      okButton: 'OK',
      cancelButton: null
    });
    router.push({ name: 'MarkerDefinitions' });
  } catch (error) {
    errorMessage.value = error.response?.data?.errors?.join(', ') || 'Failed to create marker definition. Please try again.';
  } finally {
    isSaving.value = false;
  }
}

onMounted(() => {
  definitionStore.fetchDefinitions();
});
</script>

<style scoped>
@import '@/assets/styles/health/health-shared.css';

.marker-definition-create-wrapper {
  width: 100%;
  min-height: 100vh;
}

.breadcrumb-link {
  color: white;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumb-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  opacity: 0.6;
}

.content-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.form-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.section-heading {
  margin-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 1rem;
}

.section-heading h2 {
  margin: 0 0 0.5rem;
  color: #1f2937;
}

.section-heading h2 i {
  color: #667eea;
  margin-right: 0.5rem;
}

.section-heading p,
.form-group small {
  color: #6b7280;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.form-group label {
  font-weight: 600;
  color: #374151;
}

.form-group label.required::after {
  content: ' *';
  color: #dc2626;
}

.form-control {
  width: 100%;
  box-sizing: border-box;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  font-size: 0.9375rem;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

textarea.form-control {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.alert-danger {
  margin-bottom: 1.5rem;
  padding: 1rem;
  color: #991b1b;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions .btn {
    width: 100%;
  }
}
</style>
