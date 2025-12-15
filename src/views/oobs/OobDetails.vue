<template>
  <ConfirmDialogue ref="confirmDialogue" />
  
  <div class="page-wrapper">
    <div class="oob-details-container">
      <!-- ✅ HEADER -->
      <div class="page-header">
        <h1>
          <i class="fas fa-exclamation-triangle"></i>
          OOB Details
        </h1>
      </div>

      <!-- ✅ NAVIGATION & ACTIONS -->
      <div class="action-bar">
        <button class="btn btn-secondary" @click="goBack">
          <i class="fas fa-arrow-left"></i>
          Back to List
        </button>
        
        <div class="action-buttons">
          <button class="btn btn-primary" @click="editOob">
            <i class="fas fa-edit"></i>
            Edit OOB
          </button>
          
          <button class="btn btn-danger" @click="deleteOob">
            <i class="fas fa-trash"></i>
            Delete OOB
          </button>
        </div>
      </div>

      <!-- ✅ LOADING STATE -->
      <div v-if="isLoading" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        Loading OOB details...
      </div>

      <!-- ✅ ERROR STATE -->
      <div v-else-if="!oob" class="error-state">
        <i class="fas fa-exclamation-circle"></i>
        OOB not found
      </div>

      <!-- ✅ OOB CARD -->
      <div v-else class="card-display">
        <p class="hint-text">
          <i class="fas fa-info-circle"></i>
          Double click the card below to edit
        </p>
        
        <OobCard 
          :key="oob.id" 
          :oob="oob" 
          class="detail-card" 
          @dblclick="editOob"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useOobStore } from '@/stores/OobStore';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';
import OobCard from '@/components/oobs/OobCard.vue';

// ✅ COMPOSITION API SETUP
const router = useRouter();
const route = useRoute();
const oobStore = useOobStore();

// ✅ REFS
const confirmDialogue = ref(null);

// ✅ COMPUTED
const oob = computed(() => oobStore.oob);
const isLoading = computed(() => oobStore.isLoading);

// ✅ GET OOB ID FROM ROUTE (convert to number for comparison)
const oobId = computed(() => parseInt(route.params.id));

// ✅ METHODS
const goBack = () => {
  console.log('⬅️ Navigating back to OOB list');
  router.push({ name: 'OobList' });
};

const editOob = () => {
  if (!oob.value) {
    console.warn('⚠️ No OOB to edit');
    return;
  }
  
  console.log('✏️ Navigating to edit OOB:', oob.value.id);
  router.push({ name: 'OobEdit', params: { id: oob.value.id } });
};

const deleteOob = async () => {
  if (!oob.value) {
    console.warn('⚠️ No OOB to delete');
    return;
  }

  if (!confirmDialogue.value) {
    console.error('❌ confirmDialogue ref is null!');
    alert('Error: Confirmation dialog not available');
    return;
  }

  try {
    // ✅ SHOW CONFIRMATION DIALOG
    const ok = await confirmDialogue.value.show({
      title: "Delete OOB Record",
      message: `Are you sure you want to delete the OOB from ${oob.value.date_of_occurrence}? This action cannot be undone.`,
      okButton: "Delete Forever",
      cancelButton: "Cancel"
    });

    if (!ok) {
      console.log('❌ Delete cancelled by user');
      return;
    }

    console.log('🗑️ Deleting OOB:', oob.value.id);
    
    // ✅ DELETE VIA PINIA STORE
    await oobStore.deleteOob(oob.value.id);
    
    // ✅ SHOW SUCCESS MESSAGE
    await confirmDialogue.value.show({
      title: "OOB Deleted",
      message: "OOB record has been deleted successfully.",
      okButton: "OK",
      cancelButton: null
    });
    
    console.log('✅ OOB deleted, navigating to list');
    
    // ✅ NAVIGATE BACK TO LIST
    router.push({ name: 'OobList' });
    
  } catch (error) {
    console.error('❌ Error deleting OOB:', error);
    
    if (confirmDialogue.value) {
      await confirmDialogue.value.show({
        title: "Delete Failed",
        message: `Failed to delete OOB: ${error.message}`,
        okButton: "OK",
        cancelButton: null
      });
    } else {
      alert(`Failed to delete OOB: ${error.message}`);
    }
  }
};

// ✅ LIFECYCLE - FETCH OOB ON MOUNT
onMounted(async () => {
  console.log('🚀 OobDetails mounted');
  console.log('📋 OOB ID from route:', oobId.value);
  console.log('📋 OOB ID type:', typeof route.params.id); // Debug
  
  try {
    await oobStore.fetchOob(oobId.value);
    console.log('✅ OOB loaded:', oob.value);
    console.log('🔍 Interval data:', {
      days: oob.value?.interval_days,
      hours: oob.value?.interval_hours,
      minutes: oob.value?.interval_minutes
    });
  } catch (error) {
    console.error('❌ Failed to load OOB:', error);
  }
});
</script>

<style scoped>
/* ✅ PAGE LAYOUT */
.page-wrapper {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.oob-details-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* ✅ HEADER */
.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.page-header h1 i {
  color: #ef4444;
  font-size: 2rem;
}

/* ✅ ACTION BAR */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* ✅ BUTTONS */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn:active {
  transform: translateY(0);
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

/* ✅ HINT TEXT */
.hint-text {
  text-align: center;
  color: white;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.hint-text i {
  color: #fbbf24;
}

/* ✅ CARD DISPLAY */
.card-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.detail-card {
  width: 100%;
  max-width: 900px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.detail-card:hover {
  transform: scale(1.02);
}

/* ✅ LOADING STATE */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  color: white;
  font-size: 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-state i {
  font-size: 3rem;
  color: #fbbf24;
}

/* ✅ ERROR STATE */
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  color: white;
  font-size: 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
}

.error-state i {
  font-size: 3rem;
  color: #ef4444;
}

/* ✅ RESPONSIVE */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 1.8rem;
  }

  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .action-buttons {
    width: 100%;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .detail-card {
    max-width: 100%;
  }
}
</style>