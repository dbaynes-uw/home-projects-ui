<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/components/oobs/MedCard.vue -->
<template>
  <div class="oob-card">
    <!-- ✅ MODERN CARD LAYOUT -->
    <v-card class="oob-card-content" elevation="2">
      <!-- ✅ CARD HEADER WITH DATE -->
      <v-card-title class="oob-card-header">
        <div class="header-content">
          <v-icon class="header-icon">mdi-pill</v-icon>
          <div class="header-text">
            <h3 class="oob-date">{{ formatStandardDateTime(oob.date_of_occurrence) }} {{ formatDayOfWeek(oob.date_of_occurrence) }}</h3>
            <p class="oob-duration">{{ oob.duration }}</p>
          </div>
        </div>
      </v-card-title>

      <!-- ✅ CARD CONTENT -->
      <v-card-text class="oob-details">
        <!-- ✅ INTERVAL INFORMATION -->
        <div class="interval-section">
          <h4 class="section-title">
            <v-icon size="small" class="section-icon">mdi-clock-outline</v-icon>
            Since Last:
          </h4>
          <div class="interval-grid">
            <div class="interval-item">
              <span class="interval-value">{{ oob.interval_days }}</span>
              <span class="interval-label">days</span>
            </div>
            <div class="interval-item">
              <span class="interval-value">{{ oob.interval_hours }}</span>
              <span class="interval-label">hours</span>
            </div>
            <div class="interval-item">
              <span class="interval_value">{{ oob.interval_minutes }}</span>
              <span class="interval-label">minutes</span>
            </div>
          </div>
        </div>

        <!-- ✅ CIRCUMSTANCES/NOTES -->
        <div v-if="oob.circumstances" class="circumstances-section">
          <h4 class="section-title">
            <v-icon size="small" class="section-icon">mdi-note-text</v-icon>
            Notes:
          </h4>
          <div class="circumstances-content">
            <p 
              v-for="(circumstance, idx) in splitCircumstances" 
              :key="idx"
              class="circumstance-line"
            >
              {{ circumstance }}
            </p>
          </div>
        </div>
      </v-card-text>

      <!-- ✅ CARD ACTIONS -->
      <v-card-actions class="oob-actions">
        <div class="actions-left">
          <!-- ✅ BACK TO LIST -->
          <v-btn 
            variant="outlined"
            size="small"
            :to="{ name: 'OobList' }"
            prepend-icon="mdi-arrow-left"
          >
            Back to List
          </v-btn>
        </div>

        <div class="actions-right">
          <!-- ✅ EDIT BUTTON -->
          <v-btn 
            variant="outlined"
            color="primary"
            size="small"
            :to="{ name: 'OobEdit', params: { id: oob.id } }"
            prepend-icon="mdi-pencil"
          >
            Edit
          </v-btn>

          <!-- ✅ DELETE BUTTON -->
          <v-btn 
            variant="outlined"
            color="error"
            size="small"
            @click="showDeleteDialog = true"
            prepend-icon="mdi-delete"
          >
            Delete
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>

    <!-- ✅ DELETE CONFIRMATION DIALOG -->
    <v-dialog v-model="showDeleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="dialog-title">
          <v-icon color="error" class="mr-2">mdi-delete-alert</v-icon>
          Delete Oob from List
        </v-card-title>
        
        <v-card-text class="dialog-content">
          <p>Are you sure you want to delete this oob entry?</p>
          <div class="delete-details">
            <p><strong>Date:</strong> {{ formatStandardDateTime(oob.date_of_occurrence) }}</p>
            <p><strong>Duration:</strong> {{ oob.duration }}</p>
          </div>
          <p class="warning-text">
            <v-icon color="warning" size="small" class="mr-1">mdi-alert</v-icon>
            This action cannot be undone.
          </p>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            variant="outlined"
            @click="showDeleteDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="error"
            variant="elevated"
            @click="handleDeleteOob"
            :loading="isDeleting"
          >
            Delete Oob
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onErrorCaptured } from 'vue';
import { useRouter } from 'vue-router';
import { useOobStore } from '@/stores/OobStore'; // ✅ Import Pinia store
import DateFormatService from '@/services/DateFormatService.js';
import SplitStringService from '@/services/SplitStringService.js';

// ✅ COMPOSITION API SETUP
const router = useRouter();
const oobStore = useOobStore(); // ✅ Use Pinia instead of Vuex

