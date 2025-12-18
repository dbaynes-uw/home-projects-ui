<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/views/health/glucoseReadings/GlucoseReadings.vue -->

<template>
  <div class="list-view-container">
    <!-- ✅ BREADCRUMB -->
    <nav class="breadcrumb">
      <router-link to="/health" class="breadcrumb-link">
        <i class="fas fa-heartbeat"></i>
        Health Dashboard
      </router-link>
      <i class="fas fa-chevron-right breadcrumb-separator"></i>
      <span class="breadcrumb-current">Glucose Readings</span>
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
      <StatCard
        title="Total Readings"
        :value="glucoseReadings.length"
        icon="list"
        color="purple"
      />
      <StatCard
        title="Average Glucose"
        :value="averageGlucose"
        icon="tint"
        color="blue"
        suffix="mg/dL"
      />
      <StatCard
        title="In Range"
        :value="inRangePercentage"
        icon="check-circle"
        color="green"
        suffix="%"
      />
      <StatCard
        title="Last Reading"
        :value="lastReadingValue"
        icon="clock"
        color="orange"
        suffix="mg/dL"
      />
    </div>

    <!-- ✅ VIEW SELECTOR -->
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
        <GlucoseReadingCard
          v-for="reading in glucoseReadings"
          :key="reading.id"
          :glucoseReading="reading"
          @edit="editReading"
          @delete="deleteReading"
        />
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

    <!-- ✅ DIALOG -->
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
import { useRouter } from 'vue-router';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseCard from '@/components/ui/BaseCard.vue';
import BaseModal from '@/components/ui/BaseModal.vue';
import StatCard from '@/components/ui/StatCard.vue';
import GlucoseReadingCard from '@/components/health/glucoseReadings/GlucoseReadingCard.vue';
import GlucoseReadingIndex from '@/components/health/glucoseReadings/GlucoseReadingIndex.vue';
import GlucoseReadingForm from '@/components/health/glucoseReadings/GlucoseReadingForm.vue';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';

// ✅ STORE & ROUTER
const store = useStore();
const router = useRouter();

// ✅ STATE
const currentView = ref('cards');
const showDialog = ref(false);
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
  const total = glucoseReadings.value.reduce((sum, r) => sum + parseFloat(r.glucose_value || 0), 0);
  return Math.round(total / glucoseReadings.value.length);
});

const inRangePercentage = computed(() => {
  if (glucoseReadings.value.length === 0) return '-';
  const inRange = glucoseReadings.value.filter(r => {
    const v = parseFloat(r.glucose_value);
    return v >= 70 && v < 140;
  }).length;
  return Math.round((inRange / glucoseReadings.value.length) * 100);
});

const lastReadingValue = computed(() => {
  if (glucoseReadings.value.length === 0) return '-';
  const sorted = [...glucoseReadings.value].sort((a, b) => {
    const dateA = new Date(a.reading_date + ' ' + a.reading_time);
    const dateB = new Date(b.reading_date + ' ' + b.reading_time);
    return dateB - dateA;
  });
  return sorted[0]?.glucose_value || '-';
});

// ✅ METHODS
function openAddDialog() {
  selectedReading.value = null;
  showDialog.value = true;
}

function editReading(reading) {
  selectedReading.value = { ...reading };
  showDialog.value = true;
}

async function deleteReading(reading) {
  const ok = await confirmDialogue.value?.show({
    title: "Delete Glucose Reading",
    message: `Are you sure you want to delete the reading for ${reading.reading_date} at ${reading.reading_time}? This cannot be undone.`,
    okButton: "Delete Forever",
    cancelButton: "Cancel"
  });

  if (!ok) return;

  try {
    await store.dispatch('deleteGlucoseReading', reading);
    await store.dispatch('fetchGlucoseReadings');
    await confirmDialogue.value?.show({
      title: "Reading Deleted",
      message: "Glucose reading has been deleted successfully.",
      okButton: "OK",
      cancelButton: null
    });
  } catch (error) {
    console.error('❌ Delete error:', error);
    await confirmDialogue.value?.show({
      title: "Delete Failed",
      message: "Failed to delete reading. Please try again.",
      okButton: "OK",
      cancelButton: null
    });
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
    console.error('❌ Save error:', error);
    alert('Failed to save glucose reading. Please try again.');
  }
}

function closeDialog() {
  showDialog.value = false;
  selectedReading.value = null;
}

// ✅ LIFECYCLE
onMounted(async () => {
  try {
    await store.dispatch('fetchGlucoseReadings');
  } catch (error) {
    console.error('❌ Fetch error:', error);
    alert('Failed to load glucose readings. Please refresh the page.');
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* ✅ IMPORT ALL SHARED STYLES */
@import '@/assets/styles/ui-components.css';
@import '@/assets/styles/list-view-components.css';
</style>