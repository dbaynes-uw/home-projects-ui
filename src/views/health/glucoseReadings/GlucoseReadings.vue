<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/views/health/glucoseReadings/GlucoseReadings.vue -->

<template>
  <div class="list-view-container">
    <!-- ✅ BREADCRUMB -->
    <nav class="breadcrumb">
      <router-link to="/health" class="breadcrumb-link">
        <i class="fas fa-heartbeat"></i>
        Health Dashboard
      </router-link>
    </nav>

    <!-- ✅ HEADER -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <i class="fas fa-tint"></i>
          Glucose Readings
        </h1>
        <p class="page-subtitle">Track and monitor your blood glucose levels</p>
      </div>

      <div class="header-actions">
        <BaseButton
          variant="primary"
          icon="plus"
          @click="openAddDialog"
        >
          Add Reading
        </BaseButton>
      </div>
    </div>

    <!-- ✅ STATS CARDS -->
    <div class="stats-grid">
      <div class="stat-card stat-card-purple">
        <div class="stat-icon">
          <i class="fas fa-list"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ glucoseReadings.length }}</div>
          <div class="stat-label">Total Readings</div>
        </div>
      </div>

      <div class="stat-card stat-card-blue">
        <div class="stat-icon">
          <i class="fas fa-tint"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ averageGlucose }}</div>
          <div class="stat-label">Avg Glucose <span class="stat-unit">mg/dL</span></div>
        </div>
      </div>

      <div class="stat-card stat-card-green">
        <div class="stat-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ inRangePercentage }}%</div>
          <div class="stat-label">In Range</div>
        </div>
      </div>

      <div class="stat-card stat-card-orange">
        <div class="stat-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ lastReadingValue }}</div>
          <div class="stat-label">Last Reading <span class="stat-unit">mg/dL</span></div>
        </div>
      </div>
    </div>

    <!-- ✅ VIEW SELECTOR (MOVED ABOVE CONTENT) -->
    <div class="view-controls">
      <div class="view-tabs">
        <button
          v-for="view in views"
          :key="view.value"
          :class="['view-tab', { active: currentView === view.value }]"
          @click="currentView = view.value"
        >
          <i :class="`fas fa-${view.icon}`"></i>
          {{ view.label }}
        </button>
      </div>
    </div>
    <h3>Double Click to see Details and Edit</h3>
    <!-- ✅ LOADING -->
    <BaseCard v-if="isLoading" class="loading-card">
      <div class="loading-content">
        <div class="spinner"></div>
        <p>Loading glucose readings...</p>
      </div>
    </BaseCard>

    <!-- ✅ CARDS VIEW -->
    <div v-else-if="currentView === 'cards'" class="cards-view">
      <div class="cards-grid">
        <div
          v-for="reading in glucoseReadings"
          :key="reading.id"
          class="reading-card"
          @click="openDetailsModal(reading)"
        >
          <!-- Card Header -->
          <div class="card-header">
            <div class="header-left">
              <i class="fas fa-tint glucose-icon"></i>
              <div>
                <h3>{{ formatCardDate(reading.reading_date) }}</h3>
                <span class="time-badge">{{ formatTime(reading.reading_date) }}</span>
              </div>
            </div>
            <div class="glucose-value-large" :class="getGlucoseClass(reading.reading || reading.glucose_value)">
              {{ reading.reading || reading.glucose_value }}
              <span class="unit">mg/dL</span>
            </div>
          </div>

          <!-- Card Body -->
          <div class="card-body">
            <div class="info-row" v-if="reading.reading_type">
              <i class="fas fa-utensils"></i>
              <span>{{ reading.reading_type }}</span>
            </div>
            <div class="info-row" v-if="reading.insulin_units">
              <i class="fas fa-syringe"></i>
              <span>{{ reading.insulin_units }} units</span>
            </div>
            <div class="info-row" v-if="reading.carbs_consumed">
              <i class="fas fa-bread-slice"></i>
              <span>{{ reading.carbs_consumed }}g carbs</span>
            </div>
            <div class="info-row" v-if="reading.notes">
              <i class="fas fa-sticky-note"></i>
              <span class="notes-preview">{{ reading.notes }}</span>
            </div>
          </div>

          <!-- Card Actions -->
          <div class="card-actions">
            <button class="action-btn" @click.stop="editReading(reading)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" @click.stop="deleteReading(reading)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
      
      <BaseCard v-if="glucoseReadings.length === 0" class="empty-state">
        <div class="empty-content">
          <i class="fas fa-tint empty-icon"></i>
          <p>No glucose readings yet. Start tracking your levels!</p>
          <BaseButton variant="primary" icon="plus" @click="openAddDialog">
            Add First Reading
          </BaseButton>
        </div>
      </BaseCard>
    </div>

    <!-- ✅ TABLE VIEW -->
    <GlucoseReadingIndex
      v-else-if="currentView === 'table'"
      :glucoseReadings="glucoseReadings"
      @edit="editReading"
      @delete="deleteReading"
    />

    <!-- ✅ CALENDAR VIEW (TODO) -->
    <BaseCard v-else-if="currentView === 'calendar'" class="coming-soon">
      <div class="empty-content">
        <i class="fas fa-calendar empty-icon"></i>
        <p>Calendar view coming soon!</p>
      </div>
    </BaseCard>

    <!-- ✅ CHARTS VIEW (TODO) -->
    <BaseCard v-else-if="currentView === 'charts'" class="coming-soon">
      <div class="empty-content">
        <i class="fas fa-chart-line empty-icon"></i>
        <p>Charts view coming soon!</p>
      </div>
    </BaseCard>
    
    <!-- ✅ DETAILS MODAL (for cards view) -->
    <BaseModal
      v-model="showDetailsModal"
      title="Glucose Reading Details"
      size="large"
      @close="closeDetailsModal"
    >
      <GlucoseReadingCard
        v-if="selectedReading"
        :glucoseReading="selectedReading"
      />
      <template #footer>
        <button class="btn btn-secondary" @click="closeDetailsModal">
          <i class="fas fa-times"></i> Close
        </button>
        <button class="btn btn-primary" @click="editFromDetails">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn btn-danger" @click="deleteFromDetails">
          <i class="fas fa-trash"></i> Delete
        </button>
      </template>
    </BaseModal>

    <!-- ✅ EDIT/ADD DIALOG -->
    <BaseModal
      v-model="showDialog"
      :title="selectedReading?.id ? 'Edit Glucose Reading' : 'Add Glucose Reading'"
      size="large"
      @close="closeDialog"
    >
      <GlucoseReadingForm
        :glucoseReading="selectedReading"
        @save="handleSave"
        @cancel="closeDialog"
      />
    </BaseModal>

    <ConfirmDialogue ref="confirmDialogue" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseCard from '@/components/ui/BaseCard.vue';
