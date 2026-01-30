<template>
  <div class="marker-definitions-wrapper">
    <!-- PAGE HEADER -->
    <div class="page-wrapper gradient-health">
      <div class="page-container">
        <div class="page-header">
          <h1>
            <router-link :to="{ name: 'HealthDashboard' }" class="breadcrumb-link">
              <i class="fas fa-pills"></i>
              Health Dashboard
            </router-link>
            <i class="fas fa-chevron-right breadcrumb-separator"></i>
            <router-link :to="{ name: 'HealthMarkers' }" class="breadcrumb-link">
              <i class="fas fa-heartbeat"></i>
              Health Markers
            </router-link>
            <i class="fas fa-chevron-right breadcrumb-separator"></i>
            <span>
              <i class="fas fa-cog icon-health"></i>
              Manage Marker Definitions
            </span>
          </h1>
        </div>

        <div class="controls-row">
          <button class="btn btn-success" @click="showForm = true; editingDefinition = null">
            <i class="fas fa-plus"></i>
            Add Custom Marker
          </button>
        </div>

        <!-- STATS -->
        <div class="stats-grid">
          <div class="stat-card stat-info">
            <div class="stat-icon"><i class="fas fa-globe"></i></div>
            <div class="stat-content">
              <div class="stat-value">{{ globalDefinitions.length }}</div>
              <div class="stat-label">Global Markers</div>
            </div>
          </div>
          <div class="stat-card stat-primary">
            <div class="stat-icon"><i class="fas fa-user"></i></div>
            <div class="stat-content">
              <div class="stat-value">{{ customDefinitions.length }}</div>
              <div class="stat-label">Your Custom Markers</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CONTENT -->
    <div class="content-wrapper">
      <!-- FORM MODAL -->
      <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ editingDefinition ? 'Edit' : 'Add' }} Marker Definition</h2>
            <button class="btn-close" @click="closeForm">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <form @submit.prevent="saveDefinition" class="definition-form">
            <div class="form-row">
              <div class="form-group">
                <label class="required">Marker Name</label>
                <input v-model="formData.name" type="text" class="form-control" required placeholder="e.g., Vitamin_D">
                <small class="form-text">Unique identifier (use underscores, no spaces)</small>
              </div>
              <div class="form-group">
                <label class="required">Display Label</label>
                <input v-model="formData.label" type="text" class="form-control" required placeholder="e.g., Vitamin D">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Unit</label>
                <input v-model="formData.unit" type="text" class="form-control" placeholder="e.g., ng/mL">
              </div>
              <div class="form-group">
                <label>Category</label>
                <select v-model="formData.category" class="form-control">
                  <option value="">Select category...</option>
                  <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Normal Range Low</label>
                <input v-model="formData.normal_range_low" type="text" class="form-control" placeholder="e.g., 30">
              </div>
              <div class="form-group">
                <label>Normal Range High</label>
                <input v-model="formData.normal_range_high" type="text" class="form-control" placeholder="e.g., 100">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Borderline Range Low</label>
                <input v-model="formData.borderline_range_low" type="text" class="form-control" placeholder="Optional">
              </div>
              <div class="form-group">
                <label>Borderline Range High</label>
                <input v-model="formData.borderline_range_high" type="text" class="form-control" placeholder="Optional">
              </div>
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea v-model="formData.description" class="form-control" rows="3" placeholder="What does this marker measure?"></textarea>
            </div>

            <div class="form-group">
              <label>Test Frequency</label>
              <input v-model="formData.test_frequency" type="text" class="form-control" placeholder="e.g., Annually">
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeForm">Cancel</button>
              <button type="submit" class="btn btn-success" :disabled="isSaving">
                <i class="fas" :class="isSaving ? 'fa-spinner fa-spin' : 'fa-save'"></i>
                {{ isSaving ? 'Saving...' : 'Save Marker' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- DEFINITIONS LIST -->
      <div class="definitions-section">
        <h2><i class="fas fa-list"></i> All Marker Definitions</h2>
        
        <div class="definitions-table">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Label</th>
                <th>Unit</th>
                <th>Normal Range</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="def in sortedDefinitions" :key="def.id || def.name">
                <td>
                  <span :class="['badge', def.is_global ? 'badge-info' : 'badge-success']">
                    <i :class="def.is_global ? 'fas fa-globe' : 'fas fa-user'"></i>
                    {{ def.is_global ? 'Global' : 'Custom' }}
                  </span>
                </td>
                <td class="mono">{{ def.name }}</td>
                <td><strong>{{ def.label }}</strong></td>
                <td>{{ def.unit || '-' }}</td>
                <td>
                  <span v-if="def.normal_range_low || def.normal_range_high">
                    {{ def.normal_range_low || '?' }} - {{ def.normal_range_high || '?' }}
                  </span>
                  <span v-else>-</span>
                </td>
                <td>
                  <span v-if="def.category" class="category-badge">{{ def.category }}</span>
                  <span v-else>-</span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button 
                      v-if="!def.is_global" 
                      class="btn-action btn-edit" 
                      @click="editDefinition(def)"
                      title="Edit"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      v-if="!def.is_global" 
                      class="btn-action btn-delete" 
                      @click="deleteDefinition(def)"
                      title="Delete"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                    <span v-if="def.is_global" class="text-muted">
                      <i class="fas fa-lock"></i> Protected
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <ConfirmDialogue ref="confirmDialogue" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMarkerDefinitionStore } from '@/stores/health/MarkerDefinitionStore';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';

const router = useRouter();
const definitionStore = useMarkerDefinitionStore();
const confirmDialogue = ref(null);

const showForm = ref(false);
const editingDefinition = ref(null);
const isSaving = ref(false);

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

const categories = ['Diabetes', 'Prostate', 'Thyroid', 'Lipids', 'Vitamins', 'Heart', 'Liver', 'Kidney', 'Liver/Kidney', 'Other'];

const globalDefinitions = computed(() => 
  definitionStore.allDefinitions.filter(d => d.is_global || !d.id)
);

const customDefinitions = computed(() => 
  definitionStore.allDefinitions.filter(d => !d.is_global && d.id)
);

const sortedDefinitions = computed(() => {
  return [...definitionStore.allDefinitions].sort((a, b) => {
    // Sort by type first (global vs custom), then by label
    if (a.is_global && !b.is_global) return -1;
    if (!a.is_global && b.is_global) return 1;
    return (a.label || '').localeCompare(b.label || '');
  });
});

function editDefinition(def) {
  editingDefinition.value = def;
  formData.value = {
    name: def.name,
    label: def.label,
    unit: def.unit || '',
    normal_range_low: def.normal_range_low || '',
    normal_range_high: def.normal_range_high || '',
    borderline_range_low: def.borderline_range_low || '',
    borderline_range_high: def.borderline_range_high || '',
    description: def.description || '',
    test_frequency: def.test_frequency || '',
    category: def.category || '',
    icon: def.icon || 'mdi-test-tube'
  };
  showForm.value = true;
}

async function saveDefinition() {
  isSaving.value = true;
  
  try {
    if (editingDefinition.value) {
      await definitionStore.updateDefinition({
        id: editingDefinition.value.id,
        ...formData.value
      });
    } else {
      await definitionStore.createDefinition(formData.value);
    }
    
    // Close form immediately on success
    closeForm();
  } catch (error) {
    console.error('Save error:', error);
    await confirmDialogue.value.show({
      title: "Save Failed",
      message: error.response?.data?.errors?.join(', ') || "Failed to save marker definition. Please try again.",
      okButton: "OK",
      cancelButton: null
    });
  } finally {
    isSaving.value = false;
  }
}

async function deleteDefinition(def) {
  if (!confirmDialogue.value) return;

  const ok = await confirmDialogue.value.show({
    title: "Delete Marker Definition",
    message: `Are you sure you want to delete "${def.label}"? This cannot be undone.`,
    okButton: "Delete",
    cancelButton: "Cancel"
  });

  if (!ok) return;

  try {
    await definitionStore.deleteDefinition(def.id);
    
    await confirmDialogue.value.show({
      title: "Definition Deleted",
      message: "Marker definition has been deleted successfully.",
      okButton: "OK",
      cancelButton: null
    });
  } catch (error) {
    console.error('Delete error:', error);
    
    await confirmDialogue.value.show({
      title: "Delete Failed",
      message: "Failed to delete marker definition. Please try again.",
      okButton: "OK",
      cancelButton: null
    });
  }
}

function closeForm() {
  showForm.value = false;
  editingDefinition.value = null;
  formData.value = {
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
  };
}

onMounted(async () => {
  await definitionStore.fetchDefinitions();
});
</script>

<style scoped>
@import '@/assets/styles/health/health-shared.css';

.marker-definitions-wrapper {
  width: 100%;
  min-height: 100vh;
}

.breadcrumb-link {
  color: white;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: opacity 0.3s ease;
}

.breadcrumb-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.breadcrumb-separator {
  font-size: 1.5rem;
  opacity: 0.6;
  margin: 0 0.5rem;
}

.controls-row {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.definitions-section h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.definitions-section h2 i {
  color: #667eea;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 2px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
}

.btn-close:hover {
  color: #ef4444;
}

.definition-form {
  padding: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #374151;
}

.form-group label.required::after {
  content: '*';
  color: #ef4444;
  margin-left: 0.25rem;
}

.form-control {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9375rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-text {
  font-size: 0.875rem;
  color: #6b7280;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
}

/* TABLE */
.definitions-table {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.definitions-table table {
  width: 100%;
  border-collapse: collapse;
}

.definitions-table thead {
  background: #f9fafb;
}

.definitions-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.definitions-table td {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.definitions-table tbody tr:hover {
  background: #f9fafb;
}

.mono {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.875rem;
  color: #6b7280;
}

.category-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #e0e7ff;
  color: #3730a3;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-action {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.btn-edit {
  background: #dbeafe;
  color: #1e40af;
}

.btn-edit:hover {
  background: #3b82f6;
  color: white;
}

.btn-delete {
  background: #fee2e2;
  color: #991b1b;
}

.btn-delete:hover {
  background: #ef4444;
  color: white;
}

.text-muted {
  color: #9ca3af;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .definitions-table {
    overflow-x: auto;
  }
  
  .modal-content {
    max-height: 95vh;
  }
}
</style>
