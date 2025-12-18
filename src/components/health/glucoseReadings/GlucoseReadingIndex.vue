<template>
  <div class="glucose-reading-index">
    <!-- Search & Filter -->
    <div class="index-controls">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search glucose readings..."
          class="search-input"
        />
      </div>

      <div class="filter-controls">
        <select v-model="rangeFilter" class="filter-select">
          <option value="">All Ranges</option>
          <option value="low">Low (&lt;70)</option>
          <option value="good">Good (70-99)</option>
          <option value="elevated">Elevated (100-140)</option>
          <option value="high">High (&gt;140)</option>
        </select>

        <select v-model="sortBy" class="filter-select">
          <option value="date-desc">Date (Newest First)</option>
          <option value="date-asc">Date (Oldest First)</option>
          <option value="value-desc">Value (Highest First)</option>
          <option value="value-asc">Value (Lowest First)</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th @click="setSortBy('date')" class="sortable">
              <i class="fas fa-calendar-day"></i>
              Date
              <i v-if="sortBy.startsWith('date')" :class="sortBy.includes('desc') ? 'fas fa-sort-down' : 'fas fa-sort-up'"></i>
            </th>
            <th><i class="fas fa-clock"></i> Time</th>
            <th @click="setSortBy('value')" class="sortable">
              <i class="fas fa-tint"></i>
              Glucose
              <i v-if="sortBy.startsWith('value')" :class="sortBy.includes('desc') ? 'fas fa-sort-down' : 'fas fa-sort-up'"></i>
            </th>
            <th><i class="fas fa-utensils"></i> Type</th>
            <th><i class="fas fa-syringe"></i> Insulin</th>
            <th><i class="fas fa-bread-slice"></i> Carbs</th>
            <th><i class="fas fa-pills"></i> Meds</th>
            <th class="actions-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="reading in filteredReadings"
            :key="reading.id"
            class="data-row"
            @click="openModal(reading)"
          >
            <td class="date-cell">{{ formatDate(reading.reading_date) }}</td>
            <td>{{ formatTime(reading.reading_date) }}</td>
            <td>
              <span class="glucose-badge" :class="getGlucoseClass(reading.reading || reading.glucose_value)">
                {{ reading.reading || reading.glucose_value }}
              </span>
            </td>
            <td>{{ reading.reading_type || '-' }}</td>
            <td>{{ reading.insulin_units ? `${reading.insulin_units}u` : '-' }}</td>
            <td>{{ reading.carbs_consumed ? `${reading.carbs_consumed}g` : '-' }}</td>
            <td>
              <i v-if="reading.medication_taken" class="fas fa-check-circle text-success"></i>
              <span v-else class="text-muted">-</span>
            </td>
            <td class="actions-cell" @click.stop>
              <button class="action-btn edit-btn" @click="openModal(reading)" title="View Details">
                <i class="fas fa-eye"></i>
              </button>
              <button class="action-btn delete-btn" @click="$emit('delete', reading)" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredReadings.length === 0" class="empty-state">
        <i class="fas fa-tint"></i>
        <p>No glucose readings found</p>
      </div>
    </div>

    <!-- Stats Summary -->
    <div class="stats-summary">
      <div class="stat-item">
        <i class="fas fa-list"></i>
        <span class="stat-value">{{ filteredReadings.length }}</span>
        <span class="stat-label">Records</span>
      </div>
      <div class="stat-item">
        <i class="fas fa-tint"></i>
        <span class="stat-value">{{ averageGlucose }}</span>
        <span class="stat-label">Avg Glucose</span>
      </div>
      <div class="stat-item">
        <i class="fas fa-chart-line"></i>
        <span class="stat-value">{{ inRangePercentage }}</span>
        <span class="stat-label">In Range</span>
      </div>
    </div>

    <!-- Modal -->
    <transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <div class="modal-header">
            <h2><i class="fas fa-tint"></i> Glucose Reading Details</h2>
            <button class="modal-close" @click="closeModal">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="modal-body">
            <GlucoseReadingCard
              v-if="selectedReading"
              :glucoseReading="selectedReading"
              @edit="handleEdit"
              @delete="handleDelete"
            />
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">
              <i class="fas fa-times"></i> Close
            </button>
            <button class="btn btn-primary" @click="handleEdit(selectedReading)">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-danger" @click="handleDelete(selectedReading)">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import GlucoseReadingCard from './GlucoseReadingCard.vue';