import BaseModal from '@/components/ui/BaseModal.vue';
import GlucoseReadingCard from '@/components/health/glucoseReadings/GlucoseReadingCard.vue';
import GlucoseReadingIndex from '@/components/health/glucoseReadings/GlucoseReadingIndex.vue';
import GlucoseReadingForm from '@/components/health/glucoseReadings/GlucoseReadingForm.vue';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';

const store = useStore();

// ✅ STATE
const currentView = ref('cards');
const showDialog = ref(false);
const showDetailsModal = ref(false);
const selectedReading = ref(null);
const confirmDialogue = ref(null);
const isLoading = ref(true);

// ✅ VIEW OPTIONS
const views = [
  { value: 'cards', label: 'Cards', icon: 'th' },
  { value: 'table', label: 'Table', icon: 'list' },
  { value: 'calendar', label: 'Calendar', icon: 'calendar' },
  { value: 'charts', label: 'Charts', icon: 'chart-line' }
];

// ✅ COMPUTED
const glucoseReadings = computed(() => store.state.glucoseReadings || []);

const averageGlucose = computed(() => {
  if (glucoseReadings.value.length === 0) return '-';
  const total = glucoseReadings.value.reduce((sum, r) => {
    const value = r.reading || r.glucose_value || 0;
    return sum + parseFloat(value);
  }, 0);
  return Math.round(total / glucoseReadings.value.length);
});

const inRangePercentage = computed(() => {
  if (glucoseReadings.value.length === 0) return '-';
  const inRange = glucoseReadings.value.filter(r => {
    const v = parseFloat(r.reading || r.glucose_value);
    return v >= 70 && v < 140;
  }).length;
  return Math.round((inRange / glucoseReadings.value.length) * 100);
});

const lastReadingValue = computed(() => {
  if (glucoseReadings.value.length === 0) return '-';
  const sorted = [...glucoseReadings.value].sort((a, b) => {
    return new Date(b.reading_date) - new Date(a.reading_date);
  });
  return sorted[0]?.reading || sorted[0]?.glucose_value || '-';
});

// ✅ METHODS
function openAddDialog() {
  selectedReading.value = null;
  showDialog.value = true;
}