// ✅ PROPS
const props = defineProps({
  oob: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

// ✅ ERROR HANDLER
onErrorCaptured((error, instance, info) => {
  console.error('❌ OobCard error captured:', error);
  console.error('❌ Error info:', info);
  return false;
});

// ✅ REACTIVE STATE
const showDeleteDialog = ref(false);
const isDeleting = ref(false);
const splitLength = ref(30);

// ✅ COMPUTED PROPERTIES
const isDev = computed(() => process.env.NODE_ENV === 'development');

const splitCircumstances = computed(() => {
  if (!props.oob.circumstances) return [];
  
  return SplitStringService.splitList(props.oob.circumstances, splitLength.value);
});

// ✅ METHODS
const formatStandardDateTime = (value) => {
  if (!value) return 'No date';
  return DateFormatService.formatStandardDateTimejs(value);
};

const formatDayOfWeek = (value) => {
  if (!value) return '';
  return DateFormatService.formatDayOfWeekjs(value);
};

const handleDeleteOob = async () => {
  try {
    isDeleting.value = true;
    
    if (!props.oob.id) {
      throw new Error('OOB ID is required for deletion');
    }
    
    console.log('🗑️ Deleting OOB:', props.oob.id);
    
    // ✅ USE PINIA STORE ACTION
    await oobStore.deleteOob(props.oob.id);
    
    // ✅ SHOW SUCCESS MESSAGE
    const formattedDate = formatStandardDateTime(props.oob.date_of_occurrence);
    alert(`✅ OOB was deleted for ${formattedDate}`);
    
    // ✅ NAVIGATE BACK TO LIST
    await router.push({ name: 'OobList' });
    
  } catch (error) {
    console.error('❌ Error deleting OOB:', error);
    
    if (error.response?.status === 404) {
      alert('❌ OOB not found - it may have already been deleted');
    } else if (error.response?.status === 500) {
      alert('❌ Server error - please try again later');
    } else {
      alert(`❌ Error deleting OOB: ${error.message}`);
    }
  } finally {
    isDeleting.value = false;
    showDeleteDialog.value = false;
  }
};

const debugOobData = () => {
  console.log('🔍 OOB DATA DEBUG:');
  console.log('='.repeat(50));
  
  console.log('OOB object:', props.oob);
  console.log('OOB ID:', props.oob.id);
  console.log('Date of occurrence:', props.oob.date_of_occurrence);
  console.log('Duration:', props.oob.duration);
  console.log('Circumstances:', props.oob.circumstances);
  console.log('Circumstances length:', props.oob.circumstances?.length || 0);
  
  console.log('\nInterval data:');
  console.log('Days:', props.oob.interval_days);
  console.log('Hours:', props.oob.interval_hours);
  console.log('Minutes:', props.oob.interval_minutes);
  
  console.log('\nSplit circumstances:');
  splitCircumstances.value.forEach((line, index) => {
    console.log(`Line ${index}:`, line);
  });
  
  console.log('='.repeat(50));
};
</script>
<style scoped>
/* ✅ MODERN CARD STYLES */
.oob-card {
  width: 100%;
  margin-bottom: 1rem;
}

.oob-card-content {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.oob-card-content:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

/* ✅ HEADER STYLES */
.oob-card-header {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  padding: 1rem 1.5rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.header-icon {
  font-size: 2rem;
  opacity: 0.9;
}

.header-text {
  flex: 1;
}

.oob-date {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.oob-duration {
  margin: 0.25rem 0 0 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

/* ✅ CONTENT STYLES */
.oob-details {
  padding: 1.5rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  color: #1976d2;
  font-size: 1rem;
  font-weight: 600;
}

.section-icon {
  color: #1976d2;
}

/* ✅ INTERVAL STYLES */
.interval-section {
  margin-bottom: 1.5rem;
}

.interval-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
}

.interval-item {
  text-align: center;
  padding: 0.75rem;
  background: #f5f5f5;
  border-radius: 8px;
  border-left: 4px solid #1976d2;
}

.interval-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #1976d2;
}

.interval-label {
  display: block;
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
}

/* ✅ CIRCUMSTANCES STYLES */
.circumstances-section {
  margin-bottom: 1rem;
}

.circumstances-content {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  border-left: 4px solid #28a745;
}

.circumstance-line {
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  color: #333;
}

.circumstance-line:last-child {
  margin-bottom: 0;
}

/* ✅ ACTIONS STYLES */
.oob-actions {
  padding: 1rem 1.5rem;
  background: #fafafa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions-left,
.actions-right {
  display: flex;
  gap: 0.5rem;
}

/* ✅ DIALOG STYLES */
.dialog-title {
  background: #f44336;
  color: white;
  display: flex;
  align-items: center;
}

.dialog-content {
  padding: 1.5rem;
}

.delete-details {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.delete-details p {
  margin: 0.25rem 0;
}

.warning-text {
  color: #f57c00;
  font-weight: 500;
  display: flex;
  align-items: center;
  margin-top: 1rem;
}

/* ✅ RESPONSIVE DESIGN */
@oobia (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .interval-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .oob-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .actions-left,
  .actions-right {
    width: 100%;
    justify-content: center;
  }
  
  .oob-details {
    padding: 1rem;
  }
}

/* ✅ ACCESSIBILITY */
.oob-card-content:focus-within {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
}

/* ✅ REMOVE OLD STYLES */
/* Cleaned up all float-based and manual positioning */
</style>