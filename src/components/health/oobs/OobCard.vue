<template>
  <div class="card oob-card" @dblclick="handleDoubleClick">
    <!-- ✅ CARD HEADER -->
    <div class="card-header">
      <div class="header-left">
        <i class="fas fa-exclamation-triangle icon-oob"></i>
        <h3 class="card-title">{{ formattedDate }}</h3>
      </div>
      <div class="header-right">
        <span v-if="props.oob.duration" :class="['badge', durationBadgeClass]">
          Duration: {{ props.oob.duration }}
        </span>
      </div>
    </div>

    <!-- ✅ CARD BODY -->
    <div class="card-body">
      <!-- Circumstances -->
      <div v-if="props.oob.circumstances" class="field-group">
        <label class="field-label">
          <i class="fas fa-notes-medical"></i>
          Circumstances:
        </label>
        <p class="notes-data">{{ props.oob.circumstances }}</p>
      </div>
      <br/>
      <!-- Since Last (Interval) -->
      <div v-if="hasInterval" class="interval-section">
        <h4>Since Last:</h4>
        <div class="interval-grid">
          <div class="interval-item">
            <span class="interval-value">{{ props.oob.interval_days || 0 }}</span>
            <span class="interval-label">days</span>
          </div>
          <div class="interval-item">
            <span class="interval-value">{{ props.oob.interval_hours || 0 }}</span>
            <span class="interval-label">hours</span>
          </div>
          <div class="interval-item">
            <span class="interval-value">{{ props.oob.interval_minutes || 0 }}</span>
            <span class="interval-label">minutes</span>
          </div>
        </div>
      </div>
      <br/>
      <!-- Sleep Marker Data -->
      <div v-if="props.oob.sleep_marker" class="sleep-section">
        <!--a @click.stop="handleSleepMarkerClick"-->
        <h3 style="text-align: left">Sleep Marker Information:</h3>
        <br/>
        <div class="field-group inline-field">

            <label class="field-label">
              <i class="fas fa-calendar-day"></i>
              Sleep Date:                
            </label>       
            <span class="field-value field-link-tbd">{{ formattedSleepDate }}</span>
          
        </div>

        <div class="field-group inline-field">
          <label class="field-label">
            <i class="fas fa-star"></i>
            Sleep Score:
          </label>
          <span class="field-value">{{ props.oob.sleep_marker.sleep_score }}</span>
        </div>

        <div class="field-group inline-field">
          <label class="field-label">
            <i class="fas fa-bolt"></i>
            Awake:
          </label>
          <span class="field-value">{{ props.oob.sleep_marker.formatted_awake }}</span>
        </div>

        <div class="field-group inline-field">
          <label class="field-label">
            <i class="fas fa-brain"></i>
            REM Sleep:
          </label>
          <span class="field-value">{{ props.oob.sleep_marker.formatted_rem }}</span>
        </div>

        <div class="field-group inline-field">
          <label class="field-label">
            <i class="fas fa-circle"></i>
            Core Sleep:
          </label>
          <span class="field-value">{{ props.oob.sleep_marker.formatted_core }}</span>
        </div>

        <div class="field-group inline-field">
          <label class="field-label">
            <i class="fas fa-water"></i>
            Deep Sleep:
          </label>
          <span class="field-value">{{ props.oob.sleep_marker.formatted_deep }}</span>
        </div>
      </div>
      <br/>  
      <div v-if="props.oob.am_fasting_glucose_value" class="glucose-banner" :class="glucoseColorClass">
        <div class="glucose-content">
          <i class="fas fa-tint"></i>
          <div class="glucose-info">
            <span class="glucose-label">Morning Fasting Glucose</span>
            <span class="glucose-value">{{ oob.am_fasting_glucose_value }} mg/dL</span>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div v-if="props.oob.notes" class="field-group">
        <label class="field-label">
          <i class="fas fa-comment"></i>
          Notes:
        </label>
        <p class="field-value">{{ props.oob.notes }}</p>
      </div>

      <!-- Created By -->
      <div v-if="props.oob.created_by" class="field-group">
        <label class="field-label">
          <i class="fas fa-user"></i>
          Created By:
        </label>
        <p class="field-value">{{ props.oob.created_by }}</p>
      </div>

    </div>

    <!-- ✅ CARD FOOTER (Actions) -->
    <div class="card-footer">
      <button @click.stop="handleEdit" class="btn btn-primary btn-sm">
        <i class="fas fa-edit"></i>
        Edit
      </button>
      <button @click.stop="handleDelete" class="btn btn-danger btn-sm">
        <i class="fas fa-trash"></i>
        Delete
      </button>
    </div>
  </div>

  <!-- ✅ SLEEP MARKER MODAL -->
  <Transition name="modal-fade">
    <div v-if="showSleepMarkerModal" class="modal-overlay" @click="closeSleepMarkerModal">
      <div class="modal-container" @click.stop>
        <button class="modal-close-btn" @click="closeSleepMarkerModal">
          <i class="fas fa-times"></i>
        </button>
        <SleepMarkerCard 
          v-if="props.oob.sleep_marker"
          :sleepMarker="props.oob.sleep_marker"
          @edit="closeSleepMarkerModal"
          @delete="closeSleepMarkerModal"
        />
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import SleepMarkerCard from '@/components/health/sleepMarkers/SleepMarkerCard.vue';