function openDetailsModal(reading) {
  selectedReading.value = reading;
  showDetailsModal.value = true;
}

function closeDetailsModal() {
  showDetailsModal.value = false;
  selectedReading.value = null;
}

function editFromDetails() {
  showDetailsModal.value = false;
  editReading(selectedReading.value);
}

async function deleteFromDetails() {
  showDetailsModal.value = false;
  await deleteReading(selectedReading.value);
}

function editReading(reading) {
  selectedReading.value = { ...reading };
  showDialog.value = true;
}

async function deleteReading(reading) {
  const ok = await confirmDialogue.value?.show({
    title: "Delete Glucose Reading",
    message: `Are you sure you want to delete the reading from ${formatCardDate(reading.reading_date)}? This cannot be undone.`,
    okButton: "Delete Forever",
    cancelButton: "Cancel"
  });

  if (!ok) return;

  try {
    await store.dispatch('deleteGlucoseReading', reading);
    await store.dispatch('fetchGlucoseReadings');
  } catch (error) {
    console.error('❌ Delete error:', error);
    alert('Failed to delete reading. Please try again.');
  }
}

async function handleSave(readingData) {
  
  try {
    if (readingData.id) {
      await store.dispatch('updateGlucoseReading', readingData);
    } else {
      await store.dispatch('createGlucoseReading', readingData);
    }
    await store.dispatch('fetchGlucoseReadings');
    closeDialog();
  } catch (error) {
    console.error('❌ Delete error:', error);
    alert('Failed to save glucose reading. Please try again.');
  }
}

function closeDialog() {
  showDialog.value = false;
  selectedReading.value = null;
}

function formatCardDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getGlucoseClass(value) {
  const v = parseFloat(value);
  if (v < 70) return 'glucose-low';
  if (v < 100) return 'glucose-good';
  if (v <= 140) return 'glucose-elevated';
  return 'glucose-high';
}

// ✅ LIFECYCLE
onMounted(async () => {
  try {
    await store.dispatch('fetchGlucoseReadings');
  } catch (error) {
    console.error('❌ Delete error:', error);
    alert('Failed to load glucose readings. Please refresh the page.');
  } finally {
    isLoading.value = false;
  }
});
</script>

<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/views/health/glucoseReadings/GlucoseReadings.vue -->

<style scoped>
@import '@/assets/styles/ui-components.css';
@import '@/assets/styles/list-view-components.css';

/* ✅ View Controls */
.view-controls {
  margin: 24px 0;
}

.view-tabs {
  display: flex;
  gap: 8px;
  background: white;
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.view-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #718096;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-tab:hover {
  background: #f7fafc;
  color: #4a5568;
}

.view-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.view-tab i {
  font-size: 16px;
}

/* ✅ Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-card-purple .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card-blue .stat-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-card-green .stat-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-card-orange .stat-icon {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.stat-unit {
  font-size: 11px;
  opacity: 0.7;
  margin-left: 4px;
}

/* ✅ Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

/* ✅ Individual Card in Grid */
.reading-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.reading-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.reading-card .card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reading-card .header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reading-card .glucose-icon {
  font-size: 24px;
  opacity: 0.9;
}

.reading-card .card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.reading-card .time-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 12px;
  margin-top: 4px;
}

.reading-card .glucose-value-large {
  font-size: 36px;
  font-weight: 700;
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.reading-card .unit {
  font-size: 12px;
  font-weight: 400;
  opacity: 0.8;
}

.glucose-low {
  color: #ff6b6b;
}

.glucose-good {
  color: #51cf66;
}

.glucose-elevated {
  color: #ffd43b;
}

.glucose-high {
  color: #ff6b6b;
}

.reading-card .card-body {
  padding: 20px;
}

.reading-card .info-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  color: #4a5568;
  font-size: 14px;
}

.reading-card .info-row i {
  color: #667eea;
  width: 20px;
}

.reading-card .notes-preview {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.reading-card .card-actions {
  padding: 12px 20px;
  background: #f7fafc;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  border-top: 1px solid #e2e8f0;
}

.reading-card .action-btn {
  background: white;
  border: 1px solid #e2e8f0;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #667eea;
}

.reading-card .action-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.reading-card .action-btn.delete:hover {
  background: #e53e3e;
  border-color: #e53e3e;
}

/* ✅ Mobile Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .view-tabs {
    flex-wrap: wrap;
  }

  .view-tab {
    flex: 1 1 calc(50% - 4px);
    min-width: 140px;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .stat-value {
    font-size: 24px;
  }

  .stat-label {
    font-size: 12px;
  }
}
</style>