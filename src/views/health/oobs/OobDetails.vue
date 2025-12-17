<template>
  <div class="oob-details-wrapper">
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useOobStore } from '@/stores/OobStore';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';
import OobCard from '@/components/health/oobs/OobCard.vue';
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
  router.push({ name: 'OobList' });
};

const editOob = () => {
  if (!oob.value) {
    return;
  }
  
  router.push({ name: 'OobEdit', params: { id: oob.value.id } });
};

const deleteOob = async () => {
  if (!oob.value) {
    return;
  }

  if (!confirmDialogue.value) {
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
      return;
    }    
    // ✅ DELETE VIA PINIA STORE
    await oobStore.deleteOob(oob.value.id);
    
    // ✅ SHOW SUCCESS MESSAGE
    await confirmDialogue.value.show({
      title: "OOB Deleted",
      message: "OOB record has been deleted successfully.",
      okButton: "OK",
      cancelButton: null
    });
        
    // ✅ NAVIGATE BACK TO LIST
    router.push({ name: 'OobList' });
    
  } catch (error) {
    
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
  try {
    await oobStore.fetchOob(oobId.value);
  } catch (error) {
    console.error('❌ Failed to load OOB:', error);
  }
});
</script>

<style scoped>
  @import '@/assets/styles/health-shared.css';

/* ✅ IMPORT SHARED HEALTH STYLES */
@import '@/assets/styles/health-shared.css';

/* ========================================
   COMPONENT-SPECIFIC STYLES ONLY
   ======================================== */

/* Wrapper for single root element (prevents Vue warning) */
.oob-details-wrapper {
  width: 100%;
  min-height: 100vh;
}

/* Card display specific to details view */
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

/* Responsive overrides for details view */
@media (max-width: 768px) {
  .detail-card {
    max-width: 100%;
  }
}
</style>
