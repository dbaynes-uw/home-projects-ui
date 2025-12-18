<template>
  <div class="oob-edit-wrapper">
    <!-- ✅ PAGE HEADER WITH BREADCRUMB -->
    <div class="page-wrapper gradient-oob">
      <div class="page-container">
        <div class="page-header">
          <h1>
            <router-link :to="{ name: 'HealthDashboard' }" class="breadcrumb-link">
              <i class="fas fa-pills"></i>
              Health Dashboard
            </router-link>
            <i class="fas fa-chevron-right breadcrumb-separator"></i>
            <router-link :to="{ name: 'OobList' }" class="breadcrumb-link">
              <i class="fas fa-exclamation-triangle icon-oob"></i>
              OOBs
            </router-link>
            <i class="fas fa-chevron-right breadcrumb-separator"></i>
            <span>
              <i class="fas fa-edit"></i>
              Edit OOB
            </span>
          </h1>
        </div>

        <!-- ✅ LOADING STATE -->
        <div v-if="isLoading" class="loading-state">
          <i class="fas fa-spinner fa-spin"></i>
          Loading OOB...
        </div>

        <!-- ✅ ERROR STATE -->
        <div v-else-if="!oob" class="empty-state">
          <i class="fas fa-exclamation-circle"></i>
          <h3>OOB Not Found</h3>
          <p>The requested OOB record could not be found.</p>
          <router-link :to="{ name: 'OobList' }" class="btn btn-primary">
            <i class="fas fa-arrow-left"></i>
            Back to List
          </router-link>
        </div>

        <!-- ✅ FORM CARD -->
        <div v-else class="form-card">
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">
                <i class="fas fa-exclamation-triangle icon-oob"></i>
                Edit OOB Record
              </h2>
              <p class="card-subtitle">
                Modify OOB from {{ formatDate(oob.date_of_occurrence) }}
              </p>
            </div>

            <div class="card-body">
              <OobForm
                :oob="oob"
                @save="handleSave"
                @cancel="handleCancel"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <ConfirmDialogue ref="confirmDialogue" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useOobStore } from '@/stores/health/OobStore';
import OobForm from '@/components/health/oobs/OobForm.vue';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';

// ✅ ROUTER, ROUTE & STORE
const router = useRouter();
const route = useRoute();
const oobStore = useOobStore();

// ✅ REFS
const confirmDialogue = ref(null);

// ✅ COMPUTED
const oob = computed(() => {
  const id = parseInt(route.params.id);
  return oobStore.allOobs.find(o => o.id === id);
});

const isLoading = computed(() => oobStore.isLoading);

// ✅ METHODS
function formatDate(dateString) {
  if (!dateString) return 'Unknown Date';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
}

async function handleSave(oobData) {
  try {
    await oobStore.updateOob(oobData);
    
    // Show success message
    if (confirmDialogue.value) {
      await confirmDialogue.value.show({
        title: "OOB Updated",
        message: "OOB record has been updated successfully.",
        okButton: "OK",
        cancelButton: null
      });
    }
    
    // Navigate back to list
    router.push({ name: 'OobList' });
  } catch (error) {
    console.error('❌ Update error:', error);
    
    // Show error message
    if (confirmDialogue.value) {
      await confirmDialogue.value.show({
        title: "Update Failed",
        message: "Failed to update OOB record. Please try again.",
        okButton: "OK",
        cancelButton: null
      });
    }
  }
}

async function handleCancel() {
  // Confirm navigation away
  if (confirmDialogue.value) {
    const ok = await confirmDialogue.value.show({
      title: "Cancel Editing",
      message: "Are you sure you want to cancel? Any unsaved changes will be lost.",
      okButton: "Yes, Cancel",
      cancelButton: "Keep Editing"
    });
    
    if (ok) {
      router.push({ name: 'OobList' });
    }
  } else {
    router.push({ name: 'OobList' });
  }
}

// ✅ LIFECYCLE
onMounted(async () => {
  // Ensure OOBs are loaded
  if (oobStore.allOobs.length === 0) {
    try {
      await oobStore.fetchOobs();
    } catch (error) {
      console.error('❌ Failed to load OOBs:', error);
    }
  }
  
  // Check if OOB exists
  if (!oob.value) {
    console.warn('⚠️ OOB not found:', route.params.id);
  }
});
</script>

<style scoped>
/* ✅ IMPORT SHARED HEALTH STYLES */
@import '@/assets/styles/health/health-shared.css';

/* ========================================
   COMPONENT-SPECIFIC STYLES
   ======================================== */

.oob-edit-wrapper {
  width: 100%;
  min-height: 100vh;
}

/* Page wrapper spacing */
.page-wrapper {
  padding-bottom: 120px; /* Space for footer */
}

/* Breadcrumb navigation */
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

/* Form card container */
.form-card {
  max-width: 900px;
  margin: 0 auto;
}

.form-card .card {
  border-left: 4px solid #ef4444; /* OOB red accent */
}

/* Card subtitle */
.card-subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Responsive */
@media (max-width: 768px) {
  .form-card {
    max-width: 100%;
  }
  
  .breadcrumb-separator {
    font-size: 1.25rem;
    margin: 0 0.25rem;
  }
}
</style>