// ✅ PROPS
const props = defineProps({
  oob: {
    type: Object,
    required: true
  }
});

// ✅ EMITS
const emit = defineEmits(['edit', 'delete']);

// ✅ ROUTER
const router = useRouter();

// ✅ MODAL STATE
const showSleepMarkerModal = ref(false);

// ✅ COMPUTED
const formattedDate = computed(() => {
  if (!props.oob.date_of_occurrence) return 'Unknown Date';
  
  try {
    const date = new Date(props.oob.date_of_occurrence);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return props.oob.date_of_occurrence;
  }
});

const formattedSleepDate = computed(() => {

  if (!props.oob.sleep_marker.sleep_date) return 'Sleep Date Not Present';
  
  try {
    // Parse the date string manually to avoid timezone issues
    const [year, month, day] = props.oob.sleep_marker.sleep_date.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting sleep date:', error);
    return props.oob.sleep_marker.sleep_date;
  }
});

const durationBadgeClass = computed(() => {
  const duration = props.oob.duration?.toLowerCase();
  if (duration?.includes('short')) return 'badge-success';
  if (duration?.includes('long')) return 'badge-warning';
  if (duration?.includes('very long')) return 'badge-danger';
  return 'badge-info';
});

const hasInterval = computed(() => {
  return props.oob.interval_days !== undefined || 
         props.oob.interval_hours !== undefined || 
         props.oob.interval_minutes !== undefined;
});

const glucoseColorClass = computed(() => {
  const value = parseFloat(props.oob.am_fasting_glucose_value);
  if (value < 100) return 'glucose-good';
  if (value >= 100 && value <= 125) return 'glucose-warning';
  return 'glucose-high';
});

// ✅ METHODS
const handleEdit = () => {
  router.push({ name: 'OobEdit', params: { id: props.oob.id } });
};

const handleDelete = () => {
  emit('delete', props.oob);
};

const handleDoubleClick = () => {
  handleEdit();
};

const handleSleepMarkerClick = () => {
  if (props.oob.sleep_marker?.id) {
    showSleepMarkerModal.value = true;
  }
};

const closeSleepMarkerModal = () => {
  showSleepMarkerModal.value = false;
};
</script>

<style scoped>
/* ✅ IMPORT SHARED HEALTH STYLES */
@import '@/assets/styles/health/health-shared.css';

/* ========================================
   COMPONENT-SPECIFIC STYLES
   ======================================== */

/* OOB Card specific styling */
.oob-card {
  border-left: 4px solid #ef4444;
  transition: all 0.3s ease;
}

.oob-card:hover {
  border-left-color: #dc2626;
  box-shadow: 0 10px 25px rgba(239, 68, 68, 0.2);
}

/* Header layout */
.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Field groups */
.field-group {
  margin-bottom: 1rem;
}

.field-group:last-of-type {
  margin-bottom: 0;
}

/* Sleep section styling */
.sleep-section {
  padding-top: 1rem;
  margin-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

/* Inline field groups (label and value on same line) */
.inline-field {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.inline-field .field-label {
  margin-bottom: 0;
  min-width: 140px;
  justify-content: flex-start;
}

.inline-field .field-value {
  padding-left: 0;
  font-weight: 600;
  color: #1f2937;
  text-align: left;
}

.field-link {
  color: #3b82f6;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s ease;
}

.field-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field-value {
  color: #1f2937;
  margin: 0;
  padding-left: 1.5rem;
  line-height: 1.5;
  white-space: pre-line;
}
.notes-data {
  text-align: left;
  color: #1f2937;
  margin: 0;
  padding-left: 1.5rem;
  line-height: 1.5;
  white-space: pre-line;
}

/* Card footer */
.card-footer {
  display: flex;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 1rem;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

/* Double-click hint */
.oob-card {
  cursor: pointer;
}

.oob-card::after {
  content: 'Double-click to edit';
  position: absolute;
  top: 0.75rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  color: #9ca3af;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  background: rgba(255, 255, 255, 0.95);
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.oob-card:hover::after {
  opacity: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .card-footer {
    flex-direction: column;
  }

  .btn-sm {
    width: 100%;
    justify-content: center;
  }
}

/* ✅ MODAL STYLES */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  position: relative;
  max-width: 600px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  background: transparent;
  transform-origin: center;
}

.modal-close-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: white;
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
  transition: all 0.2s ease;
}

.modal-close-btn:hover {
  background: #f3f4f6;
  transform: scale(1.1);
}

.modal-close-btn i {
  color: #6b7280;
  font-size: 1.25rem;
}

/* Modal animations */
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
  transform: scale(0.95);
}
</style>