const props = defineProps({
  glucoseReadings: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['edit', 'delete']);

const showModal = ref(false);
const selectedReading = ref(null);
const searchQuery = ref('');
const rangeFilter = ref('');
const sortBy = ref('date-desc');

function openModal(reading) {
  selectedReading.value = reading;
  showModal.value = true;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  showModal.value = false;
  selectedReading.value = null;
  document.body.style.overflow = '';
}

function handleEdit(reading) {
  closeModal();
  emit('edit', reading);
}

function handleDelete(reading) {
  closeModal();
  emit('delete', reading);
}

const filteredReadings = computed(() => {
  let filtered = [...props.glucoseReadings];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(r =>
      r.reading_date?.toLowerCase().includes(query) ||
      r.notes?.toLowerCase().includes(query) ||
      r.reading_type?.toLowerCase().includes(query)
    );
  }

  if (rangeFilter.value) {
    filtered = filtered.filter(r => {
      const value = parseFloat(r.reading || r.glucose_value); // ✅ Use correct field
      if (rangeFilter.value === 'low') return value < 70;
      if (rangeFilter.value === 'good') return value >= 70 && value < 100;
      if (rangeFilter.value === 'elevated') return value >= 100 && value <= 140;
      if (rangeFilter.value === 'high') return value > 140;
      return true;
    });
  }

  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'date-desc':
        return new Date(b.reading_date) - new Date(a.reading_date);
      case 'date-asc':
        return new Date(a.reading_date) - new Date(b.reading_date);
      case 'value-desc':
        return parseFloat(b.reading || b.glucose_value) - parseFloat(a.reading || a.glucose_value);
      case 'value-asc':
        return parseFloat(a.reading || a.glucose_value) - parseFloat(b.reading || b.glucose_value);
      default:
        return 0;
    }
  });

  return filtered;
});

function setSortBy(column) {
  if (sortBy.value.startsWith(column)) {
    sortBy.value = sortBy.value.includes('desc') ? `${column}-asc` : `${column}-desc`;
  } else {
    sortBy.value = `${column}-desc`;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// ✅ ADD THIS FUNCTION
function getGlucoseClass(value) {
  const v = parseFloat(value);
  if (v < 70) return 'glucose-low';
  if (v < 100) return 'glucose-good';
  if (v <= 140) return 'glucose-elevated';
  return 'glucose-high';
}

const averageGlucose = computed(() => {
  if (filteredReadings.value.length === 0) return '-';
  const total = filteredReadings.value.reduce((sum, r) => {
    const value = r.reading || r.glucose_value;
    return sum + parseFloat(value);
  }, 0);
  return Math.round(total / filteredReadings.value.length);
});

const inRangePercentage = computed(() => {
  if (filteredReadings.value.length === 0) return '-';
  const inRange = filteredReadings.value.filter(r => {
    const v = parseFloat(r.reading || r.glucose_value);
    return v >= 70 && v < 140;
  }).length;
  return `${Math.round((inRange / filteredReadings.value.length) * 100)}%`;
});

</script>
<style scoped>
@import '@/assets/styles/ui-components.css';
@import '@/assets/styles/list-view-components.css';

.glucose-reading-index {
  width: 100%;
}

.glucose-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
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

/* Copy stats-summary and modal styles from SleepMarkerIndex */
.stats-summary {
  display: flex;
  gap: 24px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.stat-item i {
  font-size: 24px;
  color: #667eea;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
}

.stat-label {
  font-size: 14px;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Modal styles - copy from SleepMarkerIndex */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  overflow-y: auto;
}

.modal-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-size: 18px;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px 32px;
  border-top: 1px solid #e2e8f0;
  background: #f7fafc;
  justify-content: flex-end;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.9);
}

@media (max-width: 768px) {
  .modal-container {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .stats-summary {
    flex-direction: column;
  }
}
</